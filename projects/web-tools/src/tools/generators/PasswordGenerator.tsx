"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Card, Slider, Checkbox, CopyBtn, Stat, Row } from "@/components/ui";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}:;,.?~";

function randIndex(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function generate(pool: string, len: number): string {
  let out = "";
  for (let i = 0; i < len; i++) out += pool.charAt(randIndex(pool.length));
  return out;
}

export default function PasswordGenerator() {
  const { t } = useLang();
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [pwd, setPwd] = useState("");

  function pool(): string {
    let p = "";
    if (useLower) p += LOWER;
    if (useUpper) p += UPPER;
    if (useDigits) p += DIGITS;
    if (useSymbols) p += SYMBOLS;
    return p;
  }

  function regenerate() {
    const p = pool();
    setPwd(p ? generate(p, length) : "");
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, useLower, useUpper, useDigits, useSymbols]);

  const kinds = [useLower, useUpper, useDigits, useSymbols].filter(Boolean).length;
  const score = pwd ? Math.min(4, Math.floor(length / 10) + kinds - 1) : 0;
  const scoreLabels = [
    { ar: "ضعيفة", en: "Weak" },
    { ar: "مقبولة", en: "Fair" },
    { ar: "جيدة", en: "Good" },
    { ar: "قوية", en: "Strong" },
    { ar: "ممتازة", en: "Excellent" },
  ];
  const scoreColors = ["bg-rose-500", "bg-amber-500", "bg-yellow-500", "bg-emerald-500", "bg-indigo-600"];

  return (
    <Card>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
        <div className="break-all font-mono text-2xl font-bold tracking-wider text-slate-900">
          {pwd || t({ ar: "اختر نوعًا واحدًا على الأقل", en: "Pick at least one character set" })}
        </div>
        {pwd ? (
          <div className="mt-3">
            <div className="mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
              <div
                className={"h-full rounded-full " + scoreColors[score]}
                style={{ width: String((score + 1) * 20) + "%" }}
              />
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-500">
              {t({ ar: "القوة: ", en: "Strength: " }) + t(scoreLabels[score])}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={regenerate}>
          {t({ ar: "توليد جديد", en: "Generate" })}
        </button>
        <CopyBtn text={pwd} label={{ ar: "نسخ كلمة المرور", en: "Copy password" }} />
      </div>

      <div className="mt-6">
        <Slider
          label={{ ar: "الطول: " + String(length), en: "Length: " + String(length) }}
          value={length}
          min={4}
          max={64}
          onChange={setLength}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Checkbox checked={useLower} onChange={setUseLower} label={{ ar: "أحرف صغيرة (abc)", en: "Lowercase (abc)" }} />
        <Checkbox checked={useUpper} onChange={setUseUpper} label={{ ar: "أحرف كبيرة (ABC)", en: "Uppercase (ABC)" }} />
        <Checkbox checked={useDigits} onChange={setUseDigits} label={{ ar: "أرقام (123)", en: "Digits (123)" }} />
        <Checkbox checked={useSymbols} onChange={setUseSymbols} label={{ ar: "رموز (!@#)", en: "Symbols (!@#)" }} />
      </div>

      {pwd ? (
        <div className="mt-6">
          <Row cols={3}>
            <Stat label={{ ar: "الطول", en: "Length" }} value={String(pwd.length)} accent />
            <Stat label={{ ar: "الأنماط", en: "Character sets" }} value={String(kinds)} />
            <Stat
              label={{ ar: "الاحتمالات", en: "Combinations" }}
              value={"10^" + String(Math.floor(pwd.length * Math.log10(Math.max(2, pool().length))))}
            />
          </Row>
        </div>
      ) : null}
    </Card>
  );
}
