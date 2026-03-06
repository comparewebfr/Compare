/**
 * Compare. — Routes SEO-friendly
 * Slugification et helpers de navigation
 */

import { CATS, PTYPES, ITEMS } from "./data";

// ─── Slugification (minuscules, sans accents, tirets) ───
export function slugify(s) {
  if (!s || typeof s !== "string") return "";
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Slug catégorie (SEO: nom lisible)
export function getCategorySlug(cat) {
  const c = typeof cat === "string" ? CATS.find(x => x.id === cat) : cat;
  if (!c) return "";
  return slugify(c.name);
}

export function getProductTypeSlug(ptype) {
  return slugify(ptype);
}

export function getProductSlug(item) {
  if (!item) return "";
  const base = `${slugify(item.brand)}-${slugify(item.name)}`;
  const sameSlug = ITEMS.filter(i => `${slugify(i.brand)}-${slugify(i.name)}` === base);
  if (sameSlug.length > 1) return `${base}-${item.year}`;
  return base;
}

export function getIssueSlug(issue) {
  return issue?.name ? slugify(issue.name) : "";
}

// ─── Résolution slug → entité ───
export function findCategoryBySlug(slug) {
  if (!slug) return null;
  const s = String(slug).toLowerCase();
  return CATS.find(c => getCategorySlug(c) === s || c.id === s) || null;
}

export function findProductTypeBySlug(catId, slug) {
  if (!catId || !slug) return null;
  const types = PTYPES[catId] || [];
  const s = String(slug).toLowerCase();
  return types.find(t => getProductTypeSlug(t) === s) || null;
}

// Map produit slug → item (précalculé)
let _productSlugMap = null;
function buildProductSlugMap() {
  if (_productSlugMap) return _productSlugMap;
  const map = {};
  const seen = {};
  for (const item of ITEMS) {
    let slug = getProductSlug(item);
    if (seen[slug]) {
      slug = `${slug}-${item.year}`;
    }
    seen[slug] = (seen[slug] || 0) + 1;
    map[slug] = item;
  }
  _productSlugMap = map;
  return map;
}

export function findProductBySlug(slug) {
  if (!slug) return null;
  const map = buildProductSlugMap();
  const s = String(slug).toLowerCase();
  return map[s] || ITEMS.find(i => getProductSlug(i) === s) || null;
}

/** Résolution issue par slug — à utiliser avec getIssues (helpers) pour éviter circularité */
export function findIssueBySlugFromIssues(issues, slug) {
  if (!issues?.length || !slug) return null;
  const s = String(slug).toLowerCase();
  return issues.find(i => getIssueSlug(i) === s) || null;
}

// ─── Génération des chemins ───
export function pathHome() {
  return "/";
}

export function pathCommentCaMarche() {
  return "/comment-ca-marche";
}

export function pathGuideReparation() {
  return "/guide/reparer-ou-racheter";
}

export function pathAPropos() {
  return "/a-propos";
}

export function pathContact() {
  return "/contact";
}

export function pathFaq() {
  return "/faq";
}

export function pathMentionsLegales() {
  return "/mentions-legales";
}

export function pathCategory(catId) {
  const cat = typeof catId === "string" ? CATS.find(c => c.id === catId) : catId;
  if (!cat) return "/";
  return `/categories/${getCategorySlug(cat)}`;
}

export function pathProductType(catId, productType) {
  const cat = typeof catId === "string" ? CATS.find(c => c.id === catId) : catId;
  if (!cat || !productType) return pathCategory(catId);
  return `/categories/${getCategorySlug(cat)}/${getProductTypeSlug(productType)}`;
}

export function pathBrand(catId, productType, brand) {
  const base = productType ? pathProductType(catId, productType) : pathCategory(catId);
  if (!brand) return base;
  return `${base}/${slugify(brand)}`;
}

/** Liste des modèles par type (Occasion ou Neuf) — pages générales */
export function pathModelsList(catId, productType, affType) {
  const base = pathProductType(catId, productType);
  if (!base || base === "/") return "/";
  if (affType === "occ") return `${base}/occasion`;
  if (affType === "neuf") return `${base}/acheter-neuf`;
  return base;
}

/** Page Réparer — références pièces pour DIY (pages générales) */
export function pathRepairPage(catId, productType) {
  const base = pathProductType(catId, productType);
  if (!base || base === "/") return "/";
  return `${base}/reparer`;
}

export function pathProduct(item) {
  if (!item) return "/";
  return `/produits/${getProductSlug(item)}`;
}

export function pathProductIssue(item, issue) {
  if (!item) return "/";
  const base = pathProduct(item);
  if (!issue) return base;
  return `${base}/${getIssueSlug(issue)}`;
}

export function pathProductReparer(item, issues = []) {
  if (!item) return "/";
  const base = pathProduct(item);
  const issuePart = issues.length ? `?panne=${issues.map(i => i.id).join(",")}` : "";
  return `${base}/reparer${issuePart}`;
}

export function pathProductAcheterNeuf(item) {
  if (!item) return "/";
  return `${pathProduct(item)}/acheter-neuf`;
}

export function pathProductAcheterReconditionne(item) {
  if (!item) return "/";
  return `${pathProduct(item)}/acheter-reconditionne`;
}

/** Route aff selon type : neuf → acheter-neuf, occ → acheter-reconditionne, pcs → reparer */
export function pathAff(item, affType = "neuf", issues = []) {
  if (!item) return "/";
  if (affType === "neuf") return pathProductAcheterNeuf(item);
  if (affType === "occ") return pathProductAcheterReconditionne(item);
  if (affType === "pcs") return pathProductReparer(item, issues || []);
  return pathProduct(item);
}
