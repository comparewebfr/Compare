import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { ITEMS } from "../../../../lib/data";
import { findProductBySlug } from "../../../../lib/helpers";
import { getProductSlug } from "../../../../lib/routes";

export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  const item = findProductBySlug(productSlug);
  if (!item) return { title: "Produit introuvable | Compare." };
  const name = `${item.brand} ${item.name}`;
  return {
    title: `Acheter neuf — ${name} | Compare.`,
    description: `Prix et offres neuf pour ${name}. Comparateur d'offres.`,
    alternates: { canonical: `https://compare-fr.com/produits/${productSlug}` },
  };
}

export async function generateStaticParams() {
  return ITEMS.filter(i => !["electromenager", "plomberie", "chauffage", "jardin"].includes(i.category))
    .map(item => ({ productSlug: getProductSlug(item) }));
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
