import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "../public/locales/en/common.json";

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

const SUPPORTED_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

function detectInitialLanguage() {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem("nxt_lang");
    if (saved && SUPPORTED_CODES.includes(saved)) return saved;
  } catch (e) {}
  const navLang = (typeof navigator !== "undefined" && navigator.language ? navigator.language : "en")
    .toLowerCase()
    .split("-")[0];
  if (SUPPORTED_CODES.includes(navLang)) return navLang;
  return "en";
}

async function loadResource(lang) {
  try {
    const res = await fetch(`/locales/${lang}/common.json`);
    if (!res.ok) throw new Error("not ok");
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function ensureLanguage(lang) {
  if (!SUPPORTED_CODES.includes(lang)) lang = "en";
  if (i18n.hasResourceBundle(lang, "common")) {
    if (i18n.language !== lang) await i18n.changeLanguage(lang);
    return;
  }
  if (lang === "en") {
    i18n.addResourceBundle("en", "common", enCommon, true, true);
    if (i18n.language !== "en") await i18n.changeLanguage("en");
    return;
  }
  const data = await loadResource(lang);
  if (data) {
    i18n.addResourceBundle(lang, "common", data, true, true);
    await i18n.changeLanguage(lang);
  } else {
    await i18n.changeLanguage("en");
  }
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    returnEmptyString: false,
    resources: { en: { common: enCommon } },
  });

  if (typeof window !== "undefined") {
    const initial = detectInitialLanguage();
    ensureLanguage(initial);

    i18n.on("languageChanged", (lng) => {
      try { window.localStorage.setItem("nxt_lang", lng); } catch (e) {}
      const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lng);
      if (typeof document !== "undefined") {
        document.documentElement.lang = lng;
        document.documentElement.dir = meta && meta.rtl ? "rtl" : "ltr";
      }
    });
  }
}

export default i18n;
