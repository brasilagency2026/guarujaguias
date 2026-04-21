import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const NAV = [
  { href: "/dashboard",              icon: "📊", label: "Visão geral" },
  { href: "/dashboard/perfil",       icon: "✏️", label: "Editar perfil" },
  { href: "/dashboard/mini-site",    icon: "🌐", label: "Meu mini-site" },
  { href: "/dashboard/fotos",        icon: "📸", label: "Fotos" },
  { href: "/dashboard/agendamentos", icon: "📅", label: "Agendamentos" },
  { href: "/dashboard/assinatura",   icon: "💳", label: "Assinatura" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/login?redirect=/dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: "white", borderRight: "1px solid var(--border)",
        padding: "1.5rem 0", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{ padding: "0 1rem 1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "0.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ocean)" }}>
              🌊 Guarujá <em style={{ color: "var(--sand-dark)" }}>Guias</em>
            </div>
          </Link>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Painel do comerciante</div>
        </div>

        <nav style={{ flex: 1, padding: "0 8px" }}>
          {NAV.map(({ href, icon, label }) => (
            <Link key={href} href={href} style={{ textDecoration: "none", display: "block", marginBottom: 2 }}>
              <div style={{
                padding: "10px 12px", borderRadius: "var(--radius-sm)", fontSize: 14,
                display: "flex", alignItems: "center", gap: 10,
                color: "var(--text-muted)",
                transition: "all 0.15s",
              }}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div style={{ padding: "1rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <UserButton afterSignOutUrl="/" />
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Minha conta</div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
