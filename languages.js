// languages.js — GlobalAnything Language Registry
const LANGUAGES = {
  arabic: {
    code: "ar", name: "Arabic", nativeName: "العربية",
    dir: "rtl", flag: "🇸🇦", family: "Semitic",
    script: "Arabic", region: "Middle East & North Africa"
  },
  english: {
    code: "en", name: "English", nativeName: "English",
    dir: "ltr", flag: "🇬🇧", family: "Germanic",
    script: "Latin", region: "Global"
  },
  french: {
    code: "fr", name: "French", nativeName: "Français",
    dir: "ltr", flag: "🇫🇷", family: "Romance",
    script: "Latin", region: "Europe & Africa"
  },
  spanish: {
    code: "es", name: "Spanish", nativeName: "Español",
    dir: "ltr", flag: "🇪🇸", family: "Romance",
    script: "Latin", region: "Europe & Americas"
  },
  german: {
    code: "de", name: "German", nativeName: "Deutsch",
    dir: "ltr", flag: "🇩🇪", family: "Germanic",
    script: "Latin", region: "Europe"
  },
  portuguese: {
    code: "pt", name: "Portuguese", nativeName: "Português",
    dir: "ltr", flag: "🇵🇹", family: "Romance",
    script: "Latin", region: "Europe & Americas"
  },
  italian: {
    code: "it", name: "Italian", nativeName: "Italiano",
    dir: "ltr", flag: "🇮🇹", family: "Romance",
    script: "Latin", region: "Europe"
  },
  russian: {
    code: "ru", name: "Russian", nativeName: "Русский",
    dir: "ltr", flag: "🇷🇺", family: "Slavic",
    script: "Cyrillic", region: "Europe & Asia"
  },
  turkish: {
    code: "tr", name: "Turkish", nativeName: "Türkçe",
    dir: "ltr", flag: "🇹🇷", family: "Turkic",
    script: "Latin", region: "Europe & Asia"
  },
  persian: {
    code: "fa", name: "Persian", nativeName: "فارسی",
    dir: "rtl", flag: "🇮🇷", family: "Iranian",
    script: "Arabic-Perso", region: "Middle East"
  },
  urdu: {
    code: "ur", name: "Urdu", nativeName: "اردو",
    dir: "rtl", flag: "🇵🇰", family: "Indo-Aryan",
    script: "Nastaliq", region: "South Asia"
  },
  hindi: {
    code: "hi", name: "Hindi", nativeName: "हिन्दी",
    dir: "ltr", flag: "🇮🇳", family: "Indo-Aryan",
    script: "Devanagari", region: "South Asia"
  },
  bengali: {
    code: "bn", name: "Bengali", nativeName: "বাংলা",
    dir: "ltr", flag: "🇧🇩", family: "Indo-Aryan",
    script: "Bengali", region: "South Asia"
  },
  chinese: {
    code: "zh", name: "Chinese", nativeName: "中文",
    dir: "ltr", flag: "🇨🇳", family: "Sino-Tibetan",
    script: "Han", region: "East Asia"
  },
  japanese: {
    code: "ja", name: "Japanese", nativeName: "日本語",
    dir: "ltr", flag: "🇯🇵", family: "Japonic",
    script: "Hiragana/Katakana/Kanji", region: "East Asia"
  },
  korean: {
    code: "ko", name: "Korean", nativeName: "한국어",
    dir: "ltr", flag: "🇰🇷", family: "Koreanic",
    script: "Hangul", region: "East Asia"
  }
};

const LANGUAGE_ORDER = [
  "arabic","english","french","spanish","german","portuguese",
  "italian","russian","turkish","persian","urdu","hindi",
  "bengali","chinese","japanese","korean"
];

