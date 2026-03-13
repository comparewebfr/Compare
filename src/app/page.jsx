import { Suspense } from "react";
import CompareApp from "../components/CompareAppWrapper";
import { CATS, POPULAR_SEARCHES } from "../lib/data";
import { findProductByPopular, pathCategory, pathProduct, pathProductType } from "../lib/helpers";

const Fallback = () => (
  <div style={{ minHeight: "100vh", background: "#F8F6F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontSize: 15, color: "#6B7280" }}>Chargement...</span>
  </div>
);

export default function Page() {
  return (
    <>
      <HomeSeoContent />
      <Suspense fallback={<Fallback />}>
        <CompareApp />
      </Suspense>
    </>
  );
}

function HomeSeoContent() {
  const baseUrl = "https://compare-fr.com";
  return (
    <div className="sr-only">
      <h1>Réparer ou racheter ? Comparez en 30 secondes</h1>
      <p>Comparez réparation, achat reconditionné et neuf pour faire le meilleur choix. Estimations de coût, verdict et alternatives.</p>
      <h2>Catégories disponibles</h2>
      <ul>
        {CATS.map(cat => (
          <li key={cat.id}>
            <a href={`${baseUrl}${pathCategory(cat.id)}`}>{cat.name}</a>
          </li>
        ))}
      </ul>
      <h2>Recherches populaires</h2>
      <ul>
        {POPULAR_SEARCHES.slice(0, 10).map((s, i) => {
          const href = s.type === "general"
            ? `${baseUrl}${pathProductType(s.catId, s.productType)}`
            : (() => {
                const item = findProductByPopular({ brand: s.brand, name: s.name });
                return item ? `${baseUrl}${pathProduct(item)}` : "#";
              })();
          return (
            <li key={i}>
              <a href={href}>{s.label}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
