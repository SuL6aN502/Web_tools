"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { PRIVACY_NOTE } from "@/lib/site";

export function Footer() {
  const { t } = useLang();
  const popular = TOOLS.filter((x) =>
    ["pdf-merge", "pdf-compress", "qr-code-generator", "bmi-calculator", "image-compress", "currency-converter"].includes(x.slug)
  );
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg">
              🧰
            </span>
            <span className="text-lg font-bold text-white">
              {t({ ar: "أدوات الويب المجانية", en: "Free Web Tools" })}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">{t(PRIVACY_NOTE)}</p>
          <p className="mt-3 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs leading-6 text-emerald-300">
            🔒 {t(PRIVACY_NOTE)}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {t({ ar: "الأقسام", en: "Categories" })}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/#${c.id}`} className="transition hover:text-white">
                  {c.icon} {t(c.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {t({ ar: "الأدوات الشائعة", en: "Popular Tools" })}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {popular.map((x) => (
              <li key={x.slug}>
                <Link href={`/tools/${x.slug}`} className="transition hover:text-white">
                  {t(x.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {t({ ar: "عن الموقع", en: "About" })}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{t({ ar: "مجاني بالكامل — بدون تسجيل", en: "100% free — no signup" })}</li>
            <li>{t({ ar: "بدون رفع ملفاتك للخوادم", en: "No file uploads to servers" })}</li>
            <li>{t({ ar: "يعمل على الهاتف والحاسوب", en: "Works on mobile & desktop" })}</li>
            <li>{t({ ar: "واجهة عربية وإنجليزية", en: "Arabic & English interface" })}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            {t({ ar: "أدوات الويب المجانية — جميع الحقوق محفوظة", en: "Free Web Tools — All rights reserved" })}
          </p>
          <p>{t({ ar: "صُنع بعناية للمستخدم العربي", en: "Crafted with care" })}</p>
        </div>
      </div>
    </footer>
  );
}
