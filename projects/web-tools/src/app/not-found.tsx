"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <div className="text-7xl">🧭</div>
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
        {t({ ar: "الصفحة غير موجودة", en: "Page not found" })}
      </h1>
      <p className="mt-3 text-slate-600">
        {t({
          ar: "ربما تم نقل الأداة أو أن الرابط غير صحيح.",
          en: "The tool may have moved, or the link is incorrect.",
        })}
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        {t({ ar: "العودة للرئيسية", en: "Back to home" })}
      </Link>
    </div>
  );
}
