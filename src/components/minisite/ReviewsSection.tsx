"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface Props {
  businessId: string;
  primaryColor?: string;
}

export default function ReviewsSection({ businessId, primaryColor = "var(--ocean)" }: Props) {
  const reviews = useQuery(api.reviews.listApproved, { businessId: businessId as any });
  const submitReview = useMutation(api.reviews.submit);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const avgRating = reviews?.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Informe seu nome"); return; }
    setSubmitting(true);
    try {
      await submitReview({ businessId: businessId as any, authorName: name, rating, comment: comment || undefined });
      setSubmitted(true);
      setShowForm(false);
      toast.success("Avaliação enviada! Será publicada após revisão.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const StarRow = ({ value, interactive = false }: { value: number; interactive?: boolean }) => (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => interactive && setRating(s)}
          onMouseEnter={() => interactive && setHoverRating(s)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          style={{
            fontSize: interactive ? 28 : 14,
            cursor: interactive ? "pointer" : "default",
            color: s <= (interactive ? hoverRating || rating : value) ? "#d4a853" : "#ddd",
            transition: "color 0.1s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>⭐ Avaliações</h2>
          {avgRating && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <StarRow value={Math.round(avgRating)} />
              <span style={{ fontWeight: 700, fontSize: 16, color: "#d4a853" }}>{avgRating.toFixed(1)}</span>
              <span style={{ fontSize: 13, color: "#888" }}>({reviews?.length} avaliações)</span>
            </div>
          )}
        </div>
        {!submitted && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: primaryColor, color: "white", border: "none",
              borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >
            {showForm ? "Cancelar" : "+ Avaliar"}
          </button>
        )}
      </div>

      {/* Submit form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "#f8f8f8", borderRadius: 12, padding: "1.25rem", marginBottom: "1.25rem", border: "1px solid #eee" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#555" }}>Sua avaliação</div>
            <StarRow value={rating} interactive />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome *"
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 8 }}
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sua experiência (opcional)..."
              rows={3}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }}
            />
          </div>
          <button type="submit" disabled={submitting} style={{
            width: "100%", background: primaryColor, color: "white", border: "none",
            borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer",
            opacity: submitting ? 0.7 : 1,
          }}>
            {submitting ? "Enviando..." : "Enviar avaliação"}
          </button>
          <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 6 }}>
            Avaliações passam por moderação antes de serem publicadas
          </p>
        </form>
      )}

      {submitted && (
        <div style={{ background: "var(--green-light)", borderRadius: 10, padding: "12px 14px", marginBottom: "1.25rem", fontSize: 14, color: "var(--green)" }}>
          ✅ Obrigado! Sua avaliação será publicada após revisão.
        </div>
      )}

      {/* Reviews list */}
      {reviews === undefined ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ height: 80, background: "#f0f0f0", borderRadius: 10, animation: "pulse 1.5s ease infinite" }} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#888" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⭐</div>
          <div style={{ fontSize: 14 }}>Seja o primeiro a avaliar!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map((review) => (
            <div key={review._id} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{review.authorName}</div>
                  <StarRow value={review.rating} />
                </div>
                <div style={{ fontSize: 11, color: "#aaa" }}>
                  {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
              {review.comment && (
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginTop: 6 }}>{review.comment}</p>
              )}
              {review.verified && (
                <div style={{ fontSize: 11, color: "var(--green)", marginTop: 6, fontWeight: 600 }}>✓ Visita verificada</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
