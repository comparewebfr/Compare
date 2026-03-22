/**
 * Composants JSON-LD pour le SEO enrichi (données structurées)
 * Server Component — PAS "use client"
 */

const SITE = "https://compare-fr.com";
// Valide 1 an à partir d'aujourd'hui
function priceValidUntil() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

export function ProductJsonLd({ item, imageUrl }) {
  if (!item) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.brand} ${item.name}`,
    description: `${item.brand} ${item.name} — ${item.productType}${item.year ? ` (${item.year})` : ""}. Comparez les prix neuf, reconditionné et les options de réparation sur Compare.`,
    brand: { "@type": "Brand", name: item.brand },
    category: item.productType,
    ...(imageUrl ? { image: imageUrl } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: item.priceNew,
      availability: "https://schema.org/InStock",
      url: `${SITE}/produits/${item.slug ?? ""}`,
      priceValidUntil: priceValidUntil(),
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "FR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "EUR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "FR",
        },
      },
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
      if (i < items.length - 1 && item.path) {
        entry.item = `${SITE}${item.path}`;
      }
      return entry;
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
