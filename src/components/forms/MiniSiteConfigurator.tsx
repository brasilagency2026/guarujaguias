"use client";
import { useState, useEffect } from "react";

const TEMPLATES = [
  { value: "restaurante", label: "🍽️ Restaurante",  defaultServices: ["Almoço", "Jantar", "Delivery"] },
  { value: "hospedagem",  label: "🏨 Hospedagem",   defaultServices: ["Quarto Standard", "Suíte", "Café da manhã"] },
  { value: "beleza",      label: "💅 Beleza",        defaultServices: ["Corte de cabelo", "Manicure", "Pedicure"] },
  { value: "turismo",     label: "🚤 Turismo",       defaultServices: ["Passeio de lancha", "Mergulho", "City tour"] },
  { value: "loja",        label: "🛍️ Loja",          defaultServices: ["Produto 1", "Produto 2", "Produto 3"] },
  { value: "servicos",    label: "⚙️ Serviços",      defaultServices: ["Serviço 1", "Serviço 2", "Orçamento"] },
];

const COLORS = [
  "#0a4f6e", "#e05a3a", "#2d7a4a", "#7c3aed",
  "#d4a853", "#c2185b", "#1a7fa0", "#e65100",
];

const ALL_FEATURES = [
  { key: "scheduling",     label: "📅 Agendamento online" },
  { key: "whatsappButton", label: "💬 Botão WhatsApp" },
  { key: "photoCarousel",  label: "📸 Galeria de fotos" },
  { key: "serviceList",    label: "📋 Lista de serviços" },
  { key: "map",            label: "🗺️ Localização no mapa" },
  { key: "socialLinks",    label: "📱 Redes sociais" },
  { key: "reviews",        label: "⭐ Avaliações" },
  { key: "promotions",     label: "🎁 Promoções" },
];

interface Props {
  category: string;
  businessName: string;
  onChange: (config: any) => void;
}

export default function MiniSiteConfigurator({ category, businessName, onChange }: Props) {
  const defaultTemplate = TEMPLATES.find((t) => t.value === category) ?? TEMPLATES[0];

  const [template, setTemplate] = useState(defaultTemplate.value);
  const [primaryColor, setPrimaryColor] = useState("#0a4f6e");
  const [features, setFeatures] = useState({
    scheduling: true,
    whatsappButton: true,
    photoCarousel: true,
    serviceList: true,
    map: true,
    socialLinks: true,
    reviews: false,
    promotions: false,
    menu: false,
    roomTypes: false,
  });

  const [services, setServices] = useState(
    defaultTemplate.defaultServices.map((name, i) => ({
      id: `svc-${i}`,
      name,
      description: "",
      price: undefined as number | undefined,
      priceNote: "",
    }))
  );

  // Update parent whenever config changes
  useEffect(() => {
    onChange({ template, primaryColor, secondaryColor: "#f5e6c8", fontStyle: "modern", features, services });
  }, [template, primaryColor, features, services]);

  const toggleFeature = (key: string) => {
    setFeatures((f) => ({ ...f, [key]: !f[key as keyof typeof f] }));
  };

  const updateService = (id: string, field: string, value: any) => {
    setServices((s) => s.map((svc) => svc.id === id ? { ...svc, [field]: value } : svc));
  };

  const addService = () => {
    setServices((s) => [...s, { id: `svc-${Date.now()}`, name: "", description: "", price: undefined, priceNote: "" }]);
  };

  const removeService = (id: string) => {
    setServices((s) => s.filter((svc) => svc.id !== id));
  };

  return (
    <div>
      <div className="card" style={{ padding: "1.75rem", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1.25rem" }}>
          🎨 Configure seu mini-site
        </h2>

        {/* Template */}
        <div className="form-row">
          <label className="form-label">Template</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {TEMPLATES.map(({ value, label }) => (
              <button key={value} onClick={() => setTemplate(value)} style={{
                padding: "10px 8px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600,
                cursor: "pointer", border: "none", textAlign: "center",
                background: template === value ? "var(--ocean-50)" : "var(--bg)",
                color: template === value ? "var(--ocean)" : "var(--text-muted)",
                outline: template === value ? "2px solid var(--ocean-mid)" : "none",
                transition: "all 0.15s",
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="form-row">
          <label className="form-label">Cor principal</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {COLORS.map((color) => (
              <button key={color} onClick={() => setPrimaryColor(color)} style={{
                width: 32, height: 32, borderRadius: "50%", background: color, border: "none",
                cursor: "pointer", outline: primaryColor === color ? `3px solid ${color}` : "none",
                outlineOffset: 3, transition: "transform 0.15s",
                transform: primaryColor === color ? "scale(1.2)" : "scale(1)",
              }} />
            ))}
            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ width: 32, height: 32, border: "none", borderRadius: "50%", cursor: "pointer", padding: 0 }} />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: "1rem" }}>
          ⚙️ Funcionalidades
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {ALL_FEATURES.map(({ key, label }) => {
            const checked = features[key as keyof typeof features];
            return (
              <button key={key} onClick={() => toggleFeature(key)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: "var(--radius-sm)", cursor: "pointer", border: "none",
                background: checked ? "var(--green-light)" : "var(--bg)",
                outline: checked ? "1.5px solid var(--green)" : "1.5px solid transparent",
                textAlign: "left", transition: "all 0.15s",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  background: checked ? "var(--green)" : "white",
                  border: `1.5px solid ${checked ? "var(--green)" : "var(--border-mid)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 11, fontWeight: 700,
                }}>
                  {checked ? "✓" : ""}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services */}
      {features.serviceList && (
        <div className="card" style={{ padding: "1.75rem", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: "1rem" }}>
            📋 Serviços / Produtos
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {services.map((svc) => (
              <div key={svc.id} style={{ background: "var(--bg)", borderRadius: "var(--radius-sm)", padding: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, marginBottom: 8 }}>
                  <input className="form-input" value={svc.name} onChange={(e) => updateService(svc.id, "name", e.target.value)} placeholder="Nome do serviço" style={{ fontSize: 14 }} />
                  <input className="form-input" type="number" value={svc.price ?? ""} onChange={(e) => updateService(svc.id, "price", e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="R$ Preço" style={{ width: 100, fontSize: 14 }} />
                  <button onClick={() => removeService(svc.id)} style={{ background: "var(--coral-light)", color: "var(--coral)", border: "none", borderRadius: "var(--radius-sm)", padding: "0 12px", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
                <input className="form-input" value={svc.description} onChange={(e) => updateService(svc.id, "description", e.target.value)} placeholder="Descrição (opcional)" style={{ fontSize: 13 }} />
                <input className="form-input" value={svc.priceNote} onChange={(e) => updateService(svc.id, "priceNote", e.target.value)} placeholder='Nota de preço: "a partir de", "por pessoa"' style={{ fontSize: 13, marginTop: 6 }} />
              </div>
            ))}
          </div>
          <button onClick={addService} className="btn btn-secondary" style={{ width: "100%", marginTop: 12 }}>
            + Adicionar serviço
          </button>
        </div>
      )}

      {/* Live preview hint */}
      <div style={{ background: "var(--ocean-50)", borderRadius: "var(--radius)", padding: "12px 14px", fontSize: 13, color: "var(--ocean)", border: "1px solid var(--ocean-light)" }}>
        🎉 Seu mini-site ficará disponível em: <strong>guarujaguias.com.br/guia/{businessName.toLowerCase().replace(/\s+/g, "-")}</strong>
        <br />após aprovação do pagamento e revisão da equipe (em até 24h).
      </div>
    </div>
  );
}
