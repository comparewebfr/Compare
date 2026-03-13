/**
 * Compare. — Helpers
 */

import { CATS } from "./data";
import { OCC_CATS, ISS_TPL, ITEMS, TECH_CATS, RET, CHIP_TO_PRODUCT, PAGES_GENERALES, REPAIRABILITY_ELIGIBLE_CATS, QUALIREPAR_ELIGIBLE_CATS, QUALUREPAR_BONUS_BY_TYPE, QUALUREPAR_ANNUAIRE_URL, REPAIRABILITY_INDEX_BY_TYPE, REPAIRABILITY_INDEX_BY_PRODUCT, TUTORIAL_STEPS_BY_PRODUCT } from "./data";
import * as R from "./routes";

export { slugify } from "./routes";

export function getIssues(item) {
  const tpl = ISS_TPL[item.productType] || ISS_TPL.default;
  return tpl.map((t, i) => {
    const ytParts = [t.yt, item.brand, item.name].filter(Boolean);
    const ytQuery = ytParts.join(" ");
    const ixQuery = "";
    let altResource = null;
    if (OCC_CATS.includes(item.category)) {
      altResource = { name: "Spareka", icon: "tool", color: "#00B8D9", url: `https://www.spareka.fr/comment-reparer/${encodeURIComponent(item.productType.toLowerCase().replace(/ /g,'-'))}`, label: "Guide Spareka" };
    } else if (["velo", "montres"].includes(item.category)) {
      altResource = { name: "Forum", icon: "chat", color: "#6366F1", url: `https://www.google.fr/search?q=${encodeURIComponent(`forum réparation ${t.n} ${item.brand} ${item.name}`)}`, label: "Retours utilisateurs" };
    } else {
      altResource = { name: "Recherche", icon: "book", color: "#4285F4", url: `https://www.google.fr/search?q=${encodeURIComponent(`tutoriel réparation ${t.n} ${item.brand} ${item.name}`)}`, label: "Tutoriels en ligne" };
    }
    return {
      id: item.id * 100 + i, itemId: item.id, name: t.n,
      repairMin: Math.max(5, Math.round(item.priceNew * t.rn)),
      repairMax: Math.max(10, Math.round(item.priceNew * t.rx)),
      diff: t.d, time: t.t,
      partPrice: Math.max(3, Math.round(item.priceNew * t.rn * t.pr)),
      td: t.td,
      ytQuery,
      ixQuery,
      altResource,
      reconPrice: Math.round(item.priceNew * (OCC_CATS.includes(item.category) ? .55 : .62)),
    };
  });
}

