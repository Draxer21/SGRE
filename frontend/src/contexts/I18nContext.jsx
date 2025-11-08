import { createContext, useContext, useMemo, useState } from "react";

import { defaultLocale, translations } from "../i18n/translations.js";

const STORAGE_KEY = "sgre_locale";

const I18nContext = createContext({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key, fallback) => fallback ?? key,
  availableLocales: Object.keys(translations),
});

function getNestedTranslation(locale, key) {
  const dictionary = translations[locale] ?? translations[defaultLocale];
  if (!key) {
    return undefined;
  }
  return key.split(".").reduce((acc, part) => acc?.[part], dictionary);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? defaultLocale,
  );

  const setLocale = (nextLocale) => {
    const safeLocale = translations[nextLocale] ? nextLocale : defaultLocale;
    setLocaleState(safeLocale);
    localStorage.setItem(STORAGE_KEY, safeLocale);
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      availableLocales: Object.keys(translations),
      t: (key, fallback) =>
        getNestedTranslation(locale, key) ?? fallback ?? key,
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
