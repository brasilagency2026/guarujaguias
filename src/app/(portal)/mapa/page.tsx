import type { Metadata } from "next";
import MapPageClient from "./MapPageClient";

export const metadata: Metadata = {
  title: "Mapa de Negócios em Guarujá",
  description: "Explore restaurantes, hotéis e serviços de Guarujá no mapa interativo. Geolocalização para encontrar negócios próximos a você.",
};

export default function MapPage() {
  return <MapPageClient />;
}
