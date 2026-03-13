import { Suspense } from "react";
import CompareApp from "../../components/CompareAppWrapper";
import { FaqJsonLd } from "../../components/JsonLd";
import { FAQ_QUESTIONS } from "../../lib/data";

export const metadata = {
  title: "Questions fréquentes | Compare.",
  description: "Réponses à vos questions sur Compare., le comparateur réparation vs occasion vs neuf.",
};

export default function Page() {
  return (
    <>
      <FaqJsonLd questions={FAQ_QUESTIONS} />
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
        <CompareApp />
      </Suspense>
    </>
  );
}
