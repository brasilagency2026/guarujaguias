import type { Metadata } from "next";
import DirectoryClient from "./DirectoryClient";

export const metadata: Metadata = {
  title: "Diretório de Negócios em Guarujá",
  description: "Encontre restaurantes, hotéis, salões de beleza, lojas e serviços em Guarujá, SP. Filtros por categoria, bairro e avaliação.",
};

export default function DirectoryPage() {
  return <DirectoryClient />;
}
