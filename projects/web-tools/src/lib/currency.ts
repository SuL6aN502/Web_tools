export interface RatesSnapshot {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  source: "live" | "static";
}

/** Static fallback rates vs USD (approximate). Used only when the live API is unreachable. */
export const STATIC_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.78, JPY: 150, CNY: 7.1, SAR: 3.75, AED: 3.6725,
  QAR: 3.64, KWD: 0.307, BHD: 0.376, OMR: 0.3845, JOD: 0.709, EGP: 48.5,
  MAD: 9.9, DZD: 134, TND: 3.1, IQD: 1310, YER: 250, TRY: 32, RUB: 92,
  CHF: 0.88, CAD: 1.36, AUD: 1.52, NZD: 1.64, SEK: 10.5, NOK: 10.7, DKK: 6.87,
  PLN: 3.95, INR: 83, PKR: 278, BDT: 110, IDR: 15800, MYR: 4.45, SGD: 1.34,
  THB: 35, KRW: 1330, ZAR: 18.2, NGN: 1550, KES: 129,
};

export const CURRENCIES: { code: string; ar: string; en: string; symbol: string }[] = [
  { code: "USD", ar: "دولار أمريكي", en: "US Dollar", symbol: "$" },
  { code: "SAR", ar: "ريال سعودي", en: "Saudi Riyal", symbol: "SR" },
  { code: "AED", ar: "درهم إماراتي", en: "UAE Dirham", symbol: "AED" },
  { code: "QAR", ar: "ريال قطري", en: "Qatari Riyal", symbol: "QR" },
  { code: "KWD", ar: "دينار كويتي", en: "Kuwaiti Dinar", symbol: "KD" },
  { code: "BHD", ar: "دينار بحريني", en: "Bahraini Dinar", symbol: "BD" },
  { code: "OMR", ar: "ريال عُماني", en: "Omani Rial", symbol: "OMR" },
  { code: "JOD", ar: "دينار أردني", en: "Jordanian Dinar", symbol: "JD" },
  { code: "EGP", ar: "جنيه مصري", en: "Egyptian Pound", symbol: "E£" },
  { code: "MAD", ar: "درهم مغربي", en: "Moroccan Dirham", symbol: "MAD" },
  { code: "DZD", ar: "دينار جزائري", en: "Algerian Dinar", symbol: "DZD" },
  { code: "TND", ar: "دينار تونسي", en: "Tunisian Dinar", symbol: "TND" },
  { code: "IQD", ar: "دينار عراقي", en: "Iraqi Dinar", symbol: "IQD" },
  { code: "YER", ar: "ريال يمني", en: "Yemeni Rial", symbol: "YER" },
  { code: "TRY", ar: "ليرة تركية", en: "Turkish Lira", symbol: "₺" },
  { code: "EUR", ar: "يورو", en: "Euro", symbol: "€" },
  { code: "GBP", ar: "جنيه إسترليني", en: "British Pound", symbol: "£" },
  { code: "CHF", ar: "فرنك سويسري", en: "Swiss Franc", symbol: "CHF" },
  { code: "JPY", ar: "ين ياباني", en: "Japanese Yen", symbol: "¥" },
  { code: "CNY", ar: "يوان صيني", en: "Chinese Yuan", symbol: "¥" },
  { code: "INR", ar: "روبية هندية", en: "Indian Rupee", symbol: "₹" },
  { code: "PKR", ar: "روبية باكستانية", en: "Pakistani Rupee", symbol: "₨" },
  { code: "BDT", ar: "تاكا بنغلاديشي", en: "Bangladeshi Taka", symbol: "৳" },
  { code: "IDR", ar: "روبية إندونيسية", en: "Indonesian Rupiah", symbol: "Rp" },
  { code: "MYR", ar: "رينغيت ماليزي", en: "Malaysian Ringgit", symbol: "RM" },
  { code: "SGD", ar: "دولار سنغافوري", en: "Singapore Dollar", symbol: "S$" },
  { code: "THB", ar: "بات تايلندي", en: "Thai Baht", symbol: "฿" },
  { code: "KRW", ar: "وون كوري", en: "Korean Won", symbol: "₩" },
  { code: "AUD", ar: "دولار أسترالي", en: "Australian Dollar", symbol: "A$" },
  { code: "CAD", ar: "دولار كندي", en: "Canadian Dollar", symbol: "C$" },
  { code: "NZD", ar: "دولار نيوزيلندي", en: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", ar: "كرونة سويدية", en: "Swedish Krona", symbol: "kr" },
  { code: "NOK", ar: "كرونة نرويجية", en: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", ar: "كرونة دنماركية", en: "Danish Krone", symbol: "kr" },
  { code: "PLN", ar: "زلوتي بولندي", en: "Polish Zloty", symbol: "zł" },
  { code: "RUB", ar: "روبل روسي", en: "Russian Ruble", symbol: "₽" },
  { code: "ZAR", ar: "راند جنوب أفريقي", en: "South African Rand", symbol: "R" },
  { code: "NGN", ar: "نايرا نيجيرية", en: "Nigerian Naira", symbol: "₦" },
  { code: "KES", ar: "شلن كيني", en: "Kenyan Shilling", symbol: "KSh" },
];

export function convert(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number | null {
  const rf = rates[from];
  const rt = rates[to];
  if (!rf || !rt || !Number.isFinite(amount)) return null;
  return (amount / rf) * rt;
}

/** Fetch live rates (client-side), falling back to the bundled static table. */
export async function fetchRates(): Promise<RatesSnapshot> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error("bad status " + res.status);
    const data = await res.json();
    if (!data || typeof data.rates !== "object" || !data.rates.USD) {
      throw new Error("bad payload");
    }
    return {
      base: "USD",
      rates: data.rates as Record<string, number>,
      timestamp: data.time_last_update_unix
        ? data.time_last_update_unix * 1000
        : Date.now(),
      source: "live",
    };
  } catch {
    return { base: "USD", rates: STATIC_RATES, timestamp: 0, source: "static" };
  }
}
