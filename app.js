// app.js — GlobalAnything Main Application

/* ─── State ───────────────────────────────────────────────── */
const APP = {
  lang: "arabic",       // current keyboard language
  uiLang: "en",         // UI language
  mode: "keyboard",     // keyboard | transliteration | learn | articles
  shifted: false,
  capsLock: false,
  showNumbers: false,
  darkMode: false,
  highContrast: false,
  largeKeys: false,
  text: "",
  lastToast: null
};

/* ─── DOM Refs ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ─── Init ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  loadThemePreference();
  renderLanguageSelector();
  renderKeyboard();
  renderLearnSection();
  renderArticles();
  setupTextArea();
  setupModeNav();
  setupUILangSwitcher();
  applyTranslations();
  setupAccessibilityControls();
  setupPWAInstall();
  updateCounters();
});

/* ─── Theme ─────────────────────────────────────────────────── */
function loadThemePreference() {
  const saved = localStorage.getItem("ga-theme");
  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    APP.darkMode = true;
    document.documentElement.setAttribute("data-theme", "dark");
  }
  const lk = localStorage.getItem("ga-largekeys");
  if (lk === "1") { APP.largeKeys = true; document.body.classList.add("large-keys"); }
  const hc = localStorage.getItem("ga-hc");
  if (hc === "1") { APP.highContrast = true; document.body.classList.add("high-contrast"); }
}

function toggleTheme() {
  APP.darkMode = !APP.darkMode;
  document.documentElement.setAttribute("data-theme", APP.darkMode ? "dark" : "light");
  localStorage.setItem("ga-theme", APP.darkMode ? "dark" : "light");
  const btn = $("theme-toggle");
  const t = UI_TRANSLATIONS[APP.uiLang];
  if (btn) btn.textContent = APP.darkMode ? "☀️ " + t.lightMode : "🌙 " + t.darkMode;
}

/* ─── UI Language ────────────────────────────────────────────── */
function setupUILangSwitcher() {
  $$(".ui-lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      APP.uiLang = btn.dataset.lang;
      $$(".ui-lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyTranslations();
    });
  });
}

function applyTranslations() {
  const t = UI_TRANSLATIONS[APP.uiLang];
  document.documentElement.dir = t.dir;
  $$("[data-t]").forEach(el => {
    const key = el.dataset.t;
    if (t[key]) el.textContent = t[key];
  });
  $$("[data-tp]").forEach(el => {
    const key = el.dataset.tp;
    if (t[key]) el.placeholder = t[key];
  });
  const themeBtn = $("theme-toggle");
  if (themeBtn) themeBtn.textContent = APP.darkMode ? "☀️ " + t.lightMode : "🌙 " + t.darkMode;
}

/* ─── Mode Navigation ────────────────────────────────────────── */
function setupModeNav() {
  $$(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      switchMode(btn.dataset.mode);
    });
  });
}

function switchMode(mode) {
  APP.mode = mode;
  $$(".mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  $$(".mode-panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + mode));
}

/* ─── Language Selector ─────────────────────────────────────── */
function renderLanguageSelector() {
  const container = $("lang-selector");
  if (!container) return;
  container.innerHTML = "";
  LANGUAGE_ORDER.forEach(key => {
    const info = LANGUAGES[key];
    const btn = document.createElement("button");
    btn.className = "lang-pill" + (key === APP.lang ? " active" : "");
    btn.setAttribute("aria-label", info.name + " keyboard");
    btn.innerHTML = `<span class="flag">${info.flag}</span><span class="lang-name">${info.nativeName}</span>`;
    btn.addEventListener("click", () => selectLanguage(key));
    container.appendChild(btn);
  });
}

function selectLanguage(key) {
  APP.lang = key;
  APP.shifted = false;
  APP.showNumbers = false;
  $$(".lang-pill").forEach(b => b.classList.remove("active"));
  const pills = $$(".lang-pill");
  pills[LANGUAGE_ORDER.indexOf(key)]?.classList.add("active");
  renderKeyboard();
  updateTextAreaDir();
  renderPhrases();
  const info = LANGUAGES[key];
  const detEl = $("detected-lang");
  if (detEl) detEl.textContent = info.flag + " " + info.name;
}

