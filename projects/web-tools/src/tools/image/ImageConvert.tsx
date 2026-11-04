"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { transformImage, type OutFormat } from "@/lib/image";
import { withSuffix, extOf } from "@/lib/client";
import { Card, FilePicker, DownloadBtn, Slider, Note, ToolTitle } from "@/components/ui";

export default function ImageConvert() {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutFormat>("image/webp");
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function pick(files: File[]) {
    setFile(files[0]);
    setErr("");
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const blob = await transformImage(file, { format, quality });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = withSuffix(file.name, "", extOf(format));
      a.click();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <ToolTitle sub={{ ar: "حوّل بين JPG و PNG و WebP بجودة عالية.", en: "Convert between JPG, PNG and WebP in high quality." }}>
        {t({ ar: "تحويل صيغة الصورة", en: "Convert image format" })}
      </ToolTitle>

      <FilePicker
        accept="image/*"
        onFiles={pick}
        label={{ ar: "اختر صورة", en: "Choose an image" }}
      />

      {file ? (
        <div className="mt-3 text-sm text-slate-600">
          {t({ ar: "الملف: ", en: "File: " }) + file.name + " (" + file.type + ")"}
        </div>
      ) : null}

      <div className="mt-5">
        <span className="label">{t({ ar: "الصيغة المطلوبة", en: "Target format" })}</span>
        <div className="flex flex-wrap gap-2">
          {([
            ["image/jpeg", "JPG"],
            ["image/png", "PNG"],
            ["image/webp", "WebP"],
          ] as const).map(([f, lbl]) => (
            <button
              key={f}
              type="button"
              className={"btn " + (format === f ? "btn-primary" : "btn-outline")}
              onClick={() => setFormat(f)}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {format !== "image/png" ? (
        <div className="mt-5">
          <Slider
            label={{ ar: "الجودة: " + String(Math.round(quality * 100)) + "%", en: "Quality: " + String(Math.round(quality * 100)) + "%" }}
            value={quality}
            min={0.3}
            max={1}
            step={0.05}
            onChange={setQuality}
          />
        </div>
      ) : null}

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      <div className="mt-5">
        <DownloadBtn
          label={{ ar: busy ? "جارٍ التحويل…" : "تحويل وتنزيل", en: busy ? "Converting…" : "Convert & download" }}
          onClick={run}
          disabled={!file || busy}
        />
      </div>
    </Card>
  );
}
