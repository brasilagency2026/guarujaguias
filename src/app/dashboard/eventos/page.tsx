"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import Link from "next/link";

const EVENT_CATEGORIES = [
  { value: "musica",      label: "🎵 Música / Show" },
  { value: "cultura",     label: "🎭 Cultura / Arte" },
  { value: "esporte",     label: "🏄 Esporte / Lazer" },
  { value: "gastronomia", label: "🍽️ Gastronomia" },
  { value: "familia",     label: "👨‍👩‍👧 Família / Infantil" },
  { value: "festa",       label: "🎉 Festa / Balada" },
  { value: "negocios",    label: "💼 Negócios / Feiras" },
  { value: "arte",        label: "🎨 Arte / Exposição" },
];

function EventForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const createEvent = useMutation(api.events.createEvent);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "musica",
    address: "", neighborhood: "",
    startDate: "", startTime: "19:00",
    endDate: "", endTime: "23:00",
    isFree: true, price: "",
    ticketUrl: "", whatsapp: "", instagram: "",
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.description || !form.startDate || !form.endDate) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const startDate = new Date(`${form.startDate}T${form.startTime}`).getTime();
    const endDate   = new Date(`${form.endDate}T${form.endTime}`).getTime();

    if (endDate <= startDate) {
      toast.error("A data de fim deve ser após o início");
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        category: form.category,
        address: form.address || undefined,
        neighborhood: form.neighborhood || undefined,
        startDate,
        endDate,
        isFree: form.isFree,
        price: !form.isFree && form.price ? parseFloat(form.price) : undefined,
        ticketUrl: form.ticketUrl || undefined,
        whatsapp: form.whatsapp || undefined,
        instagram: form.instagram || undefined,
      });
      toast.success("Evento criado com sucesso!");
      onSave();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: "1rem" }}>📝 Informações do evento</h3>

        <div className="form-row">
          <label className="form-label">Título do evento *</label>
          <input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Ex: Festival de Verão 2025" />
        </div>

        <div className="form-row">
          <label className="form-label">Categoria *</label>
          <select className="form-input form-select" value={form.category} onChange={e => set("category", e.target.value)}>
            {EVENT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Descrição *</label>
          <textarea className="form-input" rows={4} value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="Descreva o evento, atrações, programação..." />
        </div>

        <div className="form-grid-2">
          <div className="form-row">
            <label className="form-label">Endereço</label>
            <input className="form-input" value={form.address} onChange={e => set("address", e.target.value)} placeholder="Rua, nº, local" />
          </div>
          <div className="form-row">
            <label className="form-label">Bairro</label>
            <input className="form-input" value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} placeholder="Pitangueiras, Enseada..." />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: "1rem" }}>📅 Data e horário</h3>

        <div className="form-grid-2">
          <div className="form-row">
            <label className="form-label">Início *</label>
            <input className="form-input" type="date" value={form.startDate} min={new Date().toISOString().split("T")[0]}
              onChange={e => set("startDate", e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">Hora início</label>
            <input className="form-input" type="time" value={form.startTime} onChange={e => set("startTime", e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">Fim *</label>
            <input className="form-input" type="date" value={form.endDate} min={form.startDate || new Date().toISOString().split("T")[0]}
              onChange={e => set("endDate", e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">Hora fim</label>
            <input className="form-input" type="time" value={form.endTime} onChange={e => set("endTime", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: "1rem" }}>💰 Ingresso e contato</h3>

        <div className="form-row">
          <label className="form-label">Tipo de entrada</label>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ v: true, l: "Gratuito" }, { v: false, l: "Pago" }].map(opt => (
              <button key={String(opt.v)} type="button" onClick={() => set("isFree", opt.v)} style={{
                flex: 1, padding: "10px", borderRadius: "var(--radius-sm)", cursor: "pointer",
                border: "none", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600,
                background: form.isFree === opt.v ? "var(--ocean)" : "var(--bg)",
                color: form.isFree === opt.v ? "white" : "var(--text-muted)",
                minHeight: 44,
              }}>{opt.l}</button>
            ))}
          </div>
        </div>

        {!form.isFree && (
          <div className="form-grid-2">
            <div className="form-row">
              <label className="form-label">Preço (R$)</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.price}
                onChange={e => set("price", e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-row">
              <label className="form-label">Link de ingressos</label>
              <input className="form-input" type="url" value={form.ticketUrl}
                onChange={e => set("ticketUrl", e.target.value)} placeholder="https://..." />
            </div>
          </div>
        )}

        <div className="form-grid-2">
          <div className="form-row">
            <label className="form-label">WhatsApp de contato</label>
            <input className="form-input" value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="(13) 9XXXX-XXXX" />
          </div>
          <div className="form-row">
            <label className="form-label">Instagram do evento</label>
            <input className="form-input" value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@seuperfil" />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
        <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ flex: 2, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Salvando..." : "✅ Criar evento"}
        </button>
      </div>
    </div>
  );
}

function FeaturedCTA({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mercadopago/event-featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, eventTitle }),
      });
      const data = await res.json();
      if (data.initPoint) window.location.href = data.initPoint;
      else throw new Error("Erro ao criar pagamento");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--coral-light)", border: "1px solid var(--coral)", borderRadius: "var(--radius)", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontWeight: 700, color: "var(--coral)", fontSize: 14 }}>⭐ Destaque na homepage</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Apareça primeiro durante 30 dias · R$ 100</div>
      </div>
      <button onClick={handlePayment} disabled={loading}
        style={{ background: "var(--coral)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, opacity: loading ? 0.7 : 1, minHeight: 40 }}>
        {loading ? "Aguarde..." : "Destacar · R$ 100"}
      </button>
    </div>
  );
}

