import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade – Guarujá Guias",
  robots: { index: false, follow: false },
};

export default function PrivacidadePage() {
  return (
    <div className="container-sm" style={{ padding: "3rem 1.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 6 }}>Política de Privacidade</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Última atualização: Janeiro de 2025</p>

      {[
        {
          title: "1. Dados Coletados",
          content: "Coletamos: nome, e-mail e telefone no cadastro; dados do negócio (nome, endereço, fotos, horários); dados de navegação (páginas visitadas, cliques); dados de pagamento processados pelo MercadoPago (não armazenamos dados de cartão).",
        },
        {
          title: "2. Uso dos Dados",
          content: "Os dados são usados para: operar e melhorar a plataforma; exibir seu negócio no portal e mapa; processar pagamentos; enviar notificações sobre seu cadastro; gerar estatísticas agregadas de uso.",
        },
        {
          title: "3. Compartilhamento",
          content: "Não vendemos seus dados. Compartilhamos apenas com: MercadoPago (processamento de pagamentos); Cloudflare (hospedagem de imagens); Convex (banco de dados); Vercel (hospedagem da aplicação). Todos sob acordo de confidencialidade.",
        },
        {
          title: "4. Armazenamento",
          content: "Os dados são armazenados na infraestrutura da Convex (servidores nos EUA) com criptografia em trânsito e em repouso. Imagens são armazenadas na Cloudflare Images com CDN global.",
        },
        {
          title: "5. Seus Direitos (LGPD)",
          content: "Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar seus dados; corrigir dados incorretos; solicitar exclusão da conta; portabilidade dos dados; revogar consentimento. Entre em contato: privacidade@guarujaguias.com.br",
        },
        {
          title: "6. Cookies",
          content: "Usamos cookies essenciais para autenticação e preferências. Não usamos cookies de rastreamento de terceiros ou publicidade.",
        },
        {
          title: "7. Retenção",
          content: "Dados de conta são retidos enquanto a conta estiver ativa. Após exclusão, os dados são removidos em até 30 dias, exceto registros contábeis de pagamentos (retidos por 5 anos por obrigação legal).",
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
