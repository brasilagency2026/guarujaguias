import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(150deg, var(--ocean) 0%, #0e6080 55%, #1a9fbf 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem",
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", marginBottom: "2rem" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "white", textAlign: "center" }}>
          🌊 Guarujá <span style={{ color: "var(--sand-dark)", fontStyle: "italic" }}>Guias</span>
        </div>
      </Link>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 420 }}>
        {children}
      </div>

      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: "2rem" }}>
        © {new Date().getFullYear()} Guarujá Guias
      </p>
    </div>
  );
}
