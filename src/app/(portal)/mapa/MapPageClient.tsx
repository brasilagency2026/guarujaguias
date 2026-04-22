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
  { slug: "beleza",      label: "Beleza",       icon: "💅" },
  { slug: "turismo",     label: "Turismo",      icon: "🚤" },
  { slug: "loja",        label: "Lojas",        icon: "🛍️" },
  { slug: "saude",       label: "Saúde",        icon: "🏥" },
  { slug: "cultura",     label: "Cultura",      icon: "🎭" },
];

export default function MapPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const businesses = useQuery(api.businesses.listActive, {
    category: selectedCategory || undefined,
    limit: 100,
  });

  const handleBusinessClick = (biz: any) => {
    setSelectedBusiness(biz);
    setSheetOpen(true);
  };

  return (
    <div style={{ height: "calc(100vh - var(--nav-h))", position: "relative", overflow: "hidden" }}>

      {/* ── Category filter bar (top) ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
        padding: "8px 8px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
          {CATEGORY_FILTERS.map(({ slug, label, icon }) => (
            <button key={slug} onClick={() => setSelectedCategory(slug)} style={{
              padding: "6px 12px", borderRadius: 50, fontSize: 12, fontWeight: 600,
              cursor: "pointer", border: "none", whiteSpace: "nowrap",
              background: selectedCategory === slug ? "var(--ocean)" : "var(--bg)",
              color: selectedCategory === slug ? "white" : "var(--text-muted)",
              transition: "all 0.15s",
              minHeight: 36,
            }}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Full screen map ── */}
      <GuarujaMap
        selectedCategory={selectedCategory || undefined}
        onBusinessClick={handleBusinessClick}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%", paddingTop: 52 }}
      />

      {/* ── Business list button (mobile) ── */}
      <button
        onClick={() => setSheetOpen(!sheetOpen)}
        style={{
          position: "absolute", bottom: 24, left: "50%",
          transform: "translateX(-50%)",
          background: "var(--ocean)", color: "white",
          border: "none", borderRadius: 50,
          padding: "12px 24px", fontSize: 14, fontWeight: 700,
          cursor: "pointer", zIndex: 20,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", gap: 8,
          whiteSpace: "nowrap",
        }}
      >
        📋 Ver lista ({businesses?.length ?? "..."})
      </button>

      {/* ── Bottom sheet — business list ── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        background: "white",
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.15)",
        zIndex: 30,
        maxHeight: "70vh",
        transform: sheetOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Handle */}
        <div style={{ padding: "12px", textAlign: "center", flexShrink: 0 }} onClick={() => setSheetOpen(false)}>
          <div style={{ width: 40, height: 4, background: "var(--border-mid)", borderRadius: 2, margin: "0 auto" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "0 1rem 12px", borderBottom: "1px solid var(--border)", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
            Negócios {selectedCategory ? `· ${CATEGORY_FILTERS.find(c => c.slug === selectedCategory)?.label}` : ""}
          </div>
          <button onClick={() => setSheetOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--text-muted)" }}>✕</button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {businesses?.map((biz) => (
            <button key={biz._id} onClick={() => { setSelectedBusiness(biz); }}
              style={{
                width: "100%", background: selectedBusiness?._id === biz._id ? "var(--ocean-50)" : "transparent",
                border: selectedBusiness?._id === biz._id ? "1.5px solid var(--ocean-light)" : "1.5px solid transparent",
                borderRadius: "var(--radius)", padding: "10px 12px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12, marginBottom: 4,
                textAlign: "left", transition: "all 0.15s", minHeight: 60,
              }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--bg)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {({ restaurante: "🍽️", hospedagem: "🏨", beleza: "💅", turismo: "🚤", loja: "🛍️", saude: "🏥", cultura: "🎭", servicos: "⚙️", eventos: "🎵" } as Record<string, string>)[biz.category]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{biz.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{biz.neighborhood}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected business quick action */}
        {selectedBusiness && (
          <div style={{ borderTop: "1px solid var(--border)", padding: "1rem", background: "var(--ocean-50)", flexShrink: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{selectedBusiness.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>{selectedBusiness.shortDescription}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={`https://wa.me/${selectedBusiness.whatsapp?.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá! Vi o ${selectedBusiness.name} no Guarujá Guias.`)}`}
                target="_blank" rel="noopener"
                style={{ flex: 1, background: "#25D366", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "10px", textAlign: "center", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                💬 WhatsApp
              </a>
              <Link href={`/guia/${selectedBusiness.slug}`} style={{
                flex: 1, background: "var(--ocean)", color: "white", borderRadius: "var(--radius-sm)", padding: "10px", textAlign: "center", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                Ver →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
