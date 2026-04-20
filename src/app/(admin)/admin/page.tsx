"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import AdminReviewsTab from "../../../components/admin/AdminReviews";

const STATUS_COLORS: Record<string, string> = {
  active: "#2d7a4a",
  pending: "#d4a853",
  paused: "#1a7fa0",
  suspended: "#e05a3a",
  deleted: "#999",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Ativo",
  pending: "Pendente",
  paused: "Pausado",
  suspended: "Suspenso",
  deleted: "Excluído",
};

export default function AdminDashboard() {
  const stats = useQuery(api.admin.getAdminStats);
  const businesses = useQuery(api.admin.listAllBusinesses, {});
  const logs = useQuery(api.admin.getAdminLogs, { limit: 20 });

  const approve = useMutation(api.admin.approveBusiness);
  const pause = useMutation(api.admin.pauseBusiness);
  const suspend = useMutation(api.admin.suspendBusiness);
  const reactivate = useMutation(api.admin.reactivateBusiness);
  const deleteBiz = useMutation(api.admin.deleteBusiness);

  const [activeTab, setActiveTab] = useState<"overview" | "businesses" | "reviews" | "logs">("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredBusinesses = (businesses ?? []).filter((b) => {
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAction = async (action: string, bizId: any, bizName: string) => {
    try {
      switch (action) {
        case "approve": await approve({ businessId: bizId }); toast.success(`${bizName} aprovado`); break;
        case "pause": await pause({ businessId: bizId }); toast.info(`${bizName} pausado`); break;
        case "suspend": await suspend({ businessId: bizId }); toast.warning(`${bizName} suspenso`); break;
        case "reactivate": await reactivate({ businessId: bizId }); toast.success(`${bizName} reativado`); break;
        case "delete":
          if (confirmDelete === bizId) {
            await deleteBiz({ businessId: bizId });
            toast.error(`${bizName} excluído`);
            setConfirmDelete(null);
          } else {
            setConfirmDelete(bizId);
          }
          break;
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f0f2f5", minHeight: "100vh" }}>

      {/* TOPBAR */}
      <header style={{
        background: "#0a1628", color: "white", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 56,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🌊</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Guarujá Guias</span>
          <span style={{ background: "#e05a3a", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: 1 }}>SUPERADMIN</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["overview", "businesses", "reviews", "logs"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? "rgba(255,255,255,0.15)" : "transparent",
              color: "rgba(255,255,255,0.8)", border: "none", padding: "7px 14px",
              borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
              textTransform: "capitalize",
            }}>
              {tab === "overview" ? "Visão Geral" : tab === "businesses" ? "Negócios" : tab === "reviews" ? "Avaliações" : "Logs"}
            </button>
          ))}
        </div>
      </header>

      <main style={{ padding: "1.5rem 2rem", maxWidth: 1200, margin: "0 auto" }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && stats && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Visão Geral</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Negócios ativos", value: stats.businesses.active, color: "#2d7a4a", icon: "🏪" },
                { label: "Pendentes de aprovação", value: stats.businesses.pending, color: "#d4a853", icon: "⏳" },
                { label: "Plano Pro", value: stats.businesses.pro, color: "#7c3aed", icon: "⭐" },
                { label: "Com Mini-Site", value: stats.businesses.withMiniSite, color: "#1a7fa0", icon: "🌐" },
                { label: "Receita mensal", value: `R$ ${stats.subscriptions.monthlyRevenue}`, color: "#e05a3a", icon: "💰" },
                { label: "Usuários totais", value: stats.users.total, color: "#0a4f6e", icon: "👥" },
              ].map((stat, i) => (
                <div key={i} style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid #eee" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Pending businesses quick action */}
            {stats.businesses.pending > 0 && (
              <div style={{ background: "#fff8e1", border: "1px solid #d4a853", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#a06000" }}>⚠️ {stats.businesses.pending} negócio(s) aguardando aprovação</span>
                </div>
                <button onClick={() => { setActiveTab("businesses"); setFilterStatus("pending"); }}
                  style={{ background: "#d4a853", color: "white", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  Revisar agora →
                </button>
              </div>
            )}

            {/* Recent logs preview */}
            {logs && logs.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Atividade recente</h2>
                {logs.slice(0, 8).map((log, i) => (
                  <div key={log._id} style={{ padding: "8px 0", borderBottom: i < 7 ? "1px solid #f5f5f5" : "none", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#444" }}><span style={{ fontWeight: 600 }}>{log.action.replace(/_/g, " ")}</span> — {log.targetId.slice(-6)}</span>
                    <span style={{ color: "#aaa" }}>{new Date(log.createdAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BUSINESSES ── */}
        {activeTab === "businesses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>Negócios ({filteredBusinesses.length})</h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, fontFamily: "inherit" }}
                />
                {["all", "pending", "active", "paused", "suspended"].map((s) => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{
                    padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: filterStatus === s ? 600 : 400,
                    background: filterStatus === s ? "#0a4f6e" : "white",
                    color: filterStatus === s ? "white" : "#333",
                    border: "1px solid #ddd",
                  }}>
                    {s === "all" ? "Todos" : STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {filteredBusinesses.map((biz) => (
                <div key={biz._id} style={{ background: "white", borderRadius: 16, padding: "1rem 1.25rem", border: "1px solid #eee", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{biz.name}</span>
                      <span style={{
                        background: STATUS_COLORS[biz.status] + "20",
                        color: STATUS_COLORS[biz.status],
                        fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50,
                      }}>
                        {STATUS_LABELS[biz.status]}
                      </span>
                      {biz.plan === "pro" && (
                        <span style={{ background: "#7c3aed20", color: "#7c3aed", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>PRO</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {biz.category} · {biz.neighborhood} · {new Date(biz.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                      {biz.viewCount} views · WA: {biz.clickWhatsapp} cliques
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <a href={`/guia/${biz.slug}`} target="_blank" style={{
                      padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                      background: "#f0f0f0", color: "#333", textDecoration: "none",
                    }}>Ver →</a>

                    {biz.status === "pending" && (
                      <button onClick={() => handleAction("approve", biz._id, biz.name)}
                        style={{ padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "#e3f5ea", color: "#2d7a4a", border: "none" }}>
                        ✓ Aprovar
                      </button>
                    )}
                    {biz.status === "active" && (
                      <button onClick={() => handleAction("pause", biz._id, biz.name)}
                        style={{ padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "#e8f4fb", color: "#1a7fa0", border: "none" }}>
                        ⏸ Pausar
                      </button>
                    )}
                    {(biz.status === "paused" || biz.status === "suspended") && (
                      <button onClick={() => handleAction("reactivate", biz._id, biz.name)}
                        style={{ padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "#e3f5ea", color: "#2d7a4a", border: "none" }}>
                        ▶ Reativar
                      </button>
                    )}
                    {biz.status === "active" && (
                      <button onClick={() => handleAction("suspend", biz._id, biz.name)}
                        style={{ padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "#fae8e2", color: "#e05a3a", border: "none" }}>
                        🚫 Suspender
                      </button>
                    )}
                    <button
                      onClick={() => handleAction("delete", biz._id, biz.name)}
                      style={{
                        padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: confirmDelete === biz._id ? "#e05a3a" : "#fee2e2",
                        color: confirmDelete === biz._id ? "white" : "#e05a3a", border: "none",
                      }}>
                      {confirmDelete === biz._id ? "⚠️ Confirmar" : "🗑 Excluir"}
                    </button>
                  </div>
                </div>
              ))}

              {filteredBusinesses.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
                  Nenhum negócio encontrado.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {activeTab === "reviews" && <AdminReviewsTab />}

        {/* ── LOGS ── */}
        {activeTab === "logs" && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Logs de Administração</h1>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #eee", overflow: "hidden" }}>
              {(logs ?? []).map((log, i) => (
                <div key={log._id} style={{
                  padding: "12px 1.25rem", borderBottom: "1px solid #f5f5f5",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: i % 2 === 0 ? "white" : "#fafafa",
                }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#0a4f6e", fontSize: 14 }}>{log.action.replace(/_/g, " ")}</span>
                    <span style={{ color: "#888", fontSize: 13 }}> — {log.targetType} #{log.targetId.slice(-8)}</span>
                    {log.details && <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{log.details}</div>}
                  </div>
                  <span style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
