/**
 * Fonctions de lecture Supabase — products, offers, product_assets
 * À adapter si le schéma de tes tables diffère
 */
import { getSupabase } from "./supabase";

/** Récupère tous les produits */
export async function getProducts() {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error("Supabase non configuré") };
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
  return { data, error };
}

/** Récupère un produit par id */
export async function getProductById(id) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error("Supabase non configuré") };
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  return { data, error };
}

/** Récupère toutes les offres */
export async function getOffers() {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error("Supabase non configuré") };
  const { data, error } = await supabase.from("offers").select("*").order("id", { ascending: true });
  return { data, error };
}

/** Récupère les offres d'un produit (colonne product_id attendue) */
export async function getOffersByProductId(productId) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error("Supabase non configuré") };
  const { data, error } = await supabase.from("offers").select("*").eq("product_id", productId);
  return { data, error };
}

/** Récupère un produit par slug (colonne slug ou product_slug dans products) */
export async function getProductBySlug(slug) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error("Supabase non configuré") };
  const { data: bySlug, error: e1 } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (bySlug) return { data: bySlug, error: null };
  if (e1) return { data: null, error: e1 };
  const { data: byProductSlug } = await supabase.from("products").select("*").eq("product_slug", slug).maybeSingle();
  if (byProductSlug) return { data: byProductSlug, error: null };
  const slugLower = (slug || "").toLowerCase();
  const variants = [slugLower, slugLower.replace(/-/g, "_"), slugLower.replace(/-/g, " ")];
  for (const v of variants) {
    if (!v) continue;
    const { data: d1 } = await supabase.from("products").select("*").eq("slug", v).maybeSingle();
    if (d1) return { data: d1, error: null };
    const { data: d2 } = await supabase.from("products").select("*").eq("product_slug", v).maybeSingle();
    if (d2) return { data: d2, error: null };
  }
  const { data: all } = await supabase.from("products").select("id, slug, product_slug");
  if (all?.length) {
    const slugNorm = slugLower.replace(/[-_\s]/g, "");
    const match = all.find((p) => {
      const s = ((p.slug || p.product_slug) || "").toLowerCase().replace(/[-_\s]/g, "");
      return s === slugNorm || (s.length >= 5 && slugNorm.length >= 5 && (s.includes(slugNorm) || slugNorm.includes(s)));
    });
    if (match) {
      const { data: full } = await supabase.from("products").select("*").eq("id", match.id).single();
      return { data: full, error: null };
    }
  }
  return { data: null, error: null };
}

/**
 * Récupère le prix neuf minimum pour un produit (offres condition=new actives).
 * Source de vérité : Supabase.
 * @returns {{ minPrice: number|null, hasOffer: boolean }}
 */
export async function getMinPriceNeuf(productSlug) {
  const { data } = await getOffersForNeuf(productSlug);
  const offers = data ?? [];
  const active = offers.filter((o) => o.active !== false);
  const withPrice = active.filter((o) => o.price_amount != null && Number(o.price_amount) > 0);
  if (withPrice.length === 0) return { minPrice: null, hasOffer: false };
  const min = Math.min(...withPrice.map((o) => Number(o.price_amount)));
  return { minPrice: Math.round(min), hasOffer: true };
}

/**
 * Récupère les offres "neuf" pour un produit (page Acheter neuf).
 * Essaie d'abord via jointure products.slug, sinon via product_id.
 * Colonnes attendues : merchant, price_amount, price_currency, url, image_url
 */
export async function getOffersForNeuf(productSlug) {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: new Error("Supabase non configuré") };

  // 1. Produit par slug puis offres par product_id
  const { data: product, error: productErr } = await getProductBySlug(productSlug);
  if (productErr || !product) return { data: [], error: productErr };

  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .eq("product_id", product.id);

  if (error) return { data: [], error };

  const filtered = (offers ?? []).filter(
    (o) => !o.condition || o.condition === "new" || o.product_condition === "new" || o.condition === "neuf"
  );
  const sorted = [...filtered].sort((a, b) => (Number(a.price_amount) ?? 99999) - (Number(b.price_amount) ?? 99999));

  return { data: sorted, error: null };
}

/**
 * Récupère les offres "pièces de réparation" pour un produit.
 * Filtre sur condition = parts.
 * Colonnes attendues : merchant, condition, issue_type, url
 */
export async function getOffersForParts(productSlug) {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: new Error("Supabase non configuré") };

  const { data: product, error: productErr } = await getProductBySlug(productSlug);
  if (productErr || !product) return { data: [], error: productErr };

  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .eq("product_id", product.id);

  if (error) return { data: [], error };

  const partsConditions = ["parts", "pièces", "pieces", "reparation", "réparation"];
  const filtered = (offers ?? []).filter((o) => {
    const c = (o.condition ?? o.product_condition ?? "").toLowerCase();
    return partsConditions.some((term) => c.includes(term));
  });

  return { data: filtered, error: null };
}

/**
 * Récupère les offres "occasion/reconditionné" pour un produit.
 * Filtre sur condition = refurbished, occasion, occ, etc.
 */
