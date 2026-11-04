"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { mergePdfs } from "@/lib/pdf";
import { formatBytes } from "@/lib/format";
import { u8ToBlob, withSuffix } from "@/lib/client";
import { Card, FilePicker, DownloadBtn, Note, ToolTitle } from "@/components/ui";

interface Item {
  id: number;
  file: File;
}

export default function PdfMerge() {
  const { t } = useLang();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function add(files: File[]) {
    const pdfs = files.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    let id = Date.now();
    setItems((prev) => [...prev, ...pdfs.map((file) => ({ id: id++, file }))]);
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
      const buffers: ArrayBuffer[] = [];
      for (const it of items) buffers.push(await it.file.arrayBuffer());
      const bytes = await mergePdfs(buffers);
      const name = items.length ? withSuffix(items[0].file.name, "-merged", "pdf") : "merged.pdf";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(u8ToBlob(bytes, "application/pdf"));
      a.download = name;
      a.click();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <ToolTitle sub={{ ar: "الملفات تُدمج بالترتيب الظاهر — استخدم الأسهم لإعادة الترتيب.", en: "Files are merged in the order shown — use the arrows to reorder." }}>
        {t({ ar: "دمج ملفات PDF", en: "Merge PDF files" })}
      </ToolTitle>

      <FilePicker
        accept=".pdf,application/pdf"
        multiple
        onFiles={add}
        label={{ ar: "اسحب ملفات PDF أو انقر للاختيار", en: "Drag PDF files here or click to browse" }}
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

      {err ? <div className="mt-4"><Note tone="warn">{err}</Note></div> : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <DownloadBtn
          label={{ ar: busy ? "جارٍ الدمج…" : "دمج وتنزيل", en: busy ? "Merging…" : "Merge & download" }}
          onClick={run}
          disabled={items.length < 2 || busy}
        />
        <span className="pill ms-auto bg-slate-100 text-slate-600">
          {t({ ar: "المعالجة داخل متصفحك — الملفات لا تُرفع", en: "Processed in your browser — files never leave your device" })}
        </span>
      </div>
    </Card>
  );
}