/** @param {object} [opts] - { deviceUsé, isBricoleur, priceNeufOverride, priceOccOverride } pour affiner le verdict */
export function getVerdict(issues, item, opts = {}) {
  const AMBER = "#F59E0B";
  const GREEN = "#2D6A4F";
  const priceNeuf = opts.priceNeufOverride != null ? Number(opts.priceNeufOverride) : item.priceNew;
  const tMin = issues.reduce((s, i) => s + i.repairMin, 0);
  const tMax = issues.reduce((s, i) => s + i.repairMax, 0);
  const avg = (tMin + tMax) / 2;
  const reconPrice = opts.priceOccOverride != null ? Number(opts.priceOccOverride) : (issues[0]?.reconPrice ?? Math.round(priceNeuf * (OCC_CATS.includes(item.category) ? .55 : .62)));
  const deviceUsé = opts.deviceUsé === true;
  const isBricoleur = opts.isBricoleur === true;
  const age = new Date().getFullYear() - item.year;
  const appareilAncien = age >= 5 || deviceUsé;
  const hasDiff = issues.some(i => i.diff === "difficile");
  const hasMoyen = issues.some(i => i.diff === "moyen");
  const hasPro = issues.some(i => i.time === "pro");
  const multiDifficult = issues.filter(i => i.diff === "difficile" || i.diff === "moyen" || i.time === "pro").length >= 2;
  const repairFeasibility = hasPro || multiDifficult ? "peu_realiste" : hasDiff || hasMoyen ? "technique" : "facile";
  const repairFacile = repairFeasibility === "facile";

  let ratio = avg / priceNeuf;
  const multiIssuePenalty = issues.length >= 2 ? 1 + (issues.length - 1) * 0.28 : 1;
  ratio = Math.min(1, ratio * multiIssuePenalty);
  if (TECH_CATS.includes(item.category) && issues.length >= 2) ratio = Math.min(1, ratio + 0.06);
  if (isBricoleur && (repairFeasibility === "facile" || repairFeasibility === "technique")) ratio = Math.max(0, ratio - 0.06);
  if (repairFacile) ratio = Math.max(0, ratio - 0.03);
  if (appareilAncien) ratio = ratio < 0.12 ? Math.max(0, ratio - 0.03) : Math.min(1, ratio + 0.06);

  const savings = priceNeuf - avg;
  const repairMode = repairFeasibility === "peu_realiste" ? "pro" : (isBricoleur ? "autonome" : "autonome");
  const sl = shLabel(item.category).toLowerCase();
  const isReconEnVogue = TECH_CATS.includes(item.category);
  const remplacerWhy = isReconEnVogue
    ? `Le devis s’approche du prix du neuf. Pour les ${item.productType.toLowerCase()}s, le reconditionné est une alternative crédible : ~${reconPrice} € (${sl}) contre ${priceNeuf} € (neuf). Comparez les offres avant de trancher.`
    : `Le devis s’approche du prix du neuf. Pour ce type de produit (${item.productType}), le reconditionné est moins courant — le neuf (${priceNeuf} €) reste souvent la référence.`;
  if (repairFeasibility === "peu_realiste") {
    if (ratio < .09) return { v: "reparer", label: "Réparer", color: GREEN, icon: "tool", pertinence: "Réparer chez un pro", why: `L'intervention nécessite un professionnel, mais le coût (${Math.round(avg)} €) reste raisonnable. Un réparateur agréé QualiRépar pourra s'en charger. Économie d'environ ${Math.round(savings)} € vs le neuf.`, tip: "Réparateur pro", repairFeasibility, repairMode };
    return { v: "remplacer", label: "Remplacer", color: AMBER, icon: "swap", pertinence: "Remplacement préférable", why: remplacerWhy, tip: "Remplacer", repairFeasibility, repairMode };
  }
  if (repairFeasibility === "technique") {
    if (ratio < .14) {
      const alertBricoleur = " Réparation autonome possible (écran, batterie, connecteur…) avec un tutoriel vidéo. Sinon, un réparateur professionnel peut s'en charger.";
      return { v: "reparer", label: "Réparer", color: GREEN, icon: "tool", pertinence: "Réparer en autonomie ou chez un pro", why: `Réparation délicate mais réalisable. Économie d'environ ${Math.round(savings)} € vs le neuf.${alertBricoleur}`, tip: "Réparation autonome ou pro", repairFeasibility, repairMode };
    }
    return { v: "remplacer", label: "Remplacer", color: AMBER, icon: "swap", pertinence: "Remplacement préférable", why: remplacerWhy, tip: "Remplacer", repairFeasibility, repairMode };
  }
  const seuilRentable = appareilAncien ? .05 : .05;
  const seuilCompromis = appareilAncien ? .11 : .12;
  const seuilRemplacement = appareilAncien ? .22 : .23;
  if (ratio < seuilRentable) {
    const nuance = repairFacile ? " — réparation autonome possible" : " — réparation autonome ou pro";
    const whyRentable = appareilAncien ? `La réparation reste bien en dessous du prix neuf — économie d’environ ${Math.round(savings)} €. Appareil âgé ou usé : la réparation tient la route si le reste fonctionne bien.` : `La réparation reste bien en dessous du prix neuf — économie d’environ ${Math.round(savings)} €. C’est l’option la plus avantageuse.`;
    return { v: "reparer", label: "Réparer", color: GREEN, icon: "check", pertinence: "Rentable à réparer" + nuance, why: whyRentable, tip: "Économie maximale", repairFeasibility, repairMode };
  }
  if (ratio < seuilCompromis) {
    if (appareilAncien && ratio > .14) return { v: "remplacer", label: "Remplacer", color: AMBER, icon: "swap", pertinence: "Appareil âgé ou usé — remplacement souvent préférable", why: `À ${age} an${age > 1 ? "s" : ""}${deviceUsé ? " et usé" : ""}, le coût de réparation (${Math.round(avg)} €) s’approche du seuil où remplacer devient plus logique. ${isReconEnVogue ? `Le ${sl} (~${reconPrice} €) est une alternative crédible.` : "Le neuf reste la référence."}`, tip: "Remplacer", repairFeasibility, repairMode };
    return { v: "reparer", label: "Réparer", color: GREEN, icon: "tool", pertinence: "Réparer si bon état général", why: `Le coût de réparation reste raisonnable. Si votre appareil est en bon état (${item.year}, ${age} an${age > 1 ? "s" : ""}), la réparation est un bon compromis par rapport au ${sl} ou au neuf.`, tip: "Bon compromis", repairFeasibility, repairMode };
  }
  if (ratio < seuilRemplacement) return { v: "remplacer", label: "Remplacer", color: AMBER, icon: "swap", pertinence: "Réparation possible mais coûteuse", why: remplacerWhy, tip: "Remplacer", repairFeasibility, repairMode };
  return { v: "remplacer", label: "Remplacer", color: "#DC2626", icon: "swap", pertinence: "Remplacement recommandé", why: remplacerWhy, tip: "Remplacer", repairFeasibility, repairMode };
}

