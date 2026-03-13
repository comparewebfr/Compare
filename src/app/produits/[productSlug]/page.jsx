import { Suspense } from "react";
import CompareApp from "../../../components/CompareAppWrapper";
import { findProductBySlug, getSeoProductName } from "../../../lib/helpers";

export async function generateMetadata({ params }) {
  const { productSlug } = await (params ?? Promise.resolve({}));
  const item = findProductBySlug(productSlug);
  const siteName = "Compare.";
  if (!item) return { title: siteName };
  const shortName = getSeoProductName(item);
  return {
    title: `Réparer ${shortName} ou racheter ? | ${siteName}`,
    description: `Coût de réparation, occasion et neuf pour ${shortName} (${item.productType}, ${item.year}). Notre recommandation et les alternatives.`,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
