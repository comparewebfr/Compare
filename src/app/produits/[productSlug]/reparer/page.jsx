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
  const canonical = `https://compare-fr.com/produits/${productSlug}/reparer/`;
  return {
    title: `${name} : réparer ou racheter ? Prix réparation | Compare.`,
    description: `Votre ${name} est en panne ? Comparez le coût de réparation (écran, batterie, connecteur…) vs racheter neuf ou reconditionné. Pièces détachées et verdict sur Compare.`,
    alternates: { canonical },
    openGraph: { title: `${name} : réparer ou racheter ?`, description: `Comparez réparation vs remplacement pour ${name}.`, siteName: "Compare.", type: "website", url: canonical },
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
