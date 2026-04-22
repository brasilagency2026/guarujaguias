"use client";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import ReviewsSection from "./ReviewsSection";
import SchedulingWidget from "./SchedulingWidget";

const CF_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_HASH;
const cfImg = (id: string, v = "card") =>
  `https://imagedelivery.net/${CF_HASH}/${id}/${v}`;

interface Props { business: any; }

export default function MiniSiteRenderer({ business: biz }: Props) {
  const trackView = useMutation(api.businesses.trackView);
  const trackClick = useMutation(api.businesses.trackClick);
  const cfg = biz.miniSiteConfig;
  const primaryColor = cfg?.primaryColor ?? "#0a4f6e";
  const [activeTab, setActiveTab] = useState("inicio");

  useEffect(() => { trackView({ businessId: biz._id }); }, [biz._id]);

  const handleWhatsapp = () => {
    trackClick({ businessId: biz._id, type: "whatsapp" });
    const msg = encodeURIComponent(`Olá! Vi o ${biz.name} no Guarujá Guias e gostaria de mais informações.`);
    window.open(`https://wa.me/${biz.whatsapp.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const TABS = [
    { id: "inicio",    label: "Início" },
    cfg?.features.serviceList    && { id: "servicos",   label: "Serviços" },
    cfg?.features.photoCarousel  && { id: "fotos",      label: "Fotos" },
    cfg?.features.scheduling     && { id: "agendar",    label: "Agendar" },
    cfg?.features.reviews        && { id: "avaliacoes", label: "Avaliações" },
    { id: "contato",   label: "Contato" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div style={{ fontFamily: "var(--font-body, 'DM Sans', system-ui)", background: "#f8f5f0", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <header style={{ background: primaryColor, color: "white" }}>
        {biz.coverImageId && (
          <div style={{ height: "min(220px, 40vw)", overflow: "hidden", position: "relative" }}>
            <img src={cfImg(biz.coverImageId, "hero")} alt={biz.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${primaryColor})` }} />
          </div>
        )}

        <div style={{ padding: "1.25rem 1rem 0.75rem", display: "flex", alignItems: "flex-end", gap: 12 }}>
          {biz.logoImageId && (
            <img src={cfImg(biz.logoImageId, "thumbnail")} alt="Logo"
              style={{ width: 60, height: 60, borderRadius: 10, border: "3px solid white", objectFit: "cover", flexShrink: 0 }} />
          )}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700, marginBottom: 2, lineHeight: 1.2 }}>{biz.name}</h1>
            <p style={{ opacity: 0.85, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {biz.neighborhood} · Guarujá, SP
            </p>
            {biz.avgRating && (
              <p style={{ fontSize: 12, marginTop: 2 }}>
                {"★".repeat(Math.round(biz.avgRating))}{"☆".repeat(5 - Math.round(biz.avgRating))} {biz.avgRating.toFixed(1)}
              </p>
            )}
          </div>
        </div>

        {/* Tabs — horizontal scroll */}
        <nav style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.2)", overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              background: activeTab === id ? "rgba(255,255,255,0.2)" : "transparent",
              color: "white", border: "none",
              padding: "11px 14px", cursor: "pointer",
              fontSize: "clamp(12px, 3vw, 14px)", fontWeight: activeTab === id ? 600 : 400,
              whiteSpace: "nowrap", flexShrink: 0,
              borderBottom: activeTab === id ? "2px solid white" : "2px solid transparent",
              fontFamily: "inherit",
              minHeight: 44,
            }}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── STICKY CTA BUTTONS ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "white", borderBottom: "1px solid #eee",
        padding: "10px 1rem",
        display: "flex", gap: 8,
      }}>
        <button onClick={handleWhatsapp} style={{
          flex: 1, background: "#25D366", color: "white", border: "none",
          borderRadius: 8, padding: "11px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 44,
        }}>
          💬 WhatsApp
        </button>
        {cfg?.features.scheduling && (
          <button onClick={() => setActiveTab("agendar")} style={{
            flex: 1, background: primaryColor, color: "white", border: "none",
            borderRadius: 8, padding: "11px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", minHeight: 44,
          }}>
            📅 Agendar
          </button>
        )}
        {biz.instagram && (
          <a href={`https://instagram.com/${biz.instagram}`} target="_blank" rel="noopener"
            style={{
              background: "linear-gradient(135deg, #E1306C, #833AB4)", color: "white",
              border: "none", borderRadius: 8, padding: "11px 12px", fontSize: 20,
              display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", minHeight: 44, minWidth: 44,
            }}>
            📷
          </a>
        )}
      </div>

      {/* ── BODY ── */}
      <main style={{ padding: "1rem", maxWidth: 720, margin: "0 auto" }}>

        {/* INÍCIO */}
        {activeTab === "inicio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "white", borderRadius: 14, padding: "1rem", border: "1px solid #eee" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Sobre nós</h2>
              <p style={{ color: "#444", lineHeight: 1.7, fontSize: 14 }}>{biz.description}</p>
            </div>

            {biz.openingHours && (
              <div style={{ background: "white", borderRadius: 14, padding: "1rem", border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>🕐 Horários</h2>
                {Object.entries(biz.openingHours).map(([day, hours]: any) => {
                  const labels: Record<string, string> = { monday: "Segunda", tuesday: "Terça", wednesday: "Quarta", thursday: "Quinta", friday: "Sexta", saturday: "Sábado", sunday: "Domingo" };
                  return (
                    <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
                      <span style={{ color: "#666" }}>{labels[day]}</span>
                      <span style={{ fontWeight: 500 }}>{hours.closed ? "Fechado" : `${hours.open} – ${hours.close}`}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {cfg?.features.map && (
              <div style={{ background: "white", borderRadius: 14, padding: "1rem", border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>📍 Localização</h2>
                <p style={{ color: "#666", fontSize: 13, marginBottom: 10 }}>{biz.address}, {biz.neighborhood}</p>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${biz.lat},${biz.lng}`}
                  target="_blank" rel="noopener"
                  style={{ background: primaryColor, color: "white", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-block", minHeight: 44, lineHeight: "24px" }}>
                  Como chegar →
                </a>
              </div>
            )}
          </div>
        )}

        {/* SERVIÇOS */}
        {activeTab === "servicos" && cfg?.services && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Nossos Serviços</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cfg.services.map((svc: any) => (
                <div key={svc.id} style={{ background: "white", borderRadius: 14, padding: "1rem", border: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{svc.name}</div>
                    {svc.description && <div style={{ color: "#666", fontSize: 13, marginTop: 2 }}>{svc.description}</div>}
                  </div>
                  {svc.price && (
                    <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, flexShrink: 0 }}>
                      R$ {svc.price.toFixed(2).replace(".", ",")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOTOS */}
        {activeTab === "fotos" && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Galeria</h2>
            {biz.galleryImageIds?.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {biz.galleryImageIds.map((id: string, i: number) => (
                  <img key={id} src={cfImg(id, "card")} alt={`Foto ${i + 1}`}
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10 }} />
                ))}
              </div>
            ) : <p style={{ color: "#888" }}>Nenhuma foto ainda.</p>}
          </div>
        )}

        {/* AGENDAR */}
        {activeTab === "agendar" && (
          <div style={{ background: "white", borderRadius: 14, padding: "1rem", border: "1px solid #eee" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Agendar horário</h2>
            <SchedulingWidget businessId={biz._id} primaryColor={primaryColor} whatsapp={biz.whatsapp} />
          </div>
        )}

        {/* AVALIAÇÕES */}
        {activeTab === "avaliacoes" && (
          <div style={{ background: "white", borderRadius: 14, padding: "1rem", border: "1px solid #eee" }}>
            <ReviewsSection businessId={biz._id} primaryColor={primaryColor} />
          </div>
        )}

        {/* CONTATO */}
        {activeTab === "contato" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Contato</h2>
            {[
              biz.whatsapp && { icon: "💬", label: "WhatsApp", value: biz.whatsapp, action: handleWhatsapp },
              biz.phone    && { icon: "📞", label: "Telefone", value: biz.phone, href: `tel:${biz.phone}` },
              biz.email    && { icon: "✉️", label: "E-mail", value: biz.email, href: `mailto:${biz.email}` },
              biz.instagram && { icon: "📷", label: "Instagram", value: `@${biz.instagram}`, href: `https://instagram.com/${biz.instagram}` },
            ].filter(Boolean).map((item: any, i) => (
              <div key={i} onClick={item.action ?? (() => item.href && window.open(item.href, "_blank"))} style={{
                background: "white", borderRadius: 14, padding: "1rem",
                border: "1px solid #eee", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", minHeight: 64,
              }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#888" }}>{item.label}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "2rem 1rem", fontSize: 13, color: "#888", borderTop: "1px solid #eee", marginTop: "1rem" }}>
        <a href="https://guarujaguias.com.br" style={{ color: primaryColor, textDecoration: "none", fontWeight: 600 }}>
          🌊 Guarujá Guias
        </a>
      </footer>
    </div>
  );
}
