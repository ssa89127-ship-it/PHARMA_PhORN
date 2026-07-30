"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations } from "./translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
  tArray: (path: string) => any[];
  formatCurrency: (amount: number) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz");

  useEffect(() => {
    const saved = localStorage.getItem("pharmahub-lang") as Language;
    if (saved && ["uz", "ru", "en"].includes(saved)) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("pharmahub-lang", lang);
  };

  const getNestedValue = (obj: any, path: string): any => {
    const keys = path.split(".");
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return path;
      }
    }
    return current;
  };

  const t = (path: string): string => {
    const result = getNestedValue(translations[language], path);
    return typeof result === "string" ? result : path;
  };

  const tArray = (path: string): any[] => {
    const result = getNestedValue(translations[language], path);
    return Array.isArray(result) ? result : [];
  };

  const formatCurrency = (amount: number): string => {
    if (language === "uz") {
      return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
    } else if (language === "ru") {
      return new Intl.NumberFormat("ru-RU").format(amount) + " сум";
    } else {
      return "$" + (amount / 12000).toFixed(2);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, tArray, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