export default function DashboardEventosPage() {
  const myEvents = useQuery(api.events.listMyEvents);
  const [showForm, setShowForm] = useState(false);
  const cancelEvent = useMutation(api.events.cancelEvent);

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 4 }}>🎉 Meus Eventos</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Crie e gerencie seus eventos em Guarujá</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            + Novo evento
          </button>
        )}
      </div>

      {/* Featured CTA banner */}
      {!showForm && (
        <div style={{ background: "linear-gradient(135deg, var(--ocean-50), #d8f0fb)", border: "1px solid var(--ocean-light)", borderRadius: "var(--radius-lg)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>⭐ Destaque seu evento na homepage</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Apareça primeiro para todos os visitantes durante 30 dias por apenas R$ 100</div>
            </div>
            <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm">Criar e destacar</button>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: "1rem" }}>Novo evento</h2>
          <EventForm
            onSave={() => { setShowForm(false); toast.success("Evento criado!"); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Events list */}
      {!showForm && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myEvents === undefined && (
            [...Array(3)].map((_, i) => (
              <div key={i} style={{ height: 100, background: "var(--bg)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s ease infinite" }} />
            ))
          )}

          {myEvents?.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 1rem", background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🎭</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>Nenhum evento ainda</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>Crie seu primeiro evento e divulgue para toda Guarujá</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">+ Criar meu primeiro evento</button>
            </div>
          )}

          {myEvents?.map((ev: any) => (
            <div key={ev._id} className="card" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{ev.title}</span>
                    {ev.featured && <span style={{ background: "var(--sand)", color: "var(--sand-dark)", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>⭐ Destaque</span>}
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50,
                      background: ev.status === "active" ? "var(--green-light)" : "var(--coral-light)",
                      color: ev.status === "active" ? "var(--green)" : "var(--coral)",
                    }}>{ev.status === "active" ? "Ativo" : "Cancelado"}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    🕐 {formatDate(ev.startDate)} → {formatDate(ev.endDate)}
                  </div>
                  {ev.address && <div style={{ fontSize: 12, color: "var(--text-hint)", marginTop: 2 }}>📍 {ev.neighborhood ?? ev.address}</div>}
                  <div style={{ fontSize: 12, color: "var(--text-hint)", marginTop: 2 }}>👁️ {ev.viewCount ?? 0} visualizações</div>
                </div>

                {ev.status === "active" && (
                  <button onClick={async () => {
                    if (!confirm("Cancelar este evento?")) return;
                    await cancelEvent({ eventId: ev._id });
                    toast.info("Evento cancelado");
                  }} className="btn btn-danger btn-sm">
                    Cancelar
                  </button>
                )}
              </div>

              {/* Featured CTA if not featured */}
              {ev.status === "active" && !ev.featured && (
                <FeaturedCTA eventId={ev._id} eventTitle={ev.title} />
              )}

              {ev.featured && ev.featuredUntil && (
                <div style={{ background: "var(--sand)", borderRadius: "var(--radius-sm)", padding: "8px 12px", fontSize: 12, color: "#7a5800" }}>
                  ⭐ Destaque ativo até {new Date(ev.featuredUntil).toLocaleDateString("pt-BR")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
