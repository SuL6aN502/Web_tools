"use client";

export function u8ToBlob(bytes: Uint8Array, type: string): Blob {
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
  return new Blob([ab], { type });
}

export function baseName(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

export function withSuffix(name: string, suffix: string, ext: string): string {
  return baseName(name) + suffix + "." + ext;
}

export function extOf(format: string): string {
  if (format === "image/png") return "png";
  if (format === "image/webp") return "webp";
  return "jpg";
}
