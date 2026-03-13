import { Suspense } from "react";
import CompareApp from "../../../../components/CompareAppWrapper";
import { BreadcrumbJsonLd } from "../../../../components/JsonLd";
import { CATS, PTYPES } from "../../../../lib/data";
import { findCategoryBySlug, findProductTypeBySlug, pathCategory, pathProductType } from "../../../../lib/helpers";
import { getCategorySlug, getProductTypeSlug } from "../../../../lib/routes";

export async function generateMetadata({ params }) {
  const { categorySlug, productTypeSlug } = await params;
  const cat = findCategoryBySlug(categorySlug);
  const productType = findProductTypeBySlug(cat?.id, productTypeSlug);
  if (!cat || !productType) return { title: "Compare." };
  return {
    title: `Réparer un ${productType} ou le remplacer ? | Compare.`,
    description: `Comparez réparation, occasion et neuf pour les ${productType}. Trouvez le meilleur choix pour votre appareil.`,
    alternates: { canonical: `https://compare-fr.com/categories/${categorySlug}/${productTypeSlug}` },
  };
}

export async function generateStaticParams() {
  const params = [];
  for (const cat of CATS) {
    const types = PTYPES[cat.id] || [];
    for (const ptype of types) {
      params.push({
        categorySlug: getCategorySlug(cat),
        productTypeSlug: getProductTypeSlug(ptype),
      });
    }
  }
  return params;
}

export default async function Page({ params }) {
  const { categorySlug, productTypeSlug } = await params;
  const cat = findCategoryBySlug(categorySlug);
  const productType = findProductTypeBySlug(cat?.id, productTypeSlug);
  const breadcrumb = cat && productType
    ? [
        { label: "Accueil", path: "/" },
        { label: cat.name, path: pathCategory(cat.id) },
        { label: productType, path: pathProductType(cat.id, productType) },
      ]
    : [];
  return (
    <>
      {breadcrumb.length > 0 && <BreadcrumbJsonLd items={breadcrumb} />}
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
        <CompareApp />
      </Suspense>
    </>
  );
}
