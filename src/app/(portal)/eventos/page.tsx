import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Eventos em Guarujá – Agenda Cultural e de Lazer",
  description: "Descubra festas, shows, feiras e eventos culturais em Guarujá, SP. Agenda completa e atualizada.",
};

export default function EventsPage() {
  return <EventsClient />;
}
