import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { findProductBySlug, findIssueBySlug, pathProductIssue } from "../../../../lib/helpers";

const SITE_URL = "https://compare-fr.com";

export async function generateMetadata({ params }) {
  const { productSlug, issueSlug } = await params;
  const item = findProductBySlug(productSlug);
  if (!item) return { title: "Produit introuvable | Compare.", description: "Ce produit n'existe pas sur Compare." };
  const issue = findIssueBySlug(item, issueSlug);
  if (!issue) {
    return {
      title: `Réparer ${item.brand} ${item.name} ou racheter ? | Compare.`,
      description: `Coût de réparation, occasion et neuf pour ${item.brand} ${item.name} (${item.productType}, ${item.year}).`,
      alternates: { canonical: `https://compare-fr.com/produits/${productSlug}` },
    };
  }
  const issueName = issue.name;
  const name = `${item.brand} ${item.name}`;
  const title = `${issueName} — ${name} : réparer ou remplacer ? | Compare.`;
  const description = `Faut-il réparer votre ${name} avec ${issueName.toLowerCase()} ? Estimation réparation ${issue.repairMin}€–${issue.repairMax}€, prix reconditionné et neuf comparés.`;
  const canonicalPath = pathProductIssue(item, issue);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    openGraph: {
      title,
      description: `Comparez réparation, occasion et neuf pour ${name} — ${issueName} (${item.productType}, ${item.year}).`,
      siteName: "Compare.",
      type: "website",
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
