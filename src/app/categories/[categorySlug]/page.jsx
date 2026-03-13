import { Suspense } from "react";
import CompareApp from "../../../components/CompareAppWrapper";
import { BreadcrumbJsonLd } from "../../../components/JsonLd";
import { CATS, ITEMS, PTYPES } from "../../../lib/data";
import { findCategoryBySlug, pathCategory, pathProductType } from "../../../lib/helpers";
import { getCategorySlug } from "../../../lib/routes";

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const cat = findCategoryBySlug(categorySlug);
  if (!cat) return { title: "Catégorie introuvable | Compare." };
  return {
    title: `${cat.name} — Réparer ou remplacer ? | Compare.`,
    description: `Comparez réparation, occasion et neuf pour les ${cat.name}. Trouvez le meilleur choix pour votre appareil.`,
    alternates: { canonical: `https://compare-fr.com/categories/${categorySlug}` },
  };
}

export async function generateStaticParams() {
  return CATS.map(c => ({ categorySlug: getCategorySlug(c) }));
}

export default async function Page({ params }) {
  const { categorySlug } = await params;
  const cat = findCategoryBySlug(categorySlug);
  const breadcrumb = cat
    ? [
        { label: "Accueil", path: "/" },
        { label: cat.name, path: pathCategory(cat.id) },
      ]
    : [];
  return (
    <>
      {cat && <CategorySeoContent cat={cat} />}
      {breadcrumb.length > 0 && <BreadcrumbJsonLd items={breadcrumb} />}
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
        <CompareApp />
      </Suspense>
    </>
  );
}

function CategorySeoContent({ cat }) {
  const types = PTYPES[cat.id] || [];
  const typeCounts = types.map(ptype => ({
    type: ptype,
    count: ITEMS.filter(i => i.category === cat.id && i.productType === ptype).length,
  })).filter(t => t.count > 0);

  return (
    <div className="sr-only">
      <h1>Réparer ou remplacer — {cat.name}</h1>
      <p>Comparez réparation, occasion et neuf pour les {cat.name}. Trouvez le meilleur choix pour votre appareil.</p>
      <h2>Types de produits</h2>
      <ul>
        {typeCounts.map(({ type, count }) => (
          <li key={type}>
            <a href={`https://compare-fr.com${pathProductType(cat.id, type)}`}>{type}</a> : {count} modèle{count > 1 ? "s" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
