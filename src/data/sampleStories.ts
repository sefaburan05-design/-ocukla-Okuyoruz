import { Story } from '../types';

export const SAMPLE_STORIES: Story[] = [
  {
    id: 'sample-1',
    contentType: 'Masal',
    title: 'Can ve Pamuk Şato\'nun İyilik Sırrı',
    subtitle: 'Can\'ın uçan sevimli balonuyla girdiği sihirli diyarlar ve paylaşmanın güzelliğini keşfettiği unutulmaz masal.',
    childName: 'Can',
    childAge: '5-7 Yaş',
    readingTime: '5-6 Dakika Okuma Süresi',
    category: 'Milli ve Manevi Değerlerimiz & Erdemler',
    moralMessage: 'Paylaşmak ve dostlara yardım etmek, kalbimizdeki en büyük zenginliktir.',
    historicalFact: 'Ecdadımız Osmanlı döneminde sadaka taşları ve zimem defteri gelenekleriyle ihtiyaç sahiplerini incitmeden yardımlaşmayı esas almıştır. Ayrıca cami duvarlarına inşa edilen estetik kuş evleriyle mahlukata şefkat gösterilmiştir.',
    reflectionQuestions: [
      'Can bulduğu güzel şeyleri neden tek başına saklamak yerine arkadaşlarıyla paylaştı?',
      'Eski kültürümüzdeki kuş evleri ve sadaka taşları bize merhamet hakkında ne öğretir?',
      'Siz kendi hayatınızda bir arkadaşınıza nasıl yardımcı olabilirsiniz?'
    ],
    miniGlossary: [
      { term: 'Hürmet', meaning: 'Büyüklere ve değerlerimize duyulan derin hürmet ve saygı' },
      { term: 'Emanet', meaning: 'Korunması için güvenilerek teslim edilen kıymetli şey' }
    ],
    createdAt: 'Bugün',
    views: 184,
    chapters: [
      {
        chapterTitle: '1. Bölüm: Bahçedeki Güleryüzlü Balon',
        paragraphs: [
          'Bir bahar sabahı Güneş, masmavi gökyüzünden yeryüzüne neşeli ışıklarını saçıyordu. Yedi yaşındaki sevgili Can, evlerinin çiçek kokulu bahçesinde neşeyle oynuyordu. Tam o sırada, çimlerin üzerinde rengarenk parıldayan sevimli bir balon fark etti.',
          'Balon, Can ona doğru yaklaştıkça hafifçe havalanıyor ve sanki neşeyle gülümsüyordu. İpinde minik, gümüş bir pusula asılıydı. Can pusulaya dokunduğunda tatlı bir meltem esti ve yumuşacık bir ses fısıldadı: "Merhaba Can! Bugün kalbi sevgi dolu çocukların ziyaret edebildiği Pamuk Şato\'ya yolculuk yapmaya hazır mısın?"',
          'Can heyecanla gözlerini ışıldatarak, "Evet, çok isterim!" dedi. Balonun ipini incitmeden tuttu ve birlikte rüzgarın tatlı kucağında süzülmeye başladılar.'
        ],
        imagePrompt: 'A cute young boy holding a glowing blue balloon standing in a sunny flower garden, children storybook illustration style, soft pastel colors',
        generatedImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
      },
      {
        chapterTitle: '2. Bölüm: Bulutların Üstündeki Sevgi Çeşmesi',
        paragraphs: [
          'Yavaşça yükseldikçe evler, minik ağaçlar ve nehirler Can\'ın ayakları altında masalsı bir tablo gibi göründü. Balon onları pamuktan daha yumuşak beyaz bulutların arasına taşıdı.',
          'Bulutların üzerinde minik, tatlı geyikler ve yardımsever kuşlar yaşıyordu. Diyarın ortasında ise kristal berraklığında bir "İyilik Çeşmesi" akıyordu. Çeşmenin yanındaki bilge tavşan Can\'ı saygıyla karşıladı ve şöyle dedi: "Hoş geldin Can! Bu çeşme, yeryüzünde büyüklere saygı gösteren, arkadaşlarıyla paylaşan çocukların sevgisiyle beslenir."',
          'Can, annesine ve babasına her zaman nasıl hürmet ettiğini, arkadaşı Ali ile oyuncaklarını nasıl neşeyle paylaştığını anlattı. Bunu duyan çeşme pırıl pırıl parıldamaya başladı.'
        ],
        imagePrompt: 'Children storybook illustration of a fairytale cloud castle with crystal fountain and starry sky, magical atmosphere, pastel colors',
        generatedImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80'
      },
      {
        chapterTitle: '3. Bölüm: Paylaştıkça Çoğalan Sevinç',
        paragraphs: [
          'Çeşmeden akan tatlı meyve şerbetlerinden diyardaki tüm sevimli canlılar içti. Can yanındaki taze elmalardan minik kuşlara ve tavşana da ikram etti. Onların gözlerindeki mutluluğu görünce Can\'ın içi sıcak bir huzurla doldu.',
          'Bilge tavşan, Can\'a gümüş bir cesaret madalyonu hediye ederek, "Güzel kalpli Can, sen milli ve manevi değerlerine bağlı, paylaşımcı harika bir çocuksun. Bu güzel huyunu hiç kaybetme" dedi.',
          'Güneş batarken balon Can\'ı tekrar kendi bahçesine bıraktı. Can, yaşadığı bu güzel masalı akşam sofrasında ailesine anlatmak için neşeyle eve doğru koştu.'
        ],
        imagePrompt: 'Happy ending children storybook illustration of a young boy surrounded by friendly animals in a fairytale forest, glowing sunlight',
        generatedImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'sample-2',
    contentType: 'Hikaye',
    title: 'Zeynep ve Minik Dost Fındık\'ın Sevgi Yolu',
    subtitle: 'Zeynep\'in bahçede bulduğu yaralı kediye gösterdiği şefkat, sorumluluk ve hayvan sevgisini anlatan sıcacık bir hikaye.',
    childName: 'Zeynep',
    childAge: '6-8 Yaş',
    readingTime: '4-5 Dakika Okuma Süresi',
    category: 'Doğa ve Hayvan Sevgisi',
    moralMessage: 'Canlılara merhamet etmek ve yardım eli uzatmak insanlığın en güzel süsüdür.',
    historicalFact: 'Asr-ı Saadet döneminde Peygamber Efendimiz (s.a.v.) kedileri çok sever, sahabeden Ebu Hureyre (r.a.) kedilere olan düşkünlüğü ve merhameti sebebiyle "Kedicik Babası" unvanıyla anılırdı.',
    reflectionQuestions: [
      'Zeynep minik kedi Fındık\'ı görünce ne hissetti?',
      'Hayvanlara merhamet etmek tarihimizde ve dinimizde neden bu kadar önemlidir?',
      'Evimizdeki veya sokağımızdaki can dostlarımıza nasıl yardımcı olabiliriz?'
    ],
    miniGlossary: [
      { term: 'Şefkat', meaning: 'Sevgili ve koruyucu bir derin merhamet hissi' },
      { term: 'Kadirşinaslık', meaning: 'Yapılan iyiliğin değerini ve kıymetini bilme erdemi' }
    ],
    createdAt: 'Dün',
    views: 126,
    chapters: [
      {
        chapterTitle: '1. Bölüm: Çalıların Arasındaki Sessiz "Miyav"',
        paragraphs: [
          'Zeynep okul çıkışında çantasını sırtlayıp neşeyle eve yürüyordu. Mahallelerindeki koca çınar ağacının altından geçerken çalıların arasından cılız bir ses duydu: "Miyav, miyav..."',
          'Eğilip baktığında, minik kahverengi tüylü, ürkek gözlerle bakan minik bir yavru kedi gördü. Kedi soğuktan hafifçe titriyordu ve ön patisi incinmişti. Zeynep hemen çantasına uzandı, yavruyu incitmeden kucağına aldı ve "Korkma minik dostum, artık güvendesin" diyerek onu eve götürdü.'
        ],
        imagePrompt: 'A sweet little girl with a cute brown kitten in a green garden, whimsical children storybook style, warm lighting',
        generatedImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80'
      },
      {
        chapterTitle: '2. Bölüm: Şefkat ve Sorumluluk',
        paragraphs: [
          'Eve geldiklerinde Zeynep durumu annesine anlattı. Birlikte minik kedi için ılık bir süt hazırladılar ve patisini temiz bir bezle sardılar. Zeynep ona fındık kabuğuna benzeyen tüyleri nedeniyle "Fındık" adını verdi.',
          'Zeynep her gün okuldan geldikten sonra Fındık\'ın bakımını üstlendi, ilacını aksatmadan içirdi ve onunla şefkatle ilgilendi. Birkaç gün içinde Fındık iyileşti ve neşeyle mırlayarak Zeynep\'in etrafında koşmaya başladı. Zeynep, bir canlıya yardım etmenin insanı ne kadar mutlu ettiğini yürekten hissetti.'
        ],
        imagePrompt: 'A little girl taking care of a happy kitten indoors cozy home setting, heartwarming children illustration style',
        generatedImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'sample-3',
    contentType: 'Şiir',
    title: 'Gönül Bahçesi ve Vatan Sevgisi',
    subtitle: 'Ahmet için kaleme alınmış, milli ve manevi değerlerimizi coşkuyla terennüm eden ahenkli bir çocuk şiiri.',
    childName: 'Ahmet',
    childAge: '7-9 Yaş',
    readingTime: '3-4 Dakika Okuma Süresi',
    category: 'Milli ve Manevi Değerlerimiz',
    moralMessage: 'Vatan sevgisi, büyüklere hürmet ve güzel ahlak kalbimizi aydınlatan en parlak ışıktır.',
    historicalFact: 'Tarihte Yunus Emre ve Mevlana gibi gönül mimarları, şiir ve nefesleriyle Anadolu toprağına sevgi, hoşgörü ve milli birlik tohumları ekmişlerdir.',
    reflectionQuestions: [
      'Şiirde vatan ve bayrak sevgisi nasıl dile getirilmiştir?',
      'Büyüklere saygı göstermek bize ne kazandırır?',
      'Gönül bahçemizi güzel ahlakla nasıl süsleyebiliriz?'
    ],
    miniGlossary: [
      { term: 'Ahenk', meaning: 'Seslerin ve uyumun tatlı bir düzen içinde olması' },
      { term: 'Erdem', meaning: 'Ahlakın övdüğü ve insanın sahip olması gereken iyi nitelikler' }
    ],
    createdAt: 'Bugün',
    views: 95,
    chapters: [
      {
        chapterTitle: '1. Kıta Demeti: Vatanım Çiçek Açar',
        paragraphs: [
          'Güneş doğar ufkumuzdan,\nIşık saçar neşemizden,\nAhmet adım, gururum var,\nVatan tüter nefesimden.',
          'Büyüklerime hürmet ederim,\nTatlı sözle selam veririm,\nDoğruluktur benim yolum,\nİyilikle yükselirim.'
        ],
        imagePrompt: 'A joyful young Turkish boy looking at a beautiful sunrise over peaceful hills with wildflowers, storybook illustration',
        generatedImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
      },
      {
        chapterTitle: '2. Kıta Demeti: Sevgi ve Birlik',
        paragraphs: [
          'Paylaştıkça çoğalır aşımız,\nEl ele veririz kardeşimiz,\nAy yıldızlı al bayrağım,\nBizim en yüce tacımız.',
          'Gönül açarız herkese,\nKulak veririz her sese,\nSevgi dolu kalbimizle,\nYürürüz biz geleceğe.'
        ],
        imagePrompt: 'Children holding hands under a bright blue sky with a glowing crescent moon and stars, warm pastel art',
        generatedImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  }
];

