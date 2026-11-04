"use client";

import React, { Suspense } from "react";

const registry: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  "bmi-calculator": React.lazy(() => import("@/tools/calculators/BmiCalculator")),
  "gpa-calculator": React.lazy(() => import("@/tools/calculators/GpaCalculator")),
  "loan-calculator": React.lazy(() => import("@/tools/calculators/LoanCalculator")),
  "salary-calculator": React.lazy(() => import("@/tools/calculators/SalaryCalculator")),
  "zakat-calculator": React.lazy(() => import("@/tools/calculators/ZakatCalculator")),
  "car-installment-calculator": React.lazy(
    () => import("@/tools/calculators/CarInstallmentCalculator")
  ),
  "word-counter": React.lazy(() => import("@/tools/text/WordCounter")),
  "case-converter": React.lazy(() => import("@/tools/text/CaseConverter")),
  "text-cleaner": React.lazy(() => import("@/tools/text/TextCleaner")),
  "text-statistics": React.lazy(() => import("@/tools/text/TextStats")),
  "unit-converter": React.lazy(() => import("@/tools/converters/UnitConverter")),
  "currency-converter": React.lazy(() => import("@/tools/converters/CurrencyConverter")),
  "time-zone-converter": React.lazy(() => import("@/tools/converters/TimeZoneConverter")),
  "qr-code-generator": React.lazy(() => import("@/tools/generators/QrGenerator")),
  "password-generator": React.lazy(() => import("@/tools/generators/PasswordGenerator")),
  "uuid-generator": React.lazy(() => import("@/tools/generators/UuidGenerator")),
  "pdf-merge": React.lazy(() => import("@/tools/pdf/PdfMerge")),
  "pdf-split": React.lazy(() => import("@/tools/pdf/PdfSplit")),
  "pdf-compress": React.lazy(() => import("@/tools/pdf/PdfCompress")),
  "pdf-rotate": React.lazy(() => import("@/tools/pdf/PdfRotate")),
  "images-to-pdf": React.lazy(() => import("@/tools/pdf/ImagesToPdf")),
  "pdf-to-text": React.lazy(() => import("@/tools/pdf/PdfToText")),
  "pdf-to-word": React.lazy(() => import("@/tools/pdf/PdfToWord")),
  "image-compress": React.lazy(() => import("@/tools/image/ImageCompress")),
  "image-resize": React.lazy(() => import("@/tools/image/ImageResize")),
  "image-convert": React.lazy(() => import("@/tools/image/ImageConvert")),
  "image-to-base64": React.lazy(() => import("@/tools/image/ImageToBase64")),
};

export default function ToolRenderer({ slug }: { slug: string }) {
  const Comp = registry[slug];
  if (!Comp) return null;
  return (
    <Suspense
      fallback={
        <div className="card flex items-center justify-center p-10 text-slate-500">
          <span className="animate-pulse">…</span>
        </div>
      }
    >
      <Comp />
    </Suspense>
  );
}
