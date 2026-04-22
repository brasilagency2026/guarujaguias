"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

const CF_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_HASH;

const CATEGORY_COLORS: Record<string, string> = {
  musica:      "#7c3aed",
  cultura:     "#0a4f6e",
  esporte:     "#1a7fa0",
  gastronomia: "#e05a3a",
  familia:     "#2d7a4a",
  negocios:    "#d4a853",
  arte:        "#c2185b",
  festa:       "#e65100",
};

const CATEGORY_ICONS: Record<string, string> = {
  musica:      "🎵",
  cultura:     "🎭",
  esporte:     "🏄",
  gastronomia: "🍽️",
  familia:     "👨‍👩‍👧",
  negocios:    "💼",
  arte:        "🎨",
  festa:       "🎉",
};

function formatEventDate(startDate: number, endDate: number): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const startDay = new Date(start); startDay.setHours(0,0,0,0);

  const dayLabel = startDay.getTime() === today.getTime()
    ? "Hoje"
    : startDay.getTime() === tomorrow.getTime()
    ? "Amanhã"
    : start.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });

  const timeStr = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dayLabel} · ${timeStr}`;
}

export default function EventsStrip() {
  const events = useQuery(api.events.listForHomepage);

  if (!events || events.length === 0) return null;

  return (
    <section style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 1rem 0.5rem",
      }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 4vw, 22px)", marginBottom: 2 }}>
            📅 Agenda de Eventos
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Próximos eventos em Guarujá</p>
        </div>
        <Link href="/eventos" style={{
          color: "var(--ocean-mid)", textDecoration: "none",
          fontSize: 13, fontWeight: 600, flexShrink: 0,
        }}>
          Ver todos →
        </Link>
      </div>

      {/* Horizontal scroll cards */}
      <div style={{
        display: "flex",
        overflowX: "auto",
        gap: 10,
        padding: "8px 1rem 1rem",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      } as any}>
        {events.map((ev: any) => {
          const color = CATEGORY_COLORS[ev.category] ?? "var(--ocean)";
          const icon  = CATEGORY_ICONS[ev.category]  ?? "🎫";

          return (
            <Link key={ev._id} href={`/eventos#${ev.slug}`} style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{
                width: "min(260px, 72vw)",
                background: "white",
                borderRadius: "var(--radius-lg)",
                border: `1.5px solid ${ev.featured ? color : "var(--border)"}`,
                overflow: "hidden",
                position: "relative",
                boxShadow: ev.featured ? `0 4px 20px ${color}30` : "var(--shadow-sm)",
              }}>
                {/* Cover image or color band */}
                {ev.coverImageId ? (
                  <div style={{ height: 110, overflow: "hidden", position: "relative" }}>
                    <img
                      src={`https://imagedelivery.net/${CF_HASH}/${ev.coverImageId}/card`}
                      alt={ev.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))` }} />
                    {ev.featured && (
                      <div style={{
                        position: "absolute", top: 8, left: 8,
                        background: "var(--sand-dark)", color: "white",
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50,
                      }}>⭐ Destaque</div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    height: 80, background: `${color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 36, position: "relative",
                  }}>
                    {icon}
                    {ev.featured && (
                      <div style={{
                        position: "absolute", top: 8, left: 8,
                        background: "var(--sand-dark)", color: "white",
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50,
                      }}>⭐ Destaque</div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color,
                    textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4,
                  }}>
                    {icon} {ev.category}
                  </div>
                  <div style={{
                    fontWeight: 700, fontSize: 14, color: "var(--text)",
                    marginBottom: 6, lineHeight: 1.3,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  } as any}>
                    {ev.title}
                  </div>

                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                    🕐 {formatEventDate(ev.startDate, ev.endDate)}
                  </div>

                  {ev.address && (
                    <div style={{ fontSize: 12, color: "var(--text-hint)", marginBottom: 6 }}>
                      📍 {ev.neighborhood ?? ev.address}
                    </div>
                  )}

                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: 4,
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: ev.isFree ? "var(--green)" : "var(--ocean)",
                    }}>
                      {ev.isFree ? "Gratuito" : ev.price ? `R$ ${ev.price}` : "Ver preço"}
                    </span>
                    <span style={{
                      fontSize: 11, color: "var(--ocean)", fontWeight: 600,
                    }}>
                      Saiba mais →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Promote your event CTA */}
        <Link href="/dashboard/eventos/novo" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: "min(200px, 55vw)",
            background: "var(--ocean-50)",
            borderRadius: "var(--radius-lg)",
            border: "2px dashed var(--ocean-light)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "1.5rem 1rem",
            gap: 8, textAlign: "center",
            minHeight: 180,
          }}>
            <div style={{ fontSize: 32 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ocean)" }}>
              Divulgue seu evento
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Destaque por R$ 100
            </div>
            <div style={{
              background: "var(--ocean)", color: "white",
              padding: "6px 14px", borderRadius: 50,
              fontSize: 12, fontWeight: 700, marginTop: 4,
            }}>
              Publicar →
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
