import type { Metadata } from "next";
import { NextSeo } from "next-seo";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Guarujá Guias – Restaurantes, Hotéis e Serviços no Litoral Paulista",
  description:
    "Encontre restaurantes, pousadas, salões de beleza, passeios e serviços em Guarujá. Cadastro gratuito para comerciantes. Mapa interativo com geolocalização.",
  openGraph: {
    title: "Guarujá Guias",
    description: "O guia completo de negócios de Guarujá, SP",
    url: "https://guarujaguias.com.br",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "https://guarujaguias.com.br/og-home.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://guarujaguias.com.br" },
};

export default function HomePage() {
  return <HomeClient />;
}
