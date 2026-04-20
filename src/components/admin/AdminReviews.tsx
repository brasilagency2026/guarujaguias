"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

export default function AdminReviews() {
  const pendingReviews = useQuery(api.reviews.listPending);
  const approveReview = useMutation(api.admin.approveReview);
  const rejectReview  = useMutation(api.admin.rejectReview);

  const handleApprove = async (id: any, authorName: string) => {
    try {
      await approveReview({ reviewId: id });
      toast.success(`Avaliação de ${authorName} aprovada`);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleReject = async (id: any, authorName: string) => {
    try {
      await rejectReview({ reviewId: id });
      toast.info(`Avaliação de ${authorName} rejeitada`);
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
        ⭐ Moderação de Avaliações
      </h1>

      {pendingReviews === undefined ? (
        <div style={{ color: "#888" }}>Carregando...</div>
      ) : pendingReviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#888", background: "white", borderRadius: 16, border: "1px solid #eee" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>Nenhuma avaliação pendente</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>Todas as avaliações foram moderadas</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 14, color: "#888", marginBottom: 4 }}>
            {pendingReviews.length} avaliação(ões) aguardando moderação
          </div>
          {pendingReviews.map((review) => (
            <div key={review._id} style={{
              background: "white", borderRadius: 16, padding: "1.25rem",
              border: "1px solid #eee", display: "flex", gap: 14, flexWrap: "wrap",
            }}>
              {/* Stars */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: 18, color: "#d4a853" }}>
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                  {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{review.authorName}</div>
                {review.comment ? (
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>"{review.comment}"</p>
                ) : (
                  <p style={{ fontSize: 13, color: "#aaa", fontStyle: "italic" }}>Sem comentário</p>
                )}
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>
                  Negócio ID: {review.businessId}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                <button
                  onClick={() => handleApprove(review._id, review.authorName)}
                  style={{ padding: "8px 16px", borderRadius: 8, background: "#e3f5ea", color: "#2d7a4a", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
                >
                  ✓ Aprovar
                </button>
                <button
                  onClick={() => handleReject(review._id, review.authorName)}
                  style={{ padding: "8px 16px", borderRadius: 8, background: "#fae8e2", color: "#e05a3a", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
                >
                  ✕ Rejeitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
