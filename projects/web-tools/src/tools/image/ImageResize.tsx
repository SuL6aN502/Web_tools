"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { fileToCanvas, transformImage, computeTargetSize, type OutFormat } from "@/lib/image";
import { withSuffix, extOf } from "@/lib/client";
import { Card, FilePicker, DownloadBtn, Checkbox, Field, Note, ToolTitle, Stat, Row } from "@/components/ui";

export default function ImageResize() {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [srcW, setSrcW] = useState(0);
  const [srcH, setSrcH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [percent, setPercent] = useState(50);
  const [mode, setMode] = useState<"percent" | "exact">("percent");
  const [lock, setLock] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(files: File[]) {
    const f = files[0];
    setFile(f);
    setErr("");
    try {
      const loaded = await fileToCanvas(f);
      setSrcW(loaded.width);
      setSrcH(loaded.height);
      setWidth(loaded.width);
      setHeight(loaded.height);
      loaded.close();
    } catch (e) {
      setErr(String(e));
    }
  }

  const target = srcW
    ? computeTargetSize(srcW, srcH, {
        width: mode === "exact" ? width : undefined,
        height: mode === "exact" ? height : undefined,
        percent: mode === "percent" ? percent : undefined,
        lockAspect: lock,
      })
    : null;

  async function run() {
    if (!file || !target) return;
    setBusy(true);
    setErr("");
    try {
      const fmt: OutFormat = file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      const blob = await transformImage(file, {
        format: fmt,
        quality: 0.92,
        width: target.width,
        height: target.height,
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = withSuffix(file.name, "-resized", extOf(fmt));
      a.click();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <ToolTitle sub={{ ar: "غيّر أبعاد الصورة بالنسبة المئوية أو بمقاس محدد مع حفظ النسبة.", en: "Resize by percentage or exact dimensions with aspect-ratio lock." }}>
        {t({ ar: "تغيير حجم الصورة", en: "Resize image" })}
      </ToolTitle>

      <FilePicker
        accept="image/*"
        onFiles={pick}
        label={{ ar: "اختر صورة", en: "Choose an image" }}
      />

      {srcW ? (
        <div className="mt-4">
          <Row cols={3}>
            <Stat label={{ ar: "الأبعاد الأصلية", en: "Original size" }} value={String(srcW) + " × " + String(srcH)} />
            <Stat accent label={{ ar: "الأبعاد الناتجة", en: "New size" }} value={target ? String(target.width) + " × " + String(target.height) : "—"} />
            <Stat label={{ ar: "النسبة", en: "Scale" }} value={target ? Math.round((target.width / srcW) * 100) + "%" : "—"} />
          </Row>
        </div>
      ) : null}

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {([
            ["percent", { ar: "نسبة مئوية", en: "Percentage" }],
            ["exact", { ar: "مقاس محدد", en: "Exact size" }],
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
      </div>

      {mode === "percent" ? (
        <div className="mt-4">
          <input
            type="number"
            className="inp w-40"
            min={1}
            max={400}
            value={percent}
            onChange={(e) => setPercent(Math.max(1, Math.min(400, Number(e.target.value) || 1)))}
          />
          <span className="ms-2 text-sm text-slate-500">%</span>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label={{ ar: "العرض (بكسل)", en: "Width (px)" }}>
            <input type="number" className="inp" value={width} onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))} />
          </Field>
          <Field label={{ ar: "الارتفاع (بكسل)", en: "Height (px)" }}>
            <input type="number" className="inp" value={height} onChange={(e) => setHeight(Math.max(1, Number(e.target.value) || 1))} />
          </Field>
          <div>
            <Checkbox checked={lock} onChange={setLock} label={{ ar: "تثبيت النسبة بين العرض والارتفاع", en: "Lock aspect ratio" }} />
          </div>
        </div>
      )}

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      <div className="mt-5">
        <DownloadBtn
          label={{ ar: busy ? "جارٍ التغيير…" : "تغيير الحجم وتنزيل", en: busy ? "Resizing…" : "Resize & download" }}
          onClick={run}
          disabled={!file || busy}
        />
      </div>
    </Card>
  );
}
