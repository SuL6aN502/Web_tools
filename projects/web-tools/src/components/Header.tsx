"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/tools";

export function Header() {
  const { t, lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg text-white">
            🧰
          </span>
          <span className="text-base font-extrabold text-slate-900 sm:text-lg">
            {t({ ar: "أدوات الويب المجانية", en: "Free Web Tools" })}
          </span>
        </Link>
        <nav className="ms-4 hidden items-center gap-1 lg:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/#${c.id}`}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
            >
              {c.icon} {t(c.title)}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="btn btn-soft ms-auto shrink-0"
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          aria-label="Switch language"
        >
          🌐 {lang === "ar" ? "English" : "عربي"}
        </button>
      </div>
    </header>
  );
}
