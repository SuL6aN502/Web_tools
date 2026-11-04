"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { TOOLS, categoryById, type ToolMeta } from "@/lib/tools";
import { PRIVACY_NOTE } from "@/lib/site";
import { AdSlot } from "./AdSlot";
import { ToolCard } from "./ToolCard";
import ToolRenderer from "./ToolRenderer";

export function ToolPageView({ tool }: { tool: ToolMeta }) {
  const { t } = useLang();
  const cat = categoryById(tool.category);
  const related = TOOLS.filter(
    (x) => x.category === tool.category && x.slug !== tool.slug
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-indigo-600">
          {t({ ar: "الرئيسية", en: "Home" })}
        </Link>
        <span>/</span>
        <Link href={`/#${cat.id}`} className="hover:text-indigo-600">
          {t(cat.title)}
        </Link>
        <span>/</span>
        <span className="text-slate-700">{t(tool.title)}</span>
      </nav>

      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
          {tool.icon}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
            {t(tool.title)}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            {t(tool.desc)}
          </p>
        </div>
      </div>

      <AdSlot format="leaderboard" />

      <div className="mt-2">
        <ToolRenderer slug={tool.slug} />
      </div>

      <AdSlot format="inarticle" />

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <h2 className="font-bold text-slate-900">
            🔒 {t({ ar: "خصوصية كاملة", en: "Full privacy" })}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t(PRIVACY_NOTE)}</p>
        </div>
        <div className="card p-5">
          <h2 className="font-bold text-slate-900">
            ⚡ {t({ ar: "سريع ومجاني", en: "Fast & free" })}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t({
              ar: "لا حاجة للتسجيل أو التحميل — الأداة تعمل مباشرة في المتصفح على جميع الأجهزة.",
              en: "No signup or installs — the tool runs right in your browser on any device.",
            })}
          </p>
        </div>
        <div className="card p-5">
          <h2 className="font-bold text-slate-900">
            💡 {t({ ar: "كيف تستخدم الأداة؟", en: "How to use" })}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t({
              ar: "أدخل بياناتك أو اختر ملفاتك، اضغط زر التنفيذ، ثم انسخ أو حمّل النتيجة. كل شيء يتم محليًا.",
              en: "Enter your data or pick your files, hit the action button, then copy or download the result — all locally.",
            })}
          </p>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            {t({ ar: "أدوات ذات صلة", en: "Related tools" })}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ToolCard key={r.slug} tool={r} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
