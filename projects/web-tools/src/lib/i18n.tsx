"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "ar" | "en";
export type L10n = { ar: string; en: string };

interface LangValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (s: L10n) => string;
  rtl: boolean;
}

const LangContext = createContext<LangValue | null>(null);
const STORAGE_KEY = "wt-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  };

  const t = (s: L10n) => s[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t, rtl: lang === "ar" }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
