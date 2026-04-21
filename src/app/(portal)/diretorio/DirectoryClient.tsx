"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import BusinessCard from "../../../components/portal/BusinessCard";

// avgRating is not in the DB schema — it's computed at query time.
// We extend the base type so TypeScript accepts it throughout this component.
type BusinessListing = {
  _id: any;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  neighborhood: string;
  hasMiniSite: boolean;
  coverImageId?: string;
  viewCount: number;
  createdAt: number;
  avgRating?: number;
  [key: string]: any;
};

const CATEGORIES = [
  { slug: "",            label: "Todos",        icon: "🗂️" },
  { slug: "restaurante", label: "Restaurantes", icon: "🍽️" },
  { slug: "hospedagem",  label: "Hospedagem",   icon: "🏨" },
  { slug: "beleza",      label: "Beleza",       icon: "💅" },
  { slug: "turismo",     label: "Turismo",      icon: "🚤" },
  { slug: "loja",        label: "Lojas",        icon: "🛍️" },
  { slug: "saude",       label: "Saúde",        icon: "🏥" },
  { slug: "cultura",     label: "Cultura",      icon: "🎭" },
  { slug: "servicos",    label: "Serviços",     icon: "⚙️" },
  { slug: "eventos",     label: "Eventos",      icon: "🎵" },
];

const NEIGHBORHOODS = [
  "Todos os bairros", "Pitangueiras", "Astúrias", "Enseada",
  "Perequê", "Jardim Virgínia", "Guaiúba", "Morrinhos", "Centro",
];

const SORT_OPTIONS = [
  { value: "recent",   label: "Mais recentes" },
  { value: "rating",   label: "Melhor avaliados" },
  { value: "views",    label: "Mais visitados" },
  { value: "alpha",    label: "A–Z" },
];

