import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Cadastrar meu Negócio – Guarujá Guias",
  description: "Cadastre seu restaurante, hotel, loja ou serviço no Guarujá Guias. Listagem gratuita ou plano Pro com mini-site por R$50/mês.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
