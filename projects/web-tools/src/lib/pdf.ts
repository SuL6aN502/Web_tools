import { PDFDocument, degrees, PageSizes } from "pdf-lib";
import { loadPdfDocument } from "./pdfjs";

/** Parse "1-3,5,8-10" into arrays of 1-based page numbers, clamped to maxPage. */
export function parseRanges(input: string, maxPage: number): number[][] {
  const out: number[][] = [];
  for (const chunk of input.split(",")) {
    const part = chunk.trim();
    if (!part) continue;
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      let a = parseInt(m[1], 10);
      let b = parseInt(m[2], 10);
      if (a > b) [a, b] = [b, a];
      const pages: number[] = [];
      for (let p = a; p <= b && p <= maxPage; p++) if (p >= 1) pages.push(p);
      if (pages.length) out.push(pages);
    } else if (/^\d+$/.test(part)) {
      const p = parseInt(part, 10);
      if (p >= 1 && p <= maxPage) out.push([p]);
    }
  }
  return out;
}

export async function mergePdfs(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const buf of buffers) {
    const src = await PDFDocument.load(buf, { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    for (const p of pages) out.addPage(p);
  }
  return out.save();
}

export async function rotatePdf(
  buffer: ArrayBuffer,
  deg: 90 | 180 | 270,
  ranges?: number[][]
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const selected = new Set((ranges ?? []).flat());
  doc.getPages().forEach((page, i) => {
    if (selected.size > 0 && !selected.has(i + 1)) return;
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + deg) % 360));
  });
  return doc.save();
}

export async function extractPages(
  buffer: ArrayBuffer,
  ranges: number[][]
): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const indices = ranges.flat().map((p) => p - 1).filter((i) => i >= 0 && i < src.getPageCount());
  const pages = await out.copyPages(src, indices);
  for (const p of pages) out.addPage(p);
  return out.save();
}

export async function splitIntoFiles(
  buffer: ArrayBuffer,
  ranges: number[][]
): Promise<Uint8Array[]> {
  const results: Uint8Array[] = [];
  for (const range of ranges) {
    results.push(await extractPages(buffer, [range]));
  }
  return results;
}

export interface ImageInput {
  bytes: Uint8Array;
  kind: "jpg" | "png";
  width: number;
  height: number;
}

export async function imagesToPdf(
  images: ImageInput[],
  opts: { mode: "fit" | "a4"; margin: number }
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const margin = Math.max(0, opts.margin);
  for (const img of images) {
    const embedded = img.kind === "jpg" ? await doc.embedJpg(img.bytes) : await doc.embedPng(img.bytes);
    if (opts.mode === "a4") {
      const [pw, ph] = PageSizes.A4;
      const page = doc.addPage([pw, ph]);
      const availW = pw - margin * 2;
      const availH = ph - margin * 2;
      const scale = Math.min(availW / img.width, availH / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      page.drawImage(embedded, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
    } else {
      // natural size: px -> pt (96dpi -> 72dpi), capped below the PDF page limit
      const pxToPt = (v: number) => v * 0.75;
      const maxDim = Math.max(img.width, img.height);
      const shrink = maxDim > 14000 ? 14000 / maxDim : 1;
      const w = pxToPt(img.width * shrink);
      const h = pxToPt(img.height * shrink);
      const page = doc.addPage([w, h]);
      page.drawImage(embedded, { x: 0, y: 0, width: w, height: h });
    }
  }
  return doc.save();
}

/**
 * Best-effort PDF compression: renders every page to a canvas at the chosen
 * scale/quality and rebuilds the PDF from the optimized JPEGs. Great for scans
 * and image-heavy files, less effective for tiny text-only PDFs.
 */
export async function compressPdfRaster(
  buffer: ArrayBuffer,
  opts: { scale: number; quality: number }
): Promise<{ bytes: Uint8Array; pageCount: number }> {
  const pdf = await loadPdfDocument(buffer);
  const out = await PDFDocument.create();
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp1 = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: opts.scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(vp.width);
    canvas.height = Math.ceil(vp.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d unavailable");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", opts.quality)
    );
    if (!blob) throw new Error("page encode failed");
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const img = await out.embedJpg(bytes);
    const target = out.addPage([vp1.width, vp1.height]);
    target.drawImage(img, { x: 0, y: 0, width: vp1.width, height: vp1.height });
    page.cleanup();
  }
  return { bytes: await out.save(), pageCount: pdf.numPages };
}

export interface PdfTextResult {
  text: string;
  pageCount: number;
}

export async function pdfToText(buffer: ArrayBuffer): Promise<PdfTextResult> {
  const pdf = await loadPdfDocument(buffer);
  const parts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items = content.items as unknown as {
      str?: string;
      hasEOL?: boolean;
      transform: number[];
    }[];
    const lines: string[] = [];
    let line = "";
    let prevY: number | null = null;
    for (const item of items) {
      if (typeof item.str !== "string") continue;
      const y = item.transform[5];
      if (prevY !== null && Math.abs(y - prevY) > 2) {
        lines.push(line);
        line = "";
      }
      line += item.str;
      if (item.hasEOL) {
        lines.push(line);
        line = "";
        prevY = null;
      } else {
        prevY = y;
      }
    }
    if (line) lines.push(line);
    parts.push(lines.join("\n"));
    page.cleanup();
  }
  return { text: parts.join("\n\n"), pageCount: pdf.numPages };
}
