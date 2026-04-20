"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";

const MOCK_APPOINTMENTS = [
  { id: "1", customerName: "Maria Silva",    customerPhone: "(13) 99123-4567", service: "Corte + escova",       date: "2025-05-22", timeSlot: "14:00", status: "confirmed", notes: "" },
  { id: "2", customerName: "João Santos",    customerPhone: "(13) 97654-3210", service: "Barba",                date: "2025-05-23", timeSlot: "10:00", status: "pending",   notes: "Primeira vez" },
  { id: "3", customerName: "Ana Oliveira",   customerPhone: "(13) 98888-7777", service: "Manicure + pedicure",  date: "2025-05-24", timeSlot: "15:30", status: "confirmed", notes: "" },
  { id: "4", customerName: "Pedro Costa",    customerPhone: "(13) 91234-5678", service: "Hidratação",           date: "2025-05-25", timeSlot: "11:00", status: "pending",   notes: "Cabelo danificado" },
  { id: "5", customerName: "Lúcia Ferreira", customerPhone: "(13) 96543-2109", service: "Coloração",            date: "2025-05-20", timeSlot: "09:00", status: "completed", notes: "" },
];

const STATUS_CONFIG = {
  pending:   { label: "Pendente",   color: "#a06000", bg: "#fff3cd" },
  confirmed: { label: "Confirmado", color: "var(--green)", bg: "var(--green-light)" },
  cancelled: { label: "Cancelado",  color: "var(--coral)", bg: "var(--coral-light)" },
  completed: { label: "Concluído",  color: "var(--ocean)", bg: "var(--ocean-50)" },
};

export default function AgendamentosPage() {
  const [filter, setFilter] = useState<"upcoming" | "all" | "pending">("upcoming");
  const [selectedDate, setSelectedDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const filtered = MOCK_APPOINTMENTS.filter((a) => {
    if (filter === "upcoming") return a.date >= today && a.status !== "cancelled";
    if (filter === "pending")  return a.status === "pending";
    return true;
  }).filter((a) => !selectedDate || a.date === selectedDate);

  const handleConfirm = (id: string, name: string) => {
    toast.success(`Agendamento de ${name} confirmado`);
  };
  const handleCancel = (id: string, name: string) => {
    toast.info(`Agendamento de ${name} cancelado`);
  };
  const handleWhatsApp = (phone: string, name: string, date: string, time: string, service: string) => {
    const msg = encodeURIComponent(`Olá ${name}! Confirmamos seu agendamento:\n📅 ${date} às ${time}\n✂️ ${service}\nNos vemos em breve!`);
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const counts = {
    pending: MOCK_APPOINTMENTS.filter((a) => a.status === "pending").length,
    today:   MOCK_APPOINTMENTS.filter((a) => a.date === today).length,
    upcoming: MOCK_APPOINTMENTS.filter((a) => a.date > today).length,
  };

  return (
    <div style={{ maxWidth: 860 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: "1.5rem" }}>📅 Agendamentos</h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: "1.5rem" }}>
        {[
          { label: "Pendentes", value: counts.pending, color: "#a06000",       bg: "#fff3cd"              },
          { label: "Hoje",      value: counts.today,   color: "var(--coral)",   bg: "var(--coral-light)"  },
          { label: "Próximos",  value: counts.upcoming,color: "var(--ocean)",   bg: "var(--ocean-50)"     },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: bg, borderRadius: "var(--radius)", padding: "1rem 1.25rem", border: `1px solid ${color}30` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color }}>{value}</div>
            <div style={{ fontSize: 13, color, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {(["upcoming", "pending", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 14px", borderRadius: 50, fontSize: 13, fontWeight: 600,
            cursor: "pointer", border: "none",
            background: filter === f ? "var(--ocean)" : "var(--bg)",
            color: filter === f ? "white" : "var(--text-muted)",
          }}>
            {f === "upcoming" ? "Próximos" : f === "pending" ? `Pendentes (${counts.pending})` : "Todos"}
          </button>
        ))}
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-mid)", fontSize: 13, fontFamily: "var(--font-body)", marginLeft: "auto" }} />
        {selectedDate && <button onClick={() => setSelectedDate("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--coral)", fontWeight: 700 }}>✕</button>}
      </div>

      {/* Appointment list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((apt) => {
          const sc = STATUS_CONFIG[apt.status as keyof typeof STATUS_CONFIG];
          return (
            <div key={apt.id} className="card" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>

                {/* Date/time block */}
                <div style={{ textAlign: "center", background: "var(--bg)", borderRadius: "var(--radius-sm)", padding: "10px 14px", flexShrink: 0, minWidth: 72 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--ocean)", lineHeight: 1 }}>
                    {new Date(apt.date + "T12:00:00").getDate()}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    {new Date(apt.date + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{apt.timeSlot}</div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{apt.customerName}</span>
                    <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>{sc.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>✂️ {apt.service}</div>
                  <div style={{ fontSize: 13, color: "var(--text-hint)", marginTop: 2 }}>📞 {apt.customerPhone}</div>
                  {apt.notes && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, fontStyle: "italic" }}>"{apt.notes}"</div>}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleWhatsApp(apt.customerPhone, apt.customerName, apt.date, apt.timeSlot, apt.service)}
                    style={{ padding: "7px 12px", borderRadius: "var(--radius-sm)", background: "#25D366", color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    💬 WA
                  </button>
                  {apt.status === "pending" && (
                    <>
                      <button onClick={() => handleConfirm(apt.id, apt.customerName)}
                        style={{ padding: "7px 12px", borderRadius: "var(--radius-sm)", background: "var(--green-light)", color: "var(--green)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        ✓ Confirmar
                      </button>
                      <button onClick={() => handleCancel(apt.id, apt.customerName)}
                        style={{ padding: "7px 12px", borderRadius: "var(--radius-sm)", background: "var(--coral-light)", color: "var(--coral)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        ✕
                      </button>
                    </>
                  )}
                  {apt.status === "confirmed" && (
                    <button onClick={() => toast.success("Marcado como concluído")}
                      style={{ padding: "7px 12px", borderRadius: "var(--radius-sm)", background: "var(--ocean-50)", color: "var(--ocean)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                      ✓ Concluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Nenhum agendamento</div>
            <div style={{ fontSize: 14 }}>Os agendamentos feitos pelo seu mini-site aparecem aqui</div>
          </div>
        )}
      </div>
    </div>
  );
}
