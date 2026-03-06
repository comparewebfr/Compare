"use client";

import dynamic from "next/dynamic";

const CompareApp = dynamic(() => import("./CompareApp"), {
  ssr: true,
  loading: () => (
    <div style={{ minHeight: "100vh", background: "#F8F6F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 15, color: "#6B7280" }}>Chargement...</span>
    </div>
  ),
});

export default CompareApp;
