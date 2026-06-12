// transliteration.js — GlobalAnything Transliteration Engine

const TRANSLITERATION_MAPS = {
  arabic: {
    // Multi-char first (order matters — longer sequences take priority)
    "salam":    "سلام",
    "marhaban": "مرحباً",
    "shukran":  "شكراً",
    "allah":    "الله",
    "inshallah":"إن شاء الله",
    "alhamdulillah":"الحمد لله",
    "bismillah":"بسم الله",
    "yalla":    "يلا",
    "habibi":   "حبيبي",
    "sabah":    "صباح",
    "masa":     "مساء",
    "ahlan":    "أهلاً",
    "wahlan":   "وهلاً",
    "mabrook":  "مبروك",
    "yom":      "يوم",
    "layla":    "ليلة",
    "bayt":     "بيت",
    "kitab":    "كتاب",
    "qalb":     "قلب",
    "nour":     "نور",
    "amal":     "أمل",
    "shan":     "شأن",
    // Digraphs
    "th":  "ث", "sh":  "ش", "kh":  "خ", "dh":  "ذ",
    "gh":  "غ", "zh":  "ظ", "aa":  "ا", "ee":  "ي",
    "oo":  "و", "ei":  "ي", "ou":  "و",
    // Single letters
    "a": "ا", "b": "ب", "t": "ت", "j": "ج", "h": "ح",
    "d": "د", "r": "ر", "z": "ز", "s": "س", "f": "ف",
    "q": "ق", "k": "ك", "l": "ل", "m": "م", "n": "ن",
    "w": "و", "y": "ي", "e": "ع", "i": "ي", "u": "و",
    "p": "ب", "v": "ف", "g": "ج", "x": "خ", "c": "ك"
  },
  russian: {
    "shch": "щ", "sch": "щ", "sh":  "ш", "ch":  "ч",
    "zh":   "ж", "yu":  "ю", "ya":  "я", "yo":  "ё",
    "ts":   "ц", "kh":  "х",
    "a":"а","b":"б","v":"в","g":"г","d":"д","e":"е","z":"з",
    "i":"и","k":"к","l":"л","m":"м","n":"н","o":"о","p":"п",
    "r":"р","s":"с","t":"т","u":"у","f":"ф","y":"й","j":"й",
    "q":"к","w":"в","x":"кс","c":"с","h":"х"
  },
  greek: {
    "th":  "θ", "ph":  "φ", "ch":  "χ", "ps":  "ψ",
    "a":"α","b":"β","g":"γ","d":"δ","e":"ε","z":"ζ",
    "i":"ι","k":"κ","l":"λ","m":"μ","n":"ν","x":"ξ",
    "o":"ο","p":"π","r":"ρ","s":"σ","t":"τ","u":"υ",
    "f":"φ","h":"η","w":"ω","y":"υ","c":"κ"
  },
  hindi: {
    "ksh":"क्ष","gya":"ज्ञ","tr":"त्र",
    "sh":"श","ch":"च","ng":"ङ","jh":"झ","dh":"ध","bh":"भ",
    "gh":"घ","th":"थ","ph":"फ","kh":"ख","aa":"आ","ii":"ई",
    "uu":"ऊ","ai":"ऐ","au":"औ",
    "a":"अ","b":"ब","c":"क","d":"द","e":"ए","f":"फ","g":"ग",
    "h":"ह","i":"इ","j":"ज","k":"क","l":"ल","m":"म","n":"न",
    "o":"ओ","p":"प","r":"र","s":"स","t":"त","u":"उ",
    "v":"व","w":"व","x":"क्स","y":"य","z":"ज़"
  },
  persian: {
    "sh":"ش","kh":"خ","gh":"غ","ch":"چ","zh":"ژ","aa":"آ",
    "a":"ا","b":"ب","p":"پ","t":"ت","j":"ج","h":"ح","d":"د",
    "r":"ر","z":"ز","s":"س","f":"ف","q":"ق","k":"ک","g":"گ",
    "l":"ل","m":"م","n":"ن","v":"و","w":"و","y":"ی","i":"ی","u":"و","e":"ه"
  }
};

