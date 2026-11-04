import QRCode from "qrcode";

export interface WifiInfo {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

function esc(s: string): string {
  return s.replace(/([\\;,:"])/g, "\\$1");
}

export function buildWifiString(w: WifiInfo): string {
  const enc = w.encryption === "nopass" ? "nopass" : w.encryption;
  const pass = enc === "nopass" ? "" : esc(w.password);
  return `WIFI:T:${enc};S:${esc(w.ssid)};P:${pass};${w.hidden ? "H:true;" : ""};`;
}

export interface QrOptions {
  size?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  dark?: string;
  light?: string;
}

export async function qrToPngDataUrl(text: string, o: QrOptions = {}): Promise<string> {
  return QRCode.toDataURL(text, {
    width: o.size ?? 320,
    margin: o.margin ?? 2,
    errorCorrectionLevel: o.errorCorrectionLevel ?? "M",
    color: { dark: o.dark ?? "#1e293b", light: o.light ?? "#ffffff" },
  });
}

export async function qrToSvg(text: string, o: QrOptions = {}): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: o.margin ?? 2,
    errorCorrectionLevel: o.errorCorrectionLevel ?? "M",
    color: { dark: o.dark ?? "#1e293b", light: o.light ?? "#ffffff" },
    width: o.size ?? 320,
  });
}
