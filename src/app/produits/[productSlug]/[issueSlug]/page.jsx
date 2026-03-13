import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { findProductBySlug, findIssueBySlug, getSeoProductName } from "../../../../lib/helpers";

export async function generateMetadata({ params }) {
  const p = await (params ?? Promise.resolve({}));
  const { productSlug, issueSlug } = p;
  const siteName = "Compare.";
  const item = findProductBySlug(productSlug);
  if (!item) return { title: siteName };
  const issue = findIssueBySlug(item, issueSlug);
  const shortName = getSeoProductName(item);
  const issuePart = issue ? ` ${issue.name}` : "";
  return {
    title: `Réparer ${shortName}${issuePart} ou racheter ? | ${siteName}`,
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