// Word-level transliteration (whole words to native script)
const WORD_TRANSLITERATION = {
  arabic: {
    "salam":"سلام", "marhaba":"مرحبا", "shukran":"شكراً", "afwan":"عفواً",
    "inshallah":"إن شاء الله", "alhamdulillah":"الحمد لله", "yalla":"يلا",
    "habibi":"حبيبي", "habibti":"حبيبتي", "mashallah":"ما شاء الله",
    "jazakallah":"جزاك الله", "assalamu":"السلام", "alaykum":"عليكم",
    "wa":"و", "fi":"في", "min":"من", "ila":"إلى", "ana":"أنا",
    "anta":"أنت", "hoa":"هو", "heya":"هي", "nahnu":"نحن", "antum":"أنتم",
    "lakin":"لكن", "wa-lakin":"ولكن", "la":"لا", "naam":"نعم",
    "tamam":"تمام", "tayib":"طيب", "quran":"قرآن", "rasul":"رسول",
    "nabi":"نبي", "masjid":"مسجد", "salat":"صلاة", "sawm":"صوم",
    "hajj":"حج", "zakat":"زكاة", "iman":"إيمان", "tawba":"توبة",
    "barakallah":"بارك الله", "subhanallah":"سبحان الله",
    "astaghfirullah":"أستغفر الله", "bismillah":"بسم الله",
    "akhi":"أخي", "ukhti":"أختي", "ustaz":"أستاذ", "shaikh":"شيخ"
  }
};

class TransliterationEngine {
  constructor() {
    this.currentLang = "arabic";
    this.buffer = "";
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.buffer = "";
  }

  // Convert a full input string to target script
  convert(input, lang) {
    lang = lang || this.currentLang;
    if (!TRANSLITERATION_MAPS[lang]) return input;
    
    const lower = input.toLowerCase();
    
    // First try word-level lookup
    if (WORD_TRANSLITERATION[lang]) {
      const wordMap = WORD_TRANSLITERATION[lang];
      const words = lower.split(/\s+/);
      const converted = words.map(w => wordMap[w] || this._charConvert(w, lang));
      return converted.join(" ");
    }
    
    return this._charConvert(lower, lang);
  }

  _charConvert(input, lang) {
    const map = TRANSLITERATION_MAPS[lang];
    if (!map) return input;
    
    let result = "";
    let i = 0;
    
    while (i < input.length) {
      let matched = false;
      
      // Try longest match first (up to 4 chars)
      for (let len = Math.min(10, input.length - i); len >= 1; len--) {
        const chunk = input.slice(i, i + len);
        if (map[chunk]) {
          result += map[chunk];
          i += len;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        result += input[i];
        i++;
      }
    }
    
    return result;
  }

  // Get suggestions as user types (for Arabic)
  getSuggestions(input, lang) {
    lang = lang || this.currentLang;
    if (lang !== "arabic" && lang !== "persian") return [];
    
    const lower = input.toLowerCase().trim();
    if (!lower) return [];
    
    const wordMap = WORD_TRANSLITERATION[lang] || {};
    const suggestions = [];
    
    // Find matching words
    for (const [roman, native] of Object.entries(wordMap)) {
      if (roman.startsWith(lower) && roman !== lower) {
        suggestions.push({ roman, native });
      }
    }
    
    // Also include exact match
    if (wordMap[lower]) {
      suggestions.unshift({ roman: lower, native: wordMap[lower] });
    }
    
    return suggestions.slice(0, 5);
  }
  
  // Live character-by-character conversion
  liveConvert(inputSoFar, lang) {
    lang = lang || this.currentLang;
    return this.convert(inputSoFar, lang);
  }
}

const transliterator = new TransliterationEngine();
