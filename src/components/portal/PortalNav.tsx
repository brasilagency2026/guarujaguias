"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/mapa",      label: "Mapa",      icon: "🗺️" },
  { href: "/diretorio", label: "Diretório", icon: "📋" },
  { href: "/eventos",   label: "Eventos",   icon: "🎵" },
];

export default function PortalNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      height: "var(--nav-h)",
      background: "rgba(10,79,110,0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 1.5rem",
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🌊</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "white", fontWeight: 600 }}>
          Guarujá <span style={{ color: "var(--sand-dark)", fontStyle: "italic" }}>Guias</span>
        </span>
      </Link>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hide-mobile">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} style={{
            color: pathname === href ? "white" : "rgba(255,255,255,0.72)",
            textDecoration: "none", padding: "7px 14px", borderRadius: "var(--radius-sm)",
            fontSize: 14, fontWeight: pathname === href ? 600 : 400,
            background: pathname === href ? "rgba(255,255,255,0.15)" : "transparent",
            transition: "all 0.15s",
          }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Right CTAs */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Show dashboard link + UserButton when logged in */}
        <SignedIn>
          <Link href="/dashboard" style={{
            color: "rgba(255,255,255,0.8)", textDecoration: "none",
            fontSize: 13, padding: "6px 12px",
          }} className="hide-mobile">
            Meu painel
          </Link>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: { width: 32, height: 32 },
              },
            }}
          />
        </SignedIn>

        {/* Show login + register when logged out */}
        <SignedOut>
          <Link href="/login" style={{
            color: "rgba(255,255,255,0.8)", textDecoration: "none",
            fontSize: 13, padding: "6px 12px",
          }} className="hide-mobile">
            Entrar
          </Link>
          <Link href="/cadastro" style={{
            background: "var(--sand-dark)", color: "white", textDecoration: "none",
            padding: "8px 18px", borderRadius: "var(--radius-sm)",
            fontSize: 13, fontWeight: 700,
          }}>
            + Cadastrar negócio
          </Link>
        </SignedOut>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent", border: "none", color: "white",
            cursor: "pointer", fontSize: 20, padding: "4px",
          }}
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "var(--nav-h)", left: 0, right: 0, bottom: 0,
          background: "rgba(10,79,110,0.98)", zIndex: 999,
          display: "flex", flexDirection: "column", padding: "2rem", gap: 8,
        }}>
          {NAV_LINKS.map(({ href, label, icon }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              color: "white", textDecoration: "none", padding: "14px 16px",
              borderRadius: "var(--radius)", fontSize: 18,
              background: "rgba(255,255,255,0.1)",
            }}>
              {icon} {label}
            </Link>
          ))}
          <SignedIn>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{
              color: "white", textDecoration: "none", padding: "14px 16px",
              borderRadius: "var(--radius)", fontSize: 18,
              background: "rgba(255,255,255,0.1)",
            }}>
              📊 Meu painel
            </Link>
          </SignedIn>
          <Link href="/cadastro" onClick={() => setMenuOpen(false)} style={{
            color: "white", textDecoration: "none", padding: "14px 16px",
            borderRadius: "var(--radius)", fontSize: 18,
            background: "var(--sand-dark)", fontWeight: 700, marginTop: 8,
          }}>
            ＋ Cadastrar negócio
          </Link>
          <SignedOut>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              color: "white", textDecoration: "none", padding: "14px 16px",
              borderRadius: "var(--radius)", fontSize: 18,
              background: "rgba(255,255,255,0.1)",
            }}>
              🔑 Entrar
            </Link>
          </SignedOut>
        </div>
      )}
    </nav>
  );
}
