"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

export default function DashboardSidebarClient() {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const convexClient = useMemo(() => new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!), []);

  const [business, setBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (!isLoaded) return;
      if (!isSignedIn) {
        setBusiness(null);
        setLoading(false);
        return;
      }
      try {
        const token = await getToken({ template: "convex" }).catch(() => null);
        if (token) convexClient.setAuth(token as any);
        const res = await convexClient.query(api.businesses.getMyBusiness);
        if (!cancelled) setBusiness(res);
      } catch (e) {
        console.error("DashboardSidebarClient load error:", e);
        if (!cancelled) setBusiness(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, convexClient]);

  const baseItems = [
    { href: "/dashboard", icon: "📊", label: "Visão geral" },
    { href: "/dashboard/perfil", icon: "✏️", label: "Perfil" },
  ];

  const proItems = [
    { href: "/dashboard/mini-site", icon: "🌐", label: "Mini-site" },
    { href: "/dashboard/fotos", icon: "📸", label: "Fotos" },
    { href: "/dashboard/agendamentos", icon: "📅", label: "Agenda" },
  ];

  const otherItems = [
    { href: "/dashboard/eventos", icon: "🎉", label: "Eventos" },
    { href: "/dashboard/assinatura", icon: "💳", label: "Assinatura" },
  ];

  const showPro = !!business && business.plan === "pro";

  // While loading, show base + other (but hide pro)
  const items = [...baseItems, ...otherItems.filter(i => i.href !== "/dashboard/assinatura"), ...(showPro ? proItems : []), otherItems.find(i => i.href === "/dashboard/assinatura")!];

  return (
    <nav style={{ flex: 1, padding: "0 8px" }}>
      {items.map(({ href, icon, label }) => (
        <Link key={href} href={href} className="dash-nav-item">
          <span>{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
