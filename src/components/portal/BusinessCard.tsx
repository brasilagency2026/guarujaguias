import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  restaurante: "var(--ocean)",
  hospedagem:  "var(--sand-dark)",
  beleza:      "#c2185b",
  turismo:     "var(--ocean-mid)",
  loja:        "var(--purple)",
  saude:       "var(--green)",
  cultura:     "#6d3aed",
  servicos:    "var(--text-muted)",
  eventos:     "var(--coral)",
};

const CATEGORY_LABELS: Record<string, string> = {
  restaurante: "Restaurante",
  hospedagem:  "Hospedagem",
  beleza:      "Beleza & Estética",
  turismo:     "Turismo",
  loja:        "Loja",
  saude:       "Saúde",
  cultura:     "Cultura",
  servicos:    "Serviços",
  eventos:     "Eventos",
};

const CATEGORY_ICONS: Record<string, string> = {
  restaurante: "🍽️", hospedagem: "🏨", beleza: "💅", turismo: "🚤",
  loja: "🛍️", saude: "🏥", cultura: "🎭", servicos: "⚙️", eventos: "🎵",
};

const CF_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_HASH;

interface Props {
  business: any;
  showDistance?: boolean;
}

export default function BusinessCard({ business: biz, showDistance }: Props) {
  const color = CATEGORY_COLORS[biz.category] ?? "var(--text-muted)";

  return (
    <Link href={`/guia/${biz.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <article style={{
        background: "white", borderRadius: "var(--radius-lg)", overflow: "hidden",
        border: "1px solid var(--border)", transition: "all 0.22s",
        height: "100%", display: "flex", flexDirection: "column",
      }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Cover image or placeholder */}
        <div style={{
          height: 140, overflow: "hidden", position: "relative",
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {biz.coverImageId ? (
            <img
              src={`https://imagedelivery.net/${CF_HASH}/${biz.coverImageId}/card`}
              alt={biz.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 52, opacity: 0.5 }}>{CATEGORY_ICONS[biz.category]}</span>
          )}

          {/* Pro badge */}
          {biz.hasMiniSite && (
            <div style={{
              position: "absolute", top: 10, right: 10,
              background: "var(--ocean)", color: "white",
              fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50,
            }}>
              ✓ Mini-site
            </div>
          )}

          {/* Distance badge */}
          {showDistance && biz.distanceKm != null && (
            <div style={{
              position: "absolute", bottom: 10, left: 10,
              background: "rgba(0,0,0,0.6)", color: "white",
              fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
            }}>
              📍 {biz.distanceKm.toFixed(1)} km
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
            {CATEGORY_LABELS[biz.category]}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 5, color: "var(--text)", lineHeight: 1.3 }}>
            {biz.name}
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", flex: 1, lineHeight: 1.5 }}>
            {biz.shortDescription}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: 12, color: "var(--text-hint)" }}>
              📍 {biz.neighborhood}
            </span>
            {biz.avgRating ? (
              <span style={{ fontSize: 13, color: "var(--sand-dark)", fontWeight: 600 }}>
                ★ {biz.avgRating.toFixed(1)}
              </span>
            ) : (
              <span style={{ fontSize: 12, color: "var(--text-hint)" }}>Novo</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
