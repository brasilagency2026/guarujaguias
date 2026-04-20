"use client";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import ReviewsSection from "./ReviewsSection";
import SchedulingWidget from "./SchedulingWidget";

const CF_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_HASH;
const cfImg = (id: string, v = "card") =>
  `https://imagedelivery.net/${CF_HASH}/${id}/${v}`;

interface Props {
  business: any;
}

export default function MiniSiteRenderer({ business: biz }: Props) {
  const trackView = useMutation(api.businesses.trackView);
  const trackClick = useMutation(api.businesses.trackClick);
  const cfg = biz.miniSiteConfig;

  const primaryColor = cfg?.primaryColor ?? "#0a4f6e";
  const [activeTab, setActiveTab] = useState("inicio");

  useEffect(() => {
    trackView({ businessId: biz._id });
  }, [biz._id]);

  const handleWhatsapp = () => {
    trackClick({ businessId: biz._id, type: "whatsapp" });
    const msg = encodeURIComponent(`Olá! Vi o ${biz.name} no Guarujá Guias e gostaria de mais informações.`);
    window.open(`https://wa.me/${biz.whatsapp.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const handleWebsite = () => {
    trackClick({ businessId: biz._id, type: "website" });
    window.open(biz.website, "_blank");
  };

  // If business has external website and no minisite config, redirect
  if (!biz.hasMiniSite && biz.website) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h1>{biz.name}</h1>
        <p style={{ color: "#666", margin: "1rem 0" }}>Este negócio tem um site próprio.</p>
        <a href={biz.website} style={{
          background: primaryColor, color: "white", padding: "12px 28px",
          borderRadius: "8px", textDecoration: "none", fontWeight: 600
        }}>
          Visitar site →
        </a>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f8f5f0", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <header style={{ background: primaryColor, color: "white" }}>
        {biz.coverImageId && (
          <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
            <img
              src={cfImg(biz.coverImageId, "hero")}
              alt={biz.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
            />
            <div style={{
              position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${primaryColor})`,
            }} />
          </div>
        )}

        <div style={{ padding: "1.5rem 1.5rem 1rem", display: "flex", alignItems: "flex-end", gap: 16 }}>
          {biz.logoImageId && (
            <img
              src={cfImg(biz.logoImageId, "thumbnail")}
              alt="Logo"
              style={{ width: 72, height: 72, borderRadius: 12, border: "3px solid white", objectFit: "cover", flexShrink: 0 }}
            />
          )}
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 2 }}>{biz.name}</h1>
            <p style={{ opacity: 0.85, fontSize: 14 }}>{biz.address} · {biz.neighborhood}</p>
            {biz.avgRating && (
              <p style={{ fontSize: 13, marginTop: 4 }}>
                {"★".repeat(Math.round(biz.avgRating))}{"☆".repeat(5 - Math.round(biz.avgRating))} {biz.avgRating.toFixed(1)} ({biz.reviews?.length} avaliações)
              </p>
            )}
          </div>
        </div>

        {/* NAV TABS */}
        <nav style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.2)", overflowX: "auto" }}>
          {[
            ["inicio", "Início"],
            cfg?.features.serviceList && ["servicos", "Serviços"],
            cfg?.features.photoCarousel && ["fotos", "Fotos"],
            cfg?.features.scheduling && ["agendar", "Agendar"],
            cfg?.features.reviews && ["avaliacoes", "Avaliações"],
            ["contato", "Contato"],
          ].filter(Boolean).map(([id, label]) => (
            <button
              key={id as string}
              onClick={() => setActiveTab(id as string)}
              style={{
                background: activeTab === id ? "rgba(255,255,255,0.2)" : "transparent",
                color: "white",
                border: "none",
                padding: "12px 18px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: activeTab === id ? 600 : 400,
                whiteSpace: "nowrap",
                borderBottom: activeTab === id ? "2px solid white" : "2px solid transparent",
              }}
            >
              {label as string}
            </button>
          ))}
        </nav>
      </header>

      {/* ── BODY ── */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem" }}>

        {/* CTA Buttons (always visible) */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={handleWhatsapp} style={{
            flex: 1, minWidth: 120, background: "#25D366", color: "white", border: "none",
            borderRadius: 10, padding: "13px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            💬 WhatsApp
          </button>
          {cfg?.features.scheduling && (
            <button onClick={() => setActiveTab("agendar")} style={{
              flex: 1, minWidth: 120, background: primaryColor, color: "white", border: "none",
              borderRadius: 10, padding: "13px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              📅 Agendar
            </button>
          )}
          {biz.website && (
            <button onClick={handleWebsite} style={{
              flex: 1, minWidth: 120, background: "white", color: primaryColor,
              border: `2px solid ${primaryColor}`, borderRadius: 10, padding: "13px 16px",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              🌐 Site
            </button>
          )}
        </div>

        {/* ── TAB: INÍCIO ── */}
        {activeTab === "inicio" && (
          <div>
            <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", marginBottom: 16, border: "1px solid #eee" }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Sobre nós</h2>
              <p style={{ color: "#444", lineHeight: 1.7 }}>{biz.description}</p>
            </div>

            {biz.openingHours && (
              <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", marginBottom: 16, border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>🕐 Horário de funcionamento</h2>
                {Object.entries(biz.openingHours).map(([day, hours]: any) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 }}>
                    <span style={{ textTransform: "capitalize", color: "#666" }}>{day === "monday" ? "Segunda" : day === "tuesday" ? "Terça" : day === "wednesday" ? "Quarta" : day === "thursday" ? "Quinta" : day === "friday" ? "Sexta" : day === "saturday" ? "Sábado" : "Domingo"}</span>
                    <span style={{ fontWeight: 500 }}>{hours.closed ? "Fechado" : `${hours.open} – ${hours.close}`}</span>
                  </div>
                ))}
              </div>
            )}

            {cfg?.features.map && (
              <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>📍 Localização</h2>
                <p style={{ color: "#666", fontSize: 14, marginBottom: 10 }}>{biz.address}, {biz.neighborhood}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${biz.lat},${biz.lng}`}
                  target="_blank"
                  rel="noopener"
                  style={{ background: primaryColor, color: "white", padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-block" }}
                >
                  Como chegar →
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: SERVIÇOS ── */}
        {activeTab === "servicos" && cfg?.services && (
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 16 }}>Nossos Serviços</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {cfg.services.map((svc: any) => (
                <div key={svc.id} style={{ background: "white", borderRadius: 16, padding: "1rem 1.25rem", border: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{svc.name}</div>
                    {svc.description && <div style={{ color: "#666", fontSize: 13, marginTop: 3 }}>{svc.description}</div>}
                    {svc.priceNote && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{svc.priceNote}</div>}
                  </div>
                  {svc.price && (
                    <div style={{ fontWeight: 700, fontSize: 17, color: primaryColor, marginLeft: 16, whiteSpace: "nowrap" }}>
                      R$ {svc.price.toFixed(2).replace(".", ",")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: FOTOS ── */}
        {activeTab === "fotos" && (
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 16 }}>Galeria de Fotos</h2>
            {biz.galleryImageIds?.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {biz.galleryImageIds.map((id: string, i: number) => (
                  <img key={id} src={cfImg(id, "card")} alt={`Foto ${i + 1}`} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 12 }} />
                ))}
              </div>
            ) : (
              <p style={{ color: "#888" }}>Nenhuma foto cadastrada ainda.</p>
            )}
          </div>
        )}

        {/* ── TAB: AGENDAR ── */}
        {activeTab === "agendar" && (
          <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid #eee" }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 16 }}>Agendar horário</h2>
            <SchedulingWidget businessId={biz._id} primaryColor={primaryColor} whatsapp={biz.whatsapp} />
          </div>
        )}

        {/* ── TAB: AVALIAÇÕES ── */}
        {activeTab === "avaliacoes" && cfg?.features.reviews && (
          <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid #eee" }}>
            <ReviewsSection businessId={biz._id} primaryColor={primaryColor} />
          </div>
        )}

        {/* ── TAB: CONTATO ── */}
        {activeTab === "contato" && (
          <div style={{ display: "grid", gap: 12 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700 }}>Entre em contato</h2>
            {[
              biz.whatsapp && { icon: "💬", label: "WhatsApp", value: biz.whatsapp, action: handleWhatsapp },
              biz.phone && { icon: "📞", label: "Telefone", value: biz.phone, href: `tel:${biz.phone}` },
              biz.email && { icon: "✉️", label: "E-mail", value: biz.email, href: `mailto:${biz.email}` },
              biz.instagram && { icon: "📷", label: "Instagram", value: `@${biz.instagram}`, href: `https://instagram.com/${biz.instagram}` },
              biz.facebook && { icon: "👍", label: "Facebook", value: biz.facebook, href: `https://facebook.com/${biz.facebook}` },
            ].filter(Boolean).map((item: any, i) => (
              <div key={i} onClick={item.action ?? (() => item.href && window.open(item.href, "_blank"))} style={{
                background: "white", borderRadius: 14, padding: "1rem 1.25rem",
                border: "1px solid #eee", display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
              }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: "#888" }}>{item.label}</div>
                  <div style={{ fontWeight: 600 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "2rem", fontSize: 13, color: "#888", borderTop: "1px solid #eee", marginTop: "2rem" }}>
        <a href="https://guarujaguias.com.br" style={{ color: primaryColor, textDecoration: "none", fontWeight: 600 }}>
          🌊 Guarujá Guias
        </a>
        {" · "}Seu guia do litoral paulista
      </footer>
    </div>
  );
}


