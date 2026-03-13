"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, getOffers, getProductBySlug, getOffersForNeuf } from "../../lib/supabase-queries";
import { isSupabaseConfigured } from "../../lib/supabase";
import { getProductSlug } from "../../lib/routes";
import { ITEMS } from "../../lib/data";

export default function SupabaseDebugPage() {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [testSlug, setTestSlug] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      const [pRes, oRes] = await Promise.all([getProducts(), getOffers()]);
      setProducts(pRes.data ?? []);
      setOffers(oRes.data ?? []);
      if (ITEMS[0]) setTestSlug(getProductSlug(ITEMS[0]));
      setLoading(false);
    }
    load();
  }, []);

  async function runTest() {
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

  if (!isSupabaseConfigured()) {
    return (
      <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
        <Link href="/" style={{ color: "#2D6A4F", marginBottom: 20, display: "inline-block" }}>← Accueil</Link>
        <h1>Supabase Debug</h1>
        <p style={{ color: "#DC2626" }}>Supabase non configuré. Vérifie .env.local (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui" }}>
      <Link href="/" style={{ color: "#2D6A4F", marginBottom: 20, display: "inline-block" }}>← Accueil</Link>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Diagnostic Supabase</h1>
      <p style={{ color: "#6B7280", marginBottom: 24 }}>Vérifie la connexion et le matching produit → offres</p>

      {loading ? <p>Chargement...</p> : (
        <>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Table products ({products.length} lignes)</h2>
            <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Colonnes : {products[0] ? Object.keys(products[0]).join(", ") : "—"}</p>
            <pre style={{ background: "#F3F4F6", padding: 12, borderRadius: 8, fontSize: 11, overflow: "auto", maxHeight: 200 }}>
              {JSON.stringify(products.slice(0, 3), null, 2)}
            </pre>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Table offers ({offers.length} lignes)</h2>
            <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Colonnes : {offers[0] ? Object.keys(offers[0]).join(", ") : "—"}</p>
            <pre style={{ background: "#F3F4F6", padding: 12, borderRadius: 8, fontSize: 11, overflow: "auto", maxHeight: 200 }}>
              {JSON.stringify(offers.slice(0, 3), null, 2)}
            </pre>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Test matching</h2>
            <p style={{ fontSize: 13, marginBottom: 8 }}>Slug utilisé sur la page Acheter neuf = slug du produit (ex: apple-iphone-16-pro-max)</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input value={testSlug} onChange={(e) => setTestSlug(e.target.value)} placeholder="slug produit" style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #D1D5DB" }} />
              <button onClick={runTest} style={{ padding: "8px 16px", background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Tester</button>
            </div>
            <p style={{ fontSize: 11, color: "#6B7280" }}>Exemples de slugs (ITEMS) : {ITEMS.slice(0, 3).map((i) => getProductSlug(i)).join(", ")}</p>

            {testResult && (
              <div style={{ marginTop: 16, background: "#F9FAFB", padding: 16, borderRadius: 8, border: "1px solid #E5E7EB" }}>
                <p><strong>Slug testé :</strong> {testResult.slug}</p>
                <p><strong>Produit trouvé :</strong> {testResult.product ? "Oui" : "Non"} {testResult.productError && `(${testResult.productError})`}</p>
                <p><strong>Offres trouvées :</strong> {testResult.offers?.length ?? 0} {testResult.offersError && `(${testResult.offersError})`}</p>
                {testResult.offers?.length > 0 && (
                  <pre style={{ marginTop: 12, fontSize: 11, overflow: "auto" }}>{JSON.stringify(testResult.offers, null, 2)}</pre>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
