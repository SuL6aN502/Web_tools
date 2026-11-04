"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { compressPdfRaster } from "@/lib/pdf";
import { formatBytes } from "@/lib/format";
import { u8ToBlob, withSuffix } from "@/lib/client";
import { Card, FilePicker, DownloadBtn, Slider, Note, ToolTitle, Stat, Row } from "@/components/ui";

export default function PdfCompress() {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(1.3);
  const [quality, setQuality] = useState(0.72);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [beforeSize, setBeforeSize] = useState(0);
  const [afterSize, setAfterSize] = useState(0);
  const [pages, setPages] = useState(0);

  async function pick(files: File[]) {
    const f = files[0];
    setFile(f);
    setErr("");
    setBeforeSize(f.size);
    setAfterSize(0);
    setPages(0);
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const { bytes, pageCount } = await compressPdfRaster(await file.arrayBuffer(), {
        scale,
        quality,
      });
      setPages(pageCount);
      setAfterSize(bytes.byteLength);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(u8ToBlob(bytes, "application/pdf"));
      a.download = withSuffix(file.name, "-compressed", "pdf");
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
      <ToolTitle sub={{ ar: "يعمل بشكل ممتاز مع الملفات الممسوحة ضوئيًا والصور — يعيد بناء الصفحات كصور JPEG محسّنة.", en: "Works best on scans and image-heavy files — rebuilds pages as optimized JPEGs." }}>
        {t({ ar: "ضغط ملف PDF", en: "Compress PDF file" })}
      </ToolTitle>

      <FilePicker
        accept=".pdf,application/pdf"
        onFiles={pick}
        label={{ ar: "اختر ملف PDF", en: "Choose a PDF file" }}
      />

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Slider
          label={{ ar: "دقة التصيير: " + scale.toFixed(1) + "x", en: "Render scale: " + scale.toFixed(1) + "x" }}
          value={scale}
          min={0.7}
          max={2}
          step={0.1}
          onChange={setScale}
        />
        <Slider
          label={{ ar: "الجودة: " + String(Math.round(quality * 100)) + "%", en: "Quality: " + String(Math.round(quality * 100)) + "%" }}
          value={quality}
          min={0.3}
          max={0.95}
          step={0.05}
          onChange={setQuality}
        />
      </div>

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      {afterSize ? (
        <div className="mt-5">
          <Row cols={3}>
            <Stat label={{ ar: "قبل", en: "Before" }} value={formatBytes(beforeSize)} />
            <Stat accent label={{ ar: "بعد", en: "After" }} value={formatBytes(afterSize)} />
            <Stat
              label={{ ar: "التوفير", en: "Saved" }}
              value={pct > 0 ? formatBytes(saved) + " (" + String(pct) + "%)" : t({ ar: "لا يوجد توفير — جرّب جودة أقل", en: "no saving — try lower quality" })}
            />
          </Row>
          {pages ? <div className="mt-2 text-xs text-slate-500">{String(pages) + t({ ar: " صفحة تمت معالجتها", en: " pages processed" })}</div> : null}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <DownloadBtn
          label={{ ar: busy ? "جارٍ الضغط…" : "ضغط وتنزيل", en: busy ? "Compressing…" : "Compress & download" }}
          onClick={run}
          disabled={!file || busy}
        />
        <span className="pill ms-auto bg-slate-100 text-slate-600">
          {t({ ar: "بدون رفع الملفات", en: "No uploads" })}
        </span>
      </div>
    </Card>
  );
}