// Common phrases per language for the writing assistant
const COMMON_PHRASES = {
  arabic: [
    "السلام عليكم","مرحباً","شكراً جزيلاً","من فضلك","أهلاً وسهلاً",
    "كيف حالك؟","بخير شكراً","إلى اللقاء","نعم","لا","صباح الخير",
    "مساء الخير","أنا أحبك","ما اسمك؟","أين أنت من؟","تشرفنا"
  ],
  english: [
    "Hello","Good morning","Thank you","Please","You're welcome",
    "How are you?","I'm fine","Goodbye","Yes","No","Excuse me",
    "I love you","What's your name?","Nice to meet you","Good night"
  ],
  french: [
    "Bonjour","Merci beaucoup","S'il vous plaît","De rien","Comment allez-vous?",
    "Je vais bien","Au revoir","Oui","Non","Excusez-moi","Je t'aime",
    "Comment vous appelez-vous?","Enchanté","Bonne nuit"
  ],
  spanish: [
    "Hola","Buenos días","Muchas gracias","Por favor","De nada",
    "¿Cómo estás?","Estoy bien","Adiós","Sí","No","Perdón",
    "Te quiero","¿Cómo te llamas?","Mucho gusto","Buenas noches"
  ],
  german: [
    "Guten Morgen","Danke schön","Bitte","Gern geschehen","Wie geht es Ihnen?",
    "Es geht mir gut","Auf Wiedersehen","Ja","Nein","Entschuldigung",
    "Ich liebe dich","Wie heißen Sie?","Gute Nacht"
  ],
  russian: [
    "Привет","Доброе утро","Спасибо","Пожалуйста","Как дела?",
    "Хорошо","До свидания","Да","Нет","Извините","Я тебя люблю","Спокойной ночи"
  ],
  japanese: [
    "こんにちは","おはようございます","ありがとうございます","お願いします",
    "どういたしまして","お元気ですか？","さようなら","はい","いいえ","すみません"
  ],
  chinese: [
    "你好","早上好","谢谢","请","不客气","你好吗？","很好","再见","是","不","对不起","我爱你"
  ],
  korean: [
    "안녕하세요","감사합니다","부탁드립니다","괜찮습니다","어떻게 지내세요?",
    "잘 지내요","안녕히 계세요","네","아니요","실례합니다","사랑해요"
  ],
  hindi: [
    "नमस्ते","शुक्रिया","कृपया","कोई बात नहीं","आप कैसे हैं?",
    "मैं ठीक हूँ","अलविदा","हाँ","नहीं","माफ़ कीजिए"
  ],
  persian: [
    "سلام","صبح بخیر","ممنونم","خواهش می‌کنم","حال شما چطور است؟",
    "خوبم","خداحافظ","بله","نه","ببخشید","دوستت دارم"
  ]
};

// Alphabet guides for language learning
const ALPHABETS = {
  arabic: {
    title: "الحروف الأبجدية العربية",
    chars: [
      {char:"أ",name:"Alef",roman:"A"},  {char:"ب",name:"Ba",roman:"B"},
      {char:"ت",name:"Ta",roman:"T"},    {char:"ث",name:"Tha",roman:"Th"},
      {char:"ج",name:"Jim",roman:"J"},   {char:"ح",name:"Ha",roman:"H"},
      {char:"خ",name:"Kha",roman:"Kh"},  {char:"د",name:"Dal",roman:"D"},
      {char:"ذ",name:"Dhal",roman:"Dh"}, {char:"ر",name:"Ra",roman:"R"},
      {char:"ز",name:"Zay",roman:"Z"},   {char:"س",name:"Sin",roman:"S"},
      {char:"ش",name:"Shin",roman:"Sh"}, {char:"ص",name:"Sad",roman:"S"},
      {char:"ض",name:"Dad",roman:"D"},   {char:"ط",name:"Ta",roman:"T"},
      {char:"ظ",name:"Dha",roman:"Dh"},  {char:"ع",name:"Ain",roman:"'"},
      {char:"غ",name:"Ghayn",roman:"Gh"},{char:"ف",name:"Fa",roman:"F"},
      {char:"ق",name:"Qaf",roman:"Q"},   {char:"ك",name:"Kaf",roman:"K"},
      {char:"ل",name:"Lam",roman:"L"},   {char:"م",name:"Mim",roman:"M"},
      {char:"ن",name:"Nun",roman:"N"},   {char:"ه",name:"Ha",roman:"H"},
      {char:"و",name:"Waw",roman:"W"},   {char:"ي",name:"Ya",roman:"Y"}
    ]
  },
  russian: {
    title: "Русский алфавит",
    chars: [
      {char:"А",name:"A",roman:"A"},{char:"Б",name:"Be",roman:"B"},
      {char:"В",name:"Ve",roman:"V"},{char:"Г",name:"Ge",roman:"G"},
      {char:"Д",name:"De",roman:"D"},{char:"Е",name:"Ye",roman:"Ye"},
      {char:"Ё",name:"Yo",roman:"Yo"},{char:"Ж",name:"Zhe",roman:"Zh"},
      {char:"З",name:"Ze",roman:"Z"},{char:"И",name:"I",roman:"I"},
      {char:"К",name:"Ka",roman:"K"},{char:"Л",name:"El",roman:"L"},
      {char:"М",name:"Em",roman:"M"},{char:"Н",name:"En",roman:"N"},
      {char:"О",name:"O",roman:"O"},{char:"П",name:"Pe",roman:"P"},
      {char:"Р",name:"Er",roman:"R"},{char:"С",name:"Es",roman:"S"},
      {char:"Т",name:"Te",roman:"T"},{char:"У",name:"U",roman:"U"},
      {char:"Ф",name:"Ef",roman:"F"},{char:"Х",name:"Kha",roman:"Kh"},
      {char:"Ц",name:"Tse",roman:"Ts"},{char:"Ч",name:"Che",roman:"Ch"},
      {char:"Ш",name:"Sha",roman:"Sh"},{char:"Щ",name:"Shcha",roman:"Shch"},
      {char:"Ы",name:"Yeru",roman:"Y"},{char:"Э",name:"E",roman:"E"},
      {char:"Ю",name:"Yu",roman:"Yu"},{char:"Я",name:"Ya",roman:"Ya"}
    ]
  }
};
