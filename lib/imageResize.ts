import sharp from "sharp";

/** Widths the image proxy will produce. Deal cards are ~180px tall and up to ~400px wide. */
export const ALLOWED_WIDTHS = [320, 480, 640, 960] as const;
export const DEFAULT_WIDTH = 480;

export function pickWidth(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_WIDTH;
  return ALLOWED_WIDTHS.find(w => w >= n) ?? ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1];
}

/**
 * Shrink an image to `width` (never enlarging) and re-encode as WebP.
 * Returns null when the input can't be decoded, so callers can serve the original.
 * Animated GIFs keep only their first frame, which is fine for a card thumbnail.
 */
export async function toWebp(input: ArrayBuffer, width: number, quality = 72): Promise<Buffer | null> {
  try {
    return await sharp(Buffer.from(input), { failOn: "none" })
      .rotate() // respect EXIF orientation
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
  } catch {
    return null;
  }
}
