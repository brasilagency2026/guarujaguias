"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Senha deve ter no mínimo 8 caracteres"); return; }
    if (password !== confirm) { toast.error("As senhas não coincidem"); return; }
    setLoading(true);
    try {
      // TODO: wire up Convex auth once JWT_PRIVATE_KEY is configured
      toast.success("Conta criada! Redirecionando...");
      setTimeout(() => router.push("/cadastro"), 1500);
    } catch (err: any) {
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "2rem", borderRadius: "var(--radius-xl)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6 }}>Criar conta</h1>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: "1.75rem" }}>
        Cadastre-se para gerenciar seu negócio
      </p>

      <div style={{ background: "var(--green-light)", border: "1px solid var(--green)", borderRadius: "var(--radius)", padding: "10px 14px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>✅ Conta gratuita inclui:</div>
        <div style={{ fontSize: 12, color: "var(--green)", marginTop: 4, lineHeight: 1.8 }}>
          Listagem no portal · Aparece no mapa · Botão WhatsApp · Receber avaliações
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Seu nome</label>
          <input className="form-input" type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo" required autoComplete="name" />
        </div>
        <div className="form-row">
          <label className="form-label">E-mail</label>
          <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com" required autoComplete="email" />
        </div>
        <div className="form-grid-2">
          <div className="form-row">
            <label className="form-label">Senha</label>
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mín. 8 caracteres" required minLength={8} />
          </div>
          <div className="form-row">
            <label className="form-label">Confirmar senha</label>
            <input className="form-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a senha" required />
          </div>
        </div>

        {password.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: password.length >= i * 3
                    ? (password.length >= 12 ? "var(--green)" : password.length >= 8 ? "var(--sand-dark)" : "var(--coral)")
                    : "var(--border)",
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: password.length >= 12 ? "var(--green)" : password.length >= 8 ? "var(--sand-dark)" : "var(--coral)" }}>
              {password.length < 8 ? "Senha fraca" : password.length < 12 ? "Senha aceitável" : "Senha forte"}
            </div>
          </div>
        )}

        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
          Ao criar conta você concorda com os{" "}
          <Link href="/termos" style={{ color: "var(--ocean)" }}>Termos de Uso</Link>
          {" "}e{" "}
          <Link href="/privacidade" style={{ color: "var(--ocean)" }}>Política de Privacidade</Link>.
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg"
          style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? "Criando conta..." : "Criar conta gratuita"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Já tem conta? </span>
        <Link href="/login" style={{ color: "var(--ocean)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
          Entrar
        </Link>
      </div>
    </div>
  );
}