export default function DirectoryClient() {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("cat") ?? "");
  const [searchQuery, setSearchQuery] = useState(params.get("q") ?? "");
  const [neighborhood, setNeighborhood] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [onlyMiniSite, setOnlyMiniSite] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(0);
  const PER_PAGE = 12;

  const allBusinesses = useQuery(api.businesses.listActive, {
    category: category || undefined,
    limit: 200,
  });

  const searchResults = useQuery(
    api.businesses.search,
    searchQuery.trim().length >= 2
      ? { query: searchQuery, category: category || undefined }
      : "skip"
  );

  useEffect(() => {
    const cat = params.get("cat") ?? "";
    const q = params.get("q") ?? "";
    setCategory(cat);
    setSearchQuery(q);
  }, [params]);

  // Cast to BusinessListing[] to allow avgRating access
  const source = (
    searchQuery.trim().length >= 2
      ? (searchResults ?? [])
      : (allBusinesses ?? [])
  ) as BusinessListing[];

  const filtered = source
    .filter((b) => !neighborhood || b.neighborhood === neighborhood)
    .filter((b) => !onlyMiniSite || b.hasMiniSite)
    .sort((a, b) => {
      if (sortBy === "rating")  return (b.avgRating ?? 0) - (a.avgRating ?? 0);
      if (sortBy === "views")   return b.viewCount - a.viewCount;
      if (sortBy === "alpha")   return a.name.localeCompare(b.name, "pt-BR");
      return b.createdAt - a.createdAt;
    });

  const paginated = filtered.slice(0, (page + 1) * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div style={{ paddingBottom: "4rem" }}>

      {/* ── HEADER STRIP ───────────────────────────── */}
      <div style={{ background: "var(--ocean)", padding: "2.5rem 1.5rem 3.5rem", position: "relative" }}>
        <div aria-hidden style={{
          position: "absolute", bottom: -2, left: 0, right: 0, height: 60,
          background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)",
        }} />
        <div className="container" style={{ maxWidth: 860 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "white", marginBottom: 16 }}>
            Diretório de Negócios
          </h1>
          <div style={{ display: "flex", background: "white", borderRadius: 50, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <span style={{ padding: "0 0 0 20px", display: "flex", alignItems: "center", fontSize: 18, color: "var(--text-hint)" }}>🔍</span>
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Buscar negócio, serviço ou bairro..."
              style={{ flex: 1, border: "none", outline: "none", padding: "14px 16px", fontSize: 15, fontFamily: "var(--font-body)", background: "transparent" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 16px", color: "var(--text-hint)", fontSize: 18 }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* ── FILTERS ────────────────────────────────── */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", position: "sticky", top: "var(--nav-h)", zIndex: 50 }}>
        <div className="container" style={{ maxWidth: 1080 }}>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 0", scrollbarWidth: "none" }}>
            {CATEGORIES.map(({ slug, label, icon }) => (
              <button key={slug} onClick={() => { setCategory(slug); setPage(0); }} style={{
                padding: "7px 14px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                cursor: "pointer", border: "none", whiteSpace: "nowrap",
                background: category === slug ? "var(--ocean)" : "var(--bg)",
                color: category === slug ? "white" : "var(--text-muted)",
                transition: "all 0.15s", flexShrink: 0,
              }}>
                {icon} {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, padding: "8px 0 10px", alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={neighborhood}
              onChange={(e) => { setNeighborhood(e.target.value); setPage(0); }}
              style={{ padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-mid)", fontSize: 13, background: "white", cursor: "pointer", fontFamily: "var(--font-body)", outline: "none" }}
            >
              {NEIGHBORHOODS.map((n) => <option key={n} value={n === "Todos os bairros" ? "" : n}>{n}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-mid)", fontSize: 13, background: "white", cursor: "pointer", fontFamily: "var(--font-body)", outline: "none" }}
            >
              {SORT_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>

            <button
              onClick={() => setOnlyMiniSite(!onlyMiniSite)}
              style={{
                padding: "7px 14px", borderRadius: "var(--radius-sm)", fontSize: 13, cursor: "pointer",
                border: `1px solid ${onlyMiniSite ? "var(--ocean)" : "var(--border-mid)"}`,
                background: onlyMiniSite ? "var(--ocean-50)" : "white",
                color: onlyMiniSite ? "var(--ocean)" : "var(--text-muted)",
                fontWeight: onlyMiniSite ? 600 : 400, transition: "all 0.15s",
              }}
            >
              🌐 Com mini-site
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {(["grid", "list"] as const).map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  padding: "7px 12px", borderRadius: "var(--radius-sm)", fontSize: 16, cursor: "pointer",
                  border: "1px solid var(--border-mid)",
                  background: viewMode === mode ? "var(--ocean)" : "white",
                  color: viewMode === mode ? "white" : "var(--text-muted)",
                }}>
                  {mode === "grid" ? "⊞" : "≡"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RESULTS ─────────────────────────────────── */}
      <div className="container" style={{ maxWidth: 1080, paddingTop: "1.5rem" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {allBusinesses === undefined ? "Carregando..." : `${filtered.length} negócio${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
            {searchQuery && <span> para "<strong>{searchQuery}</strong>"</span>}
            {category && <span> em <strong>{CATEGORIES.find(c => c.slug === category)?.label}</strong></span>}
          </p>
          {(category || searchQuery || neighborhood || onlyMiniSite) && (
            <button onClick={() => { setCategory(""); setSearchQuery(""); setNeighborhood(""); setOnlyMiniSite(false); setPage(0); }}
              style={{ fontSize: 13, color: "var(--coral)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {/* Grid view */}
        {viewMode === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {paginated.map((biz) => <BusinessCard key={biz._id} business={biz} />)}
            {allBusinesses === undefined && [...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 280, background: "var(--bg)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s ease infinite" }} />
            ))}
          </div>
        )}

        {/* List view */}
        {viewMode === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {paginated.map((biz) => (
              <a key={biz._id} href={`/guia/${biz.slug}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
                >
                  <div style={{ width: 60, height: 60, borderRadius: "var(--radius-sm)", background: "var(--bg)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                    {biz.coverImageId
                      ? <img src={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CF_IMAGES_HASH}/${biz.coverImageId}/thumbnail`} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                      : ({ restaurante: "🍽️", hospedagem: "🏨", beleza: "💅", turismo: "🚤", loja: "🛍️", saude: "🏥", cultura: "🎭", servicos: "⚙️", eventos: "🎵" } as Record<string, string>)[biz.category]
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{biz.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{biz.shortDescription}</div>
                    <div style={{ fontSize: 12, color: "var(--text-hint)", marginTop: 2 }}>📍 {biz.neighborhood}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {biz.avgRating != null && (
                      <div style={{ color: "var(--sand-dark)", fontWeight: 700 }}>★ {(biz.avgRating as number).toFixed(1)}</div>
                    )}
                    {biz.hasMiniSite && <div style={{ fontSize: 11, color: "var(--ocean)", fontWeight: 600, marginTop: 3 }}>🌐 Mini-site</div>}
                  </div>
                  <div style={{ color: "var(--text-hint)", fontSize: 20 }}>›</div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && allBusinesses !== undefined && (
          <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>Nenhum resultado encontrado</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>Tente outros filtros ou cadastre seu negócio gratuitamente</p>
            <a href="/cadastro" className="btn btn-primary">Cadastrar meu negócio</a>
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button onClick={() => setPage((p) => p + 1)} className="btn btn-secondary">
              Carregar mais ({filtered.length - paginated.length} restantes)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