export function getRepairEstimate(issues, item) {
  if (!issues.length) return { min: 0, max: 0, median: 0, confidence: 0, explanation: "Aucune panne sélectionnée." };
  const currentYear = new Date().getFullYear();
  const age = currentYear - (item?.year ?? currentYear);
  const ageFactor = Math.max(0, Math.min(1, age / 8));
  const partTotal = issues.reduce((s, i) => s + i.partPrice, 0);
  let min = 0, max = 0;
  issues.forEach(i => {
    let iMin = i.repairMin, iMax = i.repairMax;
    if (i.diff === "difficile" || i.diff === "moyen" || i.time === "pro") {
      iMin = Math.round(iMin * (i.diff === "moyen" ? 1.02 : 1.05));
      iMax = Math.round(iMax * (i.diff === "moyen" ? 1.1 : 1.25));
    }
    if (ageFactor > 0.3) {
      const laborBoost = 1 + ageFactor * 0.1;
      iMin = Math.round(iMin * (0.7 + 0.3 * laborBoost));
      iMax = Math.round(iMax * (0.85 + 0.15 * laborBoost));
    }
    min += iMin;
    max += iMax;
  });
  min = Math.max(5, min);
  max = Math.max(min + 5, max);
  const median = Math.round((min + max) / 2);
  let confidence = 80;
  if (issues.length > 2) confidence -= 15;
  if (issues.some(i => i.time === "pro")) confidence -= 20;
  if (issues.some(i => i.diff === "difficile")) confidence -= 10;
  if (issues.some(i => i.diff === "moyen")) confidence -= 5;
  if (age > 6) confidence -= 10;
  confidence = Math.max(15, Math.min(95, confidence));
  const productLabel = item ? `${item.productType} ${item.brand}` : "ce type d'appareil";
  const explanation = `Estimation basée sur le prix des pièces (${partTotal} €), la difficulté et le temps estimé pour un ${productLabel}. Les tarifs varient selon l'enseigne et la région. Demandez un devis pour confirmer.`;
  return { min, max, median, confidence, explanation, partTotal };
}

/** Catégories/types éligibles au remplacement intelligent (modèle plus récent recommandé) */
const SMART_REPLACEMENT_PRODUCT_TYPES = ["Smartphone", "Tablette", "PC Portable", "Console portable"];

/**
 * Trouve un successeur logique (modèle plus récent, même famille) pour un produit tech.
 * Utilisé quand la recommandation est "remplacer" — évite de pousser bêtement le même modèle.
 * @param {object} item - Produit actuel
 * @returns {{ item: object, reason: string, priceDelta: number, yearDelta: number } | null}
 */
export function findSuccessorProduct(item) {
  if (!item || !SMART_REPLACEMENT_PRODUCT_TYPES.includes(item.productType)) return null;
  const sameType = ITEMS.filter(i => i.category === item.category && i.productType === item.productType && i.id !== item.id);
  const newerCandidates = sameType.filter(i => i.year > item.year);
  if (!newerCandidates.length) return null;

  const brand = item.brand?.toLowerCase() || "";
  const name = item.name || "";
  const priceRef = item.priceNew || 500;

  // Filtrer par famille produit (même marque + gamme cohérente)
  const inSameFamily = (c) => {
    if (c.brand?.toLowerCase() !== brand) return false;
    const cName = (c.name || "").toLowerCase();
    // iPhone → iPhone (tous)
    if (brand === "apple" && name.toLowerCase().includes("iphone")) return cName.includes("iphone");
    // Galaxy S → Galaxy S (S22, S23, S24, pas A/Z)
    if (brand === "samsung" && /galaxy s\d+/i.test(name)) return /galaxy s\d+/i.test(cName) && !/galaxy [az]/i.test(cName);
    // Galaxy A → Galaxy A
    if (brand === "samsung" && /galaxy a\d+/i.test(name)) return /galaxy a\d+/i.test(cName);
    // iPad → iPad (Pro, Air, Mini, base)
    if (brand === "apple" && name.toLowerCase().includes("ipad")) return cName.includes("ipad");
    // MacBook Air → MacBook Air
    if (brand === "apple" && name.toLowerCase().includes("macbook air")) return cName.includes("macbook air");
    // MacBook Pro → MacBook Pro
    if (brand === "apple" && name.toLowerCase().includes("macbook pro")) return cName.includes("macbook pro");
    // Switch → Switch (OLED, Lite, 2)
    if (brand === "nintendo" && name.toLowerCase().includes("switch")) return cName.includes("switch");
    // Steam Deck → Steam Deck
    if (brand === "valve" && name.toLowerCase().includes("steam deck")) return cName.includes("steam deck");
    // Autres: même marque + type
    return true;
  };

  const familyNewer = newerCandidates.filter(inSameFamily);
  if (!familyNewer.length) return null;

  // Prioriser le modèle le PLUS RÉCENT (iPhone 13 → 15/16, pas 14) tant que l'écart de prix reste raisonnable
  const yearGap = (c) => c.year - item.year;
  const priceGap = (c) => (c.priceNew - priceRef) / priceRef;
  const candidates = familyNewer
    .map(c => ({ item: c, yearDelta: yearGap(c), priceDelta: priceGap(c) }))
    .filter(x => x.yearDelta >= 1 && x.yearDelta <= 5 && x.priceDelta <= 0.5); // 1 à 5 ans plus récent, écart < 50 %

  if (!candidates.length) return null;

  // Trier par année décroissante (le plus récent en premier), puis prendre le premier valide
  const best = [...candidates].sort((a, b) => b.item.year - a.item.year)[0];
  const reason = best.yearDelta >= 2
    ? "Modèle plus récent, meilleur rapport qualité-prix"
    : "Pour un écart de prix limité, le modèle plus récent est plus pertinent";
  return { item: best.item, reason, priceDelta: best.priceDelta, yearDelta: best.yearDelta };
}

