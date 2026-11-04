"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { cleanWhitespace, type CleanOptions } from "@/lib/text";
import { Card, Checkbox, CopyBtn, Note } from "@/components/ui";

export default function TextCleaner() {
  const { t } = useLang();
  const [text, setText] = useState("");
  const [opts, setOpts] = useState<CleanOptions>({
    trimLines: true,
    collapseSpaces: true,
    removeEmptyLines: true,
    normalizeBreaks: true,
    removeZeroWidth: true,
  });

  const result = useMemo(() => cleanWhitespace(text, opts), [text, opts]);
  const saved = text.length - result.length;

  return (
    <Card>
      <textarea
        className="inp min-h-[200px] leading-8"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t({
          ar: "الصق النص غير المرتب هنا…",
          en: "Paste your messy text here…",
        })}
      />

      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <Checkbox
          checked={opts.collapseSpaces}
          onChange={(v) => setOpts({ ...opts, collapseSpaces: v })}
          label={{ ar: "دمج المسافات المتعددة في مسافة واحدة", en: "Collapse multiple spaces into one" }}
        />
        <Checkbox
          checked={opts.trimLines}
          onChange={(v) => setOpts({ ...opts, trimLines: v })}
          label={{ ar: "إزالة المسافات من بداية ونهاية كل سطر", en: "Trim spaces at line start/end" }}
        />
        <Checkbox
          checked={opts.removeEmptyLines}
          onChange={(v) => setOpts({ ...opts, removeEmptyLines: v })}
          label={{ ar: "حذف الأسطر الفارغة", en: "Remove empty lines" }}
        />
        <Checkbox
          checked={opts.normalizeBreaks}
          onChange={(v) => setOpts({ ...opts, normalizeBreaks: v })}
          label={{ ar: "توحيد فواصل الأسطر (CRLF ← LF)", en: "Normalize line breaks (CRLF → LF)" }}
        />
        <Checkbox
          checked={opts.removeZeroWidth}
          onChange={(v) => setOpts({ ...opts, removeZeroWidth: v })}
          label={{ ar: "حذف المحارف المخفية (Zero-Width)", en: "Strip hidden zero-width characters" }}
        />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">
            {t({ ar: "النتيجة", en: "Result" })}
          </h3>
          <span className="pill bg-indigo-50 text-indigo-700">
            {saved > 0
              ? t({ ar: `تم توفير ${saved} حرفًا`, en: `${saved} characters removed` })
              : t({ ar: "لا تغييرات بعد", en: "No changes yet" })}
          </span>
        </div>
        <textarea className="inp min-h-[200px] leading-8" value={result} readOnly />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CopyBtn text={result} label={{ ar: "نسخ النتيجة", en: "Copy result" }} />
        <button type="button" className="btn btn-outline" onClick={() => setText(result)}>
          {t({ ar: "استبدال النص بالنتيجة", en: "Replace input with result" })}
        </button>
      </div>

      <div className="mt-5">
        <Note>
          {t({
            ar: "مفيد جدًا مع النصوص المنسوخة من PDF أو الواتساب أو المواقع، حيث تحتوي على مسافات وأحرف غير مرئية.",
            en: "Super useful for text copied from PDFs, WhatsApp or websites, which often contains stray spaces and invisible characters.",
          })}
        </Note>
      </div>
    </Card>
  );
}
