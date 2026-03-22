import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { CATS, ITEMS } from "../../../../lib/data";
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
    alternates: { canonical: `https://compare-fr.com/produits/${productSlug}/acheter-neuf` },
  };
}

export async function generateStaticParams() {
  return ITEMS.filter(i => !["electromenager", "plomberie", "chauffage", "jardin"].includes(i.category))
    .map(item => ({ productSlug: getProductSlug(item) }));
}

export default async function Page({ params }) {
  const { productSlug } = await params;
  const item = findProductBySlug(productSlug);
  return (
    <>
      {item && <NeufSeoContent item={item} />}
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
        <CompareApp />
      </Suspense>
    </>
  );
}

function NeufSeoContent({ item }) {
  const cat = CATS.find(c => c.id === item.category);
  const name = `${item.brand} ${item.name}`;
  return (
    <div className="sr-only">
      <h1>Acheter {name} neuf — Comparateur de prix</h1>
      <p>Comparez les meilleures offres pour acheter le {name} neuf. {item.productType} sorti en {item.year}{item.priceNew ? `, prix conseillé ${item.priceNew} €` : ""}.</p>
      <h2>Pourquoi acheter neuf ?</h2>
      <p>Acheter neuf garantit la garantie fabricant (généralement 2 ans en France), un produit jamais utilisé et un support officiel {item.brand}. C'est la meilleure option si vous cherchez la tranquillité d'esprit.</p>
      {item.priceNew && (
        <>
          <h2>Prix neuf {name}</h2>
          <p>Le {name} est vendu neuf à partir de {item.priceNew} € selon les revendeurs. Comparez les offres des marchands ci-dessous pour trouver le meilleur prix du marché.</p>
          <h2>Neuf vs reconditionné</h2>
          <p>En reconditionné, le {name} est disponible autour de {Math.round(item.priceNew * 0.62)} €, soit une économie d'environ {Math.round(item.priceNew * 0.38)} € par rapport au neuf. Le neuf reste pertinent si vous souhaitez une garantie complète et un produit intact.</p>
        </>
      )}
      {cat && <p>Catégorie : {cat.name}.</p>}
    </div>
  );
}
