/**
 * Composants JSON-LD pour le SEO enrichi (données structurées)
 * Server Component — PAS "use client"
 */

export function ProductJsonLd({ item }) {
  if (!item) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.brand} ${item.name}`,
    brand: { "@type": "Brand", name: item.brand },
    category: item.productType,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: item.priceNew,
      availability: "https://schema.org/InStock",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function FaqJsonLd({ questions }) {
  if (!questions?.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(q => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BreadcrumbJsonLd({ items }) {
  if (!items?.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const entry = {
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
      };
      // Pas d'URL sur le dernier élément (page courante)
      if (i < items.length - 1 && item.path) {
        entry.item = `https://compare-fr.com${item.path}`;
      }
      return entry;
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
