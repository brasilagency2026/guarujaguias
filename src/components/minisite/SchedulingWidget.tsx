"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface Props {
  businessId: string;
  primaryColor?: string;
  whatsapp: string;
}

export default function SchedulingWidget({ businessId, primaryColor = "var(--ocean)", whatsapp }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [booking, setBooking] = useState(false);

  const availableSlots = useQuery(
    api.appointments.getAvailableSlots,
    date ? { businessId: businessId as any, date } : "skip"
  );

  const bookAppointment = useMutation(api.appointments.book);

  const handleSubmit = async () => {
    if (!date) { toast.error("Selecione uma data"); return; }
    if (!slot) { toast.error("Selecione um horário"); return; }
    if (!name.trim()) { toast.error("Informe seu nome"); return; }
    if (!phone.trim()) { toast.error("Informe seu WhatsApp"); return; }

    setBooking(true);
    try {
      await bookAppointment({
        businessId: businessId as any,
        customerName: name,
        customerPhone: phone,
        date,
        timeSlot: slot,
        durationMinutes: 60,
        notes: notes || undefined,
      });

      // Also send WhatsApp confirmation
      const msg = encodeURIComponent(
        `Olá! Fiz um agendamento:\n📅 ${new Date(date + "T12:00:00").toLocaleDateString("pt-BR")} às ${slot}\n👤 ${name}\n📞 ${phone}${notes ? `\n📝 ${notes}` : ""}`
      );
      window.open(`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${msg}`, "_blank");
      setSubmitted(true);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBooking(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Agendamento confirmado!</h3>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>
          {new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })} às {slot}
        </p>
        <p style={{ color: "#888", fontSize: 13 }}>Você receberá uma confirmação pelo WhatsApp.</p>
        <button onClick={() => { setSubmitted(false); setSlot(""); setDate(""); }}
          style={{ marginTop: 16, background: primaryColor, color: "white", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Novo agendamento
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Date picker */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
          📅 Selecione a data
        </label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => { setDate(e.target.value); setSlot(""); }}
          style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none" }}
        />
      </div>

      {/* Time slots */}
      {date && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 8 }}>
            ⏰ Horário disponível
          </label>
          {availableSlots === undefined ? (
            <div style={{ height: 40, background: "#f0f0f0", borderRadius: 8, animation: "pulse 1.5s ease infinite" }} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {availableSlots.map(({ slot: s, available }) => (
                <button
                  key={s}
                  onClick={() => available && setSlot(s)}
                  disabled={!available}
                  style={{
                    padding: "10px 6px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: available ? "pointer" : "not-allowed",
                    background: !available ? "#f5f5f5" : slot === s ? primaryColor : "white",
                    color: !available ? "#ccc" : slot === s ? "white" : "#333",
                    border: `1.5px solid ${!available ? "#eee" : slot === s ? primaryColor : "#ddd"}`,
                    transition: "all 0.15s",
                    textDecoration: !available ? "line-through" : "none",
                  }}
                >
                  {s}
                  {!available && <div style={{ fontSize: 9, marginTop: 1 }}>Ocupado</div>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Customer info */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>Seu nome *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo"
          style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>WhatsApp *</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(13) 9XXXX-XXXX"
          style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>Observações</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
          placeholder="Serviço desejado, observações..."
          style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!date || !slot || !name || !phone || booking}
        style={{
          width: "100%", background: "#25D366", color: "white", border: "none",
          borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer",
          opacity: (!date || !slot || !name || !phone || booking) ? 0.6 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {booking ? "Agendando..." : "💬 Confirmar via WhatsApp"}
      </button>
    </div>
  );
}
