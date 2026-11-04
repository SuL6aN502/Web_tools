export type OutFormat = "image/jpeg" | "image/png" | "image/webp";

export interface TransformOpts {
  format: OutFormat;
  quality: number; // 0..1 (ignored for PNG)
  width?: number;
  height?: number;
  background?: string; // used when flattening transparency for JPEG
}

export interface LoadedCanvas {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  close: () => void;
}

export async function fileToCanvas(file: File): Promise<LoadedCanvas> {
  let bitmap: ImageBitmap | null = null;
  let img: HTMLImageElement | null = null;
  let width: number;
  let height: number;

  if (typeof createImageBitmap === "function") {
    bitmap = await createImageBitmap(file);
    width = bitmap.width;
    height = bitmap.height;
  } else {
    img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      const url = URL.createObjectURL(file);
      el.onload = () => {
        URL.revokeObjectURL(url);
        resolve(el);
      };
      el.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("image load failed"));
      };
      el.src = url;
    });
    width = img.naturalWidth;
    height = img.naturalHeight;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d unavailable");
  ctx.drawImage(bitmap ?? img!, 0, 0);

  return {
    canvas,
    width,
    height,
    close: () => {
      if (bitmap) bitmap.close();
    },
  };
}

export function computeTargetSize(
  width: number,
  height: number,
  opts: { width?: number; height?: number; percent?: number; lockAspect?: boolean }
): { width: number; height: number } {
  if (opts.percent && opts.percent > 0) {
    return {
      width: Math.max(1, Math.round((width * opts.percent) / 100)),
      height: Math.max(1, Math.round((height * opts.percent) / 100)),
    };
  }
  let w = opts.width ?? width;
  let h = opts.height ?? height;
  if (opts.lockAspect !== false) {
    if (opts.width && !opts.height) h = Math.round((opts.width * height) / width);
    else if (opts.height && !opts.width) w = Math.round((opts.height * width) / height);
    else if (opts.width && opts.height) {
      // keep aspect: fit inside the box
      const scale = Math.min(opts.width / width, opts.height / height);
      w = Math.round(width * scale);
      h = Math.round(height * scale);
    }
  }
  return { width: Math.max(1, w), height: Math.max(1, h) };
}

export async function transformImage(file: File, opts: TransformOpts): Promise<Blob> {
  const loaded = await fileToCanvas(file);
  try {
    const target = computeTargetSize(loaded.width, loaded.height, {
      width: opts.width,
      height: opts.height,
    });
    const out = document.createElement("canvas");
    out.width = target.width;
    out.height = target.height;
    const ctx = out.getContext("2d");
    if (!ctx) throw new Error("canvas 2d unavailable");
    if (opts.format === "image/jpeg") {
      ctx.fillStyle = opts.background || "#ffffff";
      ctx.fillRect(0, 0, out.width, out.height);
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(loaded.canvas, 0, 0, target.width, target.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      out.toBlob(resolve, opts.format, opts.quality)
    );
    if (!blob) throw new Error("encoding failed");
    return blob;
  } finally {
    loaded.close();
  }
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("read failed"));
    fr.readAsDataURL(blob);
  });
}
