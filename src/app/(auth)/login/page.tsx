import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar – Guarujá Guias",
};

export default function LoginPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/registro"
        redirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: { width: "100%" },
            card: {
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border)",
            },
            headerTitle: { fontFamily: "var(--font-display)" },
            formButtonPrimary: {
              background: "var(--ocean)",
              borderRadius: "var(--radius)",
              fontFamily: "var(--font-body)",
            },
          },
          variables: {
            colorPrimary: "#0a4f6e",
            colorTextOnPrimaryBackground: "#ffffff",
            borderRadius: "8px",
          },
        }}
      />
    </div>
  );
}
