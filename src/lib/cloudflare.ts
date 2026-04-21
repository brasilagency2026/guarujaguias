/**
 * Cloudflare Images URL helper.
 * Use this anywhere in the app instead of building URLs manually.
 *
 * Variants configured in Cloudflare Images dashboard:
 *   thumbnail  — 200×200  (avatar, map markers)
 *   card       — 600×400  (business cards, gallery)
 *   hero       — 1200×630 (og:image, cover)
 *   public     — original quality
 */

export type CfVariant = "thumbnail" | "card" | "hero" | "public";

export function cfImageUrl(imageId: string, variant: CfVariant = "card"): string {
  if (!imageId) return "";
  const hash = process.env.NEXT_PUBLIC_CF_IMAGES_HASH;
  return `https://imagedelivery.net/${hash}/${imageId}/${variant}`;
}
