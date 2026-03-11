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
  return { data: byProductSlug, error: null };
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
