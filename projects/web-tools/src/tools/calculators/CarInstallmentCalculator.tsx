"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { carInstallmentResult } from "@/lib/calc";
import { formatNum } from "@/lib/format";
import { Card, Field, Note, Row, Stat } from "@/components/ui";

export default function CarInstallmentCalculator() {
  const { t } = useLang();
  const [price, setPrice] = useState("120000");
  const [down, setDown] = useState("20000");
  const [rate, setRate] = useState("3.5");
  const [months, setMonths] = useState("60");

  const res = carInstallmentResult(
    parseFloat(price) || 0,
    parseFloat(down) || 0,
    parseFloat(rate) || 0,
    parseFloat(months) || 0
  );

  return (
    <Card>
      <Row cols={4}>
        <Field label={{ ar: "سعر السيارة", en: "Car price" }}>
          <input className="inp" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label={{ ar: "الدفعة الأولى (المقدم)", en: "Down payment" }}>
          <input className="inp" type="number" min={0} value={down} onChange={(e) => setDown(e.target.value)} />
        </Field>
        <Field label={{ ar: "نسبة الفائدة السنوية %", en: "Annual rate %" }}>
          <input className="inp" type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label={{ ar: "مدة التمويل (شهرًا)", en: "Term (months)" }}>
          <input className="inp" type="number" min={1} max={120} value={months} onChange={(e) => setMonths(e.target.value)} />
        </Field>
      </Row>

      {res ? (
        <div className="mt-6">
          <Row cols={4}>
            <Stat accent label={{ ar: "القسط الشهري", en: "Monthly installment" }} value={formatNum(res.monthly, 2)} />
            <Stat label={{ ar: "مبلغ التمويل", en: "Financed amount" }} value={formatNum(res.financed, 2)} />
            <Stat label={{ ar: "إجمالي المدفوع", en: "Total paid" }} value={formatNum(res.totalPayment, 2)} />
            <Stat label={{ ar: "إجمالي الفوائد", en: "Total interest" }} value={formatNum(res.totalInterest, 2)} />
          </Row>
        </div>
      ) : (
        <Note tone="warn">
          {t({ ar: "أدخل قيمًا صحيحة لعرض النتيجة.", en: "Enter valid values to see results." })}
        </Note>
      )}

      <div className="mt-6">
        <Note>
          {t({
            ar: "مبلغ التمويل = سعر السيارة − الدفعة الأولى. القسط يُحسب بطريقة القسط الثابت (Equal Installments).",
            en: "Financed amount = car price − down payment. The installment uses the equal-payment (reducing balance) formula.",
          })}
        </Note>
      </div>
    </Card>
  );
}
