import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { CATS, ITEMS, OCC_CATS } from "../../../../lib/data";
import { findProductBySlug } from "../../../../lib/helpers";
import { getProductSlug } from "../../../../lib/routes";

export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  const item = findProductBySlug(productSlug);
  if (!item) return { title: "Produit introuvable | Compare." };
  const name = `${item.brand} ${item.name}`;
  const typeLabel = OCC_CATS.includes(item.category) ? "Occasion" : "Reconditionné";
  return {
    title: `${typeLabel} — ${name} | Compare.`,
    description: `Prix et offres ${typeLabel.toLowerCase()} pour ${name}. Comparateur d'offres.`,
    alternates: { canonical: `https://compare-fr.com/produits/${productSlug}/acheter-reconditionne` },
  };
}

export async function generateStaticParams() {
  return ITEMS.filter(i => !["electromenager", "plomberie", "chauffage", "jardin"].includes(i.category))
    .map(item => ({ productSlug: getProductSlug(item) }));
}

export default async function Page({ params }) {
  const { productSlug } = await params;
  const item = findProductBySlug(productSlug);
  const isOcc = item ? OCC_CATS.includes(item.category) : false;
  return (
    <>
      {item && <ReconditionneSeocontent item={item} isOcc={isOcc} />}
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
        <CompareApp />
      </Suspense>
    </>
  );
}

function ReconditionneSeocontent({ item, isOcc }) {
  const cat = CATS.find(c => c.id === item.category);
  const name = `${item.brand} ${item.name}`;
  const typeLabel = isOcc ? "occasion" : "reconditionné";
  const TypeLabel = isOcc ? "Occasion" : "Reconditionné";
  const reconPrice = item.priceNew ? Math.round(item.priceNew * (isOcc ? 0.55 : 0.62)) : null;
  return (
    <div className="sr-only">
      <h1>Acheter {name} {typeLabel} — Comparateur de prix</h1>
      <p>Comparez les meilleures offres pour acheter le {name} {typeLabel}. {item.productType} sorti en {item.year}{item.priceNew ? `, prix neuf conseillé ${item.priceNew} €` : ""}.</p>
      <h2>Pourquoi acheter {typeLabel} ?</h2>
      {isOcc
        ? <p>Acheter le {name} en occasion permet de réaliser des économies significatives. Les appareils d'occasion sont testés et fonctionnels, souvent avec une garantie vendeur.</p>
        : <p>Acheter le {name} reconditionné, c'est choisir un appareil remis à neuf, testé et garanti — généralement entre 12 et 24 mois. Une alternative responsable et économique au neuf.</p>
      }
      {reconPrice && item.priceNew && (
        <>
          <h2>Prix {typeLabel} {name}</h2>
          <p>En {typeLabel}, le {name} est disponible à partir de {reconPrice} €, soit environ {Math.round((1 - reconPrice / item.priceNew) * 100)} % moins cher que le neuf ({item.priceNew} €). Comparez les offres des marchands ci-dessous.</p>
        </>
      )}
      <h2>Garanties et qualité</h2>
      {isOcc
        ? <p>Les produits d'occasion peuvent varier en état. Vérifiez toujours la garantie proposée par le vendeur et les conditions de retour avant d'acheter.</p>
        : <p>Les produits reconditionnés sont classés par grade (A, B, C) selon leur état cosmétique. Le grade A est quasi-neuf, le grade B présente de légères traces, le grade C des marques visibles. Les fonctions sont toujours intactes.</p>
      }
      {cat && <p>Catégorie : {cat.name}.</p>}
    </div>
  );
}
