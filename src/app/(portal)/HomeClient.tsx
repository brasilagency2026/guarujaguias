"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import BusinessCard from "../../components/portal/BusinessCard";
import Link from "next/link";

const CATEGORIES = [
  { slug: "restaurante", label: "Restaurantes",  icon: "🍽️", count: "68" },
  { slug: "hospedagem",  label: "Hospedagem",     icon: "🏨", count: "42" },
  { slug: "beleza",      label: "Beleza",          icon: "💅", count: "35" },
  { slug: "turismo",     label: "Turismo",         icon: "🚤", count: "28" },
  { slug: "loja",        label: "Lojas",           icon: "🛍️", count: "55" },
  { slug: "saude",       label: "Saúde",           icon: "🏥", count: "22" },
  { slug: "cultura",     label: "Cultura",         icon: "🎭", count: "18" },
  { slug: "eventos",     label: "Eventos",         icon: "🎵", count: "31" },
  { slug: "servicos",    label: "Serviços",        icon: "⚙️", count: "47" },
];

export default function HomeClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const featured = useQuery(api.businesses.listActive, { limit: 6 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/diretorio?q=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(150deg, var(--ocean) 0%, #0e6080 55%, #1a9fbf 100%)",
        padding: "5rem 1.5rem 6rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative waves */}
        <div aria-hidden style={{
          position: "absolute", bottom: -2, left: 0, right: 0,
          height: 80, background: "var(--bg)",
          clipPath: "ellipse(62% 100% at 50% 100%)",
        }} />
        <div aria-hidden style={{
          position: "absolute", top: -60, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />
        <div aria-hidden style={{
          position: "absolute", bottom: 60, left: -60,
          width: 280, height: 280, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />

        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.9)",
            padding: "5px 16px", borderRadius: 50, fontSize: 13,
            marginBottom: 20, border: "1px solid rgba(255,255,255,0.25)",
          }}>
            🌊 O guia oficial do litoral paulista
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(34px, 6vw, 56px)",
            color: "white", lineHeight: 1.1, marginBottom: 16,
            fontWeight: 600,
          }}>
            Descubra o melhor<br />
            de <em style={{ color: "var(--sand-dark)" }}>Guarujá</em>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 18, marginBottom: 36, lineHeight: 1.6 }}>
            Restaurantes, hotéis, salões, passeios e muito mais —<br className="hide-mobile" /> tudo em um só lugar, com mapa interativo.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            display: "flex", maxWidth: 560, margin: "0 auto 24px",
            background: "white", borderRadius: 50, overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Restaurante, pousada, salão de beleza..."
              style={{
                flex: 1, border: "none", outline: "none",
                padding: "16px 22px", fontSize: 15,
                fontFamily: "var(--font-body)", background: "transparent",
              }}
            />
            <button type="submit" style={{
              background: "var(--coral)", color: "white", border: "none",
              padding: "0 28px", cursor: "pointer", fontSize: 14, fontWeight: 700,
              transition: "background 0.15s",
            }}>
              Buscar
            </button>
          </form>

          {/* Quick tags */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["🍽️ Restaurantes", "🏖️ Pousadas", "🚤 Passeios", "💅 Beleza", "🎵 Eventos"].map((tag) => (
              <button key={tag} onClick={() => {
                const cat = tag.split(" ")[1].toLowerCase();
                router.push(`/diretorio?cat=${cat === "pousadas" ? "hospedagem" : cat === "passeios" ? "turismo" : cat}`);
              }} style={{
                background: "rgba(255,255,255,0.15)", color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "6px 16px", borderRadius: 50, fontSize: 13, cursor: "pointer",
                transition: "background 0.15s",
              }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────── */}
      <section style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center", gap: "3rem", padding: "1.5rem", flexWrap: "wrap" }}>
          {[
            { n: "347+", label: "Negócios cadastrados" },
            { n: "89",   label: "Com mini-site" },
            { n: "12",   label: "Categorias" },
            { n: "4.7★", label: "Avaliação média" },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ocean)", fontWeight: 600 }}>{n}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAP PREVIEW CTA ─────────────────────────────── */}
      <section style={{ padding: "2rem 1.5rem", background: "var(--ocean-50)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 6 }}>
              📍 Explore no mapa interativo
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Encontre negócios próximos à sua localização em tempo real
            </p>
          </div>
          <Link href="/mapa" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Abrir mapa →
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────── */}
      <section className="section container">
        <h2 className="section-title">Categorias</h2>
        <p className="section-sub">Encontre o que você procura</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 12 }}>
          {CATEGORIES.map(({ slug, label, icon, count }) => (
            <Link key={slug} href={`/diretorio?cat=${slug}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white", borderRadius: "var(--radius-lg)", padding: "20px 12px",
                textAlign: "center", border: "1.5px solid transparent",
                transition: "all 0.2s", cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--ocean-mid)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: "var(--text-hint)" }}>{count} locais</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED BUSINESSES ─────────────────────────── */}
      <section className="section" style={{ background: "white" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 className="section-title">Destaques</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>Bem avaliados pela comunidade</p>
            </div>
            <Link href="/diretorio" style={{ color: "var(--ocean-mid)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Ver todos →
            </Link>
          </div>

          {featured ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginTop: 24 }}>
              {featured.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginTop: 24 }}>
              {[1,2,3].map((i) => (
                <div key={i} style={{ height: 280, background: "#f0f0f0", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s ease infinite" }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PLANS / CTA FOR BUSINESSES ──────────────────── */}
      <section id="planos" className="section" style={{ background: "var(--bg)" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 className="section-title">Para comerciantes</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16 }}>Coloque seu negócio no mapa — literalmente</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Free plan */}
            <div className="card" style={{ padding: "2rem" }}>
              <div className="badge badge-free" style={{ marginBottom: 14 }}>GRATUITO</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>R$ 0</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>Para sempre</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  "✅ Listagem no portal",
                  "✅ Aparece no mapa",
                  "✅ Botão WhatsApp",
                  "✅ Avaliações",
                  "❌ Mini-site próprio",
                  "❌ Agendamento online",
                  "❌ Galeria de fotos",
                ].map((item) => (
                  <li key={item} style={{ fontSize: 14, color: item.startsWith("❌") ? "var(--text-hint)" : "var(--text)" }}>{item}</li>
                ))}
              </ul>
              <Link href="/cadastro" className="btn btn-secondary btn-full">
                Cadastrar grátis
              </Link>
            </div>

            {/* Pro plan */}
            <div className="card" style={{ padding: "2rem", border: "2px solid var(--ocean)", position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: 16, right: -24,
                background: "var(--sand-dark)", color: "white",
                fontSize: 11, fontWeight: 700, padding: "4px 32px", transform: "rotate(35deg)",
              }}>
                POPULAR
              </div>
              <div className="badge badge-pro" style={{ marginBottom: 14 }}>PRO</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>R$ 50</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>por mês · cancele quando quiser</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  "✅ Tudo do plano gratuito",
                  "✅ Mini-site personalizado",
                  "✅ URL própria /guia/seu-negocio",
                  "✅ Agendamento online",
                  "✅ Galeria de até 20 fotos",
                  "✅ Lista de serviços com preços",
                  "✅ Redes sociais integradas",
                  "✅ Estatísticas de visitas",
                ].map((item) => (
                  <li key={item} style={{ fontSize: 14 }}>{item}</li>
                ))}
              </ul>
              <Link href="/cadastro?plano=pro" className="btn btn-primary btn-full">
                Começar por R$ 50/mês
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
