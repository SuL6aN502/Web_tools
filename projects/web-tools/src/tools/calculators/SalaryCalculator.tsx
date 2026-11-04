"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { salaryResult } from "@/lib/calc";
import { formatNum } from "@/lib/format";
import { Card, Field, Note, Row } from "@/components/ui";

export default function SalaryCalculator() {
  const { t } = useLang();
  const [basic, setBasic] = useState("8000");
  const [housingPct, setHousingPct] = useState("25");
  const [transport, setTransport] = useState("500");
  const [otherAllowances, setOtherAllowances] = useState("0");
  const [gosiPct, setGosiPct] = useState("9.67");
  const [otherDeductions, setOtherDeductions] = useState("0");

  const res = salaryResult({
    basic: parseFloat(basic) || 0,
    housingPct: parseFloat(housingPct) || 0,
    transport: parseFloat(transport) || 0,
    otherAllowances: parseFloat(otherAllowances) || 0,
    gosiPct: parseFloat(gosiPct) || 0,
    otherDeductions: parseFloat(otherDeductions) || 0,
  });

  const rows: { label: { ar: string; en: string }; value: number; kind: "plus" | "minus" | "total" }[] = [
    { label: { ar: "الراتب الأساسي", en: "Basic salary" }, value: parseFloat(basic) || 0, kind: "plus" },
    { label: { ar: "بدل السكن", en: "Housing allowance" }, value: res.housing, kind: "plus" },
    { label: { ar: "بدل النقل", en: "Transport allowance" }, value: parseFloat(transport) || 0, kind: "plus" },
    { label: { ar: "بدلات أخرى", en: "Other allowances" }, value: parseFloat(otherAllowances) || 0, kind: "plus" },
    { label: { ar: "إجمالي المستحقات (الإجمالي)", en: "Gross salary" }, value: res.gross, kind: "total" },
    { label: { ar: "التأمينات الاجتماعية", en: "Social insurance (GOSI)" }, value: -res.gosi, kind: "minus" },
    { label: { ar: "اقتطاعات أخرى", en: "Other deductions" }, value: -(parseFloat(otherDeductions) || 0), kind: "minus" },
    { label: { ar: "صافي الراتب", en: "Net salary" }, value: res.net, kind: "total" },
  ];

  return (
    <Card>
      <Row cols={3}>
        <Field label={{ ar: "الراتب الأساسي", en: "Basic salary" }}>
          <input className="inp" type="number" min={0} value={basic} onChange={(e) => setBasic(e.target.value)} />
        </Field>
        <Field label={{ ar: "بدل السكن % من الأساسي", en: "Housing % of basic" }}>
          <input className="inp" type="number" min={0} max={100} value={housingPct} onChange={(e) => setHousingPct(e.target.value)} />
        </Field>
        <Field label={{ ar: "بدل النقل", en: "Transport allowance" }}>
          <input className="inp" type="number" min={0} value={transport} onChange={(e) => setTransport(e.target.value)} />
        </Field>
        <Field label={{ ar: "بدلات أخرى", en: "Other allowances" }}>
          <input className="inp" type="number" min={0} value={otherAllowances} onChange={(e) => setOtherAllowances(e.target.value)} />
        </Field>
        <Field label={{ ar: "التأمينات الاجتماعية %", en: "Social insurance %" }}>
          <input className="inp" type="number" min={0} max={100} step="0.01" value={gosiPct} onChange={(e) => setGosiPct(e.target.value)} />
        </Field>
        <Field label={{ ar: "اقتطاعات أخرى", en: "Other deductions" }}>
          <input className="inp" type="number" min={0} value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} />
        </Field>
      </Row>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        {rows.map((r, i) => (
          <div
            key={i}
            className={
              "flex items-center justify-between px-4 py-2.5 text-sm " +
              (r.kind === "total"
                ? "bg-indigo-50 font-bold text-indigo-800"
                : i % 2
                  ? "bg-white"
                  : "bg-slate-50")
            }
          >
            <span>{t(r.label)}</span>
            <span className="font-mono" dir="ltr">
              {r.value < 0 ? "−" : ""}
              {formatNum(Math.abs(r.value), 2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Note>
          {t({
            ar: "يمكنك تعديل نسبة التأمينات حسب دولتك (في السعودية: 9.67% على العامل للسعوديين). الحسابات تتم محليًا ولا تُرسل بياناتك لأي جهة.",
            en: "Adjust the social-insurance percentage to match your country. All math runs locally and nothing is sent anywhere.",
          })}
        </Note>
      </div>
    </Card>
  );
}