function updateTextAreaDir() {
  const ta = $("main-textarea");
  if (!ta) return;
  const info = LANGUAGES[APP.lang];
  ta.dir = info.dir;
  ta.style.textAlign = info.dir === "rtl" ? "right" : "left";
}

/* ─── Keyboard Renderer ─────────────────────────────────────── */
function renderKeyboard() {
  const container = $("keyboard-container");
  if (!container) return;
  container.innerHTML = "";

  const layout = KEYBOARDS[APP.lang];
  if (!layout) return;

  // Numbers row
  const numRow = document.createElement("div");
  numRow.className = "key-row numbers-row";
  if (APP.showNumbers) {
    NUMBERS_ROW.forEach(n => {
      numRow.appendChild(makeKey(APP.shifted ? (NUMBERS_SHIFT[n] || n) : n, "key-num"));
    });
    numRow.appendChild(makeKey("=", "key-sym"));
    numRow.appendChild(makeKey("+", "key-sym"));
  }

  const rows = layout.rows;
  rows.forEach((row, rowIdx) => {
    const rowEl = document.createElement("div");
    rowEl.className = "key-row";
    if (rowIdx === rows.length - 1) rowEl.classList.add("last-row");

    // Caps/shift at start of appropriate rows
    if (rowIdx === 2) {
      rowEl.appendChild(makeSpecialKey("⇧ Shift", "key-shift key-wide", toggleShift));
    }

    row.forEach(char => {
      const display = APP.shifted ? (layout.shift[char] || char.toUpperCase()) : char;
      rowEl.appendChild(makeKey(display, "key-char", char));
    });

    if (rowIdx === 2) {
      rowEl.appendChild(makeSpecialKey("⌫", "key-backspace key-wide", handleBackspace));
    }
    container.appendChild(rowEl);
  });

  // Bottom row
  const bottomRow = document.createElement("div");
  bottomRow.className = "key-row bottom-row";
  bottomRow.appendChild(makeSpecialKey(APP.showNumbers ? "ABC" : "123", "key-meta", toggleNumbers));
  bottomRow.appendChild(makeSpecialKey("Space", "key-space", () => insertText(" ")));
  bottomRow.appendChild(makeSpecialKey("⏎", "key-enter", () => insertText("\n")));
  container.appendChild(bottomRow);

  // Diacritics row for Arabic/Persian/Urdu
  if (layout.diacritics) {
    const diacRow = document.createElement("div");
    diacRow.className = "key-row diacritics-row";
    const label = document.createElement("span");
    label.className = "row-label";
    label.textContent = "ـ";
    diacRow.appendChild(label);
    layout.diacritics.forEach(d => diacRow.appendChild(makeKey(d, "key-diacritic")));
    container.appendChild(diacRow);
  }

  // Katakana toggle for Japanese
  if (APP.lang === "japanese" && layout.katakana) {
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn-secondary katakana-toggle";
    toggleBtn.textContent = "ひ ⇄ カ";
    toggleBtn.addEventListener("click", () => {
      layout._useKatakana = !layout._useKatakana;
      renderKeyboard();
    });
    container.appendChild(toggleBtn);
    if (layout._useKatakana) {
      container.innerHTML = "";
      layout.katakana.forEach(row => {
        const rowEl = document.createElement("div");
        rowEl.className = "key-row";
        row.forEach(ch => rowEl.appendChild(makeKey(ch, "key-char")));
        container.appendChild(rowEl);
      });
      container.appendChild(toggleBtn);
    }
  }
}

function makeKey(char, cls, originalChar) {
  const btn = document.createElement("button");
  btn.className = "key " + cls;
  btn.textContent = char;
  btn.setAttribute("aria-label", char);
  btn.addEventListener("click", () => {
    insertText(char);
    if (APP.shifted && !APP.capsLock) {
      APP.shifted = false;
      updateShiftVisuals();
    }
    updateSuggestions(char);
  });
  return btn;
}

