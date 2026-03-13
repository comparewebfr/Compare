import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { findProductBySlug, getSeoProductName } from "../../../../lib/helpers";

export async function generateMetadata({ params }) {
  const { productSlug } = await (params ?? Promise.resolve({}));
  const item = findProductBySlug(productSlug);
  const siteName = "Compare.";
  if (!item) return { title: siteName };
  const shortName = getSeoProductName(item);
  return {
    title: `Pièces — ${shortName} | ${siteName}`,
    description: `Prix et offres pièces pour ${shortName}. Comparateur d'offres.`,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
