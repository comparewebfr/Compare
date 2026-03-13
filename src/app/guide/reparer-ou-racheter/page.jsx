import { Suspense } from "react";
import CompareApp from "../../../components/CompareAppWrapper";

export const metadata = {
  title: "Réparer ou racheter : guide | Compare.",
  description: "Guide complet pour décider entre réparer votre appareil ou en racheter un neuf ou reconditionné.",
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
