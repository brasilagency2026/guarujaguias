import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem",
      background: "var(--bg)", textAlign: "center",
    }}>
      <div style={{ fontSize: 80, marginBottom: "1rem" }}>🌊</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, marginBottom: 8, color: "var(--ocean)" }}>
        404
      </h1>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>
        Página não encontrada
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 380, lineHeight: 1.7, marginBottom: "2rem" }}>
        Esta página não existe ou foi removida. Pode ser que o negócio tenha mudado seu endereço.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-primary">
          ← Ir para a página inicial
        </Link>
        <Link href="/diretorio" className="btn btn-secondary">
          Ver diretório de negócios
        </Link>
      </div>
    </div>
  );
}
