/**
 * Provides the current language context (`lang`) and associated
 * translation object (`t`) based on the user's language preference.
 *
 * Used by components to retrieve translated strings dynamically.
 */

import translations from "./translations";

export const DEFAULT_LANG = "en";

export function getLanguageContext() {
  const supportedLangs = Object.keys(translations);
  let lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG;

  if (!supportedLangs.includes(lang)) {
    lang = DEFAULT_LANG;
    localStorage.setItem("lang", DEFAULT_LANG); // ✅ normalize storage
  }

  const t = translations[lang];

  return { lang, t };
}
