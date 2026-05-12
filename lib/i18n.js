import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGUAGES = [
  { code: "en",  name: "English",     flag: "🇬🇧" },
  { code: "de",  name: "Deutsch",     flag: "🇩🇪" },
  { code: "fr",  name: "Français",   flag: "🇫🇷" },
  { code: "es",  name: "Español",    flag: "🇪🇸" },
  { code: "it",  name: "Italiano",    flag: "🇮🇹" },
  { code: "pt",  name: "Português",  flag: "🇵🇹" },
  { code: "nl",  name: "Nederlands",  flag: "🇳🇱" },
  { code: "pl",  name: "Polski",      flag: "🇵🇱" },
  { code: "cs",  name: "Čeština",      flag: "🇨🇿" },
  { code: "ro",  name: "Română",     flag: "🇷🇴" },
  { code: "el",  name: "Ελληνικά",   flag: "🇬🇷" },
  { code: "hu",  name: "Magyar",      flag: "🇭🇺" },
  { code: "bg",  name: "Български",  flag: "🇧🇬" },
  { code: "hr",  name: "Hrvatski",    flag: "🇭🇷" },
  { code: "sk",  name: "Slovenčina",    flag: "🇸🇰" },
  { code: "sl",  name: "Slovenščina",   flag: "🇸🇮" },
  { code: "lt",  name: "Lietuvių",    flag: "🇱🇹" },
  { code: "lv",  name: "Latviešu",    flag: "🇱🇻" },
  { code: "et",  name: "Eesti",       flag: "🇪🇪" },
  { code: "fi",  name: "Suomi",       flag: "🇫🇮" },
  { code: "sv",  name: "Svenska",     flag: "🇸🇪" },
  { code: "da",  name: "Dansk",       flag: "🇩🇰" },
  { code: "mt",  name: "Malti",       flag: "🇲🇹" },
  { code: "ga",  name: "Gaeilge",     flag: "🇮🇪" },
  { code: "ar",  name: "العربية",      flag: "🇦🇪", rtl: true },
  { code: "zh",  name: "中文",       flag: "🇨🇳" },
  { code: "ja",  name: "日本語",     flag: "🇯🇵" },
  { code: "ko",  name: "한국어",       flag: "🇰🇷" },
  { code: "hi",  name: "हिन्दी",     flag: "🇮🇳" },
  { code: "ne",  name: "नेपाली",     flag: "🇳🇵" },
  { code: "th",  name: "ไทย",      flag: "🇹🇭" },
  { code: "vi",  name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ms",  name: "Bahasa Melayu",     flag: "🇲🇾" },
  { code: "id",  name: "Bahasa Indonesia",  flag: "🇮🇩" },
  { code: "tr",  name: "Türkçe",      flag: "🇹🇷" },
  { code: "ru",  name: "Русский",     flag: "🇷🇺" },
  { code: "uk",  name: "Українська",  flag: "🇺🇦" },
  { code: "he",  name: "עברית",       flag: "🇮🇱", rtl: true },
  { code: "sw",  name: "Kiswahili",   flag: "🇰🇪" },
  { code: "af",  name: "Afrikaans",   flag: "🇿🇦" },
  { code: "bn",  name: "বাংলা",       flag: "🇧🇩" },
  { code: "ur",  name: "اردو",        flag: "🇵🇰", rtl: true },
  { code: "fa",  name: "فارسی",      flag: "🇮🇷", rtl: true },
  { code: "fil", name: "Filipino",    flag: "🇵🇭" },
];

const SUPPORTED_CODES = SUPPORTED_LANGUAGES.map(l => l.code);

function detectInitialLanguage() {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem("nxt_lang");
    if (saved && SUPPORTED_CODES.includes(saved)) return saved;
  } catch (e) {}
  const navLang = (navigator.language || "en").toLowerCase().split("-")[0];
  if (SUPPORTED_CODES.includes(navLang)) return navLang;
  return "en";
}

async function loadResource(lang) {
  try {
    const res = await fetch(`/locales/${lang}/common.json`);
    if (!res.ok) throw new Error("not ok");
    return await res.json();
  } catch (e) {
    return {};
  }
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: detectInitialLanguage(),
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    resources: { en: { common: {} } },
  });

  if (typeof window !== "undefined") {
    const initial = i18n.language || "en";
    loadResource(initial).then((data) => {
      i18n.addResourceBundle(initial, "common", data, true, true);
      i18n.changeLanguage(initial);
    });

    i18n.on("languageChanged", async (lng) => {
      if (!SUPPORTED_CODES.includes(lng)) return;
      if (!i18n.hasResourceBundle(lng, "common")) {
        const data = await loadResource(lng);
        i18n.addResourceBundle(lng, "common", data, true, true);
      }
      try { window.localStorage.setItem("nxt_lang", lng); } catch (e) {}
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === lng);
      if (typeof document !== "undefined") {
        document.documentElement.lang = lng;
        document.documentElement.dir = lang && lang.rtl ? "rtl" : "ltr";
      }
    });
  }
}

export default i18n;
