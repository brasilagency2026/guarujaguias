import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const NAV = [
  { href: "/dashboard",              icon: "📊", label: "Visão geral" },
  { href: "/dashboard/perfil",       icon: "✏️", label: "Perfil" },
  { href: "/dashboard/mini-site",    icon: "🌐", label: "Mini-site" },
  { href: "/dashboard/fotos",        icon: "📸", label: "Fotos" },
  { href: "/dashboard/agendamentos", icon: "📅", label: "Agenda" },
  { href: "/dashboard/assinatura",   icon: "💳", label: "Assinatura" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/login?redirect=/dashboard");

  return (
    <>
      <style>{`
        /* ─── Dashboard layout ─────────────────────── */
        .dash-wrap {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
          /* Reserve space for mobile bottom nav */
          padding-bottom: 64px;
        }
        @media (min-width: 768px) {
          .dash-wrap { padding-bottom: 0; }
        }

        /* ─── Sidebar — hidden on mobile ──────────── */
        .dash-sidebar {
          display: none;
        }
        @media (min-width: 768px) {
          .dash-sidebar {
            display: flex;
            width: 220px;
            flex-shrink: 0;
            background: white;
            border-right: 1px solid var(--border);
            padding: 1.5rem 0;
            flex-direction: column;
            position: sticky;
            top: 0;
            height: 100vh;
          }
        }

        /* ─── Main content ─────────────────────────── */
        .dash-main {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          min-width: 0;
        }
        @media (min-width: 768px) {
          .dash-main { padding: 2rem; }
        }

        /* ─── Bottom nav — mobile only ────────────── */
        .dash-bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: white;
          border-top: 1px solid var(--border);
          z-index: 100;
          height: 64px;
          padding: 0 4px;
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        @media (min-width: 768px) {
          .dash-bottom-nav { display: none; }
        }

        .dash-bottom-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          text-decoration: none;
          color: var(--text-hint);
          font-size: 10px;
          font-weight: 500;
          padding: 8px 4px;
          border-radius: var(--radius-sm);
          transition: color 0.15s;
          min-width: 0;
        }
        .dash-bottom-item.active {
          color: var(--ocean);
        }
        .dash-bottom-item span:first-child {
          font-size: 20px;
          line-height: 1;
        }
        .dash-bottom-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          text-align: center;
        }

        /* ─── Sidebar nav item ─────────────────────── */
        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.15s;
          margin-bottom: 2px;
        }
        .dash-nav-item:hover { background: var(--bg); color: var(--text); }
        .dash-nav-item.active { background: var(--ocean-50); color: var(--ocean); font-weight: 600; }
      `}</style>

      {/* Mobile top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--ocean)", color: "white",
        padding: "0 1rem",
        height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }} className="show-mobile">
        <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "white", textDecoration: "none" }}>
          🌊 Guarujá <em style={{ color: "var(--sand-dark)" }}>Guias</em>
        </Link>
        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 30, height: 30 } } }} />
      </div>

      <div className="dash-wrap">
        {/* Sidebar (desktop) */}
        <aside className="dash-sidebar">
          <div style={{ padding: "0 1rem 1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "0.5rem" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ocean)" }}>
                🌊 Guarujá <em style={{ color: "var(--sand-dark)" }}>Guias</em>
              </div>
            </Link>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>Painel do comerciante</div>
          </div>

          <nav style={{ flex: 1, padding: "0 8px" }}>
            {NAV.map(({ href, icon, label }) => (
              <Link key={href} href={href} className="dash-nav-item">
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div style={{ padding: "1rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <UserButton afterSignOutUrl="/" />
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Minha conta</div>
          </div>
        </aside>

        {/* Main */}
        <main className="dash-main">
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="dash-bottom-nav">
        {NAV.slice(0, 5).map(({ href, icon, label }) => (
          <Link key={href} href={href} className="dash-bottom-item">
            <span>{icon}</span>
            <span className="dash-bottom-label">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
