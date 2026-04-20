"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

const EVENT_CATS = [
  { slug: "",         label: "Todos",       icon: "🗓️" },
  { slug: "musica",   label: "Música",      icon: "🎵" },
  { slug: "cultura",  label: "Cultura",     icon: "🎭" },
  { slug: "esporte",  label: "Esporte",     icon: "🏄" },
  { slug: "gastronomia", label: "Gastronomia", icon: "🍽️" },
  { slug: "familia",  label: "Família",     icon: "👨‍👩‍👧" },
  { slug: "negocios", label: "Negócios",    icon: "💼" },
];

// Mock events for structure — in production from Convex query
const MOCK_EVENTS = [
  { id: "1", title: "Festival de Artes da Praia", category: "cultura",  date: "2025-05-24", time: "10h–22h", location: "Praia de Pitangueiras", price: null, isFree: true,  description: "Arte, música ao vivo e gastronomia à beira-mar.", icon: "🎭", color: "#7c3aed" },
  { id: "2", title: "Samba & Churrasco no Parque",category: "musica",   date: "2025-05-25", time: "14h–20h", location: "Parque das Nações", price: 30, isFree: false, description: "Roda de samba com os melhores músicos locais.", icon: "🎵", color: "#e05a3a" },
  { id: "3", title: "Torneio de Surf Amador",     category: "esporte",  date: "2025-05-31", time: "8h–17h",  location: "Praia da Enseada", price: null, isFree: true,  description: "Competição aberta para surfistas amadores de todas as idades.", icon: "🏄", color: "#1a7fa0" },
  { id: "4", title: "Feira de Artesanato Local",  category: "cultura",  date: "2025-06-01", time: "9h–18h",  location: "Calçadão de Pitangueiras", price: null, isFree: true, description: "Mais de 50 artesãos locais com produtos únicos.", icon: "🛍️", color: "#d4a853" },
  { id: "5", title: "Show de Jazz na Praia",      category: "musica",   date: "2025-06-07", time: "19h–23h", location: "Espaço Cultural da Praia", price: 50, isFree: false, description: "Noite especial com bandas de jazz da região.", icon: "🎺", color: "#7c3aed" },
  { id: "6", title: "Passeio Ecológico nas Ilhas", category: "familia", date: "2025-06-08", time: "9h–16h",  location: "Cais do Porto", price: 80, isFree: false, description: "Tour guiado pelas ilhas com foco em educação ambiental.", icon: "🚤", color: "#2d7a4a" },
  { id: "7", title: "Festival Gastronômico",      category: "gastronomia", date: "2025-06-14", time: "12h–22h", location: "Av. Dom Pedro I", price: null, isFree: true, description: "Os melhores restaurantes de Guarujá em um só lugar.", icon: "🍽️", color: "#e05a3a" },
  { id: "8", title: "Palestra: Turismo Sustentável", category: "negocios", date: "2025-06-20", time: "18h–21h", location: "Centro de Convenções", price: null, isFree: true, description: "Como desenvolver o turismo preservando o meio ambiente.", icon: "💼", color: "#0a4f6e" },
];

export default function EventsClient() {
  const [cat, setCat] = useState("");
  const [showPast, setShowPast] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const filtered = MOCK_EVENTS
    .filter((e) => !cat || e.category === cat)
    .filter((e) => showPast ? e.date < today : e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  };

  // Group by month
  const grouped = filtered.reduce((acc, ev) => {
    const month = ev.date.slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(ev);
    return acc;
  }, {} as Record<string, typeof filtered>);

  const monthLabel = (key: string) => {
    const [y, m] = key.split("-");
    return new Date(+y, +m - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  return (
    <div style={{ paddingBottom: "4rem" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0533 0%, #4a1070 50%, #1a7fa0 100%)", padding: "3rem 1.5rem 4rem", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 60, background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)" }} />
        <div className="container" style={{ maxWidth: 860 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "white", marginBottom: 8 }}>
            🎭 Eventos em Guarujá
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
            Shows, festas, feiras e cultura — agenda completa do litoral paulista
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", position: "sticky", top: "var(--nav-h)", zIndex: 50 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 0", scrollbarWidth: "none", alignItems: "center" }}>
            {EVENT_CATS.map(({ slug, label, icon }) => (
              <button key={slug} onClick={() => setCat(slug)} style={{
                padding: "7px 14px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                cursor: "pointer", border: "none", whiteSpace: "nowrap", flexShrink: 0,
                background: cat === slug ? "var(--purple)" : "var(--bg)",
                color: cat === slug ? "white" : "var(--text-muted)",
                transition: "all 0.15s",
              }}>
                {icon} {label}
              </button>
            ))}
            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <button onClick={() => setShowPast(!showPast)} style={{
                padding: "7px 14px", borderRadius: 50, fontSize: 13, cursor: "pointer",
                border: "1px solid var(--border-mid)", background: showPast ? "var(--bg)" : "white",
                color: "var(--text-muted)", whiteSpace: "nowrap",
              }}>
                {showPast ? "Mostrar próximos" : "Ver passados"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="container" style={{ maxWidth: 860, paddingTop: "2rem" }}>

        {/* CTA to add event */}
        <div style={{ background: "var(--ocean-50)", border: "1px solid var(--ocean-light)", borderRadius: "var(--radius-lg)", padding: "1rem 1.25rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>🎉 Tem um evento em Guarujá?</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Divulgue grátis para toda a comunidade</div>
          </div>
          <Link href="/cadastro" className="btn btn-primary btn-sm">Divulgar evento →</Link>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>Nenhum evento encontrado</h3>
            <p>Tente outros filtros ou cadastre seu evento</p>
          </div>
        ) : (
          Object.entries(grouped).map(([month, events]) => (
            <div key={month} style={{ marginBottom: "2.5rem" }}>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: 18, textTransform: "capitalize",
                color: "var(--text-muted)", marginBottom: "1rem", paddingBottom: 8,
                borderBottom: "1px solid var(--border)",
              }}>
                {monthLabel(month)}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {events.map((ev) => (
                  <div key={ev.id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex" }}>
                    {/* Color sidebar */}
                    <div style={{ width: 6, background: ev.color, flexShrink: 0 }} />

                    {/* Date block */}
                    <div style={{
                      width: 72, flexShrink: 0, display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", padding: "1rem 0",
                      borderRight: "1px solid var(--border)", background: "var(--bg)",
                    }}>
                      <div style={{ fontSize: 24, fontFamily: "var(--font-display)", fontWeight: 700, color: ev.color, lineHeight: 1 }}>
                        {new Date(ev.date + "T12:00:00").getDate()}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {new Date(ev.date + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-hint)", marginTop: 2 }}>
                        {new Date(ev.date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" })}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: "1rem 1.25rem", display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ fontSize: 28, flexShrink: 0 }}>{ev.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <h3 style={{ fontWeight: 700, fontSize: 16 }}>{ev.title}</h3>
                          {ev.isFree
                            ? <span style={{ background: "var(--green-light)", color: "var(--green)", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>Gratuito</span>
                            : <span style={{ background: "var(--sand)", color: "#7a5800", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>R$ {ev.price}</span>
                          }
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5 }}>{ev.description}</p>
                        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-hint)", flexWrap: "wrap" }}>
                          <span>🕐 {ev.time}</span>
                          <span>📍 {ev.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
