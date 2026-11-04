"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { textStats } from "@/lib/text";
import { formatNum } from "@/lib/format";
import { Card, Stat, Row, CopyBtn } from "@/components/ui";

export default function WordCounter() {
  const { t } = useLang();
  const [text, setText] = useState("");
  const s = useMemo(() => textStats(text), [text]);

  return (
    <Card>
      <textarea
        className="inp min-h-[260px] leading-8"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t({
          ar: "اكتب أو الصق نصك هنا لعرض عدد الكلمات والأحرف فورًا…",
          en: "Type or paste your text here to count words and characters instantly…",
        })}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() =>
            setText(
              t({
                ar: "النص العربي سهل وممتع. يمكن استخدام هذا العدّاد لمقالاتك وتدويناتك وسيرتك الذاتية! يعرض العدّاد عدد الكلمات والأحرف والجمل والفقرات، مع وقت القراءة المقدر.",
                en: "Writing is thinking on paper. Use this counter for your essays, blog posts and CVs! It shows words, characters, sentences and paragraphs, plus estimated reading time.",
              })
            )
          }
        >
          {t({ ar: "نص تجريبي", en: "Sample text" })}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => setText("")}>
          {t({ ar: "مسح", en: "Clear" })}
        </button>
        <CopyBtn text={text} label={{ ar: "نسخ النص", en: "Copy text" }} />
        <span className="pill ms-auto bg-slate-100 text-slate-600">
          {t({ ar: "المعالجة محلية 100%", en: "100% local processing" })}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat accent label={{ ar: "الكلمات", en: "Words" }} value={formatNum(s.words, 0)} />
        <Stat accent label={{ ar: "الأحرف (مع المسافات)", en: "Characters (with spaces)" }} value={formatNum(s.chars, 0)} />
        <Stat label={{ ar: "الأحرف (بدون مسافات)", en: "Characters (no spaces)" }} value={formatNum(s.charsNoSpaces, 0)} />
        <Stat label={{ ar: "الجمل", en: "Sentences" }} value={formatNum(s.sentences, 0)} />
        <Stat label={{ ar: "الفقرات", en: "Paragraphs" }} value={formatNum(s.paragraphs, 0)} />
        <Stat label={{ ar: "الأسطر", en: "Lines" }} value={formatNum(s.lines, 0)} />
        <Stat
          label={{ ar: "وقت القراءة", en: "Reading time" }}
          value={t({
            ar: s.readingMinutes < 1 ? "أقل من دقيقة" : `${formatNum(s.readingMinutes, 1)} دقيقة`,
            en: s.readingMinutes < 1 ? "under 1 min" : `${formatNum(s.readingMinutes, 1)} min`,
          })}
        />
        <Stat
          label={{ ar: "وقت النطق", en: "Speaking time" }}
          value={t({
            ar: s.speakingMinutes < 1 ? "أقل من دقيقة" : `${formatNum(s.speakingMinutes, 1)} دقيقة`,
            en: s.speakingMinutes < 1 ? "under 1 min" : `${formatNum(s.speakingMinutes, 1)} min`,
          })}
        />
      </div>

      <div className="mt-6">
        <Row>
          <Stat label={{ ar: "الكلمات الفريدة", en: "Unique words" }} value={formatNum(s.uniqueWords, 0)} />
          <Stat label={{ ar: "متوسط طول الكلمة", en: "Avg. word length" }} value={formatNum(s.avgWordLength, 2)} />
        </Row>
      </div>
    </Card>
  );
}
