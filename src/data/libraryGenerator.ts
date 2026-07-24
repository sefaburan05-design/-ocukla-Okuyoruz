import { Story } from '../types';

// Real Turkish Names & Turkish Historical Figures / Epic Heroes
const HERO_NAMES = [
  // Real Turkish Children Names
  "Can", "Zeynep", "Ahmet", "Elif", "Ömer", "Ayşe", "Yusuf", "Merve", "Ali", "Fatma",
  "Emre", "Sare", "Mehmet", "Zehra", "Eren", "Azra", "Mustafa", "Hatice", "Kerem", "Defne",
  "Hasan", "Zeynep Ela", "İbrahim", "Hira", "Hamza", "Esma", "Burak", "Betül", "Taha", "Meryem",
  "Selim", "Beyza", "Barış", "Asya", "Kaan", "Nisa", "Arda", "İrem", "Ege", "Derin",
  "Umut", "Eylül", "Doruk", "Yağmur", "Çınar", "Duru", "Deniz", "Ada", "Poyraz", "Bade",
  
  // Great National, Historical & Spiritual Heroes
  "Gazi Mustafa Kemal Atatürk", "Hazreti Muhammed'in (s.a.v.) Güzel Ahlakı", "Fatih Sultan Mehmet",
  "Sultan Alparslan", "Mimar Sinan", "Seyit Onbaşı", "Nene Hatun", "Yunus Emre", "Mevlana",
  "Hezarfen Ahmet Çelebi", "Piri Reis", "Bilge Kağan", "Dede Korkut", "Barbaros Hayreddin",
  "Şerife Bacı", "Veysel Karani", "Hz. Ömer'in Adaleti", "Hz. Ali'nin İlim Yolculuğu",
  "Ali Kuşçu", "İbn-i Sina", "Cahit Arf", "Aziz Sancar", "Uluğ Bey", "Evliya Çelebi"
];

const AGE_GROUPS = [
  "3-5 Yaş (Anaokulu)",
  "5-7 Yaş (Okul Öncesi & İlkokul)",
  "6-8 Yaş (İlkokul Çağı)",
  "7-9 Yaş (Maceracı Çocuklar)",
  "8-10 Yaş (İlkokul Üst Seviye)"
];

const CATEGORIES = [
  "Milli ve Manevi Değerlerimiz & Erdemler",
  "Tarihi Kahramanlar ve Milli Gurur",
  "Peygamberimizin Sünneti ve Güzel Ahlak",
  "Eğlenceli Macera ve Hayal Gücü",
  "Eğitici & Öğretici Hikayeler",
  "Doğa ve Hayvan Sevgisi",
  "Dürüstlük, Paylaşım ve Yardımlaşma",
  "Bilim, Sanat ve Keşif Yolculuğu"
];

const HISTORICAL_FACTS = [
  "Gazi Mustafa Kemal Atatürk, 23 Nisan gününü dünyadaki tüm çocuklara bayram olarak armağan eden ilk liderdir.",
  "Hazreti Muhammed (s.a.v.), çocukları çok sever, yolda gördüğünde selam verir ve torunları Hz. Hasan ile Hz. Hüseyin'i sırtında taşıyarak oynatırdı.",
  "Ecdadımız Osmanlı döneminde sadaka taşları ve zimem defteri gelenekleriyle ihtiyaç sahiplerini rencide etmeden yardımlaşmayı esas almıştır.",
  "Mimar Sinan eserlerinde kuş evlerine ve estetik havalandırma sistemlerine özel önem vererek mahlukata merhameti mimariyle buluşturmuştur.",
  "Tarihte Yunus Emre ve Mevlana gibi gönül mimarları, 'Yaratılanı severiz Yaratandan ötürü' nefesiyle Anadolu toprağına sevgi ekmişlerdir.",
  "Hezarfen Ahmet Çelebi, Galata Kulesi'nden Üsküdar'a kanat çırparak insanlık tarihinin ilk uçuş denemelerinden birini başarmıştır.",
  "Piri Reis, ceylan derisi üzerine çizdiği dünya haritası ve Kitab-ı Bahriye eseriyle denizcilik tarihine adını altın harflerle yazdırmıştır.",
  "Çanakkale Zaferi'nde Seyit Onbaşı, 215 kiloluk top mermisini tek başına sırtlayarak vatan savunmasının unutulmaz sembolü olmuştur.",
  "Nene Hatun, 'Evladım anasız yaşayabilir ama vatansız yaşayamaz' diyerek cepheye koşmuş yiğit bir Türk kadınıdır.",
  "Ali Kuşçu ve Uluğ Bey, gökyüzünü ve yıldızları inceleyerek çağlarının en gelişmiş rasathanelerini kurmuş büyük bilim insanlarıdır."
];

