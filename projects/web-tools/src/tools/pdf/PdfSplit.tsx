"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { parseRanges, extractPages, splitIntoFiles } from "@/lib/pdf";
import { loadPdfDocument } from "@/lib/pdfjs";
import { u8ToBlob, withSuffix } from "@/lib/client";
import { Card, FilePicker, Field, DownloadBtn, Note, ToolTitle, Stat, Row } from "@/components/ui";

export default function PdfSplit() {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
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

  function triggerDownload(name: string, bytes: Uint8Array) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(u8ToBlob(bytes, "application/pdf"));
    a.download = name;
    a.click();
  }

  async function extract() {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const buf = await file.arrayBuffer();
      const parsed = parseRanges(ranges, pageCount);
      if (!parsed.length) {
        setErr(t({ ar: "حدد صفحات صالحة، مثال: 1-3, 5", en: "Enter valid pages, e.g. 1-3, 5" }));
        return;
      }
      const bytes = await extractPages(buf, parsed);
      triggerDownload(withSuffix(file.name, "-extracted", "pdf"), bytes);
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function splitAll() {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const buf = await file.arrayBuffer();
      const parsed = ranges.trim()
        ? parseRanges(ranges, pageCount)
        : Array.from({ length: pageCount }, (_, i) => [i + 1]);
      const files = await splitIntoFiles(buf, parsed);
      files.forEach((bytes, i) => {
        setTimeout(() => triggerDownload(withSuffix(file.name, "-part" + String(i + 1), "pdf"), bytes), i * 350);
      });
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <ToolTitle sub={{ ar: "استخرج صفحات محددة أو قسّم الملف إلى أجزاء منفصلة.", en: "Extract specific pages or split the file into separate parts." }}>
        {t({ ar: "تقسيم ملف PDF", en: "Split PDF file" })}
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
        <Field
          label={{ ar: "الصفحات المطلوبة", en: "Pages" }}
          hint={{ ar: "مثال: 1-3, 5, 8-10 — اتركه فارغًا لتقسيم كل صفحة لوحدها", en: "e.g. 1-3, 5, 8-10 — leave empty to split every page" }}
        >
          <input
            className="inp"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="1-3, 5"
          />
        </Field>
      </div>

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <DownloadBtn
          label={{ ar: busy ? "جارٍ التنفيذ…" : "استخراج الصفحات كملف واحد", en: busy ? "Working…" : "Extract as one PDF" }}
          onClick={extract}
          disabled={!file || busy}
        />
        <DownloadBtn
          label={{ ar: "تقسيم إلى ملفات منفصلة", en: "Split into separate files" }}
          onClick={splitAll}
          disabled={!file || busy}
        />
      </div>
    </Card>
  );
}
