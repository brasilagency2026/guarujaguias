"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import MiniSiteConfigurator from "../../../components/forms/MiniSiteConfigurator";
import dynamic from "next/dynamic";
import { SignInButton, useUser } from "@clerk/nextjs";

const SignUp = dynamic(() => import("@clerk/nextjs").then((m) => m.SignUp), { ssr: false });

const STEPS = ["Negócio", "Localização", "Plano", "Mini-site"];

const CATEGORIES = [
  { value: "restaurante", label: "🍽️ Restaurante / Bar" },
  { value: "hospedagem",  label: "🏨 Hospedagem / Pousada" },
  { value: "beleza",      label: "💅 Beleza & Estética" },
  { value: "turismo",     label: "🚤 Turismo & Passeios" },
  { value: "loja",        label: "🛍️ Loja / Comércio" },
  { value: "saude",       label: "🏥 Saúde & Bem-estar" },
  { value: "cultura",     label: "🎭 Cultura & Arte" },
  { value: "servicos",    label: "⚙️ Serviços Gerais" },
  { value: "eventos",     label: "🎵 Eventos" },
];

const GUARUJA_NEIGHBORHOODS = [
  "Pitangueiras", "Astúrias", "Enseada", "Perequê", "Jardim Virgínia",
  "Guaiúba", "Morrinhos", "São Vicente", "Centro", "Pernambuco",
  "Santa Cruz dos Navegantes", "Jardim Boa Esperança", "Balneário Cidade Atlântica",
];

