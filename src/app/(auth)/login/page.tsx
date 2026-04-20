"use client";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
      router.push(redirect);
    } catch (err: any) {
      toast.error("E-mail ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("password", { email, flow: "reset" });
      setForgotSent(true);
    } catch (err: any) {
      toast.error("Erro ao enviar e-mail. Verifique o endereço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "2rem", borderRadius: "var(--radius-xl)" }}>

      {mode === "login" ? (
        <>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6 }}>Entrar</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: "1.75rem" }}>
            Acesse o painel do seu negócio
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-row">
              <label className="form-label">E-mail</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Senha</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <div style={{ textAlign: "right", marginBottom: "1.25rem" }}>
              <button type="button" onClick={() => setMode("forgot")}
                style={{ background: "none", border: "none", color: "var(--ocean-mid)", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full btn-lg"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Não tem conta? </span>
            <Link href="/registro" style={{ color: "var(--ocean)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              Criar conta grátis
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 6 }}>Recuperar senha</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: "1.75rem" }}>
            Enviaremos um link de redefinição para seu e-mail
          </p>

          {forgotSent ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>E-mail enviado!</div>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: "1.5rem" }}>
                Verifique sua caixa de entrada e siga as instruções.
              </p>
              <button onClick={() => { setMode("login"); setForgotSent(false); }}
                className="btn btn-secondary btn-full">
                ← Voltar ao login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgot}>
              <div className="form-row">
                <label className="form-label">E-mail cadastrado</label>
                <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" required />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setMode("login")} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Enviando..." : "Enviar link"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
