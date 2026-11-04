import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, getTool } from "@/lib/tools";
import { ToolPageView } from "@/components/ToolPageView";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const title = `${tool.title.ar} — ${tool.title.en}`;
  const description = `${tool.desc.ar} ${tool.desc.en}`;
  const url = `${SITE_URL}/tools/${tool.slug}`;
  return {
    title,
    description,
    keywords: [...tool.keywords.ar, ...tool.keywords.en],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME.ar,
      locale: "ar_AR",
      alternateLocale: "en_US",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  return <ToolPageView tool={tool} />;
}
