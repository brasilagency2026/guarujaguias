"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton, SignUpButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/mapa",      label: "Mapa",      icon: "🗺️" },
  { href: "/diretorio", label: "Diretório", icon: "📋" },
  { href: "/eventos",   label: "Eventos",   icon: "🎵" },
];

export default function PortalNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: "var(--nav-h)",
        background: "rgba(10,79,110,0.97)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1rem",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🌊</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "white", fontWeight: 600 }}>
            Guarujá <span style={{ color: "var(--sand-dark)", fontStyle: "italic" }}>Guias</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hide-mobile-flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              color: pathname === href ? "white" : "rgba(255,255,255,0.72)",
              textDecoration: "none", padding: "7px 12px", borderRadius: "var(--radius-sm)",
              fontSize: 14, fontWeight: pathname === href ? 600 : 400,
              background: pathname === href ? "rgba(255,255,255,0.15)" : "transparent",
              transition: "all 0.15s",
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SignedIn>
            <Link href="/dashboard" className="hide-mobile" style={{
              color: "rgba(255,255,255,0.8)", textDecoration: "none",
              fontSize: 13, padding: "6px 10px",
            }}>
              Meu painel
            </Link>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
          </SignedIn>

          <SignedOut>
            <Link href="/login" className="hide-mobile" style={{
              color: "rgba(255,255,255,0.8)", textDecoration: "none",
              fontSize: 13, padding: "6px 10px",
            }}>
              Entrar
            </Link>
            <SignUpButton>
              <button className="hide-mobile" style={{
                background: "var(--sand-dark)", color: "white", textDecoration: "none",
                padding: "8px 14px", borderRadius: "var(--radius-sm)",
                fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
              }}>
                + Cadastrar
              </button>
            </SignUpButton>
          </SignedOut>

          {/* Hamburger — always visible */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: menuOpen ? "rgba(255,255,255,0.15)" : "transparent",
              border: "none", color: "white",
              cursor: "pointer", fontSize: 22, padding: "8px",
              borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40,
              transition: "background 0.15s",
            }}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Mobile drawer */}
      <div style={{
        position: "fixed",
        top: "var(--nav-h)", right: 0, bottom: 0,
        width: "min(280px, 80vw)",
        background: "#0a4f6e",
        zIndex: 1000,
        display: "flex", flexDirection: "column",
        padding: "1rem",
        gap: 6,
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflowY: "auto",
        boxShadow: menuOpen ? "-4px 0 24px rgba(0,0,0,0.3)" : "none",
      }}>
        {NAV_LINKS.map(({ href, label, icon }) => (
          <Link key={href} href={href} style={{
            color: "white", textDecoration: "none",
            padding: "14px 16px",
            borderRadius: "var(--radius)",
            fontSize: 16, fontWeight: 500,
            background: pathname === href ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12,
            minHeight: 52,
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            {label}
          </Link>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "8px 0" }} />

        <SignedIn>
          <Link href="/dashboard" style={{
            color: "white", textDecoration: "none",
            padding: "14px 16px", borderRadius: "var(--radius)",
            fontSize: 16, fontWeight: 500,
            background: "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12,
            minHeight: 52,
          }}>
            <span style={{ fontSize: 20 }}>📊</span>
            Meu painel
          </Link>
        </SignedIn>

        <SignedIn>
          <Link href="/cadastro" style={{
            color: "white", textDecoration: "none",
            padding: "14px 16px", borderRadius: "var(--radius)",
            fontSize: 16, fontWeight: 700,
            background: "var(--sand-dark)",
            display: "flex", alignItems: "center", gap: 12,
            minHeight: 52,
          }}>
            <span style={{ fontSize: 20 }}>＋</span>
            Cadastrar negócio
          </Link>
        </SignedIn>

        <SignedOut>
          <SignUpButton>
            <button style={{
              color: "white", textDecoration: "none",
              padding: "14px 16px", borderRadius: "var(--radius)",
              fontSize: 16, fontWeight: 700,
              background: "var(--sand-dark)",
              display: "flex", alignItems: "center", gap: 12,
              minHeight: 52, border: "none", cursor: "pointer",
            }}>
              <span style={{ fontSize: 20 }}>＋</span>
              Cadastrar negócio
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedOut>
          <Link href="/login" style={{
            color: "white", textDecoration: "none",
            padding: "14px 16px", borderRadius: "var(--radius)",
            fontSize: 16, fontWeight: 500,
            background: "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12,
            minHeight: 52,
          }}>
            <span style={{ fontSize: 20 }}>🔑</span>
            Entrar
          </Link>
        </SignedOut>
      </div>
    </>
  );
}
