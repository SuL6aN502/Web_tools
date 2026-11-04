"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Card, Field, Note, Row, Stat } from "@/components/ui";

const FALLBACK_ZONES = [
  "UTC", "Asia/Riyadh", "Asia/Dubai", "Asia/Kuwait", "Asia/Qatar", "Asia/Muscat",
  "Asia/Baghdad", "Asia/Amman", "Asia/Beirut", "Asia/Damascus", "Asia/Aden",
  "Africa/Cairo", "Africa/Casablanca", "Africa/Algiers", "Africa/Tunis",
  "Europe/London", "Europe/Istanbul", "Europe/Berlin", "Europe/Paris",
  "America/New_York", "America/Chicago", "America/Los_Angeles", "America/Toronto",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney",
];

function zoneList(): string[] {
  try {
    const supported = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] })
      .supportedValuesOf;
    if (typeof supported === "function") {
      const zones = supported("timeZone");
      if (Array.isArray(zones) && zones.length > 0) return zones;
    }
  } catch {
    /* fall through */
  }
  return FALLBACK_ZONES;
}

/** Wall-clock time in a zone -> UTC instant. */
function zonedToUtc(dateStr: string, timeStr: string, zone: string): Date | null {
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const tm = timeStr.match(/^(\d{2}):(\d{2})/);
  if (!m || !tm) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const [h, mi] = [Number(tm[1]), Number(tm[2])];
  const guess = Date.UTC(y, mo - 1, d, h, mi, 0);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = fmt.formatToParts(new Date(guess));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second")
  );
  return new Date(guess - (asUtc - guess));
}

function formatInZone(instant: Date, zone: string, lang: string): string {
  try {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en-GB", {
      timeZone: zone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(instant);
  } catch {
    return instant.toISOString();
  }
}

export default function TimeZoneConverter() {
  const { t, lang } = useLang();
  const zones = useMemo(() => zoneList(), []);
  const now = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    };
  }, []);

  const [date, setDate] = useState(now.date);
  const [time, setTime] = useState(now.time);
  const [fromZone, setFromZone] = useState(
    zones.includes("Asia/Riyadh") ? "Asia/Riyadh" : zones[0]
  );
  const [toZone, setToZone] = useState(
    zones.includes("America/New_York") ? "America/New_York" : zones[1] ?? zones[0]
  );

  const instant = zonedToUtc(date, time, fromZone);

  return (
    <Card>
      <Row cols={2}>
        <Field label={{ ar: "التاريخ", en: "Date" }}>
          <input className="inp" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label={{ ar: "الوقت (في المنطقة الأولى)", en: "Time (in first zone)" }}>
          <input className="inp" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
      </Row>

      <div className="mt-4">
        <Row>
          <Field label={{ ar: "من منطقة زمنية", en: "From time zone" }}>
            <select className="inp" value={fromZone} onChange={(e) => setFromZone(e.target.value)}>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </Field>
          <Field label={{ ar: "إلى منطقة زمنية", en: "To time zone" }}>
            <select className="inp" value={toZone} onChange={(e) => setToZone(e.target.value)}>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </Field>
        </Row>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="btn btn-soft"
          onClick={() => {
            const d = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            setDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
            setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
          }}
        >
          🕒 {t({ ar: "استخدام الوقت الحالي", en: "Use current time" })}
        </button>
      </div>

      <div className="mt-6">
        <Row>
          <Stat
            label={{ ar: "الوقت في المنطقة الأولى", en: "Time in first zone" }}
            value={instant ? formatInZone(instant, fromZone, lang) : "—"}
          />
          <Stat
            accent
            label={{ ar: "الوقت في المنطقة الثانية", en: "Time in second zone" }}
            value={instant ? formatInZone(instant, toZone, lang) : "—"}
          />
        </Row>
      </div>

      <div className="mt-6">
        <Note>
          {t({
            ar: "تُحسب التحويلات فورًا مع مراعاة التوقيت الصيفي لكل منطقة. مثالية لتنسيق الاجتماعات الدولية والمواعيد مع الأصدقاء حول العالم.",
            en: "Conversions account for each zone's daylight saving rules. Perfect for scheduling international meetings and calls.",
          })}
        </Note>
      </div>
    </Card>
  );
}
