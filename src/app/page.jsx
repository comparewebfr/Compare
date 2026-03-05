import { Suspense } from "react";
import CompareApp from "../components/CompareApp";

const Fallback = () => (
  <div style={{ minHeight: "100vh", background: "#F8F6F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontSize: 15, color: "#6B7280" }}>Chargement...</span>
  </div>
);

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <CompareApp />
    </Suspense>
  );
}
