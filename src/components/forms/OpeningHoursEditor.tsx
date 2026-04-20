"use client";
import { useState } from "react";

const DAYS = [
  { key: "monday",    label: "Segunda-feira" },
  { key: "tuesday",   label: "Terça-feira"   },
  { key: "wednesday", label: "Quarta-feira"  },
  { key: "thursday",  label: "Quinta-feira"  },
  { key: "friday",    label: "Sexta-feira"   },
  { key: "saturday",  label: "Sábado"        },
  { key: "sunday",    label: "Domingo"       },
];

type DayHours = { open: string; close: string; closed: boolean };
type Hours = Record<string, DayHours>;

const DEFAULT_HOURS: Hours = {
  monday:    { open: "09:00", close: "18:00", closed: false },
  tuesday:   { open: "09:00", close: "18:00", closed: false },
  wednesday: { open: "09:00", close: "18:00", closed: false },
  thursday:  { open: "09:00", close: "18:00", closed: false },
  friday:    { open: "09:00", close: "18:00", closed: false },
  saturday:  { open: "09:00", close: "13:00", closed: false },
  sunday:    { open: "09:00", close: "12:00", closed: true  },
};

interface Props {
  value?: Hours;
  onChange: (hours: Hours) => void;
}

export default function OpeningHoursEditor({ value, onChange }: Props) {
  const [hours, setHours] = useState<Hours>(value ?? DEFAULT_HOURS);

  const update = (day: string, field: keyof DayHours, val: string | boolean) => {
    const updated = { ...hours, [day]: { ...hours[day], [field]: val } };
    setHours(updated);
    onChange(updated);
  };

  const copyToAll = (fromDay: string) => {
    const source = hours[fromDay];
    const updated = Object.fromEntries(
      DAYS.map(({ key }) => [key, { ...source }])
    ) as Hours;
    setHours(updated);
    onChange(updated);
  };

  const copyWeekdaysToWeekend = (fromDay: string) => {
    const source = hours[fromDay];
    const updated = {
      ...hours,
      saturday: { ...source },
      sunday:   { ...source },
    };
    setHours(updated);
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => copyToAll("monday")}
          style={{ fontSize: 12, padding: "5px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-mid)", background: "white", cursor: "pointer", color: "var(--text-muted)" }}
        >
          Copiar segunda para todos
        </button>
        <button
          type="button"
          onClick={() => {
            const weekday = { open: "09:00", close: "18:00", closed: false };
            const weekend = { open: "09:00", close: "13:00", closed: false };
            const updated = Object.fromEntries(
              DAYS.map(({ key }) => [
                key,
                ["saturday", "sunday"].includes(key) ? weekend : weekday
              ])
            ) as Hours;
            setHours(updated);
            onChange(updated);
          }}
          style={{ fontSize: 12, padding: "5px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-mid)", background: "white", cursor: "pointer", color: "var(--text-muted)" }}
        >
          Padrão comercial (Seg–Sex 9–18, Sáb 9–13)
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {DAYS.map(({ key, label }) => {
          const day = hours[key] ?? DEFAULT_HOURS[key];
          return (
            <div key={key} style={{
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
              padding: "10px 12px", borderRadius: "var(--radius-sm)",
              background: day.closed ? "var(--bg)" : "white",
              border: `1px solid ${day.closed ? "var(--border)" : "var(--border-mid)"}`,
              transition: "all 0.15s",
            }}>
              {/* Toggle closed */}
              <button
                type="button"
                onClick={() => update(key, "closed", !day.closed)}
                style={{
                  width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                  background: day.closed ? "#ddd" : "var(--green)", position: "relative",
                  flexShrink: 0, transition: "background 0.2s",
                }}
              >
                <div style={{
                  position: "absolute", top: 2,
                  left: day.closed ? 2 : 18,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "white", transition: "left 0.2s",
                }} />
              </button>

              {/* Day name */}
              <span style={{
                fontSize: 14, fontWeight: 500, minWidth: 130,
                color: day.closed ? "var(--text-hint)" : "var(--text)",
              }}>
                {label}
              </span>

              {day.closed ? (
                <span style={{ fontSize: 13, color: "var(--text-hint)", fontStyle: "italic" }}>Fechado</span>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="time"
                    value={day.open}
                    onChange={(e) => update(key, "open", e.target.value)}
                    style={{ padding: "5px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-mid)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }}
                  />
                  <span style={{ color: "var(--text-hint)", fontSize: 13 }}>até</span>
                  <input
                    type="time"
                    value={day.close}
                    onChange={(e) => update(key, "close", e.target.value)}
                    style={{ padding: "5px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-mid)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