function makeSpecialKey(label, cls, handler) {
  const btn = document.createElement("button");
  btn.className = "key " + cls;
  btn.textContent = label;
  btn.setAttribute("aria-label", label);
  btn.addEventListener("click", handler);
  return btn;
}

function toggleShift() {
  APP.shifted = !APP.shifted;
  renderKeyboard();
}

function toggleNumbers() {
  APP.showNumbers = !APP.showNumbers;
  renderKeyboard();
}

function updateShiftVisuals() {
  $$(".key-char").forEach(k => {
    const layout = KEYBOARDS[APP.lang];
    if (layout && layout.shift[k.textContent]) {
      // handled by re-render
    }
  });
}

/* ─── Text Area ──────────────────────────────────────────────── */
function setupTextArea() {
  const ta = $("main-textarea");
  const transInput = $("translit-input");
  if (!ta) return;

  ta.addEventListener("input", () => {
    APP.text = ta.value;
    updateCounters();
    autoDetectLanguage(ta.value);
  });

  if (transInput) {
    transInput.addEventListener("input", () => {
      const result = transliterator.convert(transInput.value, APP.lang);
      const preview = $("translit-preview");
      if (preview) preview.textContent = result;
      updateTranslitSuggestions(transInput.value);
    });
  }

  $("btn-copy")?.addEventListener("click", copyText);
  $("btn-clear")?.addEventListener("click", clearText);
  $("btn-dl-txt")?.addEventListener("click", downloadTxt);
  $("btn-dl-pdf")?.addEventListener("click", downloadPdf);
  $("btn-insert-translit")?.addEventListener("click", insertTransliterated);
}

function insertText(char) {
  const ta = $("main-textarea");
  if (!ta) return;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const val = ta.value;
  ta.value = val.slice(0, start) + char + val.slice(end);
  ta.selectionStart = ta.selectionEnd = start + char.length;
  APP.text = ta.value;
  ta.focus();
  updateCounters();
  autoDetectLanguage(ta.value);
}

function handleBackspace() {
  const ta = $("main-textarea");
  if (!ta) return;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  if (start !== end) {
    insertText("");
  } else if (start > 0) {
    ta.value = ta.value.slice(0, start - 1) + ta.value.slice(start);
    ta.selectionStart = ta.selectionEnd = start - 1;
  }
  APP.text = ta.value;
  updateCounters();
}

function copyText() {
  const ta = $("main-textarea");
  if (!ta || !ta.value) return;
  navigator.clipboard.writeText(ta.value).then(() => {
    showToast(UI_TRANSLATIONS[APP.uiLang].copied);
  });
}

function clearText() {
  const ta = $("main-textarea");
  if (ta) ta.value = "";
  APP.text = "";
  updateCounters();
  showToast(UI_TRANSLATIONS[APP.uiLang].cleared);
}

function downloadTxt() {
  const ta = $("main-textarea");
  if (!ta || !ta.value) return;
  const blob = new Blob([ta.value], { type: "text/plain;charset=utf-8" });
  triggerDownload(blob, "globalanything-text.txt");
}

