"use client";
import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

const MAX_PHOTOS = 20;

export default function FotosPage() {
  const [photos, setPhotos] = useState<{ id: string; url: string; type: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const updateBusiness = useMutation(api.businesses.updateBusiness);

  const uploadFile = async (file: File, type: "gallery" | "cover" | "logo") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("businessSlug", "my-business-slug"); // from context

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? "Erro no upload");
    return data;
  };

  const handleFiles = async (files: FileList) => {
    if (photos.length >= MAX_PHOTOS) {
      toast.error(`Máximo de ${MAX_PHOTOS} fotos atingido`);
      return;
    }

    setUploading(true);
    const remaining = MAX_PHOTOS - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);

    for (const file of toUpload) {
      try {
        const data = await uploadFile(file, "gallery");
        setPhotos((p) => [...p, { id: data.imageId, url: data.urls.card, type: "gallery" }]);
        toast.success(`${file.name} enviada!`);
      } catch (e: any) {
        toast.error(`Erro: ${e.message}`);
      }
    }
    setUploading(false);
  };

  const removePhoto = async (id: string) => {
    await fetch(`/api/upload?imageId=${id}`, { method: "DELETE" });
    setPhotos((p) => p.filter((ph) => ph.id !== id));
    toast.success("Foto removida");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 6 }}>📸 Galeria de Fotos</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        {photos.length}/{MAX_PHOTOS} fotos · Formatos: JPEG, PNG, WebP · Máx. 10MB por foto
      </p>

      {/* Cover & Logo upload */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {[
          { type: "cover", label: "📸 Foto de capa", desc: "Aparece no topo do seu mini-site (1200×630px recomendado)" },
          { type: "logo",  label: "🏪 Logo / Avatar", desc: "Foto do estabelecimento ou logo (200×200px recomendado)" },
        ].map(({ type, label, desc }) => (
          <div key={type} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{desc}</div>
            <div style={{
              height: 100, background: "var(--bg)", borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px dashed var(--border-mid)", cursor: "pointer", fontSize: 28,
            }}
              onClick={() => {
                const inp = document.createElement("input");
                inp.type = "file"; inp.accept = "image/*";
                inp.onchange = (e) => { const f = (e.target as HTMLInputElement).files; if (f) handleFiles(f); };
                inp.click();
              }}
            >
              +
            </div>
          </div>
        ))}
      </div>

      {/* Gallery drag-drop */}
      <div
        className="card"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        style={{
          padding: "1.75rem",
          border: dragOver ? "2px dashed var(--ocean)" : "1px solid var(--border)",
          background: dragOver ? "var(--ocean-50)" : "white",
          transition: "all 0.15s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Galeria de fotos</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || photos.length >= MAX_PHOTOS}
            className="btn btn-primary btn-sm"
          >
            {uploading ? "Enviando..." : "+ Adicionar fotos"}
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: "none" }}
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }} />
        </div>

        {photos.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", aspectRatio: "4/3" }}>
                <img src={photo.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  onClick={() => removePhoto(photo.id)}
                  style={{
                    position: "absolute", top: 6, right: 6,
                    background: "rgba(0,0,0,0.6)", color: "white",
                    border: "none", borderRadius: "50%", width: 26, height: 26,
                    cursor: "pointer", fontSize: 12, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            height: 160, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "var(--text-hint)", gap: 8,
          }}>
            <div style={{ fontSize: 40 }}>📷</div>
            <div style={{ fontWeight: 500 }}>Arraste fotos aqui ou clique em "Adicionar fotos"</div>
            <div style={{ fontSize: 13 }}>JPEG, PNG, WebP · até 10MB por arquivo</div>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            <span>{photos.length} de {MAX_PHOTOS} fotos usadas</span>
            <span>{MAX_PHOTOS - photos.length} restantes</span>
          </div>
          <div style={{ height: 6, background: "var(--bg)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3, transition: "width 0.3s",
              background: photos.length >= MAX_PHOTOS ? "var(--coral)" : "var(--ocean)",
              width: `${(photos.length / MAX_PHOTOS) * 100}%`,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
