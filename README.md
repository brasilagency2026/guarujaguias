# 🌊 Guarujá Guias

Portal de negócios geolocalizado para Guarujá, SP — com mini-sites para comerciantes, mapa interativo e assinaturas via MercadoPago.

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | **Next.js 14** (App Router) |
| Backend/DB | **Convex** (real-time, serverless) |
| Autenticação | **Convex Auth** |
| Mapas | **MapLibre GL** + OpenFreeMap (sem API key) |
| Imagens | **Cloudflare Images** (CDN global) |
| Pagamentos | **MercadoPago** (assinatura R$50/mês) |
| Deploy | **Vercel** + Convex Cloud |

---

## Estrutura de URLs (SEO-Friendly)

```
guarujaguias.com.br/                     → Portal principal
guarujaguias.com.br/mapa                 → Mapa interativo
guarujaguias.com.br/diretorio            → Diretório com filtros
guarujaguias.com.br/eventos              → Agenda cultural
guarujaguias.com.br/cadastro             → Registro de negócios
guarujaguias.com.br/guia/{slug}          → Mini-site do negócio (SEO ★★★)
guarujaguias.com.br/admin                → Painel superadmin
guarujaguias.com.br/dashboard            → Painel do comerciante
```

Exemplos de slugs gerados:
- "Cantinho do Pescador" → `/guia/cantinho-do-pescador`
- "Hotel Beira Mar & Spa" → `/guia/hotel-beira-mar-e-spa`

---

## Setup Rápido

### 1. Clonar e instalar
```bash
git clone https://github.com/seu-usuario/guaruja-guias
cd guaruja-guias
npm install
```

### 2. Configurar Convex
```bash
npx convex dev
# Isso cria seu projeto em dashboard.convex.dev
# e preenche NEXT_PUBLIC_CONVEX_URL automaticamente
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas chaves
```

### 4. Configurar Cloudflare Images
1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) → Images
2. Crie variantes: `thumbnail` (200x200), `card` (600x400), `hero` (1200x630)
3. Copie o Account ID e crie um API Token com permissão `Cloudflare Images:Edit`
4. Pegue o delivery hash em: Images → Overview → "Your images are served from..."

### 5. Configurar MercadoPago
1. Crie conta em [mercadopago.com.br](https://mercadopago.com.br)
2. Acesse: Seu negócio → Configurações → Credenciais
3. Use credenciais de **teste** em dev, **produção** ao lançar
4. Configure o webhook URL: `https://guarujaguias.com.br/api/mercadopago/webhook`

### 6. Criar superadmin
```bash
# Após criar sua conta no portal, rode no Convex dashboard:
# Em Functions → userProfiles → insert:
{
  userId: "YOUR_USER_ID",
  role: "superadmin",
  createdAt: Date.now()
}
```

### 7. Rodar em desenvolvimento
```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

---

## Planos

| Feature | Gratuito | Pro (R$50/mês) |
|---------|----------|----------------|
| Listagem no portal | ✅ | ✅ |
| Página no mapa | ✅ | ✅ |
| WhatsApp link | ✅ | ✅ |
| Mini-site próprio | ❌ | ✅ |
| URL: `/guia/seu-negocio` | ❌ | ✅ |
| Agendamento online | ❌ | ✅ |
| Galeria de fotos | ❌ | ✅ |
| Lista de serviços com preços | ❌ | ✅ |
| Redes sociais integradas | ❌ | ✅ |
| Estatísticas de visitas | ❌ | ✅ |
| Promoções | ❌ | ✅ |

---

## Painel SuperAdmin (`/admin`)

Funcionalidades:
- **Visão geral**: KPIs, receita mensal, pendentes
- **Negócios**: Aprovar / Pausar / Suspender / Reativar / Excluir
- **Filtros**: Por status, plano, categoria, busca por nome
- **Avaliações**: Moderar reviews dos usuários
- **Usuários**: Gerenciar roles (user → admin)
- **Logs**: Histórico completo de todas as ações administrativas

---

## Geolocalização

O mapa usa:
- **MapLibre GL** (open source, sem custo)
- **OpenFreeMap** como tile provider (gratuito, sem API key)
- Geolocalização nativa do browser (`navigator.geolocation`)
- Busca de negócios por raio (bounding box no Convex)

---

## Deploy

```bash
# Deploy Convex
npx convex deploy

# Deploy Next.js (Vercel)
vercel --prod

# Configurar no Vercel:
# - NEXT_PUBLIC_CONVEX_URL
# - CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_IMAGES_TOKEN
# - MERCADOPAGO_ACCESS_TOKEN
# - AUTH_SECRET
```

---

## Sitemap dinâmico

Adicione `src/app/sitemap.ts`:
```ts
export default async function sitemap() {
  const businesses = await fetchQuery(api.businesses.listActive, {});
  return [
    { url: "https://guarujaguias.com.br", changeFrequency: "daily", priority: 1 },
    { url: "https://guarujaguias.com.br/mapa", changeFrequency: "daily", priority: 0.9 },
    ...businesses.map(b => ({
      url: `https://guarujaguias.com.br/guia/${b.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: new Date(b.updatedAt),
    }))
  ];
}
```
