import { Suspense } from "react";
import CompareApp from "../../../components/CompareAppWrapper";
import { ProductJsonLd, BreadcrumbJsonLd } from "../../../components/JsonLd";
import { CATS, ITEMS } from "../../../lib/data";
import { findProductBySlug, getIssues, getVerdict, pathCategory } from "../../../lib/helpers";
import { getProductSlug } from "../../../lib/routes";

export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  const item = findProductBySlug(productSlug);
  if (!item) return { title: "Produit introuvable | Compare.", description: "Ce produit n'existe pas sur Compare." };
  const name = `${item.brand} ${item.name}`;
  return {
    title: `Réparer ou remplacer ${name} ? | Compare.`,
    description: `Faut-il réparer votre ${name} ou en racheter un ? Estimation réparation ${item.priceNew ? `(à partir de ~${Math.round(item.priceNew * 0.08)}€)` : ""}, prix reconditionné et neuf comparés.`,
    alternates: { canonical: `https://compare-fr.com/produits/${productSlug}` },
    openGraph: {
      title: `Réparer ou remplacer ${name} ? | Compare.`,
      description: `Comparez réparation, occasion et neuf pour ${name} (${item.productType}, ${item.year}).`,
      siteName: "Compare.",
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return ITEMS.filter(i => !["electromenager", "plomberie", "chauffage", "jardin"].includes(i.category))
    .map(item => ({ productSlug: getProductSlug(item) }));
}

export default async function Page({ params }) {
  const { productSlug } = await params;
  const item = findProductBySlug(productSlug);
  const cat = item ? CATS.find(c => c.id === item.category) : null;
  const breadcrumb = item && cat
    ? [
        { label: "Accueil", path: "/" },
        { label: cat.name, path: pathCategory(cat.id) },
        { label: `${item.brand} ${item.name}`, path: `/produits/${productSlug}` },
      ]
    : [];
  return (
    <>
      {item && <ProductSeoContent item={item} />}
      {item && <ProductJsonLd item={item} />}
      {breadcrumb.length > 0 && <BreadcrumbJsonLd items={breadcrumb} />}
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
        <CompareApp />
      </Suspense>
    </>
  );
}

function ProductSeoContent({ item }) {
  const issues = getIssues(item);
  const verdict = getVerdict(issues.slice(0, 1), item);
  const cat = CATS.find(c => c.id === item.category);
  const reconPrice = Math.round(item.priceNew * 0.62);
  const firstIssue = issues[0];

  return (
    <div className="sr-only">
      <h1>Réparer ou remplacer {item.brand} {item.name} ?</h1>
      <p>Le {item.brand} {item.name} est un {item.productType} sorti en {item.year} au prix de {item.priceNew}€ neuf.</p>
      <h2>Estimation réparation</h2>
      <p>Coût moyen de réparation : entre {firstIssue?.repairMin}€ et {firstIssue?.repairMax}€ selon la panne.</p>
      <h2>Prix reconditionné</h2>
      <p>En reconditionné, comptez environ {reconPrice}€.</p>
      <h2>Notre verdict</h2>
      <p>{verdict.label} — {verdict.why}</p>
      <h2>Pannes fréquentes</h2>
      <ul>
        {issues.map(iss => (
          <li key={iss.id}>{iss.name} : {iss.repairMin}€ – {iss.repairMax}€</li>
        ))}
      </ul>
    </div>
  );
}
