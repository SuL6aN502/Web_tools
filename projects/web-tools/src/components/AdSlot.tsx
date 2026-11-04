"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

export function AdSlot({
  format = "leaderboard",
  slot,
  className = "",
}: {
  format?: "leaderboard" | "rectangle" | "inarticle";
  slot?: string;
  className?: string;
}) {
  const { t } = useLang();
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const resolvedSlot =
    slot ||
    (format === "leaderboard"
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD
      : format === "rectangle"
        ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE
        : process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE);
  const isActive = Boolean(clientId && resolvedSlot);

  useEffect(() => {
    if (!isActive) return;
    try {
      const ads = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || [];
      ads.push({});
      (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = ads;
    } catch (error) {
      console.error("Failed to render AdSense slot", error);
    }
  }, [isActive, resolvedSlot]);

  const size =
    format === "leaderboard" ? "728 × 90" : format === "rectangle" ? "300 × 250" : "responsive";

  if (!isActive) {
    return (
      <div
        className={"ad-slot my-6 px-4 py-5 " + className}
        data-ad-placeholder={format}
        role="presentation"
      >
        <div className="text-[11px] font-bold uppercase tracking-wider">
          {t({ ar: "مساحة إعلانية", en: "Advertisement" })}
        </div>
        <div className="mt-1 text-[11px]">
          {t({ ar: "AdSense — غير مفعّلة بعد", en: "AdSense placeholder — not active" })} · {size}
        </div>
      </div>
    );
  }

  return (
    <div className={"my-6 " + className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={resolvedSlot}
        data-ad-format={format === "inarticle" ? "fluid" : "auto"}
        data-ad-layout={format === "inarticle" ? "in-article" : undefined}
        data-full-width-responsive="true"
      />
    </div>
  );
}
