"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { imagesToPdf, type ImageInput } from "@/lib/pdf";
import { fileToCanvas } from "@/lib/image";
import { formatBytes } from "@/lib/format";
import { u8ToBlob } from "@/lib/client";
import { Card, FilePicker, DownloadBtn, Field, Note, ToolTitle } from "@/components/ui";

interface Item {
  id: number;
  file: File;
}

export default function ImagesToPdf() {
  const { t } = useLang();
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<"fit" | "a4">("a4");
  const [margin, setMargin] = useState(20);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function add(files: File[]) {
    const imgs = files.filter((f) => f.type === "image/jpeg" || f.type === "image/png");
    let id = Date.now();
    setItems((prev) => [...prev, ...imgs.map((file) => ({ id: id++, file }))]);
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next;
    });
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  async function run() {
    setBusy(true);
    setErr("");
    try {
      const inputs: ImageInput[] = [];
      for (const it of items) {
        const loaded = await fileToCanvas(it.file);
        inputs.push({
          bytes: new Uint8Array(await it.file.arrayBuffer()),
          kind: it.file.type === "image/png" ? "png" : "jpg",
          width: loaded.width,
          height: loaded.height,
        });
        loaded.close();
      }
      const bytes = await imagesToPdf(inputs, { mode, margin });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(u8ToBlob(bytes, "application/pdf"));
      a.download = "images.pdf";
      a.click();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <ToolTitle sub={{ ar: "حوّل صور JPG و PNG إلى ملف PDF واحد مرتّب.", en: "Turn JPG and PNG images into one organized PDF." }}>
        {t({ ar: "تحويل الصور إلى PDF", en: "Images to PDF" })}
      </ToolTitle>

      <FilePicker
        accept="image/jpeg,image/png"
        multiple
        onFiles={add}
        label={{ ar: "اسحب الصور أو انقر للاختيار (JPG / PNG)", en: "Drag images here or click to browse (JPG / PNG)" }}
      />

      {items.length ? (
        <ul className="mt-4 space-y-2">
          {items.map((it, i) => (
            <li key={it.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="w-7 text-center text-sm font-bold text-slate-400">{i + 1}</span>
              <span className="flex-1 truncate text-sm text-slate-700">{it.file.name}</span>
              <span className="text-xs text-slate-400">{formatBytes(it.file.size)}</span>
              <button type="button" className="btn btn-outline px-2 py-1" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="btn btn-outline px-2 py-1" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
              <button type="button" className="btn btn-outline px-2 py-1" onClick={() => remove(it.id)}>✕</button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label={{ ar: "حجم الصفحة", en: "Page size" }}>
          <select className="inp" value={mode} onChange={(e) => setMode(e.target.value as "fit" | "a4")}>
            <option value="a4">A4</option>
            <option value="fit">{t({ ar: "حسب حجم الصورة", en: "Fit to image" })}</option>
          </select>
        </Field>
        <Field label={{ ar: "الهامش (نقاط)", en: "Margin (pt)" }}>
          <input
            type="number"
            className="inp"
            min={0}
            max={100}
            value={margin}
            onChange={(e) => setMargin(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
          />
        </Field>
      </div>

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <DownloadBtn
          label={{ ar: busy ? "جارٍ التحويل…" : "تحويل وتنزيل PDF", en: busy ? "Converting…" : "Convert & download PDF" }}
          onClick={run}
          disabled={!items.length || busy}
        />
      </div>
    </Card>
  );
}
