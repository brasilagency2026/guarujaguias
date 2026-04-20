import Link from "next/link";

const CATS = [
  ["restaurante", "🍽️ Restaurantes"],
  ["hospedagem",  "🏨 Hospedagem"],
  ["beleza",      "💅 Beleza"],
  ["turismo",     "🚤 Turismo"],
  ["loja",        "🛍️ Lojas"],
  ["saude",       "🏥 Saúde"],
  ["cultura",     "🎭 Cultura"],
  ["eventos",     "🎵 Eventos"],
];

export default function PortalFooter() {
  return (
    <footer style={{ background: "#0a1628", color: "rgba(255,255,255,0.7)", marginTop: "4rem" }}>
      <div className="container" style={{ padding: "3rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>

        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "white", marginBottom: 10 }}>
            🌊 Guarujá <span style={{ color: "var(--sand-dark)", fontStyle: "italic" }}>Guias</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 240 }}>
            O guia completo de negócios e serviços de Guarujá, SP. Cadastro gratuito para comerciantes.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {["📷", "👍", "🐦"].map((icon, i) => (
              <span key={i} style={{ fontSize: 20, cursor: "pointer", opacity: 0.7 }}>{icon}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Categorias</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {CATS.map(([slug, label]) => (
              <Link key={slug} href={`/diretorio?cat=${slug}`} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: 13, transition: "color 0.15s" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Comerciantes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["/cadastro",        "Cadastrar meu negócio"],
              ["/cadastro#planos", "Ver planos e preços"],
              ["/dashboard",       "Meu painel"],
              ["/ajuda",           "Central de ajuda"],
            ].map(([href, label]) => (
              <Link key={href} href={href} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: 13 }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Guarujá</div>
          <div style={{ fontSize: 13, lineHeight: 2, color: "rgba(255,255,255,0.65)" }}>
            Guarujá, SP<br />
            Litoral Paulista<br />
            Brasil<br />
            <a href="mailto:contato@guarujaguias.com.br" style={{ color: "var(--sand-dark)", textDecoration: "none" }}>
              contato@guarujaguias.com.br
            </a>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13 }}>© {new Date().getFullYear()} Guarujá Guias. Todos os direitos reservados.</span>
        <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
          <Link href="/privacidade" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Privacidade</Link>
          <Link href="/termos" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Termos</Link>
          <Link href="/admin" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Admin</Link>
        </div>
      </div>
    </footer>
  );
}
