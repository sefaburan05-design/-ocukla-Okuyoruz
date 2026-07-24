import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import { validateStoryFormSafety, checkTextSafety } from './src/utils/safetyFilter';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Gemini Client Initialization
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  // Generate Story or Tale Endpoint
  app.post('/api/generate-story', async (req, res) => {
    try {
      const { contentType, childName, childAge, heroes, location, genre, specialDetails } = req.body;

      if (!childName) {
        return res.status(400).json({ error: 'Çocuğun adı zorunludur.' });
      }

      // Strict Safety & Pedagogical Filter Check
      const safetyCheck = validateStoryFormSafety({
        childName,
        heroes,
        location,
        genre,
        specialDetails
      });

      if (!safetyCheck.isSafe) {
        return res.status(400).json({
          isSafetyViolation: true,
          error: safetyCheck.detectedReason || 'Girdiğiniz bilgilerde çocuk pedagojisine aykırı, küfür, hakaret, tehdit, şantaj veya zararlı ifadeler tespit edildi.',
          violatingField: safetyCheck.violatingField
        });
      }

      const ageLabel = childAge ? `${childAge} Yaş Grubu` : 'Genel Çocuk Yaş Grubu';
      const isMasal = contentType === 'Masal';
      const isSiir = contentType === 'Şiir';
      
      let typeLabel = 'Gerçekçi Çocuk Hikayesi';
      if (isMasal) typeLabel = 'Efsanevi Çocuk Masalı';
      if (isSiir) typeLabel = 'Ahenkli Çocuk Şiiri';

      let styleInstruction = '';
      if (isMasal) {
        styleInstruction = `MASAL TARZI VE ATMOSFERİ:
- Bu bir MASALDIR. Lütfen olağanüstü, efsanevi, büyülü ve hayal gücünü coşturan sihirli ögeler kullan.
- Konuşan sevimli hayvanlar, bulutların üstündeki kristal şatolar, sihirli pusulalar, yıldız perileri, efsanevi diyarlar ve sürreal masal ögeleri yer alabilir.
- Çocuğu büyüleyici ve olağanüstü bir hayal dünyasına götür.`;
      } else if (isSiir) {
        styleInstruction = `ŞİİR TARZI VE ATMOSFERİ:
- Bu bir EĞİTİCİ VE SEVGİ DOLU ÇOCUK ŞİİRİDİR.
- KESİNLİKLE '1. Bölüm', '1. Kıta Demeti', 'Bölüm 1' VEYA KITA BAŞLIKLARI KULLANMA! chapterTitle alanını SADECE "" (boş dize) olarak bırak.
- Şiir akışı bölümleme olmadan, doğal ve ahenkli kıtalar (dörtlükler) halinde tek bir bütün olarak aksın.
- Her chapter nesnesinin paragraphs dizisi içindeki her eleman TAM BİR KITA (4 dize/mısra) olmalıdır.
- Kıta içindeki her mısra KESİNLİKLE alt satır (\\n) karakteri ile ayrılmalıdır. (Örn: "Güneş doğar ufkumuzdan,\\nIşık saçar neşemizden,\\nAhmet adım, gururum var,\\nDoğa tüter nefesimden.")
- Çocuğun duygularını coşturan, doğa sevgisi, dostluk, iyilik, büyüklere saygı, paylaşma, bilim, sanat ve neşeyi aşılayan ahenkli kıtalar yazılmalıdır.`;
      } else {
        styleInstruction = `HİKAYE TARZI VE ATMOSFERİ:
- Bu bir HİKAYEDİR. Lütfen gerçekçi, ayakları yere basan, günlük yaşama ve sosyal hayata dayalı bir kurgu oluştur.
- Okul yaşamı, aile bağları, mahalle dostlukları, doğa sevgisi, evcil hayvan bakımı, uzay/bilim merakı veya spor/hobiler gibi tamamen gerçekçi, bağ kurulabilir olaylar işlensin.
- Olağanüstü/sihirli ögeler KULLANMA; bunun yerine karakterlerin duygularına, insani ilişkilere ve gerçek hayattaki başarılara odaklan.`;
      }

      const prompt = `
Sen çocuk pedagojisine ve Türk çocuk edebiyatına son derece hakim, imla ve dil kurallarına mükemmel seviyede uyan usta bir yazarsın.
Lütfen aşağıdaki bilgilere göre zengin anlatımlı, doyurucu ve edebi değeri yüksek bir ${typeLabel} yaz.

${styleInstruction}

KONU VE ŞAHSİYET SEÇİMİ ESNEKLİĞİ (ÇOK ÖNEMLİ):
- Atatürk, Hazreti Muhammed (s.a.v.) veya belirli tarihi/dini şahsiyetleri SADECE VE SADECE kullanıcı özellikle 'Tema', 'Ek Detaylar' veya 'Kahramanlar' kısmında açıkça belirttiyse konuya dahil et.
- Kullanıcı özel olarak talep etmediyse, her masalda/hikayede/şiirde sürekli Atatürk veya Hazreti Muhammed'e atıf YAPMA.
- Varsayılan olarak çocuğun kendi macerasına, hayal gücüne, doğa sevgisine, bilime, sanata, hayvan sevgisine, dostluğa, aile bağlarına ve genel insani erdemlere (dürüstlük, cömertlik, merhamet, sorumluluk) odaklan.

KUTSAL HASSASİYET VE GÖRSEL KURALLARI (Eğer dini/tarihi bir tema seçildiyse):
1. Hazreti Muhammed (s.a.v.) veya kutsal şahsiyetler KESİNLİKLE hiçbir şekilde insan figürü olarak görsellere konu EDİLEMEZ / GÖRSELLEŞTİRİLEMEZ.
   - Image prompt'larında ASLA insan resmi/tiplemesi yer alamaz! Bunun yerine gül motifi, kandil ışığı, berrak gökyüzü, doğa veya nurani soyut ögeler betimlenmelidir.
2. Peygamber Efendimiz (s.a.v.) normal günlük akışta sıradan bir karakter gibi konuşturulamaz (ancak rüya sahnelerinde veya ahlaki öğütlerde sevgiyle bahsedilebilir).

PEDAGOJİK VE MİLLİ EĞİTİM BAKANLIĞI (MEB) VE AİLE VE SOSYAL HİZMETLER BAKANLIĞI İÇERİK UYUMU:
1. İçerik KESİNLİKLE T.C. Milli Eğitim Bakanlığı (MEB) ve Aile ve Sosyal Hizmetler Bakanlığı Çocuk Hizmetleri Genel Müdürlüğü pedagojik ve etik kriterlerine %100 uygun olmalıdır.
2. Korku, dehşet, şiddet, zorbalık, ceza, tehdit, manipülasyon, bilinçaltı karanlık ögeler veya travmatik durumlar KESİNLİKLE barındırılamaz.
3. Çocuğun zihinsel, duygusal ve psikolojik gelişimini destekleyen; sevgi, merhamet, paylaşma, dürüstlük, büyüklere saygı, doğa ve hayvan sevgisi, vatanseverlik ve yardımseverlik gibi pozitif ahlaki erdemler aşılanmalıdır.
4. Türk toplumunun milli, manevi ve ailevi değerleriyle tam bir ahenk içinde olmalı; argodan, olumsuz davranış örneklerinden ve kötü alışkanlıklardan tamamen arındırılmalıdır.
5. Hedef Yaş Grubu: ${ageLabel}. Anlatım dili, söz varlığı ve cümle uzunlukları ${ageLabel} gelişim düzeyine ve kavrayış seviyesine mükemmel biçimde uymalıdır.

PARAMETRELER:
- Eser Türü: ${contentType} (${typeLabel})
- Ana Kahraman: ${childName} (${ageLabel})
- Diğer Kahramanlar: ${heroes || 'Sevimli dostlar'}
- Mekan / Ortam: ${location || (isMasal ? 'Büyülü sihirli bir şato diyardı' : 'Güzel ve sıcak bir mahalle/okul/doğa parkı')}
- Tema / Konu: ${genre || 'Eğlenceli Macera & Erdemler'}
- Ek Detaylar ve Mesaj: ${specialDetails || 'Ahlaki ve pedagojik güzel bir ders içersin'}

SADECE geçerli bir JSON yanıtı döndür. Yanıtında herhangi bir markdown kod bloğu olmadan tam ve geçerli JSON olsun.

JSON Formatı:
{
  "title": "${typeLabel} Başlığı",
  "subtitle": "Etkileyici ve merak uyandıran 1 cümlelik özet",
  "category": "${genre || 'Eğlenceli Macera & Erdemler'}",
  "moralMessage": "Çocuğa kazandırılacak ana manevi/pedagojik ders",
  "readingTime": "5-7 Dakika Okuma Süresi",
  "historicalFact": "BUNU BİLİYOR MUSUNUZ?: Bu eser konusuyla ilgili (doğa, bilim, uzay, hayvanlar alemi, geleneksel çocuk oyunları, tarih veya sanat hakkında) çok ilgi çekici 2-3 cümlelik öğretici gerçek bilgi.",
  "reflectionQuestions": [
    "Sizce kahramanımız neden bu davranışı seçti?",
    "Biz günlük hayatımızda bu güzel erdemi nasıl uygulayabiliriz?",
    "Bu hikayede seni en çok etkileyen güzel an hangisiydi?"
  ],
  "miniGlossary": [
    { "term": "Hürmet", "meaning": "Büyüklere ve değerlere duyulan derin saygı" },
    { "term": "Emanet", "meaning": "Korunması için güvenilerek teslim edilen şey" }
  ],
  "chapters": [
    {
      "chapterTitle": "${isSiir ? '' : 'Tanışma ve Heyecanlı Başlangıç'}",
      "paragraphs": [
        "Metin veya şiir kıtası 1...",
        "Metin veya şiir kıtası 2..."
      ],
      "imagePrompt": "Detailed English description of chapter 1 specific scene, characters, cute animals, and fairytale environment."
    },
    {
      "chapterTitle": "${isSiir ? '' : 'Sevgi Dolu Paylaşım'}",
      "paragraphs": [
        "Metin veya şiir kıtası 1...",
        "Metin veya şiir kıtası 2..."
      ],
      "imagePrompt": "Detailed English description of chapter 2 specific scene, emotions, and fairytale environment."
    },
    {
      "chapterTitle": "${isSiir ? '' : 'Dayanışma ve Erdem Sevinci'}",
      "paragraphs": [
        "Metin veya şiir kıtası 1...",
        "Metin veya şiir kıtası 2..."
      ],
      "imagePrompt": "Detailed English description of chapter 3 happy ending, celebration, magical background, and friends."
    }
  ]
}
IMPORTANT FOR IMAGE PROMPTS: Each 'imagePrompt' MUST be a unique, vivid English prompt describing the EXACT specific action, characters, objects, and magical setting in THAT chapter (e.g. 'A joyful 6 year old child with brown hair playing with a glowing blue bird in a magical blooming meadow with distant fairytale castle, vibrant children storybook digital art, soft lighting'). NEVER repeat generic prompts!
`;

      let responseText = '';
      let parsedData: any = null;

      // Primary Attempt: gemini-2.5-flash
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });
        responseText = response.text || '';
      } catch (primaryErr) {
        console.warn('Primary model gemini-2.5-flash failed, attempting fallback gemini-3.6-flash:', primaryErr);
        // Secondary Attempt: gemini-3.6-flash
        try {
          const fallbackResp = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });
          responseText = fallbackResp.text || '';
        } catch (secondaryErr) {
          console.error('Both Gemini models failed:', secondaryErr);
        }
      }

      // Resilient JSON Parsing Strategy
      if (responseText) {
        try {
          parsedData = JSON.parse(responseText);
        } catch (pErr) {
          try {
            const cleaned = responseText
              .replace(/```json/gi, '')
              .replace(/```/g, '')
              .trim();
            parsedData = JSON.parse(cleaned);
          } catch (cleanErr) {
            // Extract JSON object using regex match
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                parsedData = JSON.parse(jsonMatch[0]);
              } catch (mErr) {
                console.warn('Regex JSON extraction failed');
              }
            }
          }
        }
      }

      // Guarantee structured story object even if AI response was partially malformed
      if (!parsedData || typeof parsedData !== 'object') {
        const isSiir = contentType === 'Şiir';
        parsedData = {
          title: `${childName}'in ${genre || contentType} Serüveni`,
          subtitle: `${childName} için özel olarak sevgiyle hazırlanan ${contentType.toLowerCase()}.`,
          category: genre || 'Erdemler ve Sevgi',
          moralMessage: 'Sevgi, dürüstlük ve dayanışma her zorluğun üstesinden gelir.',
          readingTime: '5-6 Dakika Okuma Süresi',
          historicalFact: 'Gönül dostluğu ve dürüstlük insana en güzel mutluluğu kazandırır.',
          reflectionQuestions: [
            'Bu güzel hikayede kahramanımızın hangi davranışı hoşuna gitti?',
            'Sevgi ve saygıyı hayatımızda nasıl gösterebiliriz?'
          ],
          miniGlossary: [
            { term: 'Erdem', meaning: 'İnsanın ruhunu güzelleştiren ahlaki nitelikler' }
          ],
          chapters: [
            {
              chapterTitle: isSiir ? '' : '1. Bölüm: Güzel Bir Başlangıç',
              paragraphs: [
                `Bir zamanlar, ${location || 'yeşillikler içinde şirin bir kasabada'} ${childName} adında neşeli ve meraklı bir çocuk yaşarmış.`,
                `${childName}, çevresindeki herkese sevgiyle yaklaşır, her gün yeni şeyler öğrenmek için heyecanla güne başlarmış.`
              ],
              imagePrompt: `A happy 6 year old child ${childName} in a beautiful fairytale landscape, digital art`
            },
            {
              chapterTitle: isSiir ? '' : '2. Bölüm: Dostluk ve Yardımlaşma',
              paragraphs: [
                `${heroes || 'Sevimli dostları'} ile birlikte güzel bir maceraya atılan ${childName}, paylaşmanın ve birlikte güzel işler yapmanın önemini bir kez daha anlamış.`,
                `Her adımlarında etraflarına ışık ve neşe saçarak tüm zorlukların üstesinden el birliğiyle gelmişler.`
              ],
              imagePrompt: `Child playing with friendly animals in a bright sunny garden, storybook art`
            },
            {
              chapterTitle: isSiir ? '' : '3. Bölüm: Sevgi Dolu Son',
              paragraphs: [
                `Günün sonunda ${childName}, yüreğinde tatlı bir huzur ve yüzünde tebessümle bu güzel günü tamamlamış.`,
                `Çünkü bilirdi ki; iyilik, merhamet ve sevgi paylaşıldıkça çoğalan en kıymetli hazinedir.`
              ],
              imagePrompt: `Happy ending sunset over a magical peaceful village, children book illustration`
            }
          ]
        };
      }

      if (parsedData.chapters && Array.isArray(parsedData.chapters)) {
        parsedData.chapters = parsedData.chapters.map((ch: any, index: number) => {
          const rawPrompt = ch.imagePrompt || `storybook illustration for ${childName} chapter ${index + 1}`;
          const cleanPrompt = String(rawPrompt).replace(/[^a-zA-Z0-9 ,]/g, '');
          const seed = Math.floor(Math.random() * 900000) + 100000;
          
          // Pollinations AI high-quality storybook illustration matching prompt
          const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
            `whimsical digital children storybook illustration, fairytale art style, ${cleanPrompt}, cute character, pastel colors, 8k`
          )}?width=1000&height=562&nologo=true&seed=${seed}`;
          
          return {
            ...ch,
            chapterTitle: isSiir ? '' : (ch.chapterTitle || `${index + 1}. Bölüm`),
            imagePrompt: rawPrompt,
            generatedImageUrl: pollinationsUrl
          };
        });
      }

      return res.json(parsedData);
    } catch (error: any) {
      console.error('Gemini Story Generation Error:', error);
      return res.status(500).json({
        error: 'İçerik oluşturulurken beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyiniz.',
        details: error.message
      });
    }
  });

  // Natural Human Voice Text-To-Speech (TTS) Endpoint using Gemini TTS
  app.post('/api/tts', async (req, res) => {
    try {
      const { text, voiceName = 'Kore' } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Seslendirilecek metin zorunludur.' });
      }

      const promptText = `Lütfen aşağıdaki Türkçe metni şefkatli bir masal anlatıcısı tonunda Türkçe seslendir:\n"${text.substring(0, 450)}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: promptText,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
            },
          },
        },
      });

      const candidatePart = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = candidatePart?.inlineData?.data;
      const mimeType = candidatePart?.inlineData?.mimeType || 'audio/mp3';

      if (base64Audio) {
        return res.json({ audio: base64Audio, mimeType });
      } else {
        return res.status(500).json({ error: 'Ses üretilemedi.' });
      }
    } catch (error: any) {
      console.warn('Gemini TTS endpoint error:', error?.message);
      return res.status(500).json({ error: error?.message || 'TTS hatası' });
    }
  });

  // Dynamic Image Generation Endpoint
  app.post('/api/generate-chapter-image', async (req, res) => {
    try {
      const { prompt: rawPrompt, chapterTitle, storyTitle } = req.body;
      const descPrompt = rawPrompt || `${storyTitle || 'masal'} ${chapterTitle || ''}`;
      const cleanPrompt = descPrompt.replace(/[^a-zA-Z0-9 ,]/g, '');
      const seed = Math.floor(Math.random() * 900000) + 100000;

      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        `cute whimsical children storybook fairytale illustration, ${cleanPrompt}, pastel colors, detailed character, 8k`
      )}?width=1000&height=562&nologo=true&seed=${seed}`;

      return res.json({ imageUrl: pollinationsUrl });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message });
    }
  });

  // Vite Integration in Dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
