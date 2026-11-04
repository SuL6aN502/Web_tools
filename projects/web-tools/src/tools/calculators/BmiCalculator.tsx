"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { bmiResult, type BmiCategory } from "@/lib/calc";
import { formatNum } from "@/lib/format";
import { Card, Field, Note, Row, Stat } from "@/components/ui";

const CAT_LABEL: Record<BmiCategory, { ar: string; en: string }> = {
  underweight: { ar: "نقص في الوزن", en: "Underweight" },
  normal: { ar: "وزن طبيعي", en: "Normal weight" },
  overweight: { ar: "زيادة في الوزن", en: "Overweight" },
  obese: { ar: "سمنة", en: "Obesity" },
};

const CAT_COLOR: Record<BmiCategory, string> = {
  underweight: "bg-sky-500",
  normal: "bg-emerald-500",
  overweight: "bg-amber-500",
  obese: "bg-rose-500",
};

export default function BmiCalculator() {
  const { t } = useLang();
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const res = bmiResult(parseFloat(height), parseFloat(weight));
  const markerPct = res ? Math.min(100, Math.max(0, ((res.value - 15) / 25) * 100)) : 0;

  return (
    <Card>
      <Row>
        <Field label={{ ar: "الطول (سم)", en: "Height (cm)" }}>
          <input
            className="inp"
            type="number"
            min={50}
            max={250}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </Field>
        <Field label={{ ar: "الوزن (كجم)", en: "Weight (kg)" }}>
          <input
            className="inp"
            type="number"
            min={10}
            max={400}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </Field>
      </Row>

      {res ? (
        <div className="mt-6">
          <Row cols={3}>
            <Stat
              accent
              label={{ ar: "مؤشر كتلة الجسم BMI", en: "Your BMI" }}
              value={formatNum(res.value, 1)}
            />
            <Stat
              label={{ ar: "الفئة", en: "Category" }}
              value={t(CAT_LABEL[res.category])}
            />
            <Stat
              label={{ ar: "الوزن الصحي لطولك", en: "Healthy weight range" }}
              value={`${formatNum(res.minHealthyWeight, 0)} – ${formatNum(res.maxHealthyWeight, 0)} kg`}
            />
          </Row>

          <div className="mt-6">
            <div className="flex h-3 overflow-hidden rounded-full">
              <div className="w-[14%] bg-sky-500" />
              <div className="w-[26%] bg-emerald-500" />
              <div className="w-[20%] bg-amber-500" />
              <div className="w-[40%] bg-rose-500" />
            </div>
            <div className="relative h-4">
              <div
                className={"absolute -top-2 h-4 w-1 rounded " + CAT_COLOR[res.category]}
                style={{ insetInlineStart: `calc(${markerPct}% - 2px)` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
        </div>
      ) : (
        <Note tone="warn">
          {t({
            ar: "أدخل طولًا ووزنًا صحيحين لعرض النتيجة.",
            en: "Enter a valid height and weight to see the result.",
          })}
        </Note>
      )}

      <div className="mt-6">
        <Note>
          {t({
            ar: "مؤشر كتلة الجسم = الوزن (كجم) ÷ الطول² (متر). لا يأخذ BMI في الاعتبار كتلة العضلات أو توزيع الدهون، لذا فهو مؤشر تقريبي فقط.",
            en: "BMI = weight (kg) ÷ height² (m). It does not account for muscle mass or fat distribution, so treat it as a rough indicator.",
          })}
        </Note>
      </div>
    </Card>
  );
}
