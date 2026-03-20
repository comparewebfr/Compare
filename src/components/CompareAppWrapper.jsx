"use client";

import dynamic from "next/dynamic";
import { ProductImageProvider } from "../lib/product-image-context";
import { ImageLightboxProvider } from "../lib/image-lightbox-context";
import { MinPriceNeufProvider } from "../lib/min-price-neuf-context";

const CompareApp = dynamic(() => import("./CompareApp"), {
  ssr: true,
  loading: () => (
    <div style={{ minHeight: "100vh", background: "#F8F6F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 15, color: "#6B7280" }}>Chargement...</span>
    </div>
  ),
});

export default function CompareAppWrapper({ productSlug, issueType }) {
  return (
    <ProductImageProvider>
      <MinPriceNeufProvider>
        <ImageLightboxProvider>
          <CompareApp initialProductSlug={productSlug} initialIssueType={issueType} />
        </ImageLightboxProvider>
      </MinPriceNeufProvider>
    </ProductImageProvider>
  );
}
