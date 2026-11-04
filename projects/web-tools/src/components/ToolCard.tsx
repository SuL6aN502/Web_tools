"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { ToolMeta } from "@/lib/tools";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  const { t } = useLang();
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl transition group-hover:bg-indigo-100">
          {tool.icon}
        </span>
        <h3 className="font-bold leading-6 text-slate-900 transition group-hover:text-indigo-700">
          {t(tool.title)}
        </h3>
      </div>
      <p className="text-sm leading-6 text-slate-600">{t(tool.desc)}</p>
      <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
        {t({ ar: "استخدم الأداة ←", en: "Use tool →" })}
      </span>
    </Link>
  );
}
