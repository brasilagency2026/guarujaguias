"use client";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const myBusiness = useQuery(api.businesses.getMyBusiness);

  // If auth state not loaded yet, avoid flicker
  if (!isLoaded) return null;

  // If not signed-in, show a simple prompt to login/register
  if (!isSignedIn) {
    return (
      <div style={{ maxWidth: 860 }}>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>Olá!</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Entre para gerenciar seu negócio ou cadastrar um novo estabelecimento.</p>
          <div style={{ marginTop: 16 }}>
            <Link href="/registro" className="btn btn-primary">Criar conta / Entrar</Link>
          </div>
        </div>
      </div>
    );
  }

  const biz = myBusiness;

  if (!biz) {
    return (
      <div style={{ maxWidth: 860 }}>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>Você ainda não cadastrou um negócio</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Cadastre seu estabelecimento gratuitamente para aparecer no portal.</p>
          <div style={{ marginTop: 16 }}>
            <Link href="/cadastro" className="btn btn-primary">Cadastrar meu estabelecimento</Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Visualizações", value: biz.viewCount.toLocaleString("pt-BR"), icon: "👁️", color: "var(--ocean)" },
    { label: "Cliques no WhatsApp", value: biz.clickWhatsapp, icon: "💬", color: "#25D366" },
    { label: "Cliques no site", value: biz.clickWebsite, icon: "🌐", color: "var(--sand-dark)" },
    { label: "Avaliação média", value: "4.8 ★", icon: "⭐", color: "var(--coral)" },
  ];

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 4 }}>
            Olá! 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Gerenciando <strong>{biz.name}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href={`/guia/${biz.slug}`} target="_blank" className="btn btn-secondary btn-sm">
            Ver meu site →
          </Link>
          <Link href="/dashboard/mini-site" className="btn btn-primary btn-sm">
            ✏️ Editar
          </Link>
        </div>
      </div>

      {/* Status banners */}
      {biz.plan === "free" && (
        <div style={{
          background: "linear-gradient(135deg, var(--ocean-50), #d8f0fb)",
          border: "1px solid var(--ocean-light)", borderRadius: "var(--radius-lg)",
          padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>🚀 Ative seu Mini-Site por R$ 50/mês</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Tenha sua própria página com agendamento, galeria e muito mais</div>
          </div>
          <Link href="/dashboard/assinatura" className="btn btn-primary btn-sm">
            Fazer upgrade →
          </Link>
        </div>
      )}

      {biz.status === "pending" && (
        <div style={{
          background: "#fff8e1", border: "1px solid #f5d98f",
          borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
        }}>
          <div style={{ fontWeight: 700, color: "#a06000" }}>⏳ Cadastro em análise</div>
          <div style={{ fontSize: 13, color: "#a06000", marginTop: 4 }}>Nossa equipe irá aprovar seu negócio em até 24 horas.</div>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: "2rem" }}>
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color }}>{value}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1rem" }}>Ações rápidas</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: "2rem" }}>
        {[
          { href: "/dashboard/mini-site", icon: "🎨", label: "Editar mini-site", desc: "Cores, textos, serviços" },
          { href: "/dashboard/fotos",     icon: "📸", label: "Adicionar fotos", desc: `${0}/20 fotos` },
          { href: "/dashboard/agendamentos", icon: "📅", label: "Agendamentos", desc: "3 pendentes" },
          { href: "/dashboard/assinatura", icon: "💳", label: "Assinatura", desc: biz.plan === "pro" ? "Plano Pro ativo" : "Upgrade disponível" },
        ].map(({ href, icon, label, desc }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: "1.25rem", transition: "all 0.2s", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>📅 Próximos agendamentos</h2>
          <Link href="/dashboard/agendamentos" style={{ fontSize: 13, color: "var(--ocean-mid)", textDecoration: "none", fontWeight: 600 }}>
            Ver todos →
          </Link>
        </div>
        {[
          { name: "Maria Silva", time: "Hoje, 14:00", service: "Corte + escova", status: "confirmed" },
          { name: "João Santos", time: "Amanhã, 10:00", service: "Barba", status: "pending" },
          { name: "Ana Oliveira", time: "Sáb, 15:30", service: "Manicure + pedicure", status: "confirmed" },
        ].map((apt, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none",
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{apt.time} · {apt.service}</div>
            </div>
            <span className={`badge badge-${apt.status === "confirmed" ? "active" : "pending"}`}>
              {apt.status === "confirmed" ? "Confirmado" : "Pendente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
