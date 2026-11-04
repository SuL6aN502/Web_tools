"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { qrToPngDataUrl, qrToSvg, buildWifiString, type WifiInfo } from "@/lib/qr";
import { Card, Field, Checkbox, DownloadBtn, CopyBtn, Note } from "@/components/ui";

type Mode = "text" | "url" | "wifi";

export default function QrGenerator() {
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [ssid, setSsid] = useState("");
  const [pass, setPass] = useState("");
  const [enc, setEnc] = useState<WifiInfo["encryption"]>("WPA");
  const [hidden, setHidden] = useState(false);
  const [size, setSize] = useState(320);
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");
  const [err, setErr] = useState("");

  const payload =
    mode === "text"
      ? text
      : mode === "url"
        ? url
        : buildWifiString({ ssid, password: pass, encryption: enc, hidden });

  useEffect(() => {
    let alive = true;
    const value = payload.trim();
    if (!value) {
      setPng("");
      setSvg("");
      setErr("");
      return;
    }
    Promise.all([qrToPngDataUrl(value, { size }), qrToSvg(value, { size })])
      .then((pair) => {
        if (!alive) return;
        setPng(pair[0]);
        setSvg(pair[1]);
        setErr("");
      })
      .catch((e) => {
        if (alive) setErr(String(e));
      });
    return () => {
      alive = false;
    };
  }, [payload, size]);

  function downloadPng() {
    const a = document.createElement("a");
    a.href = png;
    a.download = "qr-code.png";
    a.click();
  }

  function downloadSvg() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = link;
    a.download = "qr-code.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(link), 2000);
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap gap-2">
        {([
          ["text", { ar: "نص", en: "Text" }],
          ["url", { ar: "رابط", en: "URL" }],
          ["wifi", { ar: "شبكة Wi-Fi", en: "Wi-Fi" }],
        ] as const).map(([m, lbl]) => (
          <button
            key={m}
            type="button"
            className={"btn " + (mode === m ? "btn-primary" : "btn-outline")}
            onClick={() => setMode(m)}
          >
            {t(lbl)}
          </button>
        ))}
      </div>

      {mode === "text" ? (
        <Field label={{ ar: "النص", en: "Text" }}>
          <textarea
            className="inp min-h-[110px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t({ ar: "اكتب أي نص…", en: "Type any text…" })}
          />
        </Field>
      ) : null}

      {mode === "url" ? (
        <Field label={{ ar: "الرابط", en: "URL" }}>
          <input
            className="inp"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </Field>
      ) : null}

      {mode === "wifi" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={{ ar: "اسم الشبكة (SSID)", en: "Network name (SSID)" }}>
            <input className="inp" value={ssid} onChange={(e) => setSsid(e.target.value)} />
          </Field>
          <Field label={{ ar: "كلمة المرور", en: "Password" }}>
            <input className="inp" value={pass} onChange={(e) => setPass(e.target.value)} />
          </Field>
          <Field label={{ ar: "نوع التشفير", en: "Encryption" }}>
            <select
              className="inp"
              value={enc}
              onChange={(e) => setEnc(e.target.value as WifiInfo["encryption"])}
            >
              <option value="WPA">WPA/WPA2/WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">{t({ ar: "بدون كلمة مرور", en: "No password" })}</option>
            </select>
          </Field>
          <div className="flex items-end pb-2">
            <Checkbox
              checked={hidden}
              onChange={setHidden}
              label={{ ar: "شبكة مخفية", en: "Hidden network" }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Field label={{ ar: "الحجم (بكسل)", en: "Size (px)" }}>
          <select className="inp" value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value={240}>240</option>
            <option value={320}>320</option>
            <option value={480}>480</option>
            <option value={640}>640</option>
            <option value={1024}>1024</option>
          </select>
        </Field>
        <span className="pill ms-auto bg-slate-100 text-slate-600">
          {t({ ar: "توليد محلي 100%", en: "100% local generation" })}
        </span>
      </div>

      {err ? (
        <div className="mt-4">
          <Note tone="warn">{err}</Note>
        </div>
      ) : null}

      {png ? (
        <div className="mt-6 text-center">
          <img
            src={png}
            alt="QR"
            className="mx-auto rounded-2xl border border-slate-200 bg-white p-3"
          />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <DownloadBtn label={{ ar: "تنزيل PNG", en: "Download PNG" }} onClick={downloadPng} />
            <DownloadBtn label={{ ar: "تنزيل SVG", en: "Download SVG" }} onClick={downloadSvg} />
            <CopyBtn text={payload} label={{ ar: "نسخ المحتوى", en: "Copy content" }} />
          </div>
        </div>
      ) : null}
    </Card>
  );
}
