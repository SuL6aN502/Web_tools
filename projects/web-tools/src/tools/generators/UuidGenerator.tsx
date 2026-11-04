"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Card, Field, CopyBtn, DownloadBtn, Note } from "@/components/ui";

function makeUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) hex.push(bytes[i].toString(16).padStart(2, "0"));
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
}

export default function UuidGenerator() {
  const { t } = useLang();
  const [count, setCount] = useState(5);
  const [items, setItems] = useState<string[]>(() => {
    const out: string[] = [];
    for (let i = 0; i < 5; i++) out.push(makeUuid());
    return out;
  });

  function regenerate(n: number) {
    const out: string[] = [];
    for (let i = 0; i < n; i++) out.push(makeUuid());
    setItems(out);
  }

  const joined = items.join(String.fromCharCode(10));

  function download() {
    const blob = new Blob([joined], { type: "text/plain" });
    const link = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = link;
    a.download = "uuids.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(link), 2000);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-end gap-3">
        <Field label={{ ar: "عدد المعرّفات", en: "How many" }}>
          <input
            type="number"
            className="inp w-32"
            min={1}
            max={50}
            value={count}
            onChange={(e) => {
              const n = Math.max(1, Math.min(50, Number(e.target.value) || 1));
              setCount(n);
              regenerate(n);
            }}
          />
        </Field>
        <button type="button" className="btn btn-primary" onClick={() => regenerate(count)}>
          {t({ ar: "توليد جديد", en: "Generate" })}
        </button>
        <CopyBtn text={joined} label={{ ar: "نسخ الكل", en: "Copy all" }} />
        <DownloadBtn label={{ ar: "تنزيل TXT", en: "Download TXT" }} onClick={download} />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <ul className="space-y-2">
          {items.map((u) => (
            <li key={u} className="flex items-center gap-2">
              <code className="flex-1 select-all break-all rounded-lg bg-white px-3 py-2 text-sm text-slate-800 shadow-sm">
                {u}
              </code>
              <CopyBtn text={u} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <Note>{t({ ar: "توليد UUID v4 عشوائي وآمن محليًا داخل متصفحك.", en: "Secure random UUID v4 generated locally in your browser." })}</Note>
      </div>
    </Card>
  );
}
