"use client";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  label: string;
  hint?: string;
  type: "logo" | "cover" | "gallery";
  businessSlug: string;
  maxFiles?: number;
  value?: string[];
  onChange: (imageIds: string[]) => void;
  aspectRatio?: string;
}

export default function ImageUploader({
  label, hint, type, businessSlug,
  maxFiles = 1, value = [], onChange, aspectRatio = "4/3"
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const cfHash = process.env.NEXT_PUBLIC_CF_IMAGES_HASH;
  const cfUrl = (id: string) => `https://imagedelivery.net/${cfHash}/${id}/card`;

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    fd.append("businessSlug", businessSlug);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Erro no upload");
    return data.imageId as string;
  };

  const handleFiles = async (files: FileList) => {
    const remaining = maxFiles - value.length;
    if (remaining <= 0) { toast.error(`Máximo de ${maxFiles} imagem(ns) atingido`); return; }

    setUploading(true);
    const toUpload = Array.from(files).slice(0, remaining);
    const newIds: string[] = [];

    for (const file of toUpload) {
      try {
        const id = await uploadFile(file);
        newIds.push(id);
      } catch (e: any) {
        toast.error(`${file.name}: ${e.message}`);
      }
    }

    if (newIds.length) {
      onChange(maxFiles === 1 ? newIds : [...value, ...newIds]);
      toast.success(`${newIds.length} imagem(ns) enviada(s)`);
    }
    setUploading(false);
  };

  const remove = async (id: string) => {
    try {
      await fetch(`/api/upload?imageId=${id}`, { method: "DELETE" });
      onChange(value.filter((v) => v !== id));
    } catch { toast.error("Erro ao remover imagem"); }
  };

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 5 }}>{label}</div>
      {hint && <div style={{ fontSize: 12, color: "var(--text-hint)", marginBottom: 8 }}>{hint}</div>}

      {value.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: maxFiles === 1 ? "1fr" : "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginBottom: 10 }}>
          {value.map((id) => (
            <div key={id} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", aspectRatio }}>
              <img src={cfUrl(id)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={() => remove(id)}
                style={{
                  position: "absolute", top: 4, right: 4,
                  background: "rgba(0,0,0,0.65)", color: "white", border: "none",
                  borderRadius: "50%", width: 24, height: 24, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          style={{
            border: `2px dashed ${dragOver ? "var(--ocean)" : "var(--border-mid)"}`,
            borderRadius: "var(--radius-sm)", cursor: "pointer",
            background: dragOver ? "var(--ocean-50)" : "var(--bg)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "1.5rem", gap: 6, transition: "all 0.15s",
          }}
        >
          {uploading ? (
            <div style={{ fontSize: 13, color: "var(--text-muted)", animation: "pulse 1.5s ease infinite" }}>
              ⏳ Enviando...
            </div>
          ) : (
            <>
              <div style={{ fontSize: 28 }}>📷</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
                Clique ou arraste uma imagem
              </div>
              <div style={{ fontSize: 12, color: "var(--text-hint)" }}>JPEG, PNG, WebP · máx 10MB</div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple={maxFiles > 1}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
