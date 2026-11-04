"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { transformImage, fileToCanvas, type OutFormat } from "@/lib/image";
import { formatBytes } from "@/lib/format";
import { withSuffix, extOf } from "@/lib/client";
import { Card, FilePicker, DownloadBtn, Slider, Note, ToolTitle, Stat, Row } from "@/components/ui";

export default function ImageCompress() {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutFormat>("image/jpeg");
  const [quality, setQuality] = useState(0.75);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [beforeSize, setBeforeSize] = useState(0);
  const [afterSize, setAfterSize] = useState(0);

  async function pick(files: File[]) {
    const f = files[0];
    setFile(f);
    setErr("");
    setBeforeSize(f.size);
    setAfterSize(0);
    const lower = f.type.toLowerCase();
    if (lower === "image/png") setFormat("image/png");
    else if (lower === "image/webp") setFormat("image/webp");
    else setFormat("image/jpeg");
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const loaded = await fileToCanvas(file);
      const blob = await transformImage(file, {
        format,
        quality,
        width: loaded.width,
        height: loaded.height,
      });
      loaded.close();
      setAfterSize(blob.size);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = withSuffix(file.name, "-compressed", extOf(format));
      a.click();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  const saved = beforeSize && afterSize ? beforeSize - afterSize : 0;
  const pct = beforeSize && afterSize ? Math.round((saved / beforeSize) * 100) : 0;

  return (
    <Card>
      <ToolTitle sub={{ ar: "قلّل حجم الصورة مع التحكم بالجودة — بدون رفعها لأي خادم.", en: "Reduce image size with quality control — no server uploads." }}>
        {t({ ar: "ضغط الصور", en: "Compress image" })}
      </ToolTitle>

      <FilePicker
        accept="image/*"
        onFiles={pick}
        label={{ ar: "اختر صورة", en: "Choose an image" }}
      />

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <span className="label">{t({ ar: "صيغة الإخراج", en: "Output format" })}</span>
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
        <Slider
          label={{ ar: "الجودة: " + String(Math.round(quality * 100)) + "%", en: "Quality: " + String(Math.round(quality * 100)) + "%" }}
          value={quality}
          min={0.1}
          max={1}
          step={0.05}
          onChange={setQuality}
        />
      </div>

      {format === "image/png" ? (
        <div className="mt-3">
          <Note>{t({ ar: "ملفات PNG لا تتأثر بدرجة الجودة — استخدم JPG أو WebP لأحجام أصغر.", en: "PNG ignores the quality slider — use JPG or WebP for smaller files." })}</Note>
        </div>
      ) : null}

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      {afterSize ? (
        <div className="mt-5">
          <Row cols={3}>
            <Stat label={{ ar: "قبل", en: "Before" }} value={formatBytes(beforeSize)} />
            <Stat accent label={{ ar: "بعد", en: "After" }} value={formatBytes(afterSize)} />
            <Stat
              label={{ ar: "التوفير", en: "Saved" }}
              value={pct > 0 ? formatBytes(saved) + " (" + String(pct) + "%)" : t({ ar: "لا يوجد توفير", en: "no saving" })}
            />
          </Row>
        </div>
      ) : null}

      <div className="mt-5">
        <DownloadBtn
          label={{ ar: busy ? "جارٍ الضغط…" : "ضغط وتنزيل", en: busy ? "Compressing…" : "Compress & download" }}
          onClick={run}
          disabled={!file || busy}
        />
      </div>
    </Card>
  );
}