/**
 * Recommandation de remplacement intelligent : même modèle vs modèle plus récent.
 * Utilisé quand v.v === "remplacer" pour les produits tech.
 * @param {object} item - Produit actuel
 * @param {object} opts - { priceNeufOverride, priceOccOverride }
 * @returns {{ sameModel: object, newerModel: object|null, preferredOption: 'same'|'newer', reason: string } | null}
 */
export function getSmartReplacementRecommendation(item, opts = {}) {
  if (!item || !SMART_REPLACEMENT_PRODUCT_TYPES.includes(item.productType)) return null;
  const successor = findSuccessorProduct(item);
  if (!successor) return null;

  const currentYear = new Date().getFullYear();
  const age = currentYear - item.year;
  const priceNeuf = opts.priceNeufOverride ?? item.priceNew;
  const reconMult = OCC_CATS.includes(item.category) ? .55 : .62;

  const sameModel = {
    item,
    reconPrice: Math.round(priceNeuf * reconMult),
    neufPrice: priceNeuf,
  };
  const newerModel = {
    item: successor.item,
    reconPrice: Math.round(successor.item.priceNew * reconMult),
    neufPrice: successor.item.priceNew,
    reason: successor.reason,
    priceDelta: successor.priceDelta,
    yearDelta: successor.yearDelta,
  };

  // Favoriser le plus récent si : modèle ancien (>= 3 ans) OU écart de prix très raisonnable (< 25 %)
  const favorNewer = age >= 3 || (successor.priceDelta < 0.25 && age >= 2);
  const preferredOption = favorNewer ? "newer" : "same";
  const reason = favorNewer
    ? (age >= 4 ? "Le neuf de ce modèle est peu intéressant — le modèle plus récent offre un meilleur rapport qualité-prix." : "Pour un écart de prix limité, le modèle plus récent est plus pertinent.")
    : "Le neuf de ce modèle reste disponible et peut convenir si vous souhaitez rester sur le même appareil.";

  return { sameModel, newerModel, preferredOption, reason };
}

export function getAlternatives(item) {
  const isTech = TECH_CATS.includes(item.category);
  const reconMult = OCC_CATS.includes(item.category) ? .55 : .62;
  const sameType = ITEMS.filter(i => i.category === item.category && i.productType === item.productType && i.id !== item.id);
  const reconPrice = Math.round(item.priceNew * reconMult);
  if (isTech) {
    const sameGen = sameType.filter(i => i.brand === item.brand && Math.abs(i.year - item.year) <= 1).sort((a, b) => Math.abs(a.priceNew - item.priceNew) - Math.abs(b.priceNew - item.priceNew)).slice(0, 2);
    const equivOther = sameType.filter(i => i.brand !== item.brand && Math.abs(i.priceNew - item.priceNew) < item.priceNew * 0.35).sort((a, b) => Math.abs(a.priceNew - item.priceNew) - Math.abs(b.priceNew - item.priceNew)).slice(0, 2);
    const newer = sameType.filter(i => i.year > item.year).sort((a, b) => b.year - a.year).slice(0, 2);
    const closeSameGen = sameType.filter(i => i.brand === item.brand && Math.abs(i.year - item.year) <= 2).filter(i => !sameGen.find(s => s.id === i.id)).slice(0, 2);
    return {
      type: "tech",
      same: { item, reconPrice, neufPrice: item.priceNew },
      newer: newer.map(n => ({ item: n, reconPrice: Math.round(n.priceNew * reconMult), neufPrice: n.priceNew, reason: `Plus récent (${n.year})` })),
      equiv: [...closeSameGen, ...equivOther].slice(0, 4).map(e => ({
        item: e,
        reconPrice: Math.round(e.priceNew * reconMult),
        neufPrice: e.priceNew,
        reason: e.brand === item.brand ? `Modèle proche (${e.year})` : `Alternative ${e.brand} (${e.year})`,
      })),
    };
  } else {
    const sameBrand = sameType.filter(i => i.brand === item.brand).sort((a, b) => Math.abs(a.priceNew - item.priceNew) - Math.abs(b.priceNew - item.priceNew)).slice(0, 2);
    const otherBrand = sameType.filter(i => i.brand !== item.brand && Math.abs(i.priceNew - item.priceNew) < item.priceNew * 0.35).sort((a, b) => Math.abs(a.priceNew - item.priceNew) - Math.abs(b.priceNew - item.priceNew)).slice(0, 2);
    return {
      type: "functional",
      same: { item, reconPrice, neufPrice: item.priceNew },
      equiv: [...sameBrand, ...otherBrand].slice(0, 3).map(e => ({
        item: e,
        reconPrice: Math.round(e.priceNew * reconMult),
        neufPrice: e.priceNew,
        reason: e.brand === item.brand ? `Même marque, ${e.productType.toLowerCase()} compatible` : `${e.brand}, ${e.productType.toLowerCase()} équivalent`,
      })),
      newer: [],
    };
  }
}

