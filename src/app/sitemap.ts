import { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export const revalidate = 3600; // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = "https://guarujaguias.com.br";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                    changeFrequency: "daily",   priority: 1.0,  lastModified: new Date() },
    { url: `${BASE}/mapa`,          changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/diretorio`,     changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/eventos`,       changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/cadastro`,      changeFrequency: "monthly", priority: 0.7 },
  ];

  // Category pages
  const categories = ["restaurante", "hospedagem", "beleza", "turismo", "loja", "saude", "cultura", "servicos", "eventos"];
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE}/diretorio?cat=${cat}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Business mini-site pages (most important for SEO)
  let businessPages: MetadataRoute.Sitemap = [];
  try {
    const businesses = await fetchQuery(api.businesses.listActive, { limit: 1000 });
    businessPages = businesses.map((b) => ({
      url: `${BASE}/guia/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: b.hasMiniSite ? 0.9 : 0.7,
      lastModified: new Date(b.updatedAt),
    }));
  } catch (e) {
    console.error("Sitemap: failed to fetch businesses", e);
  }

  return [...staticPages, ...categoryPages, ...businessPages];
}
