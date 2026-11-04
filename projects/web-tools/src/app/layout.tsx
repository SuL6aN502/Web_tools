import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "أدوات الويب المجانية — دمج PDF، حاسبات، مولد QR وأدوات صور | Free Web Tools",
    template: "%s | أدوات الويب المجانية",
  },
  description: SITE_DESC.ar + " " + SITE_DESC.en,
  keywords: [
    "أدوات ويب مجانية", "دمج PDF", "ضغط PDF", "حاسبة BMI", "مولد QR",
    "محول العملات", "ضغط الصور", "عداد الكلمات", "free web tools",
    "merge pdf online", "compress pdf", "bmi calculator", "qr code generator",
  ],
  applicationName: SITE_NAME.ar,
  authors: [{ name: SITE_NAME.en }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME.ar,
    title: "أدوات الويب المجانية — Free Web Tools",
    description: SITE_DESC.ar,
    locale: "ar_AR",
    alternateLocale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME.en }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أدوات الويب المجانية — Free Web Tools",
    description: SITE_DESC.en,
    images: ["/og.png"],
  },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen flex-col font-sans">
        <LangProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
