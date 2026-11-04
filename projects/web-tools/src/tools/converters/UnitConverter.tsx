"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { formatNum } from "@/lib/format";
import { Card, Field, Note, Row, Stat } from "@/components/ui";

type Kind = "length" | "weight" | "temperature";

const UNITS: Record<Kind, { id: string; factor: number; ar: string; en: string }[]> = {
  length: [
    { id: "mm", factor: 0.001, ar: "مليمتر", en: "Millimeter (mm)" },
    { id: "cm", factor: 0.01, ar: "سنتيمتر", en: "Centimeter (cm)" },
    { id: "m", factor: 1, ar: "متر", en: "Meter (m)" },
    { id: "km", factor: 1000, ar: "كيلومتر", en: "Kilometer (km)" },
    { id: "in", factor: 0.0254, ar: "بوصة", en: "Inch (in)" },
    { id: "ft", factor: 0.3048, ar: "قدم", en: "Foot (ft)" },
    { id: "yd", factor: 0.9144, ar: "ياردة", en: "Yard (yd)" },
    { id: "mi", factor: 1609.344, ar: "ميل", en: "Mile (mi)" },
  ],
  weight: [
    { id: "mg", factor: 0.000001, ar: "مليغرام", en: "Milligram (mg)" },
    { id: "g", factor: 0.001, ar: "غرام", en: "Gram (g)" },
    { id: "kg", factor: 1, ar: "كيلوغرام", en: "Kilogram (kg)" },
    { id: "ton", factor: 1000, ar: "طن", en: "Ton (t)" },
    { id: "oz", factor: 0.028349523125, ar: "أونصة", en: "Ounce (oz)" },
    { id: "lb", factor: 0.45359237, ar: "باوند", en: "Pound (lb)" },
    { id: "st", factor: 6.35029318, ar: "ستون", en: "Stone (st)" },
  ],
  temperature: [
    { id: "c", factor: 0, ar: "سيليزية °C", en: "Celsius (°C)" },
    { id: "f", factor: 0, ar: "فهرنهايت °F", en: "Fahrenheit (°F)" },
    { id: "k", factor: 0, ar: "كلفن K", en: "Kelvin (K)" },
  ],
};

const KIND_LABEL: Record<Kind, { ar: string; en: string }> = {
  length: { ar: "الطول", en: "Length" },
  weight: { ar: "الوزن", en: "Weight" },
  temperature: { ar: "الحرارة", en: "Temperature" },
};

function convertTemp(value: number, from: string, to: string): number {
  let c = value;
  if (from === "f") c = ((value - 32) * 5) / 9;
  else if (from === "k") c = value - 273.15;
  if (to === "f") return (c * 9) / 5 + 32;
  if (to === "k") return c + 273.15;
  return c;
}

export default function UnitConverter() {
  const { t } = useLang();
  const [kind, setKind] = useState<Kind>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");

  const units = UNITS[kind];
  const fromUnit = units.find((u) => u.id === from) ?? units[0];
  const toUnit = units.find((u) => u.id === to) ?? units[1];

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!Number.isFinite(v)) return null;
    if (kind === "temperature") return convertTemp(v, fromUnit.id, toUnit.id);
    return (v * fromUnit.factor) / toUnit.factor;
  }, [value, kind, fromUnit, toUnit]);

  const changeKind = (k: Kind) => {
    setKind(k);
    setFrom(UNITS[k][0].id);
    setTo(UNITS[k][1].id);
  };

  return (
    <Card>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(UNITS) as Kind[]).map((k) => (
          <button
            key={k}
            type="button"
            className={"btn " + (kind === k ? "btn-primary" : "btn-outline")}
            onClick={() => changeKind(k)}
          >
            {t(KIND_LABEL[k])}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Row cols={3}>
          <Field label={{ ar: "القيمة", en: "Value" }}>
            <input
              className="inp"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Field>
          <Field label={{ ar: "من وحدة", en: "From unit" }}>
            <select className="inp" value={from} onChange={(e) => setFrom(e.target.value)}>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {t({ ar: u.ar, en: u.en })}
                </option>
              ))}
            </select>
          </Field>
          <Field label={{ ar: "إلى وحدة", en: "To unit" }}>
            <select className="inp" value={to} onChange={(e) => setTo(e.target.value)}>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {t({ ar: u.ar, en: u.en })}
                </option>
              ))}
            </select>
          </Field>
        </Row>
      </div>

      <div className="mt-6">
        <Row>
          <Stat
            accent
            label={{ ar: "النتيجة", en: "Result" }}
            value={
              result === null
                ? "—"
                : `${formatNum(result, 6)} {t({ ar: toUnit.ar, en: toUnit.en })}`
            }
          />
          <Stat
            label={{ ar: "المعادلة", en: "Equation" }}
            value={
              result === null
                ? "—"
                : `${formatNum(parseFloat(value) || 0, 4)} {fromUnit.id} = ${formatNum(result, 4)} {toUnit.id}`
            }
          />
        </Row>
      </div>

      <div className="mt-6">
        <Note>
          {t({
            ar: "تدعم الأداة وحدات الطول والوزن والحرارة بدقة عالية. للحرارة تُستخدم معادلات التحويل المباشرة وليس النسب.",
            en: "Supports length, weight and temperature units with high precision. Temperature uses direct conversion formulas rather than ratios.",
          })}
        </Note>
      </div>
    </Card>
  );
}
