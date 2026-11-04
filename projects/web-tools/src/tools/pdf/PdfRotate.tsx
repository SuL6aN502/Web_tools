"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { rotatePdf, parseRanges } from "@/lib/pdf";
import { loadPdfDocument } from "@/lib/pdfjs";
import { u8ToBlob, withSuffix } from "@/lib/client";
import { Card, FilePicker, Field, DownloadBtn, Note, ToolTitle, Stat, Row } from "@/components/ui";

export default function PdfRotate() {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [deg, setDeg] = useState<90 | 180 | 270>(90);
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(files: File[]) {
    const f = files[0];
    setFile(f);
    setErr("");
    setPageCount(0);
    try {
      const doc = await loadPdfDocument(await f.arrayBuffer());
      setPageCount(doc.numPages);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const parsed = ranges.trim() ? parseRanges(ranges, pageCount) : undefined;
      const bytes = await rotatePdf(await file.arrayBuffer(), deg, parsed);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(u8ToBlob(bytes, "application/pdf"));
      a.download = withSuffix(file.name, "-rotated", "pdf");
      a.click();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <ToolTitle sub={{ ar: "دوّر كل الصفحات أو صفحات محددة بزاوية 90 أو 180 أو 270 درجة.", en: "Rotate all pages or a selection by 90, 180 or 270 degrees." }}>
        {t({ ar: "تدوير صفحات PDF", en: "Rotate PDF pages" })}
      </ToolTitle>

      <FilePicker
        accept=".pdf,application/pdf"
        onFiles={pick}
        label={{ ar: "اختر ملف PDF", en: "Choose a PDF file" }}
      />

      {file ? (
        <div className="mt-4">
          <Row>
            <Stat label={{ ar: "الملف", en: "File" }} value={file.name} />
            <Stat accent label={{ ar: "عدد الصفحات", en: "Pages" }} value={String(pageCount)} />
          </Row>
        </div>
      ) : null}

      <div className="mt-4">
        <span className="label">{t({ ar: "الزاوية", en: "Angle" })}</span>
        <div className="flex flex-wrap gap-2">
          {([90, 180, 270] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={"btn " + (deg === d ? "btn-primary" : "btn-outline")}
              onClick={() => setDeg(d)}
            >
              {String(d) + "°"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Field
          label={{ ar: "صفحات محددة (اختياري)", en: "Specific pages (optional)" }}
          hint={{ ar: "مثال: 1-3, 5 — اتركه فارغًا لتدوير كل الصفحات", en: "e.g. 1-3, 5 — leave empty for all pages" }}
        >
          <input className="inp" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5" />
        </Field>
      </div>

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      <div className="mt-5">
        <DownloadBtn
          label={{ ar: busy ? "جارٍ التدوير…" : "تدوير وتنزيل", en: busy ? "Rotating…" : "Rotate & download" }}
          onClick={run}
          disabled={!file || busy}
        />
      </div>
    </Card>
  );
}