function downloadPdf() {
  const ta = $("main-textarea");
  if (!ta || !ta.value) return;
  // Simple HTML-to-print approach for PDF
  const lang = LANGUAGES[APP.lang];
  const html = `<!DOCTYPE html><html dir="${lang.dir}"><head><meta charset="UTF-8">
    <style>body{font-family:system-ui,sans-serif;font-size:16px;padding:40px;direction:${lang.dir};max-width:700px;margin:auto;line-height:1.8;}
    h3{color:#555;font-size:12px;margin-bottom:20px;}p{white-space:pre-wrap;}</style></head>
    <body><h3>GlobalAnything.com — ${lang.name} Text</h3><p>${escapeHtml(ta.value)}</p></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) setTimeout(() => win.print(), 800);
}

function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* ─── Counters & Detection ────────────────────────────────────── */
function updateCounters() {
  const ta = $("main-textarea");
  if (!ta) return;
  const text = ta.value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const wc = $("word-count");
  const cc = $("char-count");
  const t = UI_TRANSLATIONS[APP.uiLang];
  if (wc) wc.textContent = words + " " + t.wordCount;
  if (cc) cc.textContent = chars + " " + t.charCount;
}

function autoDetectLanguage(text) {
  if (text.length < 3) return;
  const detected = detectLanguage(text);
  if (detected) {
    const el = $("detected-lang");
    if (el) el.textContent = detected.name;
  }
}

/* ─── Suggestions ───────────────────────────────────────────── */
function updateSuggestions(char) {
  const container = $("suggestions-container");
  if (!container) return;
  const suggestions = ARABIC_SUGGESTIONS[char];
  if (!suggestions || APP.lang !== "arabic") {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = suggestions.map(s =>
    `<button class="suggestion-pill" onclick="insertText('${s} ')">${s}</button>`
  ).join("");
}

function updateTranslitSuggestions(input) {
  const container = $("translit-suggestions");
  if (!container) return;
  const sugs = transliterator.getSuggestions(input, APP.lang);
  container.innerHTML = sugs.map(s =>
    `<button class="suggestion-pill" onclick="useTranslitSuggestion('${s.roman}','${s.native}')">${s.roman} → ${s.native}</button>`
  ).join("");
}

function useTranslitSuggestion(roman, native) {
  const ti = $("translit-input");
  if (ti) ti.value = roman;
  const preview = $("translit-preview");
  if (preview) preview.textContent = native;
}

function insertTransliterated() {
  const preview = $("translit-preview");
  if (preview && preview.textContent) {
    insertText(preview.textContent + " ");
    const ti = $("translit-input");
    if (ti) ti.value = "";
    if (preview) preview.textContent = "";
  }
}

/* ─── Common Phrases ─────────────────────────────────────────── */
function renderPhrases() {
  const container = $("phrases-container");
  if (!container) return;
  const phrases = COMMON_PHRASES[APP.lang];
  if (!phrases) { container.innerHTML = ""; return; }
  container.innerHTML = phrases.map(p =>
    `<button class="phrase-pill" onclick="insertText('${p.replace(/'/g,"\\'")} ')">${p}</button>`
  ).join("");
}

/* ─── Learn Section ─────────────────────────────────────────── */
function renderLearnSection() {
  renderAlphabetGuide("arabic");
  renderAlphabetGuide("russian");
  renderTypingLessons();
}

function renderAlphabetGuide(lang) {
  const container = $("alphabet-" + lang);
  if (!container) return;
  const data = ALPHABETS[lang];
  if (!data) return;
  container.innerHTML = data.chars.map(c =>
    `<div class="alpha-card" tabindex="0" title="${c.name} (${c.roman})">
      <span class="alpha-char">${c.char}</span>
      <span class="alpha-name">${c.name}</span>
      <span class="alpha-roman">${c.roman}</span>
    </div>`
  ).join("");
}

const TYPING_LESSONS = [
  { lang:"arabic", level:1, title:"Arabic Lesson 1 — Basic Letters",
    text:"ب ت ث ج ح", hint:"ba ta tha ja ha" },
  { lang:"arabic", level:2, title:"Arabic Lesson 2 — Short Words",
    text:"باب دار كتاب", hint:"door / house / book" },
  { lang:"arabic", level:3, title:"Arabic Lesson 3 — Common Phrases",
    text:"السلام عليكم مرحباً شكراً", hint:"Peace be upon you / Hello / Thank you" },
  { lang:"russian", level:1, title:"Russian Lesson 1 — Basic Letters",
    text:"а б в г д е ж з", hint:"a b v g d ye zh z" },
  { lang:"russian", level:2, title:"Russian Lesson 2 — Short Words",
    text:"да нет мир дом кот", hint:"yes / no / peace / home / cat" },
  { lang:"french", level:1, title:"French Lesson 1 — Accents",
    text:"é è ê ç à â ô ù", hint:"Practice French special characters" },
  { lang:"spanish", level:1, title:"Spanish Lesson 1 — Special Characters",
    text:"á é í ó ú ñ ¿ ¡", hint:"Practice Spanish special characters" }
];

