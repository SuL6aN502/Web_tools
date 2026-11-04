"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { pdfToText } from "@/lib/pdf";
import { Card, FilePicker, CopyBtn, DownloadBtn, Note, ToolTitle, Stat, Row } from "@/components/ui";

export default function PdfToText() {
  const { t } = useLang();
  const [text, setText] = useState("");
  const [pages, setPages] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(files: File[]) {
    const f = files[0];
    setBusy(true);
    setErr("");
    setText("");
    setPages(0);
    try {
      const res = await pdfToText(await f.arrayBuffer());
      setText(res.text);
      setPages(res.pageCount);
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pdf-text.txt";
    a.click();
  }

  return (
    <Card>
      <ToolTitle sub={{ ar: "استخرج النص من ملف PDF بضغطة واحدة — بدون رفع الملف.", en: "Extract text from a PDF in one click — no uploading." }}>
        {t({ ar: "استخراج النص من PDF", en: "PDF to text" })}
      </ToolTitle>

      <FilePicker
        accept=".pdf,application/pdf"
        onFiles={pick}
        label={{ ar: busy ? "جارٍ الاستخراج…" : "اختر ملف PDF", en: busy ? "Extracting…" : "Choose a PDF file" }}
      />

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      {text ? (
        <>
          <div className="mt-4">
            <Row>
              <Stat accent label={{ ar: "الصفحات", en: "Pages" }} value={String(pages)} />
              <Stat label={{ ar: "الأحرف", en: "Characters" }} value={String(text.length)} />
            </Row>
          </div>
          <textarea className="inp mt-4 min-h-[300px] font-mono text-sm" readOnly value={text} />
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyBtn text={text} label={{ ar: "نسخ النص", en: "Copy text" }} />
            <DownloadBtn label={{ ar: "تنزيل TXT", en: "Download TXT" }} onClick={download} />
          </div>
        </>
      ) : null}
    </Card>
  );
}
