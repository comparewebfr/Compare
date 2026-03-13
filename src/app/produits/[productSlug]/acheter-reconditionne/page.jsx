import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { findProductBySlug, getSeoProductName } from "../../../../lib/helpers";
import { OCC_CATS } from "../../../../lib/data";

export async function generateMetadata({ params }) {
  const { productSlug } = await (params ?? Promise.resolve({}));
  const item = findProductBySlug(productSlug);
  const siteName = "Compare.";
  if (!item) return { title: siteName };
  const shortName = getSeoProductName(item);
  const typeLabel = OCC_CATS.includes(item.category) ? "Occasion" : "Reconditionné";
  return {
    title: `${typeLabel} — ${shortName} | ${siteName}`,
    description: `Prix et offres ${typeLabel.toLowerCase()} pour ${shortName}. Comparateur d'offres.`,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
