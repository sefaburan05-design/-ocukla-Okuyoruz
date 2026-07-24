import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

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
      "imagePrompt": "A cute whimsical children storybook illustration of ${childName}, a happy ${childAge || 6} year old child in ${location || 'a beautiful meadow'}, pastel colors, soft lighting, 8k disney style."
    },
    {
      "chapterTitle": "${isSiir ? '' : 'Sevgi Dolu Paylaşım'}",
      "paragraphs": [
        "Metin veya şiir kıtası 1...",
        "Metin veya şiir kıtası 2..."
      ],
      "imagePrompt": "Beautiful fairytale scene of ${childName} learning about kindness and sharing with friends in ${location || 'a village'}, warm sunlight, colorful storybook art."
    },
    {
      "chapterTitle": "${isSiir ? '' : 'Dayanışma ve Erdem Sevinci'}",
      "paragraphs": [
        "Metin veya şiir kıtası 1...",
        "Metin veya şiir kıtası 2..."
      ],
      "imagePrompt": "Magical storybook illustration of ${childName} celebrating good values, glowing golden light, cute animal friends, detailed digital art."
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      let parsedData: any = {};
      
      try {
        parsedData = JSON.parse(responseText);
      } catch (pErr) {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      // Curated fast-loading storybook illustrations for instant reliable image fallback
      const STORY_ILLUSTRATIONS = [
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
      ];

      if (parsedData.chapters && Array.isArray(parsedData.chapters)) {
        parsedData.chapters = parsedData.chapters.map((ch: any, index: number) => {
          const rawPrompt = ch.imagePrompt || `storybook illustration for ${childName} chapter ${index + 1}`;
          const cleanPrompt = rawPrompt.replace(/[^a-zA-Z0-9 ,]/g, '');
          const seed = Math.floor(Math.random() * 90000) + 10000;
          // Synchronous Pollinations AI image URL generated with prompt + fallback
          const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`children storybook illustration, ${cleanPrompt}, pastel colors, cute art style, 8k`)}?width=800&height=500&nologo=true&seed=${seed}`;
          
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
        error: 'İçerik oluşturulurken bir hata meydana geldi.',
        details: error.message
      });
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
