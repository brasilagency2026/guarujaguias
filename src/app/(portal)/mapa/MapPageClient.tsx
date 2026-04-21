"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const GuarujaMap = dynamic(() => import("../../../components/map/GuarujaMap"), { ssr: false });

const CATEGORY_FILTERS = [
  { slug: "",            label: "Todos",        icon: "🗺️" },
  { slug: "restaurante", label: "Restaurantes", icon: "🍽️" },
  { slug: "hospedagem",  label: "Hospedagem",   icon: "🏨" },
  { slug: "beleza",      label: "Beleza",        icon: "💅" },
  { slug: "turismo",     label: "Turismo",       icon: "🚤" },
  { slug: "loja",        label: "Lojas",         icon: "🛍️" },
  { slug: "saude",       label: "Saúde",         icon: "🏥" },
  { slug: "cultura",     label: "Cultura",       icon: "🎭" },
];

export default function MapPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const businesses = useQuery(api.businesses.listActive, {
    category: selectedCategory || undefined,
    limit: 100,
  });

  return (
    <div style={{ height: "calc(100vh - var(--nav-h))", display: "flex", position: "relative" }}>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <div style={{
        width: sidebarOpen ? 340 : 0, minWidth: sidebarOpen ? 340 : 0,
        height: "100%", background: "white", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        transition: "all 0.3s ease", flexShrink: 0, zIndex: 10,
      }}>
        {sidebarOpen && (
          <>
            <div style={{ padding: "12px", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
              <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
                {CATEGORY_FILTERS.map(({ slug, label, icon }) => (
                  <button key={slug} onClick={() => setSelectedCategory(slug)} style={{
                    padding: "6px 12px", borderRadius: 50, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", border: "none", whiteSpace: "nowrap",
                    background: selectedCategory === slug ? "var(--ocean)" : "var(--bg)",
                    color: selectedCategory === slug ? "white" : "var(--text-muted)",
                    transition: "all 0.15s",
                  }}>
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
              {businesses ? (
                businesses.length > 0 ? businesses.map((biz) => (
                  <button
                    key={biz._id}
                    onClick={() => setSelectedBusiness(biz)}
                    style={{
                      width: "100%",
                      background: selectedBusiness?._id === biz._id ? "var(--ocean-50)" : "transparent",
                      border: selectedBusiness?._id === biz._id ? "1.5px solid var(--ocean-light)" : "1.5px solid transparent",
                      borderRadius: "var(--radius)", padding: "10px 12px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 12, marginBottom: 4,
                      textAlign: "left", transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: "var(--radius-sm)",
                      background: "var(--bg)", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 20, flexShrink: 0,
                    }}>
                      {biz.coverImageId
                        ? <img src={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CF_IMAGES_HASH}/${biz.coverImageId}/thumbnail`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-sm)" }} alt="" />
                        : ({ restaurante: "🍽️", hospedagem: "🏨", beleza: "💅", turismo: "🚤", loja: "🛍️", saude: "🏥", cultura: "🎭", servicos: "⚙️", eventos: "🎵" } as Record<string, string>)[biz.category]
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{biz.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{biz.neighborhood}</div>
                    </div>
                    {biz.hasMiniSite && (
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} title="Tem mini-site" />
                    )}
                  </button>
                )) : (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)", fontSize: 14 }}>
                    Nenhum negócio nesta categoria
                  </div>
                )
              ) : (
                [...Array(8)].map((_, i) => (
                  <div key={i} style={{ height: 58, background: "var(--bg)", borderRadius: "var(--radius)", marginBottom: 4, animation: "pulse 1.5s ease infinite" }} />
                ))
              )}
            </div>

            {selectedBusiness && (
              <div style={{ borderTop: "1px solid var(--border)", padding: "14px", background: "var(--ocean-50)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedBusiness.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{selectedBusiness.address}</div>
                  </div>
                  <button onClick={() => setSelectedBusiness(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 16 }}>✕</button>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{selectedBusiness.shortDescription}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={`https://wa.me/${selectedBusiness.whatsapp?.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá! Vi o ${selectedBusiness.name} no Guarujá Guias.`)}`}
                    target="_blank" rel="noopener"
                    style={{ flex: 1, background: "#25D366", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "9px", textAlign: "center", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
                  >
                    💬 WhatsApp
                  </a>
                  <Link href={`/guia/${selectedBusiness.slug}`} style={{
                    flex: 1, background: "var(--ocean)", color: "white", border: "none",
                    borderRadius: "var(--radius-sm)", padding: "9px", textAlign: "center",
                    fontSize: 13, fontWeight: 700, textDecoration: "none",
                  }}>
                    Ver →
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "absolute", left: sidebarOpen ? 340 : 0, top: "50%",
          transform: "translateY(-50%)",
          background: "white", border: "1px solid var(--border)", borderLeft: "none",
          width: 20, height: 48, cursor: "pointer", zIndex: 20,
          borderRadius: "0 6px 6px 0", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "left 0.3s ease", fontSize: 10, color: "var(--text-muted)",
        }}
        aria-label={sidebarOpen ? "Fechar painel" : "Abrir painel"}
      >
        {sidebarOpen ? "‹" : "›"}
      </button>

      {/* ── MAP — div parent handles 100% width/height ── */}
      <div style={{ flex: 1, height: "100%", position: "relative" }}>
        <GuarujaMap
          selectedCategory={selectedCategory || undefined}
          onBusinessClick={setSelectedBusiness}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}
