import { Suspense } from "react";
import CompareApp from "../../../components/CompareAppWrapper";
import { findCategoryBySlug } from "../../../lib/helpers";

export async function generateMetadata({ params }) {
  const { categorySlug } = await (params ?? Promise.resolve({}));
  const cat = findCategoryBySlug(categorySlug);
  const siteName = "Compare.";
  if (!cat) return { title: siteName };
  return {
    title: `Réparer ou racheter ${cat.name} ? | ${siteName}`,
    description: `Comparez réparation, occasion et neuf pour les ${cat.name}. Trouvez le meilleur choix pour votre appareil.`,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
