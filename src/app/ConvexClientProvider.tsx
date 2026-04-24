"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ptBR } from "@clerk/localizations";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      localization={ptBR as any}
      appearance={{
        baseTheme: "auto",
        variables: {
          colorPrimary: "#0e6080",
          colorText: "#0a4f6e",
          colorBackground: "#fffaf6",
          fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
          borderRadius: "8px",
        },
      } as any}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth as any}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
