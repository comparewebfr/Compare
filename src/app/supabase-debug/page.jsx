"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, getOffers, getProductBySlug, getOffersForNeuf, getProductPrimaryImageBySlug, getProductImageMap } from "../../lib/supabase-queries";
import { isSupabaseConfigured } from "../../lib/supabase";
import { getProductSlug } from "../../lib/routes";
import { ITEMS } from "../../lib/data";

export default function SupabaseDebugPage() {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [testSlug, setTestSlug] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [imageResults, setImageResults] = useState([]);
  const [imageMap, setImageMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      const [pRes, oRes, map] = await Promise.all([getProducts(), getOffers(), getProductImageMap()]);
      setProducts(pRes.data ?? []);
      setOffers(oRes.data ?? []);
      setImageMap(map);
      if (ITEMS[0]) setTestSlug(getProductSlug(ITEMS[0]));
      const imgChecks = await Promise.all(
        ITEMS.slice(0, 12).map(async (item) => {
          const slug = getProductSlug(item);
          const url = await getProductPrimaryImageBySlug(slug);
          return { slug, name: `${item.brand} ${item.name}`, url };
        })
      );
      setImageResults(imgChecks);
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
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Map images produits ({imageMap?.size ?? 0} slugs)</h2>
            <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Matching slug → image_url (ex. apple-iphone-13)</p>
            {imageMap && imageMap.size > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {Array.from(imageMap.entries()).slice(0, 12).map(([slug, url]) => (
                  <div key={slug} style={{ background: "#F3F4F6", padding: 8, borderRadius: 6, fontSize: 11, maxWidth: 200 }}>
                    <strong>{slug}</strong>
                    <br />
                    <span style={{ color: "#6B7280", wordBreak: "break-all" }}>{url?.slice(0, 50)}…</span>
                    {url && <img src={url} alt="" style={{ width: 48, height: 48, objectFit: "contain", marginTop: 4, display: "block" }} onError={(e) => { e.target.style.display = "none"; }} />}
                  </div>
                ))}
              </div>
            )}
            {imageMap && imageMap.size === 0 && <p style={{ color: "#DC2626" }}>Aucune image trouvée. Vérifie product_assets et la jointure products.</p>}
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Table offers ({offers.length} lignes)</h2>
            <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Colonnes : {offers[0] ? Object.keys(offers[0]).join(", ") : "—"}</p>
            <pre style={{ background: "#F3F4F6", padding: 12, borderRadius: 8, fontSize: 11, overflow: "auto", maxHeight: 200 }}>
              {JSON.stringify(offers.slice(0, 3), null, 2)}
            </pre>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Images produits (product_assets)</h2>
            <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Slug app = slug dans products Supabase. Si « Aucune » → produit absent ou slug différent.</p>
            <div style={{ display: "grid", gap: 8 }}>
              {imageResults.map((r) => (
                <div key={r.slug} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, background: r.url ? "#ECFDF5" : "#FEF2F2", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                  {r.url ? <img src={r.url} alt="" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 6, background: "#fff" }} onError={(e) => { e.target.style.display = "none"; }} /> : <span style={{ width: 48, height: 48, background: "#E5E7EB", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#6B7280" }}>—</span>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>slug: {r.slug}</div>
                    <div style={{ fontSize: 10, color: r.url ? "#059669" : "#DC2626", wordBreak: "break-all" }}>{r.url || "Aucune image"}</div>
                  </div>
                </div>
              ))}
            </div>
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