export async function getOffersForOcc(productSlug) {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: new Error("Supabase non configuré") };

  const { data: product, error: productErr } = await getProductBySlug(productSlug);
  if (productErr || !product) return { data: [], error: productErr };

  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .eq("product_id", product.id);

  if (error) return { data: [], error };

  const occConditions = ["refurbished", "occasion", "occ", "reconditionné", "reconditionne"];
  const filtered = (offers ?? []).filter(
    (o) => {
      const c = (o.condition ?? o.product_condition ?? "").toLowerCase();
      return occConditions.some(term => c.includes(term));
    }
  );
  const sorted = [...filtered].sort((a, b) => (Number(a.price_amount) ?? 99999) - (Number(b.price_amount) ?? 99999));

  return { data: sorted, error: null };
}

/** Récupère tous les assets */
export async function getProductAssets() {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error("Supabase non configuré") };
  const { data, error } = await supabase.from("product_assets").select("*").order("id", { ascending: true });
  return { data, error };
}

/** Récupère les assets d'un produit (colonne product_id attendue) */
export async function getProductAssetsByProductId(productId) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error("Supabase non configuré") };
  const { data, error } = await supabase.from("product_assets").select("*").eq("product_id", productId);
  return { data, error };
}

/**
 * Récupère l'URL de l'image principale du produit (product_assets).
 * Priorité : is_primary = true, sinon première image.
 * Retourne l'URL ou null.
 */
export async function getProductPrimaryImageBySlug(productSlug) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: product } = await getProductBySlug(productSlug);
  if (!product) return null;
  const { data: assets } = await supabase
    .from("product_assets")
    .select("image_url, is_primary")
    .eq("product_id", product.id);
  if (!assets?.length) return null;
  const primary = assets.find((a) => a.is_primary === true);
  const first = assets[0];
  const chosen = primary ?? first;
  return chosen?.image_url?.trim() || null;
}

/**
 * Récupère toutes les images produits avec infos produit (jointure).
 * Permet un matching robuste par slug, product_slug ou brand+name.
 * Retourne un Map: slugNormalized -> image_url (image principale par produit).
 */
const _productImageMapCache = { data: null, ts: 0 };
const CACHE_TTL_MS = 60_000;

function slugify(s) {
  if (!s || typeof s !== "string") return "";
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function getProductImageMap() {
  if (_productImageMapCache.data && Date.now() - _productImageMapCache.ts < CACHE_TTL_MS) {
    return _productImageMapCache.data;
  }
  const supabase = getSupabase();
  if (!supabase) return new Map();
  const map = new Map();
  let assets = [];
  const { data: joined } = await supabase
    .from("product_assets")
    .select("image_url, is_primary, product_id, products(slug, product_slug, brand, name)")
    .not("image_url", "is", null);
  if (joined?.length) {
    assets = joined;
  } else {
    const { data: pa } = await supabase.from("product_assets").select("image_url, is_primary, product_id").not("image_url", "is", null);
    const { data: prods } = await supabase.from("products").select("id, slug, product_slug, brand, name");
    const prodMap = new Map((prods ?? []).map((p) => [p.id, p]));
    assets = (pa ?? []).map((a) => ({ ...a, products: prodMap.get(a.product_id) }));
  }
  if (!assets?.length) return map;
  const byProductId = {};
  for (const row of assets) {
    const pid = row.product_id;
    if (!pid || !row.image_url?.trim()) continue;
    if (!byProductId[pid]) byProductId[pid] = [];
    byProductId[pid].push(row);
  }
  for (const pid of Object.keys(byProductId)) {
    const rows = byProductId[pid];
    const primary = rows.find((r) => r.is_primary) ?? rows[0];
    const url = primary.image_url.trim();
    const product = primary.products;
    if (!product) continue;
    const slugs = [product.slug, product.product_slug].filter(Boolean);
    if (product.brand && product.name) slugs.push(`${slugify(product.brand)}-${slugify(product.name)}`);
    const slugNorm = (s) => (s || "").toLowerCase().replace(/[-_\s]/g, "");
    for (const s of slugs) {
      if (s) map.set(s.toLowerCase(), url);
      if (s) map.set(slugNorm(s), url);
    }
  }
  _productImageMapCache.data = map;
  _productImageMapCache.ts = Date.now();
  return map;
}

/**
 * Récupère un produit avec son offre et son image (pour test)
 * Retourne { product, offer, asset } ou null en cas d'erreur
 */
export async function getProductWithOfferAndAsset(productId) {
  const [productRes, offersRes, assetsRes] = await Promise.all([
    getProductById(productId),
    getOffersByProductId(productId),
    getProductAssetsByProductId(productId),
  ]);

  if (productRes.error) return { error: productRes.error, product: null, offer: null, asset: null };
  const product = productRes.data;
  const offer = offersRes.data?.[0] ?? null;
  const asset = assetsRes.data?.[0] ?? null;

  return { product, offer, asset, error: null };
}
