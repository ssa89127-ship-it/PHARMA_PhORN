"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { languages, Language } from "@/i18n/translations";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const current = languages.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors"
      >
        <Languages className="w-4 h-4" />
        <span className="hidden sm:inline">{current?.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-1 w-40 rounded-xl glass border border-border/50 shadow-elevated z-50 overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] text-muted-foreground">({lang.name})</span>
                  </div>
                  {language === lang.code && (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
