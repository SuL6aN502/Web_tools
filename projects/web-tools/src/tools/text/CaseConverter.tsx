"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { toAlternatingCase, toSentenceCase, toTitleCase } from "@/lib/text";
import { Card, CopyBtn } from "@/components/ui";

export default function CaseConverter() {
  const { t } = useLang();
  const [text, setText] = useState("");

  const apply = (fn: (s: string) => string) => setText(fn(text));

  const actions: { label: { ar: string; en: string }; fn: (s: string) => string }[] = [
    { label: { ar: "أحرف كبيرة (ABC)", en: "UPPERCASE" }, fn: (s) => s.toLocaleUpperCase() },
    { label: { ar: "أحرف صغيرة (abc)", en: "lowercase" }, fn: (s) => s.toLocaleLowerCase() },
    { label: { ar: "صيغة العنوان (Title Case)", en: "Title Case" }, fn: toTitleCase },
    { label: { ar: "صيغة الجملة (Sentence case)", en: "Sentence case" }, fn: toSentenceCase },
    { label: { ar: "أحرف متبادلة (aLtErNaTiNg)", en: "aLtErNaTiNg cAsE" }, fn: toAlternatingCase },
    { label: { ar: "عكس النص", en: "Reverse text" }, fn: (s) => s.split("").reverse().join("") },
  ];

  return (
    <Card>
      <textarea
        className="inp min-h-[220px] leading-8"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t({
          ar: "اكتب أو الصق النص هنا، ثم اختر نوع التحويل…",
          en: "Type or paste text here, then choose a conversion…",
        })}
      />

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => (
          <button
            key={a.label.en}
            type="button"
            className="btn btn-soft"
            onClick={() => apply(a.fn)}
          >
            {t(a.label)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline" onClick={() => setText("")}>
          {t({ ar: "مسح الكل", en: "Clear all" })}
        </button>
        <CopyBtn text={text} label={{ ar: "نسخ النتيجة", en: "Copy result" }} />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
        {t({
          ar: "كل التحويلات تتم في متصفحك — يمكنك لصق النصوص الحساسة بثقة.",
          en: "All conversions run in your browser — safe to paste sensitive text.",
        })}
      </div>
    </Card>
  );
}
