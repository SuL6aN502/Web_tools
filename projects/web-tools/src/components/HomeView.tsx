"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { PRIVACY_NOTE, SITE_DESC, SITE_NAME } from "@/lib/site";
import { AdSlot } from "./AdSlot";
import { ToolCard } from "./ToolCard";

export function HomeView() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return null;
    return TOOLS.filter((tool) => {
      const hay = [
        tool.title.ar,
        tool.title.en,
        tool.desc.ar,
        tool.desc.en,
        tool.slug,
        ...tool.keywords.ar,
        ...tool.keywords.en,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_2px,transparent_2px)] [background-size:28px_28px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <span className="pill bg-white/15 text-white">
            🔒 {t({ ar: "معالجة محلية 100% داخل المتصفح", en: "100% local processing in your browser" })}
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-snug sm:text-5xl">
            {t({
              ar: "أدوات ويب مجانية سريعة وخاصة — بدون رفع ملفاتك",
              en: "Free web tools that are fast and private — your files never leave you",
            })}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-indigo-100 sm:text-lg">
            {t(SITE_DESC)}
          </p>
          <div className="mt-8 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t({
                ar: "ابحث عن أداة… مثل: ضغط PDF، حاسبة BMI",
                en: "Search tools… e.g. merge pdf, bmi calculator",
              })}
              className="inp !border-white/30 !bg-white/95 !text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-indigo-100">
            <span className="rounded-full bg-white/10 px-3 py-1">✅ {t({ ar: "بدون تسجيل", en: "No signup" })}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">✅ {t({ ar: "بدون علامات مائية", en: "No watermarks" })}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">✅ {t({ ar: "27 أداة", en: "27 tools" })}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">✅ {t({ ar: "عربي / English", en: "Arabic / English" })}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <AdSlot format="leaderboard" />

        {filtered ? (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {t({ ar: "نتائج البحث", en: "Search results" })} ({filtered.length})
            </h2>
            {filtered.length === 0 ? (
              <div className="card p-10 text-center text-slate-500">
                {t({ ar: "لا توجد نتائج مطابقة — جرّب كلمة أخرى.", en: "No matching tools — try another keyword." })}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            )}
          </section>
        ) : (
          CATEGORIES.map((cat) => {
            const tools = TOOLS.filter((x) => x.category === cat.id);
            return (
              <section key={cat.id} id={cat.id} className="scroll-mt-24 py-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                    {cat.icon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">{t(cat.title)}</h2>
                    <p className="text-sm text-slate-600">{t(cat.desc)}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })
        )}

        {/* trust section */}
        <section className="my-10 grid gap-4 rounded-3xl bg-slate-900 p-8 text-slate-200 sm:grid-cols-3">
          <div>
            <div className="text-2xl">🔒</div>
            <h3 className="mt-3 font-bold text-white">{t({ ar: "خصوصيتك أولًا", en: "Privacy first" })}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">{t(PRIVACY_NOTE)}</p>
          </div>
          <div>
            <div className="text-2xl">⚡</div>
            <h3 className="mt-3 font-bold text-white">{t({ ar: "سرعة فائقة", en: "Lightning fast" })}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              {t({
                ar: "كل الأدوات تعمل بتقنيات الويب الحديثة مباشرة على جهازك — لا انتظار ولا طوابير رفع.",
                en: "Every tool runs on modern web tech directly on your device — no waiting, no upload queues.",
              })}
            </p>
          </div>
          <div>
            <div className="text-2xl">🆓</div>
            <h3 className="mt-3 font-bold text-white">{t({ ar: "مجاني للجميع", en: "Free for everyone" })}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              {t({
                ar: "بدون اشتراكات أو حدود يومية — استخدم الأدوات كما تريد بقدر ما تحتاج.",
                en: "No subscriptions or daily limits — use the tools as much as you need.",
              })}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900">
            {t({ ar: "لماذا موقعنا؟", en: "Why this site?" })} — {t(SITE_NAME)}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
            {t({
              ar: "صُمم هذا الموقع ليكون مرجعك اليومي للأدوات المجانية: أدوات PDF، محوّلات، حاسبات، مولّدات وأدوات صور — كلها في مكان واحد وبواجهة عربية كاملة مع دعم اللغة الإنجليزية. لا نطلب بريدًا إلكترونيًا، ولا نحفظ ملفاتك، ولا نعرض إعلانات مزعجة داخل الأدوات.",
              en: "This site is your daily toolkit: PDF tools, converters, calculators, generators and image tools — all in one place with a full Arabic interface and English support. No email required, no file storage, and no intrusive ads inside the tools.",
            })}
          </p>
        </section>
      </div>
    </div>
  );
}