const REFLECTIONS = [
  ["Atatürk'ün çocuklara verdiği değer ve sevgi hayatımızı nasıl aydınlatır?", "Siz bu durumda olsaydınız vatanınız ve arkadaşlarınız için ne yapardınız?", "Okuma ve öğrenme sevgisi bize neler kazandırır?"],
  ["Peygamber Efendimizin (s.a.v.) merhamet ve dürüstlük anlayışını günlük hayatımızda nasıl uygulayabiliriz?", "Büyüklere hürmet ve küçüklere şefkat göstermek toplumumuzu nasıl mutlu kılar?", "Dürüstlük neden en büyük hazinedir?"],
  ["Milli kahramanlarımızın cesareti ve fedakarlığı bize nasıl ilham veriyor?", "Bir zorlukla karşılaştığımızda pes etmemek bize ne kazandırır?", "Bugün çevrenizdeki insanlara yapabileceğiniz en güzel iyilik nedir?"]
];

const GLOSSARIES = [
  [
    { term: 'Vatanseverlik', meaning: 'Milletine, toprağına ve bayrağına duyulan derin sevgi ve bağlılık' },
    { term: 'Emanet', meaning: 'Korunması için güvenilerek teslim edilen kıymetli şey' }
  ],
  [
    { term: 'El-Emin', meaning: 'Peygamber Efendimizin (s.a.v.) herkesçe bilinen en güvenilir ve dürüst olma sıfatı' },
    { term: 'Sünnet', meaning: 'Peygamberimizin yaptığı, tavsiye ettiği güzel davranış ve ahlak ilkeleri' }
  ],
  [
    { term: 'Fedakarlık', meaning: 'Sevdikleri ve vatanı uğruna kendi rahatından neşeyle vazgeçebilme erdemi' },
    { term: 'Kadirşinaslık', meaning: 'Yapılan iyiliğin, emeğin ve tarihsel mirasın değerini bilme bilinci' }
  ]
];

