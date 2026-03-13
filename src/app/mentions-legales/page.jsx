import { Suspense } from "react";
import CompareApp from "../../components/CompareAppWrapper";

export const metadata = {
  title: "Mentions légales | Compare.",
  description: "Mentions légales et conditions d'utilisation du site Compare.",
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
