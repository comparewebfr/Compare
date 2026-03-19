/**
 * Fonctions de lecture Supabase — products, offers, product_assets
 * À adapter si le schéma de tes tables diffère
 *
 * Source des offres : manual (priorité) | awin_feed | import_script
 * Priorité d'affichage : manuel exact > import exact > fallback > reste
 */
import { getSupabase } from "./supabase";

/** Offre manuelle (Amazon, etc.) — prioritaire, jamais écrasée par import */
function isManualOffer(o) {
  const s = (o.source ?? "").toLowerCase();
  return !s || s === "manual";
}

/** Priorité pour tri : 0 = meilleur, 1 = manuel fallback, 2 = import exact, 3 = import fallback */
function getOfferDisplayPriority(o) {
  const manual = isManualOffer(o);
  const exact = o.is_exact_match === true;
  if (manual && exact) return 0;
  if (manual) return 1;
  if (exact) return 2;
  return 3;
}

/** Inclut les offres produit principal + alternative (exclut part/accessory) */
function isMainProductOffer(o) {
  const kind = (o.offer_kind ?? "").toLowerCase();
  if (!kind || kind === "main_product" || kind === "alternative_product") return true;
  return false;
}

/** Inclut les offres pièces/accessoires dans la zone réparation */
function isPartsOffer(o) {
  const kind = (o.offer_kind ?? "").toLowerCase();
  const c = (o.condition ?? o.product_condition ?? "").toLowerCase();
  const partsConditions = ["parts", "pièces", "pieces", "reparation", "réparation"];
  const condMatch = partsConditions.some((term) => c.includes(term));
  if (kind === "part" || kind === "accessory" || kind === "service") return true;
  if (condMatch) return true;
  return false;
}

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

  // 1. Produit par slug puis offres : product_id exact OU fallback pour cette page
  const { data: product, error: productErr } = await getProductBySlug(productSlug);
  if (productErr || !product) return { data: [], error: productErr };

  const { data: directOffers, error: err1 } = await supabase
    .from("offers")
    .select("*")
    .eq("product_id", product.id);
  if (err1) return { data: [], error: err1 };

  // fallback_for_product_id est optionnel — on ignore l'erreur si la colonne n'existe pas
  const { data: fallbackOffers } = await supabase
    .from("offers")
    .select("*")
    .eq("fallback_for_product_id", product.id);
  const offers = [...(directOffers ?? []), ...(fallbackOffers ?? [])];

  const filtered = (offers ?? []).filter((o) => {
    if (o.is_hidden === true) return false;
    const condOk = !o.condition || o.condition === "new" || o.product_condition === "new" || o.condition === "neuf";
    if (!condOk) return false;
    if (!isMainProductOffer(o)) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const pa = getOfferDisplayPriority(a);
    const pb = getOfferDisplayPriority(b);
    if (pa !== pb) return pa - pb;
    return (Number(a.price_amount) ?? 99999) - (Number(b.price_amount) ?? 99999);
  });

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
    if (o.is_hidden === true) return false;
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

  const { data: directOffers, error: err1 } = await supabase
    .from("offers")
    .select("*")
    .eq("product_id", product.id);
  if (err1) return { data: [], error: err1 };

  // fallback_for_product_id est optionnel — on ignore l'erreur si la colonne n'existe pas
  const { data: fallbackOffers } = await supabase
    .from("offers")
    .select("*")
    .eq("fallback_for_product_id", product.id);
  const offers = [...(directOffers ?? []), ...(fallbackOffers ?? [])];

  const occConditions = ["refurbished", "occasion", "occ", "reconditionné", "reconditionne"];
  const filtered = (offers ?? []).filter((o) => {
    if (o.is_hidden === true) return false;
    const c = (o.condition ?? o.product_condition ?? "").toLowerCase();
    if (!occConditions.some((term) => c.includes(term))) return false;
    if (!isMainProductOffer(o)) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const pa = getOfferDisplayPriority(a);
    const pb = getOfferDisplayPriority(b);
    if (pa !== pb) return pa - pb;
    return (Number(a.price_amount) ?? 99999) - (Number(b.price_amount) ?? 99999);
  });

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
