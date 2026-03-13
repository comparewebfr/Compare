import { Suspense } from "react";
import CompareApp from "../../../../../components/CompareAppWrapper";
import { BreadcrumbJsonLd } from "../../../../../components/JsonLd";
import { CATS, ITEMS } from "../../../../../lib/data";
import { findCategoryBySlug, findProductTypeBySlug, pathBrand, pathCategory, pathProductType } from "../../../../../lib/helpers";
import { getCategorySlug, getProductTypeSlug, slugify } from "../../../../../lib/routes";

export async function generateMetadata({ params }) {
  const { categorySlug, productTypeSlug, brandSlug } = await params;
  const cat = findCategoryBySlug(categorySlug);
  const productType = findProductTypeBySlug(cat?.id, productTypeSlug);
  if (!cat || !productType) return { title: "Compare." };
  const brand = [...new Set(ITEMS.filter(i => i.category === cat.id && i.productType === productType).map(i => i.brand))]
    .find(b => slugify(b) === brandSlug);
  if (!brand) return { title: "Compare." };
  return {
    title: `Réparer ou remplacer ${brand} ? | Compare.`,
    description: `Comparez réparation, occasion et neuf pour les ${productType} ${brand}. Trouvez le meilleur choix pour votre appareil.`,
    alternates: { canonical: `https://compare-fr.com/categories/${categorySlug}/${productTypeSlug}/${brandSlug}` },
  };
}

export async function generateStaticParams() {
  const params = [];
  const seen = new Set();
  for (const item of ITEMS) {
    const key = `${item.category}|${item.productType}|${slugify(item.brand)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const cat = CATS.find(c => c.id === item.category);
    if (!cat) continue;
    params.push({
      categorySlug: getCategorySlug(cat),
      productTypeSlug: getProductTypeSlug(item.productType),
      brandSlug: slugify(item.brand),
    });
  }
  return params;
}

export default async function Page({ params }) {
  const { categorySlug, productTypeSlug, brandSlug } = await params;
  const cat = findCategoryBySlug(categorySlug);
  const productType = findProductTypeBySlug(cat?.id, productTypeSlug);
  const brand = [...new Set(ITEMS.filter(i => i.category === cat?.id && i.productType === productType).map(i => i.brand))]
    .find(b => slugify(b) === brandSlug);
  const breadcrumb = cat && productType && brand
    ? [
        { label: "Accueil", path: "/" },
        { label: cat.name, path: pathCategory(cat.id) },
        { label: productType, path: pathProductType(cat.id, productType) },
        { label: brand, path: pathBrand(cat.id, productType, brand) },
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