export default function RegisterClient() {
  const router = useRouter();
  const params = useSearchParams();
  const initialPlan = params.get("plano") === "pro" ? "pro" : "free";

  const { isLoaded, isSignedIn } = useUser();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    shortDescription: "",
    whatsapp: "",
    phone: "",
    email: "",
    website: "",
    instagram: "",
    address: "",
    neighborhood: "",
    lat: -23.9933,
    lng: -46.2565,
    tags: [] as string[],
    plan: initialPlan,
    wantsMiniSite: initialPlan === "pro",
    miniSiteConfig: null as any,
  });

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  // Ensure we don't stay on the Mini-site step if the user switches to the free plan
  useEffect(() => {
    const effectiveLen = form.plan === "free" ? STEPS.slice(0, 3).length : STEPS.length;
    if (step >= effectiveLen) {
      setStep(effectiveLen - 1);
    }
    if (form.plan === "free") {
      set("wantsMiniSite", false);
      set("miniSiteConfig", null);
    }
    // only run when plan changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.plan]);

  const register = useMutation(api.businesses.register);

  // Geocode address via browser (Nominatim, free)
  const geocodeAddress = async () => {
    if (!form.address || !form.neighborhood) return;
    const query = `${form.address}, ${form.neighborhood}, Guarujá, SP, Brasil`;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
    const data = await res.json();
    if (data[0]) {
      set("lat", parseFloat(data[0].lat));
      set("lng", parseFloat(data[0].lon));
    }
  };

  const canProceed = () => {
    if (step === 0) return form.name && form.category && form.description && form.shortDescription && form.whatsapp;
    if (step === 1) return form.address && form.neighborhood;
    if (step === 2) return true;
    if (step === 3) return !form.wantsMiniSite || form.miniSiteConfig;
    return true;
  };

  // If Clerk auth state is not yet loaded, avoid rendering UI flicker
  if (!isLoaded) return null;

  // If not signed in, show Clerk SignUp inline so it matches site design
  if (!isSignedIn) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <div className="card" style={{ padding: "1.75rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1rem" }}>
            Crie sua conta para continuar
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
            Para registrar seu estabelecimento precisamos vincular sua conta. Use o formulário abaixo para criar uma conta ou entrar.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 520 }}>
              <SignUp />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <SignInButton>
              <button className="btn btn-secondary">Entrar</button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = async () => {
    if (step === 1) await geocodeAddress();
    if (step < STEPS.length - 1) {
      if (form.plan === "free" && step === 2) {
        await handleSubmit();
        return;
      }
      setStep((s) => s + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        category: form.category as any,
        description: form.description,
        shortDescription: form.shortDescription,
        address: form.address,
        neighborhood: form.neighborhood,
        lat: form.lat,
        lng: form.lng,
        whatsapp: form.whatsapp,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        instagram: form.instagram || undefined,
        tags: form.tags,
        wantsMiniSite: form.wantsMiniSite,
      });

      if (form.plan === "pro") {
        // Redirect to MercadoPago
        const mpRes = await fetch("/api/mercadopago/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId: result.businessId,
            ownerEmail: form.email,
            ownerName: form.name,
          }),
        });
        const mpData = await mpRes.json();
        if (mpData.initPoint) {
          window.location.href = mpData.initPoint;
          return;
        }
      }

      router.push(`/cadastro/sucesso?slug=${result.slug}`);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const effectiveSteps = form.plan === "free" ? STEPS.slice(0, 3) : STEPS;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 8 }}>
          Cadastrar meu negócio
        </h1>
        <p style={{ color: "var(--text-muted)" }}>Listagem gratuita · Sem cartão de crédito</p>
      </div>

      {/* Progress stepper */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: 0 }}>
        {effectiveSteps.map((label, i) => (
          <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700,
                background: i < step ? "var(--green)" : i === step ? "var(--ocean)" : "var(--bg)",
                color: i <= step ? "white" : "var(--text-muted)",
                border: i > step ? "1.5px solid var(--border-mid)" : "none",
                transition: "all 0.2s",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 11, color: i === step ? "var(--ocean)" : "var(--text-hint)", marginTop: 4, whiteSpace: "nowrap" }}>
                {label}
              </div>
            </div>
            {i < effectiveSteps.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 4px 16px",
                background: i < step ? "var(--green)" : "var(--border)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 0: Business Info ── */}
      {step === 0 && (
        <div className="card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1.25rem" }}>
            📋 Informações do negócio
          </h2>

          <div className="form-row">
            <label className="form-label">Nome do estabelecimento *</label>
            <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Restaurante Sol e Mar" />
          </div>

          <div className="form-row">
            <label className="form-label">Categoria *</label>
            <select className="form-input form-select" value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">Selecione uma categoria...</option>
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Descrição curta * <span style={{ color: "var(--text-hint)", fontWeight: 400 }}>(até 120 caracteres — aparece nos cards)</span></label>
            <input className="form-input" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value.slice(0, 120))} placeholder="Ex: Frutos do mar frescos com vista para o mar" maxLength={120} />
            <div style={{ fontSize: 11, color: "var(--text-hint)", marginTop: 3 }}>{form.shortDescription.length}/120</div>
          </div>

          <div className="form-row">
            <label className="form-label">Descrição completa *</label>
            <textarea className="form-input" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Conte mais sobre seu negócio, história, diferenciais..." />
          </div>

          <div className="form-grid-2">
            <div className="form-row">
              <label className="form-label">WhatsApp * (com DDD)</label>
              <input className="form-input" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="(13) 98765-4321" />
            </div>
            <div className="form-row">
              <label className="form-label">Telefone fixo</label>
              <input className="form-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(13) 3386-XXXX" />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-row">
              <label className="form-label">E-mail</label>
              <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="contato@seunegocio.com.br" />
            </div>
            <div className="form-row">
              <label className="form-label">Instagram</label>
              <input className="form-input" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@seunegocio" />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Site (se já tiver)</label>
            <input className="form-input" type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://seunegocio.com.br" />
          </div>
        </div>
      )}

      {/* ── STEP 1: Location ── */}
      {step === 1 && (
        <div className="card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1.25rem" }}>
            📍 Localização em Guarujá
          </h2>

          <div className="form-row">
            <label className="form-label">Endereço completo *</label>
            <input className="form-input" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Rua das Ondas, 123" />
          </div>

          <div className="form-row">
            <label className="form-label">Bairro *</label>
            <select className="form-input form-select" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)}>
              <option value="">Selecione o bairro...</option>
              {GUARUJA_NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={{ background: "var(--ocean-50)", borderRadius: "var(--radius)", padding: "12px 14px", fontSize: 13, color: "var(--ocean)", marginTop: 8 }}>
            📍 Sua localização será usada automaticamente no mapa interativo do portal. O endereço é convertido em coordenadas GPS via OpenStreetMap.
          </div>
        </div>
      )}

      {/* ── STEP 2: Plan ── */}
      {step === 2 && (
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: "1.25rem", textAlign: "center" }}>
            Escolha seu plano
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* FREE */}
            <div
              onClick={() => { set("plan", "free"); set("wantsMiniSite", false); }}
              className="card"
              style={{
                padding: "1.5rem", cursor: "pointer",
                border: form.plan === "free" ? "2px solid var(--ocean)" : "1px solid var(--border)",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="badge badge-free">GRATUITO</span>
                {form.plan === "free" && <span style={{ color: "var(--green)", fontWeight: 700, fontSize: 18 }}>✓</span>}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>R$ 0</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>Para sempre</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {["✅ Listagem no portal", "✅ Aparece no mapa", "✅ Link WhatsApp", "❌ Mini-site"].map(i => (
                  <li key={i} style={{ fontSize: 13, color: i.startsWith("❌") ? "var(--text-hint)" : "var(--text)" }}>{i}</li>
                ))}
              </ul>
            </div>

            {/* PRO */}
            <div
              onClick={() => { set("plan", "pro"); set("wantsMiniSite", true); }}
              className="card"
              style={{
                padding: "1.5rem", cursor: "pointer",
                border: form.plan === "pro" ? "2px solid var(--ocean)" : "1px solid var(--border)",
                transition: "all 0.15s", position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 14, right: -20,
                background: "var(--sand-dark)", color: "white",
                fontSize: 10, fontWeight: 700, padding: "3px 28px", transform: "rotate(35deg)",
              }}>POPULAR</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="badge badge-pro">PRO</span>
                {form.plan === "pro" && <span style={{ color: "var(--green)", fontWeight: 700, fontSize: 18 }}>✓</span>}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>R$ 50</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>por mês via MercadoPago</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {["✅ Tudo do gratuito", "✅ Mini-site próprio", "✅ Agendamento", "✅ Galeria de fotos", "✅ Lista de serviços"].map(i => (
                  <li key={i} style={{ fontSize: 13 }}>{i}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ background: "#fff8e1", borderRadius: "var(--radius)", padding: "12px 14px", fontSize: 13, color: "#a06000", marginTop: 14, border: "1px solid #f5d98f" }}>
            💳 O pagamento Pro é processado com segurança pelo <strong>MercadoPago</strong>. Você pode cancelar a qualquer momento diretamente na plataforma.
          </div>
        </div>
      )}

      {/* ── STEP 3: Mini-site config ── */}
      {step === 3 && form.plan === "pro" && (
        <MiniSiteConfigurator
          category={form.category}
          businessName={form.name}
          onChange={(config) => set("miniSiteConfig", config)}
        />
      )}

      {/* Navigation buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: "1.5rem" }}>
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="btn btn-secondary" style={{ flex: 1 }}>
            ← Voltar
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className="btn btn-primary"
          style={{ flex: 2, opacity: (!canProceed() || loading) ? 0.6 : 1 }}
        >
          {loading ? "Aguarde..." :
            step === effectiveSteps.length - 1
              ? form.plan === "pro" ? "💳 Ir para pagamento →" : "✅ Cadastrar gratuitamente"
              : "Continuar →"}
        </button>
      </div>
    </div>
  );
}
