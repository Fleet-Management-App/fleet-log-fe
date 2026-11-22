import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { type Language, LANGUAGES, resources } from "./resources";

// The chosen language lives in localStorage (Confluence "Tech Stack & Coding Conventions");
// without a stored choice the app starts in English.
const LANGUAGE_STORAGE_KEY = "fleetlog.language";
const DEFAULT_LANGUAGE: Language = "en";

const readStoredLanguage = (): Language => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return LANGUAGES.includes(stored as Language) ? (stored as Language) : DEFAULT_LANGUAGE;
};

void i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "common",
  ns: Object.keys(resources.en),
  // React already escapes rendered values
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.documentElement.lang = language;
});
document.documentElement.lang = i18n.language;

export const changeLanguage = (language: Language) => i18n.changeLanguage(language);

export { i18n };
