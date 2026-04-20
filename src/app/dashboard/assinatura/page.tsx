"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);

  // Mock - in production: useQuery(api.payments.getMySubscription)
  const subscription = null; // null = free plan
  const isPro = !!subscription;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mercadopago/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: "BUSINESS_ID_HERE", // get from context
          ownerEmail: "owner@email.com",
          ownerName: "Nome do Dono",
        }),
      });
      const data = await res.json();
      if (data.initPoint) window.location.href = data.initPoint;
      else throw new Error("Erro ao criar assinatura");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 6 }}>💳 Assinatura</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Gerencie seu plano e pagamentos</p>

      {/* Current plan */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>Plano atual</h2>
          <span className={`badge ${isPro ? "badge-pro" : "badge-free"}`} style={{ fontSize: 13, padding: "5px 14px" }}>
            {isPro ? "⭐ PRO" : "GRATUITO"}
          </span>
        </div>

        {isPro ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "var(--bg)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 3 }}>Próximo vencimento</div>
                <div style={{ fontWeight: 700 }}>15 de Junho, 2025</div>
              </div>
              <div style={{ background: "var(--bg)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 3 }}>Valor mensal</div>
                <div style={{ fontWeight: 700, color: "var(--ocean)" }}>R$ 50,00</div>
              </div>
            </div>
            <button className="btn btn-danger btn-sm" style={{ fontSize: 13 }}>
              Cancelar assinatura
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Você está no plano gratuito. Faça upgrade para o <strong>Plano Pro</strong> e tenha seu mini-site personalizado com agendamento, galeria de fotos, lista de serviços e muito mais.
            </p>

            {/* Feature comparison */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "var(--text-muted)" }}>Plano Gratuito</div>
                {["✅ Listagem no portal", "✅ Aparece no mapa", "✅ Link WhatsApp", "✅ Avaliações", "❌ Mini-site próprio", "❌ Agendamento", "❌ Fotos"].map(f => (
                  <div key={f} style={{ fontSize: 13, marginBottom: 6, color: f.startsWith("❌") ? "var(--text-hint)" : "var(--text)" }}>{f}</div>
                ))}
              </div>
              <div style={{ background: "var(--ocean-50)", borderRadius: "var(--radius)", padding: "1rem", border: "1px solid var(--ocean-light)" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "var(--ocean)" }}>⭐ Plano Pro</div>
                {["✅ Tudo do gratuito", "✅ Mini-site personalizado", "✅ URL própria", "✅ Agendamento online", "✅ Galeria até 20 fotos", "✅ Lista de serviços", "✅ Estatísticas"].map(f => (
                  <div key={f} style={{ fontSize: 13, marginBottom: 6 }}>{f}</div>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn btn-primary btn-full btn-lg"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Redirecionando..." : "🚀 Assinar por R$ 50/mês via MercadoPago"}
            </button>
            <p style={{ fontSize: 12, color: "var(--text-hint)", textAlign: "center", marginTop: 10 }}>
              Pagamento seguro via MercadoPago · Cancele quando quiser
            </p>
          </div>
        )}
      </div>

      {/* Payment history */}
      {isPro && (
        <div className="card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: "1rem" }}>Histórico de pagamentos</h2>
          {[
            { date: "15/05/2025", amount: "R$ 50,00", status: "approved" },
            { date: "15/04/2025", amount: "R$ 50,00", status: "approved" },
            { date: "15/03/2025", amount: "R$ 50,00", status: "approved" },
          ].map((p, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ fontSize: 14 }}>{p.date}</div>
              <div style={{ fontWeight: 600 }}>{p.amount}</div>
              <span className="badge badge-active">Aprovado</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
