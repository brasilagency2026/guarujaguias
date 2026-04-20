"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import OpeningHoursEditor from "../../components/forms/OpeningHoursEditor";
import ImageUploader from "../../components/ui/ImageUploader";

const TAGS_SUGGESTIONS: Record<string, string[]> = {
  restaurante: ["frutos do mar", "churrasco", "pizza", "japonês", "delivery", "almoço executivo", "rodízio"],
  hospedagem:  ["piscina", "café da manhã", "wifi", "vista para o mar", "pet friendly", "estacionamento"],
  beleza:      ["corte feminino", "coloração", "manicure", "pedicure", "sobrancelha", "massagem"],
  turismo:     ["passeio de lancha", "mergulho", "pesca", "city tour", "aluguel de barco"],
  loja:        ["roupas", "acessórios", "artesanato", "souvenir", "beachwear"],
  saude:       ["fisioterapia", "nutrição", "academia", "yoga", "pilates"],
};

export default function PerfilPage() {
  // Mock — replace with useQuery(api.businesses.getMyBusiness)
  const [form, setForm] = useState({
    name: "Cantinho do Pescador",
    description: "Frutos do mar frescos servidos com vista para o oceano. Especialidade em moqueca e camarão.",
    shortDescription: "Frutos do mar frescos com vista para o mar",
    whatsapp: "(13) 99123-4567",
    phone: "(13) 3386-1234",
    email: "contato@cantinhopescador.com.br",
    instagram: "cantinhopescador",
    facebook: "",
    tiktok: "",
    website: "",
    address: "Av. Miguel Stéfano, 4333",
    neighborhood: "Enseada",
    tags: ["frutos do mar", "moqueca", "camarão"] as string[],
    logoImageId: "",
    coverImageId: "",
    galleryImageIds: [] as string[],
    openingHours: undefined as any,
  });

  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const addTag = (tag: string) => {
    const clean = tag.trim().toLowerCase();
    if (clean && !form.tags.includes(clean) && form.tags.length < 10) {
      set("tags", [...form.tags, clean]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => set("tags", form.tags.filter((t) => t !== tag));

  const handleSave = async () => {
    setSaving(true);
    try {
      // await updateBusiness({ businessId: ..., ...form });
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Perfil atualizado com sucesso!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, paddingBottom: "5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>✏️ Editar Perfil</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary"
          style={{ opacity: saving ? 0.7 : 1 }}>
          {saving ? "Salvando..." : "💾 Salvar"}
        </button>
      </div>

      {/* ── IDENTIDADE ── */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1.25rem" }}>🏪 Identidade</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: "1.25rem" }}>
          <ImageUploader label="Logo / Avatar" hint="200×200px recomendado" type="logo"
            businessSlug="cantinho-do-pescador" maxFiles={1}
            value={form.logoImageId ? [form.logoImageId] : []}
            onChange={(ids) => set("logoImageId", ids[0] ?? "")}
            aspectRatio="1/1"
          />
          <ImageUploader label="Foto de Capa" hint="1200×630px recomendado" type="cover"
            businessSlug="cantinho-do-pescador" maxFiles={1}
            value={form.coverImageId ? [form.coverImageId] : []}
            onChange={(ids) => set("coverImageId", ids[0] ?? "")}
            aspectRatio="16/9"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Nome do estabelecimento *</label>
          <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>

        <div className="form-row">
          <label className="form-label">Descrição curta <span style={{ color: "var(--text-hint)", fontWeight: 400 }}>(aparece nos cards)</span></label>
          <input className="form-input" value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value.slice(0, 120))} maxLength={120} />
          <div style={{ fontSize: 11, color: "var(--text-hint)", marginTop: 3 }}>{form.shortDescription.length}/120</div>
        </div>

        <div className="form-row">
          <label className="form-label">Descrição completa</label>
          <textarea className="form-input" rows={4} value={form.description}
            onChange={(e) => set("description", e.target.value)} />
        </div>

        {/* Tags */}
        <div className="form-row">
          <label className="form-label">Tags / Palavras-chave <span style={{ color: "var(--text-hint)", fontWeight: 400 }}>(máx. 10)</span></label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {form.tags.map((tag) => (
              <span key={tag} style={{
                background: "var(--ocean-50)", color: "var(--ocean)", padding: "4px 10px",
                borderRadius: 50, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5,
              }}>
                {tag}
                <button onClick={() => removeTag(tag)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: 13, lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="form-input" style={{ flex: 1 }} value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
              placeholder="Adicionar tag..." />
            <button onClick={() => addTag(tagInput)} className="btn btn-secondary btn-sm">+ Add</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
            {(TAGS_SUGGESTIONS["restaurante"] ?? []).filter(t => !form.tags.includes(t)).slice(0, 5).map((tag) => (
              <button key={tag} onClick={() => addTag(tag)} style={{
                fontSize: 11, padding: "3px 9px", borderRadius: 50, border: "1px dashed var(--border-mid)",
                background: "white", cursor: "pointer", color: "var(--text-muted)",
              }}>
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTATO ── */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1.25rem" }}>📞 Contato</h2>
        <div className="form-grid-2">
          <div className="form-row">
            <label className="form-label">WhatsApp *</label>
            <input className="form-input" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="(13) 9XXXX-XXXX" />
          </div>
          <div className="form-row">
            <label className="form-label">Telefone fixo</label>
            <input className="form-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">E-mail</label>
            <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">Site externo</label>
            <input className="form-input" type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-row">
            <label className="form-label">Instagram</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ padding: "11px 10px 11px 14px", background: "var(--bg)", border: "1.5px solid var(--border-mid)", borderRight: "none", borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)", fontSize: 14, color: "var(--text-hint)" }}>@</span>
              <input className="form-input" style={{ borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", borderLeft: "none" }}
                value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="seuperfil" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Facebook</label>
            <input className="form-input" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="facebook.com/seunegocio" />
          </div>
        </div>
      </div>

      {/* ── ENDEREÇO ── */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1.25rem" }}>📍 Endereço</h2>
        <div className="form-grid-2">
          <div className="form-row" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Endereço completo</label>
            <input className="form-input" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">Bairro</label>
            <input className="form-input" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">Cidade / Estado</label>
            <input className="form-input" value="Guarujá / SP" disabled style={{ opacity: 0.6 }} />
          </div>
        </div>
      </div>

      {/* ── HORÁRIOS ── */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1.25rem" }}>🕐 Horário de Funcionamento</h2>
        <OpeningHoursEditor value={form.openingHours} onChange={(h) => set("openingHours", h)} />
      </div>

      {/* ── GALERIA ── */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1.25rem" }}>📸 Galeria de Fotos</h2>
        <ImageUploader
          label="Fotos do estabelecimento"
          hint="Até 20 fotos · JPEG, PNG, WebP · máx 10MB cada"
          type="gallery"
          businessSlug="cantinho-do-pescador"
          maxFiles={20}
          value={form.galleryImageIds}
          onChange={(ids) => set("galleryImageIds", ids)}
        />
      </div>

      {/* Fixed save bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 220, right: 0,
        background: "white", borderTop: "1px solid var(--border)",
        padding: "1rem 2rem", display: "flex", justifyContent: "flex-end", gap: 12,
        zIndex: 100,
      }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg"
          style={{ opacity: saving ? 0.7 : 1, minWidth: 200 }}>
          {saving ? "Salvando..." : "💾 Salvar alterações"}
        </button>
      </div>
    </div>
  );
}
