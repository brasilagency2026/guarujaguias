// ─── Image URL helper ─────────────────────────────────────────────────────
const CF_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_HASH;

export type ImageVariant = "thumbnail" | "card" | "hero" | "public";

export function cfImageUrl(imageId: string, variant: ImageVariant = "card"): string {
  if (!imageId) return "";
  return `https://imagedelivery.net/${CF_HASH}/${imageId}/${variant}`;
}

// ─── Format helpers ───────────────────────────────────────────────────────
export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min  = Math.floor(diff / 60000);
  const hr   = Math.floor(diff / 3600000);
  const day  = Math.floor(diff / 86400000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  if (hr < 24)  return `há ${hr}h`;
  if (day < 7)  return `há ${day} dia${day > 1 ? "s" : ""}`;
  return formatDate(ts);
}

// ─── WhatsApp URL ─────────────────────────────────────────────────────────
export function whatsappUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, "");
  const br = clean.startsWith("55") ? clean : `55${clean}`;
  const base = `https://wa.me/${br}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// ─── Slug ─────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ─── cn (clsx + tailwind-merge) ───────────────────────────────────────────
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