function renderTypingLessons() {
  const container = $("lessons-container");
  if (!container) return;
  container.innerHTML = TYPING_LESSONS.map((lesson, i) => {
    const info = LANGUAGES[lesson.lang];
    return `<div class="lesson-card">
      <div class="lesson-header">
        <span class="lesson-flag">${info.flag}</span>
        <span class="lesson-title">${lesson.title}</span>
        <span class="lesson-level">Level ${lesson.level}</span>
      </div>
      <div class="lesson-text" dir="${info.dir}">${lesson.text}</div>
      <div class="lesson-hint">${lesson.hint}</div>
      <button class="btn-secondary" onclick="practiceLesson(${i})">Practice This Lesson</button>
    </div>`;
  }).join("");
}

function practiceLesson(index) {
  const lesson = TYPING_LESSONS[index];
  switchMode("keyboard");
  selectLanguage(lesson.lang);
  const ta = $("main-textarea");
  if (ta) {
    ta.value = "";
    ta.focus();
    showToast("Practice: " + lesson.hint);
  }
}

/* ─── Articles (SEO) ─────────────────────────────────────────── */
const SEO_ARTICLES = [
  { id:1,  title:"How to Type Arabic Online Without Installing Software",    lang:"en", category:"Arabic Typing",       desc:"Learn how to type Arabic letters online using GlobalAnything's free virtual keyboard. No installation required — works directly in your browser." },
  { id:2,  title:"Virtual Keyboard for Arabic: Complete Guide 2024",         lang:"en", category:"Virtual Keyboards",    desc:"A comprehensive guide to using virtual Arabic keyboards online, including tips for typing diacritics, using RTL text, and common Arabic phrases." },
  { id:3,  title:"Arabic Keyboard Online — لوحة المفاتيح العربية",           lang:"ar", category:"Arabic Typing",       desc:"دليل شامل لاستخدام لوحة المفاتيح العربية الافتراضية عبر الإنترنت." },
  { id:4,  title:"Multilingual Keyboard Tools for Language Learners",        lang:"en", category:"Language Learning",    desc:"Discover the best multilingual keyboard tools to help you practice writing in foreign languages — from Arabic to Japanese." },
  { id:5,  title:"How to Type in Russian Online: Cyrillic Keyboard Guide",   lang:"en", category:"Virtual Keyboards",    desc:"Everything you need to type Russian Cyrillic characters online without installing a Russian keyboard." },
  { id:6,  title:"Top 10 Uses for an Online Multilingual Keyboard",          lang:"en", category:"International Typing", desc:"From journalism to travel, multilingual keyboards are essential tools for global communication." },
  { id:7,  title:"Arabic Transliteration: Type Arabic by Phonetics",        lang:"en", category:"Arabic Typing",       desc:"Learn how phonetic Arabic transliteration works — type 'salam' and see 'سلام' appear instantly." },
  { id:8,  title:"How Journalists Use Virtual Keyboards for International Coverage", lang:"en", category:"International Typing", desc:"A look at how journalists and reporters use online keyboard tools when covering stories in foreign-language regions." },
  { id:9,  title:"Typing Hindi Online: Devanagari Virtual Keyboard",        lang:"en", category:"Virtual Keyboards",    desc:"Complete guide to typing Hindi and other Devanagari-script languages using a virtual keyboard online." },
  { id:10, title:"Clavier Arabe En Ligne: Guide Complet",                   lang:"fr", category:"Arabic Typing",       desc:"Guide complet pour utiliser le clavier arabe en ligne sans installation de logiciel." },
  { id:11, title:"Chinese Virtual Keyboard: Type Mandarin Online",          lang:"en", category:"Virtual Keyboards",    desc:"How to type Chinese characters online with our virtual keyboard, including Pinyin input mode." },
  { id:12, title:"Japanese Keyboard Online: Hiragana, Katakana & Kanji",    lang:"en", category:"Virtual Keyboards",    desc:"Learn to type Japanese characters online using Hiragana and Katakana virtual keyboards." },
  { id:13, title:"Korean Keyboard Online: Type Hangul Characters",          lang:"en", category:"Virtual Keyboards",    desc:"How to use the Korean Hangul virtual keyboard to type Korean characters online." },
  { id:14, title:"Teclado Árabe en Línea: Guía Completa",                   lang:"es", category:"Arabic Typing",       desc:"Guía completa para usar el teclado árabe en línea sin necesidad de instalar software." },
  { id:15, title:"Persian Keyboard Online: Type Farsi Characters",          lang:"en", category:"Virtual Keyboards",    desc:"Use our online Persian keyboard to type Farsi and Dari text without any installation." },
  { id:16, title:"Urdu Keyboard Online: Type Nastaliq Script",              lang:"en", category:"Virtual Keyboards",    desc:"Complete guide to typing Urdu using our online virtual keyboard with Nastaliq-style characters." },
  { id:17, title:"Bengali Keyboard Online: Type Bengali Script",            lang:"en", category:"Virtual Keyboards",    desc:"Learn how to type Bengali characters online with our free virtual keyboard." },
  { id:18, title:"How to Write Arabic on iPhone and Android",               lang:"en", category:"Mobile Keyboards",     desc:"Enable Arabic typing on your phone with or without changing language settings — using a mobile-optimized virtual keyboard." },
  { id:19, title:"The History of Arabic Script and Writing Systems",        lang:"en", category:"Writing Systems",      desc:"Explore the origins and evolution of the Arabic script, from ancient Nabataean roots to modern standard Arabic." },
  { id:20, title:"Why RTL Languages Need Special Keyboard Support",         lang:"en", category:"Writing Systems",      desc:"Understanding right-to-left writing systems and why languages like Arabic, Persian, and Hebrew require specialized keyboard tools." },
  { id:21, title:"How to Use a Virtual Keyboard on a Tablet",               lang:"en", category:"Mobile Keyboards",     desc:"Tips for using touch-optimized virtual keyboards on iPad, Android tablets, and other devices." },
  { id:22, title:"German Keyboard Online: Ä, Ö, Ü and ß Characters",       lang:"en", category:"Virtual Keyboards",    desc:"Type German special characters online without switching your keyboard layout." },
  { id:23, title:"French Keyboard Online: Accents and Special Characters",  lang:"en", category:"Virtual Keyboards",    desc:"Type French accented characters online — é, è, ê, ç, à, â, ô, ù, û — without changing your keyboard." },
  { id:24, title:"Spanish Keyboard Online: ñ, ¿, ¡ and Accents",           lang:"en", category:"Virtual Keyboards",    desc:"How to type Spanish special characters online including ñ, accented vowels, and inverted punctuation." },
  { id:25, title:"Turkish Keyboard Online: ğ, ş, ç, ı and More",           lang:"en", category:"Virtual Keyboards",    desc:"Type Turkish special characters online including the dotless ı and other unique Turkish letters." },
  { id:26, title:"The Benefits of Learning Arabic Script",                  lang:"en", category:"Language Learning",    desc:"Why learning to read and write Arabic is a valuable skill for students, travelers, and professionals." },
  { id:27, title:"How to Practice Typing in a Foreign Language",            lang:"en", category:"Language Learning",    desc:"Practical tips for using virtual keyboards to practice typing in a new language effectively." },
  { id:28, title:"Virtual Keyboard vs Physical Keyboard: Pros and Cons",    lang:"en", category:"International Typing", desc:"A comparison of virtual and physical keyboards for international typing, language learning, and multilingual work." },
  { id:29, title:"Online Tools for Arabic Calligraphy and Typography",      lang:"en", category:"Writing Systems",      desc:"Discover online tools for Arabic typography, calligraphy, and creative text design." },
  { id:30, title:"How Translators Use Virtual Keyboards in Their Work",     lang:"en", category:"International Typing", desc:"Professional translators share how they use virtual keyboard tools to work efficiently with multiple languages." }
];

