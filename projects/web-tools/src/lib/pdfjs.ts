/**
 * pdf.js is loaded lazily (dynamic import) and only in the browser, so it never
 * touches SSR. The worker bundle is served from /pdf.worker.min.mjs (copied into
 * public/ by scripts/copy-worker.mjs).
 */
export async function loadPdfDocument(data: ArrayBuffer) {
  const pdfjs = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
  return pdfjs.getDocument({
    data,
    isEvalSupported: false,
    useWorkerFetch: false,
  }).promise;
}
