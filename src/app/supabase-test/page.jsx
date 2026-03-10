"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, getProductWithOfferAndAsset, getProductBySlug, getOffersForNeuf } from "../../lib/supabase-queries";
import { isSupabaseConfigured } from "../../lib/supabase";
import { getProductSlug } from "../../lib/routes";
import { ITEMS } from "../../lib/data";

const hasUrl = typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" && process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0;
const hasKey = typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0;

export default function SupabaseTestPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testSlug, setTestSlug] = useState(ITEMS[0] ? getProductSlug(ITEMS[0]) : "");
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setError("Supabase non configuré : ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local");
        setLoading(false);
        return;
      }
      const { data, error: err } = await getProducts();
      if (err) {
        setError(err.message);
        setProducts([]);
      } else {
        setProducts(data ?? []);
        if (data?.length) {
          const first = data[0];
          const id = first.id ?? first.product_id ?? first.uuid;
          if (id) loadProductDetail(id);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  async function loadProductDetail(productId) {
    setSelectedProduct(null);
    const res = await getProductWithOfferAndAsset(productId);
    if (res.error) {
      setError(res.error.message);
    } else {
      setSelectedProduct(res);
    }
  }

  async function runSlugTest() {
    if (!testSlug) return;
    setTestResult(null);
    const productRes = await getProductBySlug(testSlug);
    const offersRes = await getOffersForNeuf(testSlug);
    setTestResult({
      slug: testSlug,
      product: productRes.data,
      productError: productRes.error?.message,
      offers: offersRes.data,
      offersError: offersRes.error?.message,
    });
  }

  if (loading) {
    return (
      <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto", fontFamily: "system-ui" }}>
      <Link href="/" style={{ color: "#2D6A4F", marginBottom: 20, display: "inline-block" }}>
        ← Retour à l&apos;accueil
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Test Supabase</h1>
      <p style={{ color: "#6B7280", marginBottom: 24, fontSize: 14 }}>
        Page de test pour vérifier la connexion Supabase. Ne pas exposer en production.
      </p>

      <div style={{ background: "#F3F4F6", padding: 16, borderRadius: 8, marginBottom: 24, fontSize: 13 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Variables d&apos;environnement</h3>
        <p style={{ margin: 0 }}><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {hasUrl ? "présente" : "absente"}</p>
        <p style={{ margin: "4px 0 0" }}><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {hasKey ? "présente" : "absente"}</p>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6B7280" }}>Client configuré: {isSupabaseConfigured() ? "oui" : "non"}</p>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", color: "#B91C1C", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          {error}
        </div>
      )}

      <section style={{ background: "#F9FAFB", padding: 20, borderRadius: 12, border: "1px solid #E5E7EB", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Slug utilisé sur la page Acheter neuf</h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>Le slug = identifiant du produit dans l&apos;URL (ex: apple-iphone-16-pro-max)</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={testSlug} onChange={(e) => setTestSlug(e.target.value)} placeholder="slug produit" style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14 }} />
          <button onClick={runSlugTest} style={{ padding: "10px 18px", background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Tester</button>
        </div>
        <p style={{ fontSize: 12, color: "#6B7280" }}>Exemples : {ITEMS.slice(0, 5).map((i) => getProductSlug(i)).join(", ")}</p>
        {testResult && (
          <div style={{ marginTop: 16, padding: 16, background: "#fff", borderRadius: 8, border: "1px solid #E5E7EB" }}>
            <p><strong>Slug testé :</strong> {testResult.slug}</p>
            <p><strong>Produit trouvé :</strong> {testResult.product ? "Oui" : "Non"} {testResult.productError && `(${testResult.productError})`}</p>
            <p><strong>Offres trouvées :</strong> {testResult.offers?.length ?? 0} {testResult.offersError && `(${testResult.offersError})`}</p>
            {testResult.offers?.length > 0 && (
              <pre style={{ marginTop: 12, fontSize: 11, overflow: "auto", maxHeight: 150 }}>{JSON.stringify(testResult.offers, null, 2)}</pre>
            )}
          </div>
        )}
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Produits ({products.length})</h2>
        {products.length === 0 ? (
          <p style={{ color: "#6B7280" }}>Aucun produit ou table vide.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {products.map((p) => {
              const id = p.id ?? p.product_id ?? p.uuid;
              return (
                <button
                  key={id}
                  onClick={() => loadProductDetail(id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {p.name ?? p.title ?? p.slug ?? `ID ${id}`}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selectedProduct && (
        <section style={{ background: "#F9FAFB", padding: 20, borderRadius: 12, border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Détail produit sélectionné</h2>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <strong>Product:</strong>
              <pre style={{ marginTop: 4, padding: 12, background: "#fff", borderRadius: 6, fontSize: 12, overflow: "auto" }}>
                {JSON.stringify(selectedProduct.product, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Offer:</strong>
              <pre style={{ marginTop: 4, padding: 12, background: "#fff", borderRadius: 6, fontSize: 12, overflow: "auto" }}>
                {selectedProduct.offer ? JSON.stringify(selectedProduct.offer, null, 2) : "null"}
              </pre>
            </div>
            <div>
              <strong>Asset (image):</strong>
              {selectedProduct.asset?.url ? (
                <div style={{ marginTop: 8 }}>
                  <img src={selectedProduct.asset.url} alt="" style={{ maxWidth: 200, borderRadius: 8 }} />
                  <pre style={{ marginTop: 8, padding: 12, background: "#fff", borderRadius: 6, fontSize: 12 }}>
                    {JSON.stringify(selectedProduct.asset, null, 2)}
                  </pre>
                </div>
              ) : (
                <pre style={{ marginTop: 4, padding: 12, background: "#fff", borderRadius: 6, fontSize: 12 }}>
                  {selectedProduct.asset ? JSON.stringify(selectedProduct.asset, null, 2) : "null"}
                </pre>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
