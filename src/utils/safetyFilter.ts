/**
 * Safety and Pedagogical Content Filter for "Çocukla Okuyoruz"
 * Detects profanity, insults, threats, blackmail, bullying, violence, and pedagogical violations.
 */

// List of forbidden exact words and stem patterns (in Turkish & English common terms)
const FORBIDDEN_EXACT_WORDS = new Set([
  'amk', 'aq', 'amq', 'oc', 'oç', 'sik', 'siki', 'siktir', 'siktirgit', 'amına', 'amina',
  'amınakoyayım', 'aminakoyayim', 'amkoyayım', 'yarrak', 'yarak', 'yarram', 'piç', 'pic',
  'orospu', 'göt', 'got', 'gotu', 'götü', 'ibne', 'lavuk', 'kaltak', 'puşt', 'pust',
  'gavat', 'kahpe', 'yosma', 'amcık', 'amcik', 'yaragı', 'sikim', 'siktim', 'sikimle',
  'porno', 'seks', 'sex', 'meme', 'vajina', 'penis', 'sokuş', 'sokus', 'fahişe', 'fahise',
  'aptal', 'gerizekalı', 'gerizekali', 'salak', 'mal', 'hıyar', 'hiyar', 'dingil',
  'dallama', 'aşağılık', 'asagilik', 'ezik', 'şerefsiz', 'serefsiz', 'haysiyetsiz',
  'namussuz', 'gebert', 'öldür', 'oldur', 'katil', 'katliam', 'tecavüz', 'tecavuz',
  'dayak', 'şantaj', 'santaj', 'tehdit', 'bıçak', 'bicak', 'tabanca', 'silah', 'bomba',
  'patlat', 'intihar', 'işkence', 'iskence', 'hırsız', 'hirsiz', 'kurşun', 'kursun',
  'zorbalık', 'zorbalik', 'taciz', 'sövme', 'sovme', 'yavşak', 'yavsak', 'ipne',
  'sürtük', 'surtuk', 'orospuçocuğu', 'orospucocugu', 'döl', 'dol', 'taşak', 'tasak',
  'domuz', 'it', 'köpek', 'itlik', 'kahpelik', 'sürtük', 'göte', 'orospuya',
  'dönek', 'satılmış', 'şerefsizlik', 'yavşaklık', 'puştluk', 'hıdrellez',
  'çük', 'cuk', 'cük', 'çüke', 'pipi', 'pipilik', 'yosma', 'yarag'
]);

// Stem or substring patterns that are unambiguous indicators of violation
const FORBIDDEN_PATTERNS = [
  /s[i!1]kt[i!1]r/i,
  /am[ıi1]na\s*ko/i,
  /o[r0]o[s5]pu/i,
  /p[i!1]ç/i,
  /gebe[rrt]/i,
  /te[cç]av[uü]z/i,
  /şanta[jž]/i,
  /tehd[i!1]t/i,
  /zorbal[ıi]k/i,
  /int[i!1]har/i,
  /ger[i!1]zekal/i,
  /a[sş]a[gğ][ıi]l[ıi]k/i,
  /s[e3]r[e3]fs[i!1]z/i,
  /namu[s5]su[s5]z/i,
  /bomba\s*patla/i,
  /katl[i!1]am/i,
  /kur[sş]un/i,
  /i[sş]ken[cç]e/i,
  /küf[uü]r/i,
  /hakaret/i,
  /zorbal/i,
  /şanta/i,
  /taciz/i
];

/**
 * Normalizes text for safety inspection (converts to lowercase, strips accents & leetspeak)
 */
function normalizeText(text: string): string {
  if (!text) return '';
  let lower = text
    .toLowerCase()
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

  // Basic leetspeak conversions
  lower = lower
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's');

  return lower;
}

export interface SafetyCheckResult {
  isSafe: boolean;
  detectedReason?: string;
  violatingField?: string;
}

/**
 * Checks a single string for inappropriate content
 */
export function checkTextSafety(text: string): SafetyCheckResult {
  if (!text || typeof text !== 'string') {
    return { isSafe: true };
  }

  const rawNormalized = normalizeText(text);
  
  // 1. Check regex patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(rawNormalized) || pattern.test(text)) {
      return {
        isSafe: false,
        detectedReason: 'Pedagojik ve etik standartlara aykırı ifade veya kavram tespit edildi.'
      };
    }
  }

  // 2. Tokenize words and check against exact list
  const words = rawNormalized.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
  
  for (const word of words) {
    if (FORBIDDEN_EXACT_WORDS.has(word)) {
      return {
        isSafe: false,
        detectedReason: `İçeriğe girmeye çalıştığınız "${word}" ibaresi pedagojik olarak çocuklara uygun değildir.`
      };
    }
  }

  return { isSafe: true };
}

/**
 * Checks all user input fields in a story request form
 */
export function validateStoryFormSafety(data: {
  childName?: string;
  heroes?: string;
  location?: string;
  genre?: string;
  specialDetails?: string;
}): SafetyCheckResult {
  const fieldsToCheck: { key: string; label: string; value?: string }[] = [
    { key: 'childName', label: 'Çocuk Adı', value: data.childName },
    { key: 'heroes', label: 'Kahramanlar', value: data.heroes },
    { key: 'location', label: 'Mekan / Ortam', value: data.location },
    { key: 'genre', label: 'Konu / Tema', value: data.genre },
    { key: 'specialDetails', label: 'Ek Detaylar', value: data.specialDetails }
  ];

  for (const field of fieldsToCheck) {
    if (field.value) {
      const result = checkTextSafety(field.value);
      if (!result.isSafe) {
        return {
          isSafe: false,
          violatingField: field.label,
          detectedReason: `"${field.label}" alanında çocuk pedagojisine aykırı, küfür, hakaret, tehdit veya olumsuz ifade tespit edildi.`
        };
      }
    }
  }

  return { isSafe: true };
}