export function getRet(cat, type) {
  const m = OCC_CATS.includes(cat);
  if (type === "neuf") return RET.neuf.filter(r => m ? ["Amazon", "Castorama", "Cdiscount", "Darty", "Rue du Commerce"].includes(r.n) : ["Amazon", "Fnac", "Darty", "Cdiscount", "Rue du Commerce"].includes(r.n));
  if (type === "occ") {
    const occRets = RET.occ.filter(r => ["Back Market", "Amazon Renewed", "Rakuten", "Cdiscount"].includes(r.n));
    if (OCC_CATS.includes(cat)) return occRets.filter(r => r.n !== "Back Market");
    return occRets;
  }
  return RET.pcs.filter(r => m ? ["Amazon", "Spareka", "Castorama", "Rue du Commerce"].includes(r.n) : ["Amazon", "Spareka", "Rue du Commerce"].includes(r.n));
}

export function buildRetailerUrl(r, item, affType) {
  const q = encodeURIComponent(`${item.brand} ${item.name}`);
  if (r.n === "Amazon") return affType === "occ" ? `https://www.amazon.fr/s?k=${q}&rh=p_72%3A2661614031` : `https://www.amazon.fr/s?k=${q}`;
  if (r.n === "Amazon Renewed") return `https://www.amazon.fr/s?k=${q}&rh=p_72%3A2661614031`;
  if (r.n === "Back Market") return `https://www.backmarket.fr/fr-fr/search?q=${q}`;
  if (r.n === "Fnac") return `https://www.fnac.com/SearchResult/ResultList.aspx?Search=${q}`;
  if (r.n === "Darty") return `https://www.darty.com/nav/recherche?s=${q}`;
  if (r.n === "Cdiscount") return `https://www.cdiscount.com/search/10/${q.replace(/ /g, "+")}.html`;
  if (r.n === "Castorama") return `https://www.castorama.fr/recherche?q=${q}`;
  if (r.n === "Rakuten") return `https://fr.shopping.rakuten.com/search/${q.replace(/ /g, "+")}`;
  if (r.n === "Rue du Commerce") return `https://www.rueducommerce.fr/recherche/${q.replace(/ /g, "%20")}`;
  if (r.n === "Spareka") return `https://www.spareka.fr/recherche?q=${q}`;
  return `https://www.google.com/search?q=${q}+${r.n}`;
}

/** Libellé explicite pour une offre pièce — ex: "Écran iPhone 13 compatible", "Batterie iPhone 13". Jamais la panne (écran cassé, batterie HS) dans le titre. */
export function buildPartsOfferLabel(offer, item, issueName) {
  const product = item ? `${item.brand} ${item.name}`.trim() : "";
  const slugFromOffer = (offer?.issue_type ?? "").toLowerCase().replace(/_/g, "-");
  const slugFromIssue = issueName ? R.slugify(issueName) : "";
  const slug = slugFromOffer || slugFromIssue;

  const partLabels = {
    "ecran-casse": { type: "ecran", part: "Écran" },
    "ecran-fissure": { type: "ecran", part: "Écran" },
    "batterie-usee": { type: "kit", part: "batterie" },
    "batterie-faible": { type: "kit", part: "batterie" },
    "batterie-hs": { type: "kit", part: "batterie" },
    "batterie-ecouteur-usee": { type: "kit", part: "batterie" },
    "batterie-boitier-usee": { type: "kit", part: "batterie" },
    "camera-avant-face-id": { type: "camera-avant", part: "Caméra avant Face ID" },
    "camera-avant": { type: "camera-avant", part: "Caméra avant" },
    "camera-avant-hs": { type: "camera-avant", part: "Caméra avant" },
    "camera-arriere-hs": { type: "camera-arriere", part: "Caméra arrière" },
    "camera-arriere": { type: "camera-arriere", part: "Caméra arrière" },
    "connecteur-de-charge": { type: "piece", part: "Connecteur de charge" },
    "connecteur-charge": { type: "piece", part: "Connecteur de charge" },
    "connecteur-charge-defaillant": { type: "piece", part: "Connecteur de charge" },
    "haut-parleur": { type: "piece", part: "Haut-parleur" },
    "bouton-power-volume": { type: "piece", part: "Boutons volume/power" },
    "vitre-arriere-cassee": { type: "piece", part: "Vitre arrière" },
    "wifi-bluetooth-hs": { type: "piece", part: "Module WiFi/Bluetooth" },
    "vibreur-hs": { type: "piece", part: "Moteur vibreur" },
    "kit-outils": { type: "kit-outils", part: "outils" },
    "outils": { type: "kit-outils", part: "outils" },
  };

  const mapped = partLabels[slug];
  if (mapped) {
    if (mapped.type === "ecran") return product ? `Écran ${product} compatible` : "Écran compatible";
    if (mapped.type === "kit") return `Kit réparation ${mapped.part} ${product}`;
    if (mapped.type === "kit-outils") return `Kit outils réparation ${product}`;
    if (mapped.type === "camera-avant" || mapped.type === "camera-arriere") return `${mapped.part} ${product}`;
    return `${mapped.part} ${product}`;
  }
  if (issueName) {
    const partFromIssue = issueName.replace(/\s+(cassé|cassée|fissuré|fissurée|hs|usée|usé|faible|défaillant|qui tient plus)$/i, "").trim();
    if (partFromIssue) return `${partFromIssue} ${product}`;
  }
  return product ? `Pièce ${product}` : "Pièce détachée";
}

