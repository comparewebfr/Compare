import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { findCategoryBySlug, findProductTypeBySlug } from "../../../../lib/helpers";
import { PAGES_GENERALES } from "../../../../lib/data";

export async function generateMetadata({ params }) {
  const p = await (params ?? Promise.resolve({}));
  const { categorySlug, productTypeSlug } = p;
  const siteName = "Compare.";
  const cat = findCategoryBySlug(categorySlug);
  const productType = findProductTypeBySlug(cat?.id, productTypeSlug);
  if (!cat || !productType) return { title: siteName };
  const typeLower = productType.toLowerCase();
  if (PAGES_GENERALES.includes(cat.id)) {
    return {
      title: `Réparer ou racheter ${typeLower} ? | ${siteName}`,
      description: `Guide : quand réparer ou racheter un ${typeLower} ? Coûts indicatifs, pannes typiques et références pour comparer.`,
    };
  }
  return {
    title: `Réparer ou racheter ${typeLower} ? | ${siteName}`,
    description: `Comparez réparation, occasion et neuf pour les ${productType}. Trouvez le meilleur choix pour votre appareil.`,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
