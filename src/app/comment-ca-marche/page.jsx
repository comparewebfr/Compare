import { Suspense } from "react";
import CompareApp from "../../components/CompareAppWrapper";

export const metadata = {
  title: "Comment ça marche | Compare.",
  description: "Découvrez comment Compare. vous aide à choisir entre réparer et racheter.",
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