function renderArticles() {
  const container = $("articles-grid");
  if (!container) return;
  const categories = [...new Set(SEO_ARTICLES.map(a => a.category))];
  
  container.innerHTML = `
    <div class="articles-filter">
      <button class="filter-btn active" data-cat="all" onclick="filterArticles('all', this)">All</button>
      ${categories.map(c => `<button class="filter-btn" data-cat="${c}" onclick="filterArticles('${c.replace(/'/g,"\\'")}', this)">${c}</button>`).join("")}
    </div>
    <div id="articles-list" class="articles-list">
      ${SEO_ARTICLES.map(articleCard).join("")}
    </div>`;
}

function articleCard(a) {
  return `<article class="article-card" data-cat="${a.category}" data-lang="${a.lang}">
    <div class="article-meta">
      <span class="article-cat">${a.category}</span>
      <span class="article-lang">${a.lang.toUpperCase()}</span>
    </div>
    <h3 class="article-title">${a.title}</h3>
    <p class="article-desc">${a.desc}</p>
    <a href="#" class="article-link" onclick="openArticle(${a.id}); return false;">Read More →</a>
  </article>`;
}

function filterArticles(cat, btn) {
  $$(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  $$(".article-card").forEach(card => {
    card.style.display = (cat === "all" || card.dataset.cat === cat) ? "" : "none";
  });
}

function openArticle(id) {
  const article = SEO_ARTICLES.find(a => a.id === id);
  if (!article) return;
  const modal = $("article-modal");
  if (modal) {
    $("modal-title").textContent = article.title;
    $("modal-body").innerHTML = generateArticleContent(article);
    modal.classList.add("open");
  }
}

function generateArticleContent(article) {
  return `<div class="article-full">
    <div class="article-full-meta"><span class="article-cat">${article.category}</span></div>
    <p><strong>${article.desc}</strong></p>
    <p>At GlobalAnything.com, we provide free, browser-based virtual keyboards for over 16 languages. Whether you're a student learning Arabic script, a journalist covering international events, or a business communicating globally — our tools make multilingual typing effortless.</p>
    <h4>Key Points</h4>
    <ul>
      <li>No software installation required</li>
      <li>Works on desktop, tablet, and mobile browsers</li>
      <li>Supports RTL languages like Arabic, Persian, and Urdu</li>
      <li>Free to use with no account required</li>
      <li>Copy text with one click to use anywhere</li>
    </ul>
    <p>Ready to start typing? <a href="#" onclick="closeModal(); switchMode('keyboard');">Try the keyboard now →</a></p>
  </div>`;
}

function closeModal() {
  $("article-modal")?.classList.remove("open");
}

/* ─── Accessibility Controls ─────────────────────────────────── */
function setupAccessibilityControls() {
  $("btn-large-keys")?.addEventListener("click", () => {
    APP.largeKeys = !APP.largeKeys;
    document.body.classList.toggle("large-keys", APP.largeKeys);
    localStorage.setItem("ga-largekeys", APP.largeKeys ? "1" : "0");
  });
  $("btn-high-contrast")?.addEventListener("click", () => {
    APP.highContrast = !APP.highContrast;
    document.body.classList.toggle("high-contrast", APP.highContrast);
    localStorage.setItem("ga-hc", APP.highContrast ? "1" : "0");
  });
}

/* ─── Toast ──────────────────────────────────────────────────── */
function showToast(msg) {
  let toast = $("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(APP.lastToast);
  APP.lastToast = setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ─── PWA ────────────────────────────────────────────────────── */
function setupPWAInstall() {
  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = $("install-banner");
    if (banner) banner.style.display = "flex";
  });
  $("btn-install")?.addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        const banner = $("install-banner");
        if (banner) banner.style.display = "none";
      });
    }
  });
  $("btn-install-dismiss")?.addEventListener("click", () => {
    const banner = $("install-banner");
    if (banner) banner.style.display = "none";
  });
}

// Keyboard shortcut: Ctrl+C copies, Escape closes modal
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});
