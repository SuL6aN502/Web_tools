"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { CURRENCIES, convert, fetchRates, type RatesSnapshot } from "@/lib/currency";
import { formatNum } from "@/lib/format";
import { Card, Field, Note, Row, Stat } from "@/components/ui";

export default function CurrencyConverter() {
  const { t, lang } = useLang();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("SAR");
  const [snap, setSnap] = useState<RatesSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchRates().then((s) => {
      if (alive) {
        setSnap(s);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const rate = snap ? snap.rates[to] / snap.rates[from] : null;
  const value = convert(parseFloat(amount) || 0, from, to, snap?.rates ?? {});

  const curName = (code: string) => {
    const c = CURRENCIES.find((x) => x.code === code);
    return c ? (lang === "ar" ? c.ar : c.en) : code;
  };

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={{ ar: "المبلغ", en: "Amount" }}>
          <input
            className="inp"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 items-end gap-3">
          <Field label={{ ar: "من", en: "From" }}>
            <select className="inp" value={from} onChange={(e) => setFrom(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {lang === "ar" ? c.ar : c.en}
                </option>
              ))}
            </select>
          </Field>
          <Field label={{ ar: "إلى", en: "To" }}>
            <select className="inp" value={to} onChange={(e) => setTo(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {lang === "ar" ? c.ar : c.en}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          🔁 {t({ ar: "تبديل", en: "Swap" })}
        </button>
        <button
          type="button"
          className="btn btn-soft"
          onClick={() => {
            setLoading(true);
            fetchRates().then((s) => {
              setSnap(s);
              setLoading(false);
            });
          }}
        >
          🔄 {t({ ar: "تحديث الأسعار", en: "Refresh rates" })}
        </button>
        {loading ? (
          <span className="pill bg-slate-100 text-slate-500">
            {t({ ar: "جارٍ التحديث…", en: "Updating…" })}
          </span>
        ) : snap?.source === "live" ? (
          <span className="pill bg-emerald-50 text-emerald-700">
            ● {t({ ar: "أسعار مباشرة", en: "Live rates" })}
            {snap.timestamp
              ? " · " + new Date(snap.timestamp).toLocaleDateString(lang === "ar" ? "ar" : "en")
              : ""}
          </span>
        ) : (
          <span className="pill bg-amber-50 text-amber-700">
            ● {t({ ar: "أسعار احتياطية (بدون إنترنت)", en: "Fallback rates (offline)" })}
          </span>
        )}
      </div>

      <div className="mt-6">
        <Row>
          <Stat
            accent
            label={{ ar: "النتيجة", en: "Result" }}
            value={
              value === null
                ? "—"
                : `${formatNum(value, 2)} {curName(to)}`
            }
          />
          <Stat
            label={{ ar: "سعر الصرف", en: "Exchange rate" }}
            value={rate ? `1 {from} = {formatNum(rate, 6)} {to}` : "—"}
          />
        </Row>
      </div>

      <div className="mt-6">
        <Note>
          {t({
            ar: "تُحدَّث الأسعار تلقائيًا من مزوّد أسعار الصرف العالمية، وإذا تعذّر الاتصال تعمل الأداة بجدول أسعار احتياطي داخل المتصفح.",
            en: "Rates are fetched live from a global exchange-rate provider; if the network is unavailable, a bundled fallback table keeps the tool working.",
          })}
        </Note>
      </div>
    </Card>
  );
}
