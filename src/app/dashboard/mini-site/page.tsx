"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import MiniSiteConfigurator from "../../../components/forms/MiniSiteConfigurator";
import Link from "next/link";

export default function MiniSitePage() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // const updateMiniSite = useMutation(api.miniSites.update);

  // Mock business - replace with useQuery(api.businesses.getMyBusiness)
  const business = { name: "Meu Negócio", slug: "meu-negocio", category: "beleza", plan: "pro", hasMiniSite: true };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      // await updateMiniSite({ businessId: business._id, config });
      await new Promise(r => setTimeout(r, 800)); // mock delay
      setSaved(true);
      toast.success("Mini-site atualizado com sucesso!");
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 4 }}>🌐 Meu Mini-Site</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            URL: <a href={`/guia/${business.slug}`} target="_blank" style={{ color: "var(--ocean)", fontWeight: 600, textDecoration: "none" }}>
              guarujaguias.com.br/guia/{business.slug}
            </a>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href={`/guia/${business.slug}`} target="_blank" className="btn btn-secondary btn-sm">
            👁️ Visualizar
          </Link>
          <button
            onClick={handleSave}
            disabled={!config || saving}
            className="btn btn-primary btn-sm"
            style={{ opacity: (!config || saving) ? 0.7 : 1 }}
          >
            {saving ? "Salvando..." : saved ? "✓ Salvo!" : "💾 Salvar alterações"}
          </button>
        </div>
      </div>

      {/* Tabs: editor / preview toggle */}
      <div style={{ display: "flex", gap: 0, marginBottom: "1.5rem", background: "var(--bg)", borderRadius: "var(--radius)", padding: 4, width: "fit-content" }}>
        <div style={{ padding: "8px 20px", borderRadius: "var(--radius-sm)", background: "white", fontSize: 14, fontWeight: 600, color: "var(--ocean)", boxShadow: "var(--shadow-sm)" }}>
          ✏️ Editor
        </div>
        <Link href={`/guia/${business.slug}`} target="_blank" style={{ textDecoration: "none", padding: "8px 20px", fontSize: 14, color: "var(--text-muted)" }}>
          🖥️ Prévia
        </Link>
      </div>

      {/* Non-pro warning */}
      {business.plan !== "pro" && (
        <div style={{ background: "var(--ocean-50)", border: "1px solid var(--ocean-light)", borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, color: "var(--ocean)" }}>🚀 Upgrade necessário</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>O mini-site requer o Plano Pro por R$ 50/mês</div>
          </div>
          <Link href="/dashboard/assinatura" className="btn btn-primary btn-sm">Fazer upgrade →</Link>
        </div>
      )}

      {/* Configurator */}
      <MiniSiteConfigurator
        category={business.category}
        businessName={business.name}
        onChange={setConfig}
      />

      {/* Save button (bottom) */}
      <div style={{ position: "sticky", bottom: 0, background: "white", borderTop: "1px solid var(--border)", padding: "1rem", margin: "0 -2rem", marginTop: "1.5rem" }}>
        <div style={{ maxWidth: 860, display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href={`/guia/${business.slug}`} target="_blank" className="btn btn-secondary">
            👁️ Visualizar mini-site
          </Link>
          <button
            onClick={handleSave}
            disabled={!config || saving}
            className="btn btn-primary"
            style={{ opacity: (!config || saving) ? 0.7 : 1, minWidth: 180 }}
          >
            {saving ? "Salvando..." : saved ? "✓ Alterações salvas!" : "💾 Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