/** URL de recherche pièces détachées (par type de produit + panne) — pour pages générales sans item précis */
export function buildRetailerUrlForParts(r, productType, panneName) {
  const raw = `pièce ${panneName} ${productType}`.trim();
  const q = encodeURIComponent(raw);
  if (r.n === "Amazon") return `https://www.amazon.fr/s?k=${q}`;
  if (r.n === "Rue du Commerce") return `https://www.rueducommerce.fr/recherche/${raw.replace(/ /g, "+")}`;
  if (r.n === "Castorama") return `https://www.castorama.fr/recherche?q=${q}`;
  if (r.n === "Spareka") return `https://www.spareka.fr/recherche?q=${q}`;
  return `https://www.google.com/search?q=${q}`;
}

export function isRepairabilityEligible(catId) {
  return REPAIRABILITY_ELIGIBLE_CATS.includes(catId);
}

export function isQualiReparEligible(catId) {
  return QUALIREPAR_ELIGIBLE_CATS.includes(catId);
}

/** Montant du bonus QualiRépar pour un type de produit (€). Retourne null si non éligible ou inconnu. */
export function getQualiReparBonus(productType) {
  if (!productType) return null;
  return QUALUREPAR_BONUS_BY_TYPE[productType] ?? null;
}

/** URL officielle pour trouver un réparateur labellisé QualiRépar */
export { QUALUREPAR_ANNUAIRE_URL };

export function getRepairabilityIndex(productType, item) {
  const key = item ? `${item.brand}|${item.name}` : null;
  if (key && REPAIRABILITY_INDEX_BY_PRODUCT[key] != null) return REPAIRABILITY_INDEX_BY_PRODUCT[key];
  return REPAIRABILITY_INDEX_BY_TYPE[productType] ?? null;
}

/** Étapes de tutoriel adaptées au type de produit */
export function getTutorialSteps(productType) {
  return TUTORIAL_STEPS_BY_PRODUCT[productType] ?? TUTORIAL_STEPS_BY_PRODUCT.default;
}

/** Requête YouTube ciblée : "réparer [produit] [problème]" */
export function getYoutubeRepairQuery(productType, problemName) {
  const p = (productType || "").toLowerCase().trim();
  const prob = (problemName || "").trim();
  return `réparer ${p} ${prob}`.replace(/\s+/g, " ").trim();
}

