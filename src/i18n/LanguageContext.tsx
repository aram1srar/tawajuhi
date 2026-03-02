import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import translations, { type Locale } from "./translations";

type TranslationType = typeof translations.en | typeof translations.ar;

interface LanguageContextType {
  locale: Locale;
  t: TranslationType;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>("ar");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.setAttribute("dir", newLocale === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", newLocale);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
  }, []);

  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
