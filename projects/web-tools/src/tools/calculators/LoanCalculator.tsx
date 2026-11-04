"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { loanResult } from "@/lib/calc";
import { formatNum } from "@/lib/format";
import { Card, Field, Note, Row, Stat } from "@/components/ui";

export default function LoanCalculator() {
  const { t } = useLang();
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("4.5");
  const [years, setYears] = useState("20");

  const months = (parseFloat(years) || 0) * 12;
  const res = loanResult(parseFloat(amount) || 0, parseFloat(rate) || 0, months);

  return (
    <Card>
      <Row cols={3}>
        <Field label={{ ar: "مبلغ القرض", en: "Loan amount" }}>
          <input className="inp" type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label={{ ar: "نسبة الفائدة السنوية %", en: "Annual interest rate %" }}>
          <input className="inp" type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label={{ ar: "مدة التمويل (سنوات)", en: "Term (years)" }}>
          <input className="inp" type="number" min={1} max={40} value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </Row>

      {res ? (
        <div className="mt-6">
          <Row cols={3}>
            <Stat accent label={{ ar: "القسط الشهري", en: "Monthly installment" }} value={formatNum(res.monthly, 2)} />
            <Stat label={{ ar: "إجمالي المدفوعات", en: "Total payments" }} value={formatNum(res.totalPayment, 2)} />
            <Stat label={{ ar: "إجمالي الفائدة", en: "Total interest" }} value={formatNum(res.totalInterest, 2)} />
          </Row>
          <div className="mt-5">
            <div className="flex h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="bg-indigo-600"
                style={{ width: `${Math.min(100, (parseFloat(amount || "0") / res.totalPayment) * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                {t({ ar: "أصل المبلغ", en: "Principal" })}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                {t({ ar: "الفوائد", en: "Interest" })}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <Note tone="warn">
          {t({ ar: "أدخل قيمًا صحيحة لعرض النتيجة.", en: "Enter valid values to see results." })}
        </Note>
      )}

      <div className="mt-6">
        <Note>
          {t({
            ar: "القسط الشهري = (المبلغ × سعر الفائدة الشهرية) ÷ (1 − (1 + سعر الفائدة الشهرية)^−الشهور). مناسب للقروض الشخصية والتمويل العقاري والسيارات.",
            en: "Monthly payment = (P × r) ÷ (1 − (1 + r)^−n) where r is the monthly rate and n the number of months. Works for personal, mortgage and auto loans.",
          })}
        </Note>
      </div>
    </Card>
  );
}
