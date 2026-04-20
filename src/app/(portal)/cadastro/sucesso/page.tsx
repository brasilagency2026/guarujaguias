"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CadastroSucesso() {
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: "1rem", animation: "fadeIn 0.5s ease" }}>🎉</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 12 }}>
        Cadastro realizado!
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.7, marginBottom: "2rem" }}>
        Seu negócio foi enviado para análise. Nossa equipe irá aprovar em até <strong>24 horas</strong>.
        Você receberá uma confirmação pelo WhatsApp.
      </p>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: "1rem" }}>Próximos passos</h2>
        {[
          { icon: "⏳", title: "Análise em andamento", desc: "Nossa equipe revisará seu cadastro em até 24 horas." },
          { icon: "✅", title: "Aprovação e publicação", desc: "Após aprovação, seu negócio aparecerá no portal e no mapa." },
          slug && { icon: "🌐", title: "Seu mini-site", desc: `Acesse em: guarujaguias.com.br/guia/${slug}` },
          { icon: "📊", title: "Painel do comerciante", desc: "Gerencie fotos, serviços, agendamentos e sua assinatura." },
        ].filter(Boolean).map((step: any, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? "1rem" : 0 }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{step.icon}</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/dashboard" className="btn btn-primary">
          📊 Acessar meu painel
        </Link>
        {slug && (
          <Link href={`/guia/${slug}`} className="btn btn-secondary">
            🌐 Ver meu mini-site
          </Link>
        )}
        <Link href="/" className="btn btn-secondary">
          ← Voltar ao portal
        </Link>
      </div>
    </div>
  );
}
