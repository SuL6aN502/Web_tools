export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://alltools-nine.vercel.app";

export const SITE_NAME = {
  ar: "أدوات الويب المجانية",
  en: "Free Web Tools",
} as const;

export const SITE_DESC = {
  ar: "أكثر من 25 أداة ويب مجانية تعمل داخل متصفحك: دمج PDF، ضغط الصور، حاسبة BMI، مولّد QR، محول العملات وغيرها — سريعة وخاصة وبدون رفع ملفاتك.",
  en: "25+ free web tools that run in your browser: merge PDF, compress images, BMI calculator, QR generator, currency converter and more — fast, private, no uploads.",
} as const;

export const PRIVACY_NOTE = {
  ar: "جميع المعالجة تتم داخل متصفحك — لا تُرفع ملفاتك أو بياناتك إلى أي خادم.",
  en: "All processing happens in your browser — your files and data never leave your device.",
} as const;