// Rich Themes for Masal (Including National & Spiritual Fairytales)
const MASAL_THEMES = [
  { title: "Atatürk'ün Çocuklara Armağan Ettiği Işıklı Bayram", topic: "atatürk", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Peygamberimizin Gül Kokulu Şefkat Bahçesi", topic: "peygamber", category: "Peygamberimizin Sünneti ve Güzel Ahlak" },
  { title: "Mimar Sinan ve Kuşların Sihirli Sarayı", topic: "sinan", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Hezarfen'in Kanatlarında Gökyüzü Masalı", topic: "hezarfen", category: "Bilim, Sanat ve Keşif Yolculuğu" },
  { title: "Dede Korkut'un Bilgelik Davulu ve Yiğit Çocuk", topic: "dedekorkut", category: "Milli ve Manevi Değerlerimiz & Erdemler" },
  { title: "Yunus Emre'nin Sevgi Çiçekleri Açan Ormanı", topic: "yunusemre", category: "Milli ve Manevi Değerlerimiz & Erdemler" },
  { title: "Alparslan'ın Cesaret Atı ve Altın Anahtar", topic: "alparslan", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Piri Reis'in Sihirli Pusulası ve Okyanus Sırrı", topic: "pirireis", category: "Bilim, Sanat ve Keşif Yolculuğu" },
  { title: "Sihirli Elma Ormanı ve Cömertlik Sırrı", topic: "genel", category: "Dürüstlük, Paylaşım ve Yardımlaşma" },
  { title: "Kristal Kanatlı Kuşun Macerası", topic: "genel", category: "Eğlenceli Macera ve Hayal Gücü" },
  { title: "Yıldız Tozu Şatosu ve Sevgi Çeşmesi", topic: "genel", category: "Eğlenceli Macera ve Hayal Gücü" },
  { title: "Uçan Halı ve Küçük Gezgin", topic: "genel", category: "Eğlenceli Macera ve Hayal Gücü" },
  { title: "Güneş Ülkesinin Güleryüzlü Çocuğu", topic: "genel", category: "Doğa ve Hayvan Sevgisi" },
  { title: "Gümüş Irmak ve Bilge Pelikan", topic: "genel", category: "Doğa ve Hayvan Sevgisi" },
  { title: "Çikolata Köyünün Cömert Muhtarı", topic: "genel", category: "Dürüstlük, Paylaşım ve Yardımlaşma" }
];

// Rich Themes for Hikaye (National, Historic & Real Life)
const HIKAYE_THEMES = [
  { title: "Atatürk'ün Kitap Sevgisi ve Küçük Mustafa'nın Rüyası", topic: "atatürk", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Peygamberimizin Merhameti ve Kuş Yolu Hikayesi", topic: "peygamber", category: "Peygamberimizin Sünneti ve Güzel Ahlak" },
  { title: "Seyit Onbaşı'nın Vatan Sevdası ve Kahramanlık Yolu", topic: "canakkale", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Nene Hatun'un Cesareti ve Erzurum Siperleri", topic: "milli", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Fatih Sultan Mehmet'in Bilim ve Kitap Merakı", topic: "fatih", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Veysel Karani'nin Anne Sevgisi ve Hırka-i Şerif", topic: "veysel", category: "Peygamberimizin Sünneti ve Güzel Ahlak" },
  { title: "Hz. Ömer'in Adaleti ve Gece Feneri", topic: "adalet", category: "Milli ve Manevi Değerlerimiz & Erdemler" },
  { title: "Cahit Arf ve Sayıların Büyülü Dünyası", topic: "bilim", category: "Bilim, Sanat ve Keşif Yolculuğu" },
  { title: "Aziz Sancar'ın Laboratuvar İdealizmi", topic: "bilim", category: "Bilim, Sanat ve Keşif Yolculuğu" },
  { title: "Mahalle Takımının Dostluk Maçı", topic: "genel", category: "Eğitici & Öğretici Hikayeler" },
  { title: "Eski Saatçinin Değerli Hediyesi", topic: "genel", category: "Dürüstlük, Paylaşım ve Yardımlaşma" },
  { title: "Sokak Kedisi Minnoş'a Yuva", topic: "genel", category: "Doğa ve Hayvan Sevgisi" },
  { title: "Dedemin Ahşap Atölyesindeki Sır", topic: "genel", category: "Eğitici & Öğretici Hikayeler" },
  { title: "Milli Parkta Kamp Macerası", topic: "genel", category: "Doğa ve Hayvan Sevgisi" },
  { title: "Okul Kütüphanesindeki Gizemli Kitap", topic: "genel", category: "Bilim, Sanat ve Keşif Yolculuğu" }
];

// Rich Themes for Şiir (National, Spiritual & Moral Poetry)
const SIIR_THEMES = [
  { title: "23 Nisan ve Atatürk Sevgisi", topic: "atatürk", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Peygamberimizin Ahenkli Gül Kokusu", topic: "peygamber", category: "Peygamberimizin Sünneti ve Güzel Ahlak" },
  { title: "Ay Yıldızlı Al Bayrağım", topic: "bayrak", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Çanakkale Destanı ve Vatan Sevgisi", topic: "canakkale", category: "Tarihi Kahramanlar ve Milli Gurur" },
  { title: "Yunus Emre Gibi Sevmek", topic: "yunus", category: "Milli ve Manevi Değerlerimiz & Erdemler" },
  { title: "Annem Benim Canım Annem", topic: "anne", category: "Milli ve Manevi Değerlerimiz & Erdemler" },
  { title: "Okulum Sevgi Yuvası", topic: "okul", category: "Eğitici & Öğretici Hikayeler" },
  { title: "Doğanın Fısıltısı ve Yeşil Aşkı", topic: "doga", category: "Doğa ve Hayvan Sevgisi" },
  { title: "Doğruluk ve Dürüstlük Türküsü", topic: "durustluk", category: "Dürüstlük, Paylaşım ve Yardımlaşma" },
  { title: "Büyüklere Saygı ve Şefkat", topic: "saygi", category: "Milli ve Manevi Değerlerimiz & Erdemler" }
];

// Content Generator Function for Long Rich Masallar (4 Chapters, 3-5 min reading time)
function generate1000Masal(): Story[] {
  const list: Story[] = [];

  for (let i = 1; i <= 1000; i++) {
    const name = HERO_NAMES[(i - 1) % HERO_NAMES.length];
    const themeObj = MASAL_THEMES[(i - 1) % MASAL_THEMES.length];
    const age = AGE_GROUPS[(i - 1) % AGE_GROUPS.length];
    const category = themeObj.category || CATEGORIES[(i - 1) % CATEGORIES.length];

    const title = i <= 30 ? `${name} ile ${themeObj.title}` : `Masal #${i}: ${name} ve ${themeObj.title}`;

    let p1_1 = `Bir zamanlar, gözleri yıldızlar gibi parıldayan, kalbi sevgi ve merhametle dolu ${name} adında akıllı bir çocuk yaşardı. ${name}, vatanını, doğayı, masalları ve büyüklere hürmet etmeyi her şeyden çok severdi.`;
    let p1_2 = `Pırıl pırıl bir bahar sabahında ${name}, kuşların neşeyle cıvıldaştığı yeşil tepelerin ardında gizlenmiş sihirli bir geçit keşfetti. Bu geçit, iyilik ve adalet tohumlarının filizlendiği Masal Ülkesi'ne açılıyordu.`;
    let p1_3 = `${name}, yanına tatlı gülücüklerini ve dürüstlükle dolu cesaretini alarak bu masalsı patikada ilk adımını attı.`;

    let p2_1 = `Masal Ülkesi'ne vardığında etrafta rengarenk kelebekler süzülüyor, ulu çınar ağaçları neşeyle fısıldıyordu: 'Hoş geldin güzel kalpli ${name}!'`;
    let p2_2 = `Yolda sevimli minik hayvan dostlarıyla karşılaştı. Dostları ona bu diyardaki en büyük hazinenin altın veya gümüş değil, kalpten paylaşılan sevgi ve dürüstlük olduğunu söylediler.`;
    let p2_3 = `${name}, yolda karşılaştığı yaşlı bilge pelikanın çantasını taşımaya yardım ederek büyüklere saygının en güzel örneğini sergiledi.`;

    let p3_1 = `Yolculuk boyunca önlerine zorlu bir nehir çıktı. Karşıya geçebilmek için herkesin el ele vermesi ve güçlerini birleştirmesi gerekiyordu.`;
    let p3_2 = `${name}, bencilce davranmak yerine arkadaşlarını yüreklendirdi. Birlikte kurdukları sağlam dostluk köprüsü sayesinde nehrin karşısına güvenle geçmeyi başardılar.`;
    let p3_3 = `O anda gökyüzünde ışıl ışıl bir gökkuşağı belirdi ve ${name}'in dürüstlüğü ile cömertliğini ödüllendirdi.`;

    let p4_1 = `Günün sonunda ${name}, Masal Ülkesi'nin bilge önderinden altın değerinde bir nasihat aldı: 'Gerçek kahramanlık; insanlara şefkatle yaklaşmak, dürüstlükten ayrılmamak ve vatana hayırlı bir insan olmaktır.'`;
    let p4_2 = `Kalbi neşeyle ve gururla dolan ${name}, öğrendiği bu güzel erdemleri kardeşlerine ve arkadaşlarına anlatmak üzere huzurla evine döndü.`;

    if (themeObj.topic === 'atatürk') {
      p1_1 = `Gazi Mustafa Kemal Atatürk'ün tüm dünya çocuklarına hediye ettiği 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı sabahında, ${name} evinin balkonuna al bayrağımızı neşeyle astı.`;
      p1_2 = `${name}'in kalbi vatan sevgisi ve coşkuyla çarpıyordu. Gazi Paşa'nın 'Çocuklar geleceğimizin teminatıdır' sözünü her düşündüğünde gözleri gururla parlıyordu.`;
      p1_3 = `O gün okulda düzenlenecek bayram töreninde ${name}, arkadaşlarıyla birlikte Atatürk'ün izinde yürümek üzere sabırsızlanıyordu.`;

      p2_1 = `Tören alanında kırmızı beyaz balonlar gökyüzüne havalanıyor, İstiklal Marşımız yankılanıyordu. ${name}, şiirini okumak üzere kürsüye adım attı.`;
      p2_2 = `Atatürk'ün kitaba, bilime, sanata ve milli değerlerimize verdiği ehemmiyeti gür bir sesle anlattı. Salondaki herkes bu küçük kahramanı coşkuyla alkışladı.`;
      p2_3 = `Öğretmeni ${name}'in başını okşayarak: 'Gazi Paşa sizler gibi vatanını seven, dürüst ve çalışkan çocuklarla gurur duyardı' dedi.`;

      p3_1 = `Bayram kutlamalarının ardından ${name} ve arkadaşları, okul bahçesine '23 Nisan Fidanı' dikmeye karar verdiler.`;
      p3_2 = `Toprağı neşeyle kazdılar, fidanı dikip can suyunu verdiler. Bu fidan tıpkı Cumhuriyetimiz gibi büyüyecek, gölgesinde gelecek nesiller serinleyecekti.`;
      p3_3 = `${name}, birlik içinde çalışmanın ve vatan toprağına emek vermenin tarifsiz mutluluğunu yaşadı.`;

      p4_1 = `Akşam olduğunda ${name}, bayrak kokan odasında Atatürk'ün Nutuk eserini ve çocukluğuna dair anıları okudu.`;
      p4_2 = `İlimde, bilimde ve ahlakta en ön safta yer alacağına, milletine faydalı durust bir insan olacağına yürekten söz vererek huzurla uykuya daldı.`;
    } else if (themeObj.topic === 'peygamber') {
      p1_1 = `Sevgili ${name}, Peygamber Efendimiz Hazreti Muhammed'in (s.a.v.) çocuklara duyduğu engin merhameti ve 'El-Emin' yani en güvenilir insan olma sıfatını öğreniyordu.`;
      p1_2 = `Peygamberimizin yolda karşılaştığı çocuklara tebessümle selam vermesi, yetimleri koruması ve komşuluk haklarına riayet etmesi ${name}'in kalbini sıcacık yapıyordu.`;
      p1_3 = `${name}, Peygamberimizin bu güzel sünnetlerini günlük hayatında bir bir uygulamaya karar verdi.`;

      p2_1 = `Bir gün mahallede oyun oynarken ${name}, komşu teyzenin ağır pazar poşetlerini taşımakta zorlandığını fark etti.`;
      p2_2 = `Hemen koşarak ona yardım etti ve yüzündeki tebessümle poşetleri kapısına kadar taşıdı. Komşu teyze ${name}'e 'Allah senden razı olsun evladım' diyerek dua etti.`;
      p2_3 = `${name}, küçük bir yardımın bile insan yüreğinde nasıl çiçekler açtırdığını bizzat yaşayarak gördü.`;

      p3_1 = `Sokakta kanadı kırılmış minik bir serçe gören ${name}, onu incitmeden avucuna aldı ve babasıyla birlikte hemen veterinere götürdü.`;
      p3_2 = `Peygamberimizin 'Yeryüzündekilere merhamet edin ki göktekiler de size merhamet etsin' hadis-i şerifini hatırlayarak serçeye su ve yem verdi.`;
      p3_3 = `Serçenin iyileşip yeniden kanat çırpması ${name}'e dünyadaki en büyük mutluluğu yaşattı.`;

      p4_1 = `Akşam aile sofrasında ${name}, gün boyunca yaşadığı bu güzel halleri annesine ve babasına gururla anlattı.`;
      p4_2 = `Güzel ahlakın ve dürüstlüğün insana kazandırdığı en tatlı huzurla odasına geçti ve sevgi dolu rüyalara daldı.`;
    }

    list.push({
      id: `masal-${i}`,
      contentType: 'Masal',
      title,
      subtitle: `${name} için kaleme alınmış; 4 bölümlük, milli ve manevi erdemlerle örülü 5 dakikalık zengin masal.`,
      childName: name,
      childAge: age,
      readingTime: `5 Dakika Okuma`,
      category,
      moralMessage: "İyilik, vatan sevgisi, dürüstlük ve güzel ahlak kalbimizi aydınlatan en parlak ışıktır.",
      historicalFact: HISTORICAL_FACTS[i % HISTORICAL_FACTS.length],
      reflectionQuestions: REFLECTIONS[i % REFLECTIONS.length],
      miniGlossary: GLOSSARIES[i % GLOSSARIES.length],
      createdAt: i < 20 ? 'Bugün' : 'Önceki Günler',
      views: 120 + i * 3,
      chapters: [
        {
          chapterTitle: `1. Bölüm: ${name}'in Heyecanlı Yolculuğu`,
          paragraphs: [p1_1, p1_2, p1_3],
          imagePrompt: `A cute Turkish child named ${name} in a peaceful fairytale setting, glowing sunlight, storybook illustration`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
        },
        {
          chapterTitle: `2. Bölüm: İyilik ve Hürmet Yolu`,
          paragraphs: [p2_1, p2_2, p2_3],
          imagePrompt: `Child with friendly animals under starry sky, magical peaceful children illustration`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
        },
        {
          chapterTitle: `3. Bölüm: Birlik Olmanın ve Dayanışmanın Gücü`,
          paragraphs: [p3_1, p3_2, p3_3],
          imagePrompt: `Children helping each other in a magical green forest, warm sunlight, digital art`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
        },
        {
          chapterTitle: `4. Bölüm: Mutlu Son ve Aydınlık Gelecek`,
          paragraphs: [p4_1, p4_2],
          imagePrompt: `A child looking at a starry night sky with a peaceful smile, warm cozy bedroom, storybook illustration`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
        }
      ]
    });
  }

  return list;
}

// Content Generator Function for Long Rich Hikayeler (4 Chapters, 4-6 min reading time)
function generate1000Hikaye(): Story[] {
  const list: Story[] = [];

  for (let i = 1; i <= 1000; i++) {
    const name = HERO_NAMES[(i + 3) % HERO_NAMES.length];
    const themeObj = HIKAYE_THEMES[(i - 1) % HIKAYE_THEMES.length];
    const age = AGE_GROUPS[(i - 1) % AGE_GROUPS.length];
    const category = themeObj.category || CATEGORIES[(i - 1) % CATEGORIES.length];

    const title = i <= 30 ? `${name} ve ${themeObj.title}` : `Hikaye #${i}: ${name}'in ${themeObj.title}`;

    let h1_1 = `Güneşli ve cıvıl cıvıl bir sabah ${name}, okul çantasına neşeyle defterlerini yerleştirip yola çıktı.`;
    let h1_2 = `${name}; öğretmenlerini dikkatle dinleyen, arkadaşlarıyla oyuncaklarını ve ekmeğini paylaşan son derece terbiye sahibi bir çocuktu.`;
    let h1_3 = `O gün okulda öğretmenleri 'Çevremize ve İnsanlığa Faydalı Olma Haftası' kapsamında özel bir imece projesi başlatmıştı.`;

    let h2_1 = `Sınıfta gruplar kuruldu. ${name}, arkadaşlarına mahalledeki yaşlı teyzeler ve amcalar için bir kitap okuma ve yardım kulübü kurmayı teklif etti.`;
    let h2_2 = `Fikir oy birliğiyle kabul edildi. Tarihimizdeki sadaka taşları, aşevleri ve Osmanlı vakıf medeniyetini hatırlayan çocuklar, bu güzel gelenekleri yaşatmak istedi.`;
    let h2_3 = `Okul kütüphanesinden seçtikleri birbirinden güzel milli ve eğitici kitapları özenle çantalara yerleştirdiler.`;

    let h3_1 = `Öğleden sonra mahalle muhtarının rehberliğinde ilk ziyarete başladılar. Yaşlı amcalar çocukları kapıda gözleri dolarak karşıladı.`;
    let h3_2 = `${name} onlara tatlı bir ses tonuyla milli mücadele kahramanlarımızı ve birlik beraberlik hikayelerini okudu. Çaylar yudumlandı, dualar edildi.`;
    let h3_3 = `İnsanlara hürmet etmenin ve yüzlerinde gülücükler açtırmanın ne kadar ulvi bir duygu olduğunu hepsi hissetti.`;

    let h4_1 = `Projenin sonunda okul müdürü ${name} ve arkadaşlarını tüm okulun önünde örnek davranışlarından dolayı tebrik etti.`;
    let h4_2 = `${name} eve döndüğünde babasına sarılarak: 'İyilik yaptıkça insan daha çok mutlu oluyormuş' dedi.`;

    if (themeObj.topic === 'atatürk') {
      h1_1 = `Kütüphanede Mustafa Kemal Atatürk'ün çocukluk ve gençlik yıllarını anlatan kitabı büyük bir merakla okuyan ${name}, Gazi'nin kitap sevgisine hayran kaldı.`;
      h1_2 = `Atatürk'ün cephede bile yanında yüzlerce kitap taşıdığını ve 'Eğer okul yıllarımda harçlığımın yarısını kitaplara vermeseydim bugün yaptıklarımın hiçbirini başaramazdım' sözünü öğrendi.`;
      h1_3 = `${name}, bu yüce vizyondan ilham alarak okulunda geniş kapsamlı bir okuma seferberliği başlatmaya karar verdi.`;

      h2_1 = `Ertesi gün sınıfta öğretmenine projesini açtı. Öğretmeni ${name}'in bu milli şuurla dolu fikrini çok beğendi ve onu tüm sınıfa tanıttı.`;
      h2_2 = `${name} ve arkadaşları evlerindeki okuma kitaplarını getirerek okul koridoruna 'Atatürk Kitaplığı' köşesi kurdular.`;
      h2_3 = `Tüm öğrenciler teneffüslerde bu zengin kitaplıktan istifade etmeye başladı. Okul adeta bir bilim ve kültür yuvasına dönüştü.`;

      h3_1 = `Hafta sonu ilçe milli eğitim müdürlüğü okullar arası 'En Çalışkan Okuma Kulübü' yarışması düzenledi.`;
      h3_2 = `${name}, Atatürk'ün bilim, akıl ve milli bağımsızlık hakkındaki düşüncelerini sunumuyla jüriye aktardı.`;
      h3_3 = `Sunum bittiğinde salonda alkış tufanı koptu. ${name}'in okulu birincilik kupasına layık görüldü.`;

      h4_1 = `Tören sonrası birincilik madalyasını boynuna takan ${name}, en büyük ödülün Atatürk'ün gösterdiği muasır medeniyet yolunda ilerlemek olduğunu söyledi.`;
      h4_2 = `Ailesiyle birlikte bu haklı gururu paylaşan ${name}, ülkesine hayırlı bir bilim insanı olma yolunda kararlılıkla yürümeye devam etti.`;
    } else if (themeObj.topic === 'canakkale') {
      h1_1 = `${name}, okul gezisiyle Çanakkale Şehitliği'ni ziyaret etme imkanı buldu. Otobüsten indiğinde o mübarek toprakların manevi havası yüreğini titretti.`;
      h1_2 = `Rehber, Seyit Onbaşı'nın 215 kiloluk mermiyi sırtlayarak vatanı müdafaa edişini ve Mehmetçiklerin 'Çanakkale Geçilmez' destanını gözleri dolarak anlattı.`;
      h1_3 = `${name}, şehitlikteki al bayrağımıza bakarak vatan toprağının ne kadar kutsal bir emanet olduğunu anladı.`;

      h2_1 = `Müzeyi gezerken Seyit Onbaşı'nın heykeli önünde duran ${name}, onun ve silah arkadaşlarının yazdığı tarihi destanı defterine not etti.`;
      h2_2 = `Milletimizin zor zamanlarda inançla, birlikle ve fedakarlıkla nasıl tek yürek olduğunu bizzat hissetti.`;
      h2_3 = `Arkadaşlarına dönerek: 'Bizler bu vatan için gece gündüz çalışmalı ve ecdadımıza layık olmalıyız' dedi.`;

      h3_1 = `Geziden döndükten sonra ${name}, okuldaki panoya Çanakkale Zaferi ve Mehmetçiklerimiz temalı harika bir sergi hazırladı.`;
      h3_2 = `Afişlerde birlik, beraberlik, dürüstlük ve vatan sevgisi vurgularına yer verdi. Bütün okul öğrencileri sergiyi ilgiyle inceledi.`;
      h3_3 = `Öğretmenleri ${name}'in bu hassasiyetini ve tarih şuurunu takdirle ödüllendirdi.`;

      h4_1 = `Akşam evde bayrağını öpüp odasının duvarına asan ${name}, ecdadına dua ederek vatanına hizmet etme aşkıyla büyümeye devam etti.`;
      h4_2 = `Gözlerini kapatırken içinde vatansever bir evlat olmanın tarifsiz gururu vardı.`;
    }

    list.push({
      id: `hikaye-${i}`,
      contentType: 'Hikaye',
      title,
      subtitle: `${name} için kaleme alınmış; 4 bölümlük, milli şuur ve dürüstlük dolu 5 dakikalık hikaye.`,
      childName: name,
      childAge: age,
      readingTime: `5 Dakika Okuma`,
      category,
      moralMessage: "Sorumluluk almak, merhametli ve dürüst olmak, vatanımızı ve bayrağımızı canla sevmek en yüce erdemdir.",
      historicalFact: HISTORICAL_FACTS[(i + 1) % HISTORICAL_FACTS.length],
      reflectionQuestions: REFLECTIONS[(i + 1) % REFLECTIONS.length],
      miniGlossary: GLOSSARIES[(i + 1) % GLOSSARIES.length],
      createdAt: i < 20 ? 'Bugün' : 'Geçen Hafta',
      views: 110 + i * 4,
      chapters: [
        {
          chapterTitle: `1. Bölüm: ${name}'in Anlamlı Adımı`,
          paragraphs: [h1_1, h1_2, h1_3],
          imagePrompt: `A smiling Turkish child in a warm school or historical setting, storybook art style`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
        },
        {
          chapterTitle: `2. Bölüm: Dayanışma ve İmece Ruhu`,
          paragraphs: [h2_1, h2_2, h2_3],
          imagePrompt: `Children collaborating together on a project, bright warm lighting, storybook illustration`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
        },
        {
          chapterTitle: `3. Bölüm: Vatan ve İnsan Sevgisinin Meyvesi`,
          paragraphs: [h3_1, h3_2, h3_3],
          imagePrompt: `Happy children celebrating togetherness in a garden, bright colors children illustration`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
        },
        {
          chapterTitle: `4. Bölüm: Aydınlık Geleceğe Doğru`,
          paragraphs: [h4_1, h4_2],
          imagePrompt: `Child standing proudly with a Turkish flag and books, bright hopeful lighting, digital art`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
        }
      ]
    });
  }

  return list;
}

// Content Generator Function for Şiirler (Strictly NO chapter titles!)
function generate1000Siir(): Story[] {
  const list: Story[] = [];

  for (let i = 1; i <= 1000; i++) {
    const name = HERO_NAMES[(i + 7) % HERO_NAMES.length];
    const themeObj = SIIR_THEMES[(i - 1) % SIIR_THEMES.length];
    const age = AGE_GROUPS[(i - 1) % AGE_GROUPS.length];
    const category = themeObj.category || CATEGORIES[(i - 1) % CATEGORIES.length];

    const title = i <= 30 ? `${name} İçin Şiir: ${themeObj.title}` : `Şiir #${i}: ${name} ve ${themeObj.title}`;

    let k1 = `Güneş doğar ufkumuzdan,\nIşık saçar neşemizden,\n${name} adım, gururum var,\nDoğa tüter nefesimden.`;
    let k2 = `Büyüklerime hürmet ederim,\nTatlı sözle selam veririm,\nDoğruluktur benim yolum,\nİyilikle yükselirim.`;
    let k3 = `Paylaştıkça çoğalır aşımız,\nEl ele veririz kardeşimiz,\nSevgi dolu kalbimizle,\nYürürüz biz geleceğe.`;
    let k4 = `Gönül açarız herkese,\nKulak veririz her sese,\nKitaplarla, ilim ile,\nUlaşırız her hedefe.`;

    if (themeObj.topic === 'atatürk') {
      k1 = `23 Nisan coşkusuyla,\nGül açar Türk yurdumda,\nAtatürk'ün armağanı,\nIşık saçar ufkumuzda.`;
      k2 = `${name} adım, gururla bak,\nGökyüzünde al al bayrak,\nİlim ile bilim ile,\nYürüyeceğiz ileriye doğru tek yürek.`;
      k3 = `Aydınlıktır yarınlarımız,\nGöklerdedir dualarımız,\nAtamızın izindeyiz,\nEksilmez hiç sevgimiz.`;
      k4 = `Vatan bizim canımızdır,\nBayrak şanlı alımızdır,\n${name} okur neşeyle,\nIşık saçar milletine.`;
    } else if (themeObj.topic === 'peygamber') {
      k1 = `Gül kokulu Peygamberim,\nŞefkat dolu yüreğim,\nO'nun güzel ahlakıyla,\nDoğruluğu rehber ederim.`;
      k2 = `Yetimleri sevindiririm,\nKomşuma selam veririm,\n${name} olarak sevgiyle,\nİyilik yolunda yürürüm.`;
      k3 = `Tatlı dille konuşurum,\nSevgi için koşuşurum,\nPeygamberimin sünnetiyle,\nHuzura kavuşurum.`;
      k4 = `El-Emin olmak hedefim,\nDürüstlüktür tek servetim,\nDualarla yükseliriz,\nAydınlanır memleketim.`;
    } else if (themeObj.topic === 'bayrak') {
      k1 = `Al renginde şehit kanı,\nŞanla kaplar her bir yanı,\nAy yıldızlı şanlı bayrak,\nCanımızdan tatlı vatanı.`;
      k2 = `Göklerde özgürce süzül,\nEy nazlı hilal sen gül,\n${name} senin gölgende,\nYürür daima dimdik ve özgür.`;
      k3 = `Dalgalan sen gökyüzünde,\nNeşe var her gözümüzde,\nVatan sevgisi bitmez hiç,\nTaşırız biz özümüzde.`;
      k4 = `Ecdadımızdan emanet,\nBoş durmayız hiç nihayet,\nÇalışırız gecelerce,\nMilletimize hizmet.`;
    }

    list.push({
      id: `siir-${i}`,
      contentType: 'Şiir',
      title,
      subtitle: `${name} için yazılmış; milli coşku, sevgiler ve ahenkli 4 dörtlük şiir.`,
      childName: name,
      childAge: age,
      readingTime: `3 Dakika Okuma`,
      category,
      moralMessage: "Ahenkli mısralarla vatanı, Peygamberimizin güzel ahlakını, doğayı ve dürüstlüğü kalbimize nakşederiz.",
      historicalFact: HISTORICAL_FACTS[(i + 2) % HISTORICAL_FACTS.length],
      reflectionQuestions: REFLECTIONS[(i + 2) % REFLECTIONS.length],
      miniGlossary: GLOSSARIES[(i + 2) % GLOSSARIES.length],
      createdAt: i < 20 ? 'Bugün' : 'Geçen Ay',
      views: 110 + i * 3,
      chapters: [
        {
          chapterTitle: "", // Strictly NO header
          paragraphs: [k1, k2],
          imagePrompt: `A child looking at a beautiful sunrise over peaceful hills with Turkish flags, storybook illustration`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
        },
        {
          chapterTitle: "", // Strictly NO header
          paragraphs: [k3, k4],
          imagePrompt: `Children holding hands under a bright blue sky, warm pastel art`,
          generatedImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
        }
      ]
    });
  }

  return list;
}

let cachedLibrary: Story[] | null = null;

// Full 3,000 Item Library Generator (1,000 Masal + 1,000 Hikaye + 1,000 Şiir)
export function getFullLibraryStories(): Story[] {
  if (cachedLibrary) return cachedLibrary;
  const masallar = generate1000Masal();
  const hikayeler = generate1000Hikaye();
  const siirler = generate1000Siir();

  cachedLibrary = [...masallar, ...hikayeler, ...siirler];
  return cachedLibrary;
}
