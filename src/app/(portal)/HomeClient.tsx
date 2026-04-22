"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import BusinessCard from "../../components/portal/BusinessCard";
import Link from "next/link";

const CATEGORIES = [
  { slug: "restaurante", label: "Restaurantes", icon: "🍽️", count: "68" },
  { slug: "hospedagem",  label: "Hospedagem",   icon: "🏨", count: "42" },
  { slug: "beleza",      label: "Beleza",        icon: "💅", count: "35" },
  { slug: "turismo",     label: "Turismo",       icon: "🚤", count: "28" },
  { slug: "loja",        label: "Lojas",         icon: "🛍️", count: "55" },
  { slug: "saude",       label: "Saúde",         icon: "🏥", count: "22" },
  { slug: "cultura",     label: "Cultura",       icon: "🎭", count: "18" },
  { slug: "eventos",     label: "Eventos",       icon: "🎵", count: "31" },
  { slug: "servicos",    label: "Serviços",      icon: "⚙️", count: "47" },
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
      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(150deg, var(--ocean) 0%, #0e6080 55%, #1a9fbf 100%)",
        padding: "3rem 1rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div aria-hidden style={{
          position: "absolute", bottom: -2, left: 0, right: 0,
          height: 60, background: "var(--bg)",
          clipPath: "ellipse(62% 100% at 50% 100%)",
        }} />

        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.9)",
            padding: "4px 14px", borderRadius: 50, fontSize: 12,
            marginBottom: 16, border: "1px solid rgba(255,255,255,0.25)",
          }}>
            🌊 O guia oficial do litoral paulista
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 8vw, 52px)",
            color: "white", lineHeight: 1.15, marginBottom: 12, fontWeight: 600,
          }}>
            Descubra o melhor<br />
            de <em style={{ color: "var(--sand-dark)" }}>Guarujá</em>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "clamp(14px, 3.5vw, 17px)", marginBottom: 28, lineHeight: 1.6 }}>
            Restaurantes, hotéis, salões e muito mais — tudo em um só lugar
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{
            display: "flex", maxWidth: 520, margin: "0 auto 20px",
            background: "white", borderRadius: 50, overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Restaurante, pousada, salão..."
              style={{
                flex: 1, border: "none", outline: "none",
                padding: "14px 16px", fontSize: 15,
                fontFamily: "var(--font-body)", background: "transparent",
                minWidth: 0,
              }}
            />
            <button type="submit" style={{
              background: "var(--coral)", color: "white", border: "none",
              padding: "0 20px", cursor: "pointer", fontSize: 14, fontWeight: 700,
              flexShrink: 0,
            }}>
              Buscar
            </button>
          </form>

          {/* Quick tags — horizontal scroll on mobile */}
          <div style={{
            display: "flex", gap: 8, justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {["🍽️ Restaurantes", "🏖️ Pousadas", "🚤 Passeios", "💅 Beleza"].map((tag) => (
              <button key={tag} onClick={() => {
                const parts = tag.split(" ");
                const word = parts[1].toLowerCase();
                const cat = word === "pousadas" ? "hospedagem" : word === "passeios" ? "turismo" : word;
                router.push(`/diretorio?cat=${cat}`);
              }} style={{
                background: "rgba(255,255,255,0.15)", color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "6px 14px", borderRadius: 50, fontSize: 13, cursor: "pointer",
                minHeight: 36,
              }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto", padding: "1.25rem 1rem",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
        }}>
          {[
            { n: "347+", label: "Negócios" },
            { n: "89",   label: "Com mini-site" },
            { n: "12",   label: "Categorias" },
            { n: "4.7★", label: "Avaliação média" },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 5vw, 28px)", color: "var(--ocean)", fontWeight: 600 }}>{n}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAP CTA ── */}
      <section style={{ padding: "1rem", background: "var(--ocean-50)" }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap",
        }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 2 }}>
              📍 Mapa interativo
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Negócios próximos a você em tempo real
            </p>
          </div>
          <Link href="/mapa" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
            Abrir mapa →
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "2rem 1rem" }}>
        <h2 className="section-title" style={{ marginBottom: 4 }}>Categorias</h2>
        <p className="section-sub">Encontre o que você procura</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}>
          {/* 3 cols on mobile, more on desktop */}
          <style>{`
            @media (min-width: 480px) { .cat-grid { grid-template-columns: repeat(4, 1fr) !important; } }
            @media (min-width: 768px) { .cat-grid { grid-template-columns: repeat(5, 1fr) !important; } }
            @media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(9, 1fr) !important; } }
          `}</style>
          {CATEGORIES.map(({ slug, label, icon, count }) => (
            <Link key={slug} href={`/diretorio?cat=${slug}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white", borderRadius: "var(--radius)",
                padding: "14px 8px", textAlign: "center",
                border: "1.5px solid transparent",
                transition: "all 0.2s", cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{ fontSize: "clamp(22px, 5vw, 30px)", marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: "clamp(10px, 2.5vw, 12px)", fontWeight: 600, color: "var(--text)", marginBottom: 1, lineHeight: 1.2 }}>{label}</div>
                <div style={{ fontSize: 10, color: "var(--text-hint)" }}>{count}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section style={{ padding: "0 1rem 2rem", background: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, paddingTop: "2rem" }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: 2 }}>Destaques</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Bem avaliados pela comunidade</p>
          </div>
          <Link href="/diretorio" style={{ color: "var(--ocean-mid)", textDecoration: "none", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            Ver todos →
          </Link>
        </div>

        {featured ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
            gap: 16,
          }}>
            {featured.map((biz) => (
              <BusinessCard key={biz._id} business={biz} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ height: 240, background: "var(--bg)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s ease infinite" }} />
            ))}
          </div>
        )}
      </section>

      {/* ── PLANS ── */}
      <section id="planos" style={{ padding: "2rem 1rem", background: "var(--bg)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 className="section-title">Para comerciantes</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Coloque seu negócio no mapa — literalmente</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
          }}>
            <style>{`
              @media (min-width: 600px) { .plans-grid { grid-template-columns: 1fr 1fr !important; } }
            `}</style>

            {/* Free */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <span className="badge badge-free" style={{ marginBottom: 12, display: "inline-block" }}>GRATUITO</span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, marginBottom: 2 }}>R$ 0</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>Para sempre</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {["✅ Listagem no portal", "✅ Aparece no mapa", "✅ Botão WhatsApp", "❌ Mini-site", "❌ Agendamento"].map(i => (
                  <li key={i} style={{ fontSize: 14, color: i.startsWith("❌") ? "var(--text-hint)" : "var(--text)" }}>{i}</li>
                ))}
              </ul>
              <Link href="/cadastro" className="btn btn-secondary btn-full">Cadastrar grátis</Link>
            </div>

            {/* Pro */}
            <div className="card" style={{ padding: "1.5rem", border: "2px solid var(--ocean)", position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: 14, right: -20,
                background: "var(--sand-dark)", color: "white",
                fontSize: 10, fontWeight: 700, padding: "3px 28px", transform: "rotate(35deg)",
              }}>POPULAR</div>
              <span className="badge badge-pro" style={{ marginBottom: 12, display: "inline-block" }}>PRO</span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, marginBottom: 2 }}>R$ 50</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>por mês · cancele quando quiser</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {["✅ Tudo do gratuito", "✅ Mini-site personalizado", "✅ Agendamento online", "✅ Galeria de fotos", "✅ Lista de serviços"].map(i => (
                  <li key={i} style={{ fontSize: 14 }}>{i}</li>
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
