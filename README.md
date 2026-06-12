# 🌐 GlobalAnything

**Type Any Language. Anywhere.**

> The world's most comprehensive multilingual virtual keyboard platform — free, browser-based, no installation required.

[![Live Demo](https://img.shields.io/badge/Live-globalanything.com-14b8a6?style=for-the-badge)](https://globalanything.com)
[![Languages](https://img.shields.io/badge/Languages-16-blue?style=for-the-badge)](#supported-languages)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-green?style=for-the-badge)](#pwa--offline-support)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported Languages](#supported-languages)
- [Installation Guide](#installation-guide)
- [GitHub Pages Deployment](#github-pages-deployment)
- [File Structure](#file-structure)
- [Language Management Guide](#language-management-guide)
- [Custom Keyboard Guide](#custom-keyboard-guide)
- [SEO Guide](#seo-guide)
- [PWA & Offline Support](#pwa--offline-support)
- [Accessibility](#accessibility)
- [Contact](#contact)

---

## Overview

**GlobalAnything** is a production-ready, open-source multilingual virtual keyboard platform. It lets users type in 16 languages directly in the browser without installing any software, changing OS settings, or purchasing anything.

**Target users:** Students, translators, writers, journalists, researchers, international businesses, language learners, and travelers.

**Tech stack:** Pure HTML5, CSS3, and vanilla JavaScript — no frameworks, no dependencies, no build step.

---

## Features

| Feature | Description |
|---|---|
| 🌐 **16 Virtual Keyboards** | Full layouts: Arabic, English, French, Spanish, German, Portuguese, Italian, Russian, Turkish, Persian, Urdu, Hindi, Bengali, Chinese, Japanese, Korean |
| ✨ **Smart Transliteration** | Type phonetically in English → get native script live (Arabic, Russian, Persian, Hindi) |
| 📋 **One-Click Copy** | Copy typed text to clipboard instantly |
| ⬇️ **Download TXT / PDF** | Save typed text as .txt or open print dialog for PDF |
| 🔢 **Word & Character Counter** | Real-time statistics as you type |
| 🔍 **Language Detector** | Auto-detects Arabic, Russian, Chinese, Japanese, Korean, French, Spanish, German |
| 🔤 **Diacritics Support** | Arabic tashkeel (harakat), Persian vowel marks |
| 📖 **Alphabet Guides** | Visual letter-by-letter reference for Arabic and Russian |
| ✍️ **Typing Lessons** | 7 beginner lessons across Arabic, Russian, French, Spanish |
| 📰 **30 SEO Articles** | Built-in content covering keyboards, typing guides, writing systems |
| 📱 **Mobile-First** | Touch-optimized for iPhone, Android, tablets |
| 🌙 **Dark / Light Mode** | System preference detected + manual toggle |
| ♿ **Accessibility** | Large keys mode, high-contrast mode, ARIA labels, keyboard focus |
| 💾 **PWA / Offline** | Installable as a native-like app, works without internet after first load |
| 🌍 **Multilingual UI** | Interface in English, Arabic, French, and Spanish |

---

## Supported Languages

| Flag | Language | Script | Direction | Transliteration |
|------|----------|--------|-----------|-----------------|
| 🇸🇦 | Arabic | Arabic | RTL | ✅ Yes |
| 🇬🇧 | English | Latin | LTR | — |
| 🇫🇷 | French | Latin | LTR | — |
| 🇪🇸 | Spanish | Latin | LTR | — |
| 🇩🇪 | German | Latin | LTR | — |
| 🇵🇹 | Portuguese | Latin | LTR | — |
| 🇮🇹 | Italian | Latin | LTR | — |
| 🇷🇺 | Russian | Cyrillic | LTR | ✅ Yes |
| 🇹🇷 | Turkish | Latin | LTR | — |
| 🇮🇷 | Persian | Arabic-Perso | RTL | ✅ Yes |
| 🇵🇰 | Urdu | Nastaliq | RTL | — |
| 🇮🇳 | Hindi | Devanagari | LTR | ✅ Yes |
| 🇧🇩 | Bengali | Bengali | LTR | — |
| 🇨🇳 | Chinese | Han | LTR | — |
| 🇯🇵 | Japanese | Hiragana/Katakana | LTR | — |
| 🇰🇷 | Korean | Hangul | LTR | — |

---

## Installation Guide

### Option 1: Run Locally (no server needed)

```bash
# 1. Clone or download this repository
git clone https://github.com/YOUR_USERNAME/globalanything.git

# 2. Open in browser
cd globalanything
open index.html      # macOS
# or double-click index.html in Windows/Linux
```

> **Note:** For full PWA / Service Worker functionality, you need a local HTTP server.

### Option 2: Local HTTP Server

```bash
# Using Python (built-in)
cd globalanything
python3 -m http.server 8080
# Visit: http://localhost:8080

# Using Node.js (npx)
npx serve .
# or
npx http-server . -p 8080
```

### Option 3: VS Code Live Server

Install the **Live Server** extension in VS Code, then right-click `index.html` → **Open with Live Server**.

---

## GitHub Pages Deployment

Deploy for free in under 5 minutes:

```bash
# 1. Initialize repository
git init
git add .
git commit -m "🚀 Launch GlobalAnything"

# 2. Create GitHub repo at github.com/new, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/globalanything.git
git push -u origin main

# 3. Enable GitHub Pages:
#    Repo → Settings → Pages → Source: Deploy from branch → main → / (root)
#    Your site: https://YOUR_USERNAME.github.io/globalanything/
```

### Custom Domain (optional)

```bash
# Create CNAME file in project root
echo "globalanything.com" > CNAME
git add CNAME && git commit -m "Add custom domain" && git push
# Then configure DNS: CNAME record → YOUR_USERNAME.github.io
```

---

## File Structure

```
globalanything/
├── index.html          # Main HTML — all UI structure
├── style.css           # Complete design system (tokens, components, responsive)
├── app.js              # Main application logic (state, rendering, interactions)
├── keyboards.js        # All 16 keyboard layouts and key maps
├── transliteration.js  # Phonetic-to-script conversion engine
├── languages.js        # Language metadata, common phrases, alphabet guides
├── translations.js     # UI translations (EN, AR, FR, ES) + language detector
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (offline caching)
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine crawler rules
├── README.md           # This file
├── .gitignore          # Git ignore rules
└── icons/              # PWA icons (add: icon-72/96/128/192/512.png)
```

---

## Language Management Guide

### Adding a New Language

**Step 1 — Register the language in `languages.js`:**

```javascript
const LANGUAGES = {
  // ... existing languages ...
  greek: {
    code: "el", name: "Greek", nativeName: "Ελληνικά",
    dir: "ltr", flag: "🇬🇷", family: "Hellenic",
    script: "Greek", region: "Europe"
  }
};

// Add to order array:
const LANGUAGE_ORDER = [..., "greek"];
```

**Step 2 — Add the keyboard layout in `keyboards.js`:**

```javascript
const KEYBOARDS = {
  // ... existing ...
  greek: {
    rows: [
      ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ"],
      ["μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ"],
      ["ψ","ω","ά","έ","ή","ί","ό","ύ","ώ"]
    ],
    shift: { "α":"Α","β":"Β" /* ... */ }
  }
};
```

**Step 3 — (Optional) Add transliteration in `transliteration.js`:**

```javascript
const TRANSLITERATION_MAPS = {
  greek: {
    "th":"θ", "ph":"φ", "ps":"ψ",
    "a":"α","b":"β","g":"γ" /* ... */
  }
};
```

**Step 4 — (Optional) Add common phrases in `languages.js`:**

```javascript
const COMMON_PHRASES = {
  greek: ["Γεια σου","Ευχαριστώ","Παρακαλώ","Καλημέρα"]
};
```

### Removing a Language

Remove its key from `LANGUAGES`, `LANGUAGE_ORDER`, `KEYBOARDS`, and optionally `COMMON_PHRASES`.

---

## Custom Keyboard Guide

### Custom Layout Example (Emoji Keyboard)

```javascript
// In keyboards.js
const KEYBOARDS = {
  emoji: {
    rows: [
      ["😀","😂","🥰","😎","🤔","😴","🤩","😭","😤","🥳"],
      ["❤️","🔥","✨","🎉","👍","🙏","💯","🎁","🌟","💪"],
      ["🌍","🚀","🎵","📚","💻","🎨","⚽","🍕","🌈","🦋"]
    ],
    shift: {}
  }
};

// In languages.js
const LANGUAGES = {
  emoji: {
    code: "em", name: "Emoji", nativeName: "Emoji 😀",
    dir: "ltr", flag: "🎉", family: "Unicode",
    script: "Emoji", region: "Global"
  }
};
const LANGUAGE_ORDER = [...existingOrder, "emoji"];
```

### Diacritics Row

Add a `diacritics` array to enable the vowel marks row (shown below the main keyboard):

```javascript
KEYBOARDS.myLang = {
  rows: [ /* ... */ ],
  diacritics: ["á","é","í","ó","ú","ñ"]  // shown in amber row
};
```

---

## SEO Guide

### Meta Tags (already included)

- **Title tag** — keyword-rich, under 60 chars
- **Meta description** — compelling, under 160 chars
- **Open Graph** — for Facebook/LinkedIn sharing
- **Twitter Card** — `summary_large_image`
- **Canonical URL** — prevents duplicate content
- **hreflang** — multilingual signal to Google
- **Schema.org** — `WebApplication` + `SoftwareApplication` with `AggregateRating`

### Adding More SEO Articles

In `app.js`, extend the `SEO_ARTICLES` array:

```javascript
const SEO_ARTICLES = [
  // ... existing 30 articles ...
  {
    id: 31,
    title: "How to Type Greek Online",
    lang: "en",
    category: "Virtual Keyboards",
    desc: "Learn to type Greek characters online using a free virtual keyboard."
  }
];
```

### Sitemap

Update `sitemap.xml` when you add new pages or language sections. Re-submit to Google Search Console after any major change.

### Performance Tips

- All JS is vanilla — no framework overhead
- Fonts loaded from Google Fonts CDN with `display=swap`
- Service Worker caches all assets after first visit
- Lighthouse target: **90+ Performance, 100 Accessibility, 100 SEO**

---

## PWA & Offline Support

GlobalAnything is a **Progressive Web App**:

| Capability | Status |
|---|---|
| Installable | ✅ (manifest + service worker) |
| Offline | ✅ (cache-first strategy) |
| Push Notifications | 🔜 Future |
| Background Sync | 🔜 Future |

### PWA Icons

Generate icons from your logo at [realfavicongenerator.net](https://realfavicongenerator.net) or [maskable.app](https://maskable.app), then place them in `/icons/`:

```
icons/
├── icon-72.png
├── icon-96.png
├── icon-128.png
├── icon-192.png   ← Required for Android install prompt
└── icon-512.png   ← Required for splash screen
```

---

## Accessibility

GlobalAnything is built with accessibility as a first-class concern:

- **ARIA roles and labels** on all interactive elements
- **`role="tablist"` / `role="tab"`** on mode navigation
- **`aria-live` regions** for suggestions and transliteration output
- **`aria-pressed`** on toggle buttons
- **Keyboard focus styles** using `:focus-visible`
- **Large Keys mode** — increases key size for motor-impaired users
- **High Contrast mode** — WCAG AA compliant color ratios
- **`prefers-reduced-motion`** respected (animations disabled)
- **Screen reader friendly** — all keyboard keys have `aria-label`

---

## Contact

**GlobalAnything.com**

📧 Email: [salatrir@gmail.com](mailto:salatrir@gmail.com)

For bug reports, feature requests, or custom keyboard contributions, open an issue on GitHub.

---

## License

MIT License — free to use, modify, and distribute.

---

*GlobalAnything.com — Type Any Language. Anywhere.*
