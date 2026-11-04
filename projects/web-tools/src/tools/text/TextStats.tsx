"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { textStats, topWords } from "@/lib/text";
import { formatNum } from "@/lib/format";
import { Card, Note, Row, Stat } from "@/components/ui";

export default function TextStats() {
  const { t } = useLang();
  const [text, setText] = useState("");
  const s = useMemo(() => textStats(text), [text]);
  const top = useMemo(() => topWords(text, 12), [text]);
  const maxCount = top[0]?.count ?? 1;

  return (
    <Card>
      <textarea
        className="inp min-h-[220px] leading-8"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t({
          ar: "الصق النص هنا لتحليله إحصائيًا…",
          en: "Paste text here for a full statistical analysis…",
        })}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat accent label={{ ar: "الكلمات", en: "Words" }} value={formatNum(s.words, 0)} />
        <Stat label={{ ar: "الكلمات الفريدة", en: "Unique words" }} value={formatNum(s.uniqueWords, 0)} />
        <Stat label={{ ar: "الأحرف", en: "Characters" }} value={formatNum(s.chars, 0)} />
        <Stat label={{ ar: "الجمل", en: "Sentences" }} value={formatNum(s.sentences, 0)} />
        <Stat label={{ ar: "متوسط طول الكلمة", en: "Avg. word length" }} value={formatNum(s.avgWordLength, 2)} />
        <Stat label={{ ar: "متوسط طول الجملة", en: "Avg. sentence length" }} value={formatNum(s.avgSentenceLength, 2)} />
        <Stat label={{ ar: "الحروف", en: "Letters" }} value={formatNum(s.letters, 0)} />
        <Stat label={{ ar: "الأرقام", en: "Digits" }} value={formatNum(s.digits, 0)} />
      </div>

      <div className="mt-6">
        <Row>
          <Stat label={{ ar: "أطول كلمة", en: "Longest word" }} value={s.longestWord || "—"} />
          <Stat
            label={{ ar: "تنوع المفردات", en: "Vocabulary richness" }}
            value={s.words ? `${formatNum((s.uniqueWords / s.words) * 100, 1)}%` : "—"}
          />
        </Row>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 font-bold text-slate-900">
          {t({ ar: "أكثر الكلمات تكرارًا", en: "Most frequent words" })}
        </h3>
        {top.length === 0 ? (
          <Note tone="warn">
            {t({ ar: "أدخل نصًا لعرض تحليل الكلمات.", en: "Enter some text to see word analysis." })}
          </Note>
        ) : (
          <div className="space-y-2">
            {top.map((w) => (
              <div key={w.word} className="flex items-center gap-3">
                <span className="w-36 truncate text-sm text-slate-700">{w.word}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-violet-500"
                    style={{ width: `${(w.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-end text-xs font-semibold text-slate-500">
                  {w.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
