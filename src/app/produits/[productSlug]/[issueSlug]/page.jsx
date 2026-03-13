import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { findProductBySlug, findIssueBySlug, buildSeoIssueMetadata, pathProductIssue } from "../../../../lib/helpers";

const SITE_URL = "https://compare-fr.com";

export async function generateMetadata({ params }) {
  const p = await (params ?? Promise.resolve({}));
  const { productSlug, issueSlug } = p;
  const siteName = "Compare.";
  const item = findProductBySlug(productSlug);
  if (!item) return { title: siteName };
  const issue = findIssueBySlug(item, issueSlug);
  if (!issue) {
    return {
      title: `Réparer ${item.brand} ${item.name} ou racheter ? | ${siteName}`,
      description: `Coût de réparation, occasion et neuf pour ${item.brand} ${item.name} (${item.productType}, ${item.year}).`,
    };
  }
  const meta = buildSeoIssueMetadata(item, issue);
  if (!meta) return { title: siteName };
  const canonicalPath = pathProductIssue(item, issue);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}${canonicalPath}`,
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