export function buildRepairerMapsUrl(item, place) {
  const where = (place || "").trim();
  if (!where) return "";
  const isTech = TECH_CATS.includes(item.category);
  const focus = isTech ? `${item.brand} ${item.name}` : `${item.productType} ${item.brand}`;
  const query = `réparateur ${focus} ${where}`.replace(/\s+/g, " ").trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildRepairerMapsUrlForType(productType, place) {
  const where = (place || "").trim();
  if (!where) return "";
  const query = `réparateur ${productType} ${where}`.replace(/\s+/g, " ").trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function pathCategory(catId) {
  return R.pathCategory(catId);
}

export function pathProduct(item) {
  return R.pathProduct(item);
}

export function pathCompare(item, issueId) {
  if (!item) return "/";
  if (issueId) {
    const issues = getIssues(item);
    const issue = issues.find(i => i.id === issueId);
    if (issue) return R.pathProductIssue(item, issue);
  }
  return R.pathProduct(item);
}

export function pathProductIssue(item, issue) {
  return R.pathProductIssue(item, issue);
}

export function findIssueBySlug(item, slug) {
  return R.findIssueBySlugFromIssues(getIssues(item), slug);
}

export function pathAff(item, affType, issues) {
  return R.pathAff(item, affType, issues);
}

export function pathProductType(catId, productType) {
  return R.pathProductType(catId, productType);
}

export function pathBrand(catId, productType, brand) {
  return R.pathBrand(catId, productType, brand);
}

export function pathModelsList(catId, productType, affType) {
  return R.pathModelsList(catId, productType, affType);
}

export function pathRepairPage(catId, productType) {
  return R.pathRepairPage(catId, productType);
}

export function findCategoryBySlug(slug) {
  return R.findCategoryBySlug(slug);
}

export function findProductBySlug(slug) {
  return R.findProductBySlug(slug);
}

export function findProductTypeBySlug(catId, slug) {
  return R.findProductTypeBySlug(catId, slug);
}

/** Nom court produit pour SEO (ex: "iPhone 13" au lieu de "Apple iPhone 13") */
export function getSeoProductName(item) {
  if (!item) return "";
  return item.brand === "Apple" ? item.name : `${item.brand} ${item.name}`;
}

/** Phrase d'intention SEO pour le titre — varie selon verdict et type de panne */
function getSeoIntentPhrase(issue, item, verdict) {
  const v = verdict?.v;
  const age = new Date().getFullYear() - (item?.year ?? new Date().getFullYear());
  const appareilAncien = age >= 5;
  const issueName = (issue?.name || "").toLowerCase();
  const isBatterie = issueName.includes("batterie") || issueName.includes("batterie usée") || issueName.includes("batterie faible");
  const isEcran = issueName.includes("écran") || issueName.includes("écran cassé");
  if (v === "remplacer" && (isBatterie || appareilAncien)) return "réparer ou passer à plus récent ?";
  if (v === "remplacer" && isEcran) return "réparer ou remplacer ?";
  if (v === "remplacer") return "réparer ou remplacer ?";
  return "réparer ou racheter ?";
}

/** Phrase question above-the-fold pour page produit + problème */
export function getSeoQuestionPhrase(issue, item, verdict) {
  if (!issue || !item) return null;
  const shortName = getSeoProductName(item);
  const intent = getSeoIntentPhrase(issue, item, verdict).replace(/\s*\?$/, "");
  return `Faut-il ${intent} un ${shortName} avec ${issue.name.toLowerCase()} ?`;
}

/** Metadata SEO complètes pour page produit + problème (title, description uniques) */
export function buildSeoIssueMetadata(item, issue) {
  if (!item || !issue) return null;
  const shortName = getSeoProductName(item);
  const verdict = getVerdict([issue], item);
  const repair = getRepairEstimate([issue], item);
  const intent = getSeoIntentPhrase(issue, item, verdict);
  const siteName = "Compare.";
  const title = `${shortName} ${issue.name.toLowerCase()} : ${intent} | ${siteName}`;
  const reconPrice = issue.reconPrice ?? Math.round(item.priceNew * (OCC_CATS.includes(item.category) ? .55 : .62));
  const sl = OCC_CATS.includes(item.category) ? "occasion" : "reconditionné";
  const repairRange = repair.median > 0 ? `Réparation estimée : ${repair.min}-${repair.max} €. ` : "";
  const description = `${repairRange}Prix neuf ~${item.priceNew} €, ${sl} ~${reconPrice} €. Verdict : ${verdict.label}. Notre analyse et les alternatives pour ${shortName} (${item.productType}, ${item.year}).`;
  return { title, description, verdict, intent };
}

export function buildSeo(page, data) {
  const siteName = "Compare.";
  if (page === "home") return { title: `Réparer ou racheter ? Comparez en 30 secondes | ${siteName}`, description: "Comparez réparation, achat reconditionné et neuf pour faire le meilleur choix. Estimations de coût, verdict et alternatives.", canonicalPath: "/", breadcrumb: [{ label: "Accueil", path: "/" }] };
  if ((page === "cat" || page === "cat-type" || page === "cat-brand") && data?.cat) {
    const cat = typeof data.cat === "string" ? CATS.find(c => c.id === data.cat) : data.cat;
    const catId = cat?.id || data.cat;
    const name = cat?.name || data.cat;
    const path = pathCategory(catId);
    if (page === "cat-type" && data.productType && PAGES_GENERALES.includes(catId)) {
      const typeLower = data.productType.toLowerCase();
      const typePath = R.pathProductType(catId, data.productType);
      const issuePart = data.issueName ? ` ${data.issueName}` : "";
      return { title: `Réparer ou racheter ${typeLower}${issuePart} ? | ${siteName}`, description: `Guide : quand réparer ou racheter un ${typeLower} ? Coûts indicatifs, pannes typiques et références pour comparer.`, canonicalPath: typePath, breadcrumb: [{ label: "Accueil", path: "/" }, { label: name, path }, { label: data.productType, path: typePath }] };
    }
    return { title: `Réparer ou racheter ${name} ? | ${siteName}`, description: `Comparez réparation, occasion et neuf pour les ${name}. Trouvez le meilleur choix pour votre appareil.`, canonicalPath: path, breadcrumb: [{ label: "Accueil", path: "/" }, { label: name, path }] };
  }
  if ((page === "compare" || page === "issue") && data?.item) {
    const item = data.item;
    const shortName = getSeoProductName(item);
    const path = data.issue ? R.pathProductIssue(item, data.issue) : pathCompare(item);
    if (page === "issue" && data.issue) {
      const meta = buildSeoIssueMetadata(item, data.issue);
      if (meta) return { title: meta.title, description: meta.description, canonicalPath: path, breadcrumb: [{ label: "Accueil", path: "/" }, { label: CATS.find(c => c.id === item.category)?.name || item.category, path: pathCategory(item.category) }, { label: shortName, path }] };
    }
    return { title: `Réparer ${shortName} ou racheter ? | ${siteName}`, description: `Coût de réparation, occasion et neuf pour ${shortName} (${item.productType}, ${item.year}). Notre recommandation et les alternatives.`, canonicalPath: path, breadcrumb: [{ label: "Accueil", path: "/" }, { label: CATS.find(c => c.id === item.category)?.name || item.category, path: pathCategory(item.category) }, { label: shortName, path }] };
  }
  if (page === "aff" && data?.item) {
    const item = data.item;
    const shortName = getSeoProductName(item);
    const typeLabel = data.affType === "neuf" ? "Acheter neuf" : data.affType === "occ" ? (OCC_CATS.includes(item.category) ? "Occasion" : "Reconditionné") : "Pièces";
    return { title: `${typeLabel} — ${shortName} | ${siteName}`, description: `Prix et offres pour ${shortName} (${typeLabel}). Comparateur d'offres.`, canonicalPath: pathCompare(item), breadcrumb: [{ label: "Accueil", path: "/" }, { label: shortName, path: pathCompare(item) }, { label: typeLabel, path: "" }] };
  }
  const staticPages = { guide: "/comment-ca-marche", "repair-guide": "/guide/reparer-ou-racheter", avantages: "/avantages", faq: "/faq", legal: "/mentions-legales", about: "/a-propos", contact: "/contact" };
  if (staticPages[page]) return { title: siteName, description: "Comparez réparation, achat reconditionné et neuf.", canonicalPath: staticPages[page], breadcrumb: [] };
  return { title: `Réparer ou racheter ? | ${siteName}`, description: "Réparer, occasion ou neuf ? Comparez en un clic.", canonicalPath: "/", breadcrumb: [] };
}

export function findProductByChip(label) {
  const key = CHIP_TO_PRODUCT[label];
  if (key) return ITEMS.find(i => i.brand === key[0] && i.name === key[1]);
  return null;
}

export function findProductByPopular({ brand, name }) {
  return ITEMS.find(i => i.brand === brand && i.name === name);
}

export function shLabel(cat) {
  return OCC_CATS.includes(cat) ? "Occasion" : "Reconditionné";
}

// Time parsing
function _parseTimeMinutes(raw) {
  const s = (raw || "").toString().toLowerCase().replace(/\s+/g, "");
  if (!s) return null;
  if (s.includes("min")) {
    const n = parseInt(s.replace("min", ""), 10);
    return Number.isFinite(n) ? n : null;
  }
  if (s.includes("h")) {
    const m = s.match(/^(\d+)h(\d+)?$/);
    if (!m) return null;
    const h = parseInt(m[1], 10);
    const min = m[2] ? parseInt(m[2], 10) : 0;
    if (!Number.isFinite(h) || !Number.isFinite(min)) return null;
    return h * 60 + min;
  }
  return null;
}

export function parseTimeRange(raw) {
  const s0 = (raw || "").toString().toLowerCase().trim();
  if (!s0) return { kind: "unknown" };
  const s = s0.replace(/\s+/g, "");
  if (s === "pro") return { kind: "pro" };
  if (s === "variable") return { kind: "variable" };
  if (s.includes("-")) {
    let [a, b] = s.split("-");
    const unit = b.includes("h") ? "h" : b.includes("min") ? "min" : null;
    if (unit && !a.includes("h") && !a.includes("min")) a = a + unit;
    const minA = _parseTimeMinutes(a);
    const minB = _parseTimeMinutes(b);
    if (minA == null || minB == null) return { kind: "variable" };
    return { kind: "range", min: Math.min(minA, minB), max: Math.max(minA, minB) };
  }
  const m = _parseTimeMinutes(s);
  if (m == null) return { kind: "variable" };
  return { kind: "range", min: m, max: m };
}

function _fmtMinutes(mins) {
  const m = Math.max(0, Math.round(mins));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h <= 0) return `${m} min`;
  if (r === 0) return `${h}h`;
  return `${h}h${String(r).padStart(2, "0")}`;
}

export function formatTimeRangeLabel(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return "Durée variable";
  if (min === max) return `Environ ${_fmtMinutes(min)}`;
  return `Environ ${_fmtMinutes(min)} à ${_fmtMinutes(max)}`;
}

export function getCumulTimeInfo(issues) {
  const parsed = issues.map(i => parseTimeRange(i.time));
  const hasPro = parsed.some(p => p.kind === "pro");
  const hasVar = parsed.some(p => p.kind === "variable" || p.kind === "unknown");
  if (hasPro) {
    return { diyLabel: "Intervention professionnelle recommandée", diyFeasible: false, min: null, max: null, needsPro: true, hasVar: false };
  }
  if (hasVar) {
    return { diyLabel: "Durée variable (selon panne et modèle)", diyFeasible: true, min: null, max: null, needsPro: false, hasVar: true };
  }
  const min = parsed.reduce((s, p) => s + p.min, 0);
  const max = parsed.reduce((s, p) => s + p.max, 0);
  return { diyLabel: formatTimeRangeLabel(min, max), diyFeasible: true, min, max, needsPro: false, hasVar: false };
}

export function formatSingleTime(raw) {
  const p = parseTimeRange(raw);
  if (p.kind === "pro") return "Professionnel";
  if (p.kind === "variable" || p.kind === "unknown") return "Variable";
  if (p.kind === "range") return p.min === p.max ? _fmtMinutes(p.min) : `${_fmtMinutes(p.min)} à ${_fmtMinutes(p.max)}`;
  return "—";
}

export { _parseTimeMinutes, _fmtMinutes };
