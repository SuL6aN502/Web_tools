"use client";

import React, { useRef, useState } from "react";
import { useLang, type L10n } from "@/lib/i18n";
import { copyText } from "@/lib/format";

type Label = L10n | string;

function asText(label: Label, t: (s: L10n) => string): string {
  return typeof label === "string" ? label : t(label);
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={"card p-5 sm:p-6 " + className}>{children}</div>;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: Label;
  hint?: Label;
  children: React.ReactNode;
}) {
  const { t } = useLang();
  return (
    <label className="block">
      <span className="label">{asText(label, t)}</span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs text-slate-500">{asText(hint, t)}</span>
      ) : null}
    </label>
  );
}

export function Stat({
  label,
  value,
  accent = false,
}: {
  label: Label;
  value: React.ReactNode;
  accent?: boolean;
}) {
  const { t } = useLang();
  return (
    <div
      className={
        "rounded-2xl border p-4 " +
        (accent
          ? "border-indigo-200 bg-indigo-50"
          : "border-slate-200 bg-slate-50")
      }
    >
      <div className="text-xs font-semibold text-slate-500">{asText(label, t)}</div>
      <div
        className={
          "mt-1 text-xl font-bold " + (accent ? "text-indigo-700" : "text-slate-900")
        }
      >
        {value}
      </div>
    </div>
  );
}

export function CopyBtn({ text, label }: { text: string; label?: L10n }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={async () => {
        const ok = await copyText(text);
        if (ok) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
    >
      {done
        ? t({ ar: "تم النسخ ✓", en: "Copied ✓" })
        : label
          ? t(label)
          : t({ ar: "نسخ", en: "Copy" })}
    </button>
  );
}

export function DownloadBtn({
  text,
  label,
  onClick,
  disabled,
}: {
  text?: string;
  label?: L10n;
  onClick: () => void;
  disabled?: boolean;
}) {
  const { t } = useLang();
  return (
    <button type="button" className="btn btn-primary" onClick={onClick} disabled={disabled}>
      <span>⬇️</span>
      {label ? t(label) : t({ ar: "تنزيل", en: "Download" })}
    </button>
  );
}

export function Note({
  children,
  tone = "info",
}: {
  children: React.ReactNode;
  tone?: "info" | "warn" | "ok";
}) {
  const cls =
    tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : tone === "ok"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-sky-200 bg-sky-50 text-sky-800";
  return (
    <div className={"rounded-xl border px-4 py-3 text-sm leading-6 " + cls}>
      {children}
    </div>
  );
}

export function FilePicker({
  accept,
  multiple = false,
  onFiles,
  label,
}: {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: L10n;
}) {
  const { t } = useLang();
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(files);
      }}
      className={
        "cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition " +
        (drag
          ? "border-indigo-500 bg-indigo-50"
          : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50")
      }
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      <div className="text-3xl">📁</div>
      <div className="mt-2 font-semibold text-slate-800">
        {label
          ? t(label)
          : t({
              ar: "اسحب الملفات هنا أو انقر للاختيار",
              en: "Drag & drop files here or click to browse",
            })}
      </div>
      {accept ? <div className="mt-1 text-xs text-slate-500">{accept}</div> : null}
    </div>
  );
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  label?: Label;
}) {
  const { t } = useLang();
  return (
    <div>
      {label ? <span className="label">{asText(label, t)}</span> : null}
      <input
        type="range"
        className="w-full accent-indigo-600"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: Label;
}) {
  const { t } = useLang();
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{asText(label, t)}</span>
    </label>
  );
}

export function Row({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const cls =
    cols === 3
      ? "grid gap-4 sm:grid-cols-3"
      : cols === 4
        ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        : "grid gap-4 sm:grid-cols-2";
  return <div className={cls}>{children}</div>;
}

export function ToolTitle({ children, sub }: { children: React.ReactNode; sub?: Label }) {
  const { t } = useLang();
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-slate-900">{children}</h2>
      {sub ? <p className="mt-1 text-sm text-slate-500">{asText(sub, t)}</p> : null}
    </div>
  );
}
