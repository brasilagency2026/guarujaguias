import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso – Guarujá Guias",
  robots: { index: false, follow: false },
};

export default function TermosPage() {
  return (
    <div className="container-sm" style={{ padding: "3rem 1.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 6 }}>Termos de Uso</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Última atualização: Janeiro de 2025</p>

      {[
        {
          title: "1. Aceitação dos Termos",
          content: "Ao acessar e usar o Guarujá Guias, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.",
        },
        {
          title: "2. Descrição do Serviço",
          content: "O Guarujá Guias é uma plataforma de diretório de negócios locais de Guarujá, SP. Oferecemos listagem gratuita e plano Pro com mini-site personalizado por R$ 50/mês.",
        },
        {
          title: "3. Responsabilidade do Comerciante",
          content: "O comerciante é integralmente responsável pelas informações publicadas em seu perfil, incluindo descrições, preços, horários e fotos. O Guarujá Guias não se responsabiliza por informações incorretas ou desatualizadas.",
        },
        {
          title: "4. Plano Pro e Pagamentos",
          content: "O Plano Pro custa R$ 50,00 mensais, cobrado via MercadoPago. A assinatura renova automaticamente a cada mês. O cancelamento pode ser feito a qualquer momento, com efeito no próximo ciclo de cobrança.",
        },
        {
          title: "5. Conteúdo Proibido",
          content: "É proibido publicar conteúdo falso, enganoso, ofensivo, ilegal ou que viole direitos de terceiros. O Guarujá Guias reserva-se o direito de remover qualquer conteúdo e suspender contas sem aviso prévio.",
        },
        {
          title: "6. Modificações",
          content: "Reservamo-nos o direito de modificar estes termos a qualquer momento. Continuando a usar o serviço após as alterações, você aceita os novos termos.",
        },
        {
          title: "7. Contato",
          content: "Para dúvidas sobre estes termos, entre em contato: contato@guarujaguias.com.br",
        },
      ].map(({ title, content }) => (
        <div key={title} style={{ marginBottom: "1.75rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>{title}</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>{content}</p>
        </div>
      ))}
    </div>
  );
}
