import { Suspense } from "react";
import CompareApp from "../components/CompareApp";

const Fallback = () => (
  <div style={{ minHeight: "100vh", background: "#F8F6F0" }}>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>
      <img src="/banner-hero.jpg" alt="" width={640} height={320} fetchPriority="high" loading="eager" style={{ width: "100%", height: "auto", borderRadius: 16, objectFit: "cover" }} />
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>Chargement...</div>
  </div>
);

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <CompareApp />
    </Suspense>
  );
}
