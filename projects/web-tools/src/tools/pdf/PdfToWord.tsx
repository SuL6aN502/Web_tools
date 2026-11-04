"use client";

import { useLang } from "@/lib/i18n";
import { Card, Note, ToolTitle } from "@/components/ui";

export default function PdfToWord() {
  const { t } = useLang();
  return (
    <Card>
      <ToolTitle sub={{ ar: "التحويل الكامل لمستندات Word قيد التطوير.", en: "Full Word conversion is under development." }}>
        {t({ ar: "تحويل PDF إلى Word", en: "PDF to Word" })}
      </ToolTitle>
      <Note tone="warn">
        {t({
          ar: "قريبًا! يمكنك الآن استخدام أداة «استخراج النص من PDF» للحصول على النص ونسخه إلى Word مباشرة.",
          en: "Coming soon! Meanwhile, use the PDF-to-Text tool to extract the text and paste it into Word.",
        })}
      </Note>
    </Card>
  );
}
