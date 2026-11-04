"use client";

import { useLang } from "@/lib/i18n";

/**
 * AdSense placeholder — deliberately NOT live.
 * When the site is approved for AdSense, replace this block with:
 *
 * <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXX"
 *      data-ad-slot="YYYY" data-ad-format="auto" data-full-width-responsive="true"></ins>
 * <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
 */
export function AdSlot({
  format = "leaderboard",
  className = "",
}: {
  format?: "leaderboard" | "rectangle" | "inarticle";
  className?: string;
}) {
  const { t } = useLang();
  const size =
    format === "leaderboard" ? "728 × 90" : format === "rectangle" ? "300 × 250" : "responsive";
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
