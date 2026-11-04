"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { blobToDataUrl, transformImage } from "@/lib/image";
import { formatBytes } from "@/lib/format";
import { Card, FilePicker, CopyBtn, Field, Note, ToolTitle, Stat, Row } from "@/components/ui";

export default function ImageToBase64() {
  const { t } = useLang();
  const [dataUrl, setDataUrl] = useState("");
  const [raw, setRaw] = useState("");
  const [size, setSize] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(files: File[]) {
    const f = files[0];
    setBusy(true);
    setErr("");
    try {
      const blob = await transformImage(f, {
        format: f.type === "image/png" ? "image/png" : f.type === "image/webp" ? "image/webp" : "image/jpeg",
        quality: 0.92,
      });
      const url = await blobToDataUrl(blob);
      setDataUrl(url);
      const comma = url.indexOf(",");
      setRaw(comma >= 0 ? url.slice(comma + 1) : url);
      setSize(blob.size);
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <ToolTitle sub={{ ar: "حوّل الصورة إلى نص Base64 جاهز للاستخدام في الكود.", en: "Turn any image into Base64 text ready for your code." }}>
        {t({ ar: "تحويل الصورة إلى Base64", en: "Image to Base64" })}
      </ToolTitle>

      <FilePicker
        accept="image/*"
        onFiles={pick}
        label={{ ar: busy ? "جارٍ التحويل…" : "اختر صورة", en: busy ? "Converting…" : "Choose an image" }}
      />

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      {dataUrl ? (
        <>
          <div className="mt-4">
            <Row>
              <Stat accent label={{ ar: "حجم الصورة", en: "Image size" }} value={formatBytes(size)} />
              <Stat label={{ ar: "طول النص Base64", en: "Base64 length" }} value={String(dataUrl.length)} />
            </Row>
          </div>
          <div className="mt-4">
            <img src={dataUrl} alt="preview" className="mx-auto max-h-56 rounded-xl border border-slate-200" />
          </div>
          <div className="mt-4">
            <Field label={{ ar: "رابط البيانات الكامل (Data URL)", en: "Full data URL" }}>
              <textarea className="inp min-h-[110px] font-mono text-xs" readOnly value={dataUrl} />
            </Field>
          </div>
          <div className="mt-3">
            <Field label={{ ar: "Base64 فقط (بدون البادئة)", en: "Raw Base64 (without prefix)" }}>
              <textarea className="inp min-h-[110px] font-mono text-xs" readOnly value={raw} />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyBtn text={dataUrl} label={{ ar: "نسخ Data URL", en: "Copy data URL" }} />
            <CopyBtn text={raw} label={{ ar: "نسخ Base64", en: "Copy Base64" }} />
          </div>
        </>
      ) : null}
    </Card>
  );
}
