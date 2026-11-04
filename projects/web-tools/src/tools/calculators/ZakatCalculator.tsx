"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { zakatResult } from "@/lib/calc";
import { formatNum } from "@/lib/format";
import { Card, Field, Note, Row, Stat } from "@/components/ui";

export default function ZakatCalculator() {
  const { t } = useLang();
  const [cash, setCash] = useState("10000");
  const [gold, setGold] = useState("0");
  const [silver, setSilver] = useState("0");
  const [inventory, setInventory] = useState("0");
  const [receivables, setReceivables] = useState("0");
  const [debts, setDebts] = useState("0");
  const [nisab, setNisab] = useState("25000");
  const [goldPrice, setGoldPrice] = useState("300");

  const res = zakatResult({
    cash: parseFloat(cash) || 0,
    goldValue: parseFloat(gold) || 0,
    silverValue: parseFloat(silver) || 0,
    inventory: parseFloat(inventory) || 0,
    receivables: parseFloat(receivables) || 0,
    debts: parseFloat(debts) || 0,
    nisabValue: parseFloat(nisab) || 0,
  });

  return (
    <Card>
      <Row cols={3}>
        <Field label={{ ar: "النقد والحسابات البنكية", en: "Cash & bank accounts" }}>
          <input className="inp" type="number" min={0} value={cash} onChange={(e) => setCash(e.target.value)} />
        </Field>
        <Field label={{ ar: "قيمة الذهب (بلغ العملة)", en: "Gold value (in your currency)" }}>
          <input className="inp" type="number" min={0} value={gold} onChange={(e) => setGold(e.target.value)} />
        </Field>
        <Field label={{ ar: "قيمة الفضة", en: "Silver value" }}>
          <input className="inp" type="number" min={0} value={silver} onChange={(e) => setSilver(e.target.value)} />
        </Field>
        <Field label={{ ar: "بضائع التجارة (بالقيمة السوقية)", en: "Trade goods (market value)" }}>
          <input className="inp" type="number" min={0} value={inventory} onChange={(e) => setInventory(e.target.value)} />
        </Field>
        <Field label={{ ar: "ديون مرجوّة السداد", en: "Receivables (expected to be paid)" }}>
          <input className="inp" type="number" min={0} value={receivables} onChange={(e) => setReceivables(e.target.value)} />
        </Field>
        <Field label={{ ar: "الديون المستحقة عليك", en: "Debts you owe (due now)" }}>
          <input className="inp" type="number" min={0} value={debts} onChange={(e) => setDebts(e.target.value)} />
        </Field>
      </Row>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Row>
          <Field label={{ ar: "النصاب (قيمة 85 جرام ذهب)", en: "Nisab (value of 85g gold)" }}>
            <input className="inp" type="number" min={0} value={nisab} onChange={(e) => setNisab(e.target.value)} />
          </Field>
          <Field
            label={{ ar: "سعر جرام الذهب", en: "Gold price per gram" }}
            hint={{ ar: "اضغط الزر لحساب النصاب تلقائيًا: 85 × السعر", en: "Tap the button to compute nisab: 85 × price" }}
          >
            <div className="flex gap-2">
              <input className="inp" type="number" min={0} value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} />
              <button
                type="button"
                className="btn btn-soft shrink-0"
                onClick={() => setNisab(String(Math.round((parseFloat(goldPrice) || 0) * 85)))}
              >
                {t({ ar: "احسب النصاب", en: "Set nisab" })}
              </button>
            </div>
          </Field>
        </Row>
      </div>

      <div className="mt-6">
        <Row cols={3}>
          <Stat label={{ ar: "صافي الوعاء الزكوي", en: "Zakat base" }} value={formatNum(res.base, 2)} />
          <Stat accent label={{ ar: "الزكاة الواجبة (2.5%)", en: "Zakat due (2.5%)" }} value={formatNum(res.due, 2)} />
          <Stat
            label={{ ar: "الحالة", en: "Status" }}
            value={
              res.belowNisab
                ? t({ ar: "أقل من النصاب", en: "Below nisab" })
                : t({ ar: "تجب الزكاة", en: "Zakat is due" })
            }
          />
        </Row>
      </div>

      <div className="mt-6">
        <Note>
          {t({
            ar: "زكاة المال = 2.5% من صافي المال الزكوي بعد مرور سنة هجرية كاملة (الحول). هذه الأداة للتقدير العام، ويُستحسن الرجوع إلى أهل العلم في المسائل الخاصة.",
            en: "Zakat on wealth = 2.5% of the net zakatable assets after one lunar year has passed. This is a general estimate — consult a scholar for special cases.",
          })}
        </Note>
      </div>
    </Card>
  );
}
