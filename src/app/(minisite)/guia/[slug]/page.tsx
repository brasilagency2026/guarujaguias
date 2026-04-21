import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import MiniSiteRenderer from "../../../../components/minisite/MiniSiteRenderer";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await fetchQuery(api.businesses.getBySlug, { slug: params.slug });

  if (!business) return { title: "Negócio não encontrado – Guarujá Guias" };

  const title = business.metaTitle ?? `${business.name} – ${business.neighborhood}, Guarujá`;
  const description =
    business.metaDescription ??
    `${business.shortDescription} — ${business.address}, Guarujá, SP.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://guarujaguias.com.br/guia/${business.slug}`,
      type: "website",
      locale: "pt_BR",
      images: business.coverImageId
        ? [{
            url: `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CF_IMAGES_HASH}/${business.coverImageId}/hero`,
            width: 1200,
            height: 630,
            alt: business.name,
          }]
        : [],
    },
    alternates: { canonical: `https://guarujaguias.com.br/guia/${business.slug}` },

    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: business.name,
        description: business.shortDescription,
        address: {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressLocality: "Guarujá",
          addressRegion: "SP",
          addressCountry: "BR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: business.lat,
          longitude: business.lng,
        },
        telephone: business.phone ?? business.whatsapp,
        url: business.website ?? `https://guarujaguias.com.br/guia/${business.slug}`,
      }),
    },
  };
}

export const revalidate = 60;

export default async function BusinessSlugPage({ params }: Props) {
  const business = await fetchQuery(api.businesses.getBySlug, { slug: params.slug });

  if (!business || business.status === "deleted" || business.status === "suspended") {
    notFound();
  }

  if (business.status === "paused") {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h1>Este negócio está temporariamente indisponível</h1>
        <p>Tente novamente em breve.</p>
      </div>
    );
  }

  return <MiniSiteRenderer business={business} />;
}
