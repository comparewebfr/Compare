"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== "undefined" && window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { PRODUCT_IMAGES } from "../data/product-images";
import { PRODUCT_TYPE_IMAGES } from "../data/product-type-images";
import { ACCENT, GREEN, AMBER, W, F, CSS } from "../lib/constants";
import { auth, signInWithGoogle, signInWithApple, signUpWithEmail, signInWithEmail, subscribeToAuth, logout } from "../lib/firebase";
import { CATS, PTYPES, ITEMS, OCC_CATS, SIDEBAR_GROUPS, CHIP_TO_PRODUCT, POPULAR_SEARCHES, POPULAR_SEARCHES_IPHONE, RET, LOGO_BG, TECH_CATS, WHEN_REPAIR_SPEC, PAGES_PRECISES, PAGES_GENERALES, ISS_TPL, BRAND_LOGOS, FAQ_QUESTIONS } from "../lib/data";
import { slugify, getIssues, getVerdict, getRepairEstimate, getAlternatives, getRet, buildRetailerUrl, buildRetailerUrlForParts, buildPartsOfferLabel, buildRepairerMapsUrl, buildRepairerMapsUrlForType, pathCategory, pathProduct, pathProductType, pathProductIssue, pathBrand, pathCompare, pathAff, pathModelsList, pathRepairPage, findProductByChip, findProductByPopular, findCategoryBySlug, findProductBySlug, findProductTypeBySlug, findIssueBySlug, shLabel, getCumulTimeInfo, parseTimeRange, formatTimeRangeLabel, formatSingleTime, isRepairabilityEligible, isQualiReparEligible, getQualiReparBonus, QUALUREPAR_ANNUAIRE_URL, getRepairabilityIndex, getTutorialSteps, getYoutubeRepairQuery, getSmartReplacementRecommendation, getSeoProductName, getSeoQuestionPhrase } from "../lib/helpers";
import { getOffersForNeuf, getOffersForOcc, getOffersForParts } from "../lib/supabase-queries";
import { isSupabaseConfigured } from "../lib/supabase";
import { getProductSlug } from "../lib/routes";
import { useProductImage } from "../lib/product-image-context";
import { useImageLightbox } from "../lib/image-lightbox-context";
import { useMinPriceNeuf } from "../lib/min-price-neuf-context";
import { Icon, Logo, Chev, Pill, Badge, Card } from "./shared";
import { FaqPage, LegalPage, AdvantagesPage, GuidePage, RepairGuidePage, AboutPage, ContactPage } from "./pages/StaticPages";
import HomePage from "./HomePage";

// ─── Prix neuf unifié (min des offres Supabase) ───
function ProductPriceNeuf({ item, fallback = "—" }) {
  const { displayText, loading } = useMinPriceNeuf(item);
  if (!item) return <>{fallback}</>;
  return <>{loading ? (item.priceNew != null ? `~${Math.round(item.priceNew)} €` : fallback) : displayText}</>;
}

const INFO_LOGO_SIZE = 56;
const INFO_LOGO_INDICE_SIZE = 70;
const INFO_BUBBLE = { width: 140, minHeight: 38, padding: "8px 16px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" };
const INFO_BUBBLE_INDICE = { width: 140, minHeight: 44, padding: "10px 18px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" };

/** Logo + bulle Indice de réparabilité */
function RepairabilityLogo({ score }) {
  const idx = score != null ? Math.min(10, Math.max(0, Number(score))) : null;
  const variant = idx == null ? 3 : idx <= 1.9 ? 1 : idx <= 3.9 ? 2 : idx <= 5.9 ? 3 : idx <= 7.9 ? 4 : 5;
  const src = `/reparabilite/logo-indice-${variant}.png`;
  const c = ["#E30613", "#F16E43", "#FFC107", "#6BCB77", "#2D6A4F"][variant - 1];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ width: INFO_LOGO_INDICE_SIZE, height: INFO_LOGO_INDICE_SIZE, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image src={src} alt="Indice de réparabilité" width={INFO_LOGO_INDICE_SIZE} height={INFO_LOGO_INDICE_SIZE} style={{ width: INFO_LOGO_INDICE_SIZE, height: INFO_LOGO_INDICE_SIZE, objectFit: "contain" }} />
      </div>
      {idx != null && (
        <div style={{ ...INFO_BUBBLE_INDICE, background: c + "22", border: `1px solid ${c}50` }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: c }}>{(Number.isInteger(idx) ? idx : idx.toFixed(1)).replace(".", ",")}</span><span style={{ fontSize: 14, fontWeight: 600, color: c, opacity: 0.9 }}>/10</span>
        </div>
      )}
    </div>
  );
}

/** Logo + bulle QualiRépar */
function QualiReparLogo({ bonusLabel, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ width: INFO_LOGO_SIZE, height: INFO_LOGO_SIZE, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image src="/qualirepar/logo.png" alt="QualiRépar" width={INFO_LOGO_SIZE} height={INFO_LOGO_SIZE} style={{ width: INFO_LOGO_SIZE, height: INFO_LOGO_SIZE, objectFit: "contain" }} />
      </div>
      <div style={{ ...INFO_BUBBLE, background: color + "22", border: `1px solid ${color}50` }}>
        <span style={{ fontSize: 15, fontWeight: 800, color, whiteSpace: "nowrap" }}>{bonusLabel} économisés</span>
      </div>
    </div>
  );
}

/** Colonne gauche : logo + valeur centrés */
function InfoCardBlock({ children }) {
  return (
    <div style={{ width: 140, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "stretch" }}>
      {children}
    </div>
  );
}

// ─── Images produits ────────────────────────────────────────────────────────
// Priorité centralisée : 1) Supabase (product_assets)  2) PRODUCT_IMAGES  3) placeholder (pas de /products/ pour éviter 404)
function getPlaceholderSrc(item) {
  if (!item?.id) return null;
  const seed = `${item.id}-${(item.brand || "")}-${(item.name || "")}`.replace(/\s/g, "-");
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/400`;
}

function ProductImg({ brand, item, size = 48, priorityUrl: priorityUrlProp, expandable = true }) {
  const supabaseUrl = useProductImage(item);
  const lightbox = useImageLightbox();
  const priorityUrl = priorityUrlProp ?? supabaseUrl;
  const [step, setStep] = useState(0);
  useEffect(() => { setStep(0); }, [item?.id, priorityUrl]);
  const initials = ((brand || item?.brand) || "?").slice(0, 3);
  const fallbackDiv = <div style={{ width: size, height: size, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E5E7EB", flexShrink: 0 }}>
    <span style={{ fontSize: Math.max(8, size * .15), fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase" }}>{initials}</span>
  </div>;
  let src = null;
  if (item) {
    if (step === 0 && priorityUrl?.trim()) src = priorityUrl.trim();
    else if (step === 0 && PRODUCT_IMAGES[item.id]) src = PRODUCT_IMAGES[item.id];
    else if (step === 0) src = getPlaceholderSrc(item);
    else src = getPlaceholderSrc(item);
  }
  const onError = () => setStep((s) => (s < 1 ? 1 : 3));
  if (!item || step === 3) return fallbackDiv;
  if (step === 0 && !src) return fallbackDiv;
  const objectFit = priorityUrl && step === 0 ? "contain" : "cover";
  const imgEl = (
    <Image src={src} alt={`Produit : ${item?.brand || ""} ${item?.name || ""}`.trim()} onError={onError} loading="lazy" width={size} height={size} sizes={`${size}px`} style={{ width: size, height: size, borderRadius: 10, objectFit, border: "1px solid #E5E7EB", flexShrink: 0, background: "#F3F4F6" }} />
  );
  if (expandable && lightbox && src) {
    return (
      <button type="button" onClick={() => lightbox.openLightbox(src)} style={{ padding: 0, border: "none", background: "none", cursor: "zoom-in", flexShrink: 0 }} aria-label="Agrandir l'image">
        {imgEl}
      </button>
    );
  }
  return imgEl;
}

/** Image par type de produit (maison) — PRODUCT_TYPE_IMAGES ou public/products-types/{slug}.jpg */
function ProductTypeImg({ productType, size = 120, iconName = "washer", iconColor = "#B45309" }) {
  const slug = slugify(productType || "");
  const src = PRODUCT_TYPE_IMAGES[productType] || (slug ? `/products-types/${slug}.jpg` : null);
  const [hasError, setHasError] = useState(false);
  useEffect(() => setHasError(false), [productType]);
  const placeholder = (
    <div style={{ width: size, height: size, borderRadius: 14, background: "linear-gradient(135deg, #FEF3E2 0%, #FDE8CD 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #E5E7EB", flexShrink: 0 }}>
      <Icon name={iconName} s={size * 0.4} color={iconColor} style={{ opacity: 0.6 }} />
    </div>
  );
  if (!src || hasError) return placeholder;
  return (
    <Image src={src} alt={productType} onError={() => setHasError(true)} width={size} height={size} sizes={`${size}px`} style={{ width: size, height: size, borderRadius: 14, objectFit: "cover", border: "1px solid #E5E3DE", flexShrink: 0 }} />
  );
}

/** Logo retailer — fond = prolongement de la couleur du logo (LOGO_BG), pas la couleur accent */
function RetailerLogo({ r, size = 44, className }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => setHasError(false), [r?.n]);
  const bg = (r?.logoUrl && LOGO_BG[r.logoUrl]) || "#F3F4F6";
  const boxStyle = { width: size, height: size, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: Math.round(size * 0.4), color: "#374151", flexShrink: 0 };
  if (!r?.logoUrl || hasError) {
    return <div className={className} style={boxStyle}>{r?.logo || r?.n?.[0] || "?"}</div>;
  }
  return (
    <Image src={r.logoUrl} alt={r.n} onError={() => setHasError(true)} width={size} height={size} sizes={`${size}px`} className={className} style={{ width: size, height: size, borderRadius: 10, objectFit: "contain", background: bg, flexShrink: 0 }} />
  );
}

/** Logo de marque — Google Favicon (gratuit, fiable) ; sz=256 pour netteté, unoptimized pour éviter le flou Next.js */
function BrandLogo({ brand, size = 48 }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => setHasError(false), [brand]);
  const domain = BRAND_LOGOS[brand] || (brand ? `${String(brand).toLowerCase().replace(/\s/g, "")}.com` : null);
  const initials = (brand || "?").slice(0, 2).toUpperCase();
  const fallback = (
    <div style={{ width: size, height: size, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E5E7EB", flexShrink: 0 }}>
      <span style={{ fontSize: Math.max(10, size * 0.25), fontWeight: 800, color: "#9CA3AF" }}>{initials}</span>
    </div>
  );
  if (!domain || hasError) return fallback;
  const src = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
  return (
    <div style={{ width: size, height: size, padding: 4, borderRadius: 10, background: "#fff", border: "1px solid #E5E7EB", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Image src={src} alt={brand} onError={() => setHasError(true)} width={size} height={size} unoptimized style={{ width: size, height: size, objectFit: "contain" }} />
    </div>
  );
}

// ─── AUTH MODAL ───
const FIREBASE_ENABLED = typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

function AuthModal({ onClose }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const closeBtnRef = useRef(null);
  useEffect(() => {
    closeBtnRef.current?.focus();
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onEsc); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleGoogle = async () => {
    if (!FIREBASE_ENABLED) { setError("Connexion non configurée. Configurez Firebase."); return; }
    setError(""); setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (e) {
      setError(e?.message || "Erreur Google");
    } finally { setLoading(false); }
  };

  const handleApple = async () => {
    if (!FIREBASE_ENABLED) { setError("Connexion non configurée. Configurez Firebase."); return; }
    setError(""); setLoading(true);
    try {
      await signInWithApple();
      onClose();
    } catch (e) {
      setError(e?.message || "Erreur Apple");
    } finally { setLoading(false); }
  };

  const handleEmail = async () => {
    if (!FIREBASE_ENABLED) { setError("Connexion non configurée. Configurez Firebase."); return; }
    if (!email.trim() || !password.trim()) { setError("Email et mot de passe requis"); return; }
    if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères"); return; }
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      onClose();
    } catch (e) {
      const msg = e?.code === "auth/email-already-in-use" ? "Cet email est déjà utilisé" : e?.code === "auth/invalid-credential" ? "Email ou mot de passe incorrect" : e?.message || "Erreur";
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="auth-title" style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, width: 370, maxWidth: "90vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 id="auth-title" style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>{mode === "signup" ? "Créer un compte" : "Se connecter"}</h2>
          <button ref={closeBtnRef} onClick={onClose} aria-label="Fermer" style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {!FIREBASE_ENABLED && <p style={{ fontSize: 13, color: AMBER, marginBottom: 12 }}>Configurez les variables Firebase (NEXT_PUBLIC_FIREBASE_*) pour activer la connexion.</p>}
        <button type="button" onClick={handleGoogle} disabled={!FIREBASE_ENABLED || loading} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: FIREBASE_ENABLED && !loading ? "pointer" : "not-allowed", fontFamily: F, marginBottom: 8, opacity: FIREBASE_ENABLED && !loading ? 1 : 0.6 }}>Continuer avec Google</button>
        <button type="button" onClick={handleApple} disabled={!FIREBASE_ENABLED || loading} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #111", background: "#111", color: "#fff", fontSize: 14, fontWeight: 600, cursor: FIREBASE_ENABLED && !loading ? "pointer" : "not-allowed", fontFamily: F, marginBottom: 8, opacity: FIREBASE_ENABLED && !loading ? 1 : 0.6 }}>Continuer avec Apple</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}><div style={{ flex: 1, height: 1, background: "#E5E7EB" }} /><span style={{ fontSize: 12, color: "#9CA3AF" }}>ou</span><div style={{ flex: 1, height: 1, background: "#E5E7EB" }} /></div>
        <label htmlFor="auth-email" className="sr-only">Adresse email</label>
        <input id="auth-email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="email@exemple.com" type="email" autoComplete="email" disabled={!FIREBASE_ENABLED} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #D1D5DB", fontSize: 14, fontFamily: F, marginBottom: 8, outline: "none" }} />
        <label htmlFor="auth-password" className="sr-only">Mot de passe</label>
        <input id="auth-password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Mot de passe (min. 6 caractères)" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} disabled={!FIREBASE_ENABLED} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #D1D5DB", fontSize: 14, fontFamily: F, marginBottom: 8, outline: "none" }} />
        {error && <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 8 }}>{error}</p>}
        <button type="button" onClick={handleEmail} disabled={!FIREBASE_ENABLED || loading} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 600, cursor: FIREBASE_ENABLED && !loading ? "pointer" : "not-allowed", fontFamily: F, marginBottom: 8, opacity: FIREBASE_ENABLED && !loading ? 1 : 0.6 }}>{mode === "signup" ? "Créer mon compte" : "Se connecter"}</button>
        <button type="button" onClick={() => { setMode(m => m === "signup" ? "signin" : "signup"); setError(""); }} style={{ background: "none", border: "none", fontSize: 13, color: "#6B7280", cursor: "pointer", fontFamily: F, padding: 0 }}>{mode === "signup" ? "Déjà un compte ? Se connecter" : "Pas de compte ? Créer un compte"}</button>
      </div>
    </div>
  );
}

// ─── SIDEBAR ───
function Sidebar({ open, onClose, onNav }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onEsc); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  const infoLinks = [{ l: "Comment ça marche", p: "guide", icon: "search" }, { l: "Guide réparation", p: "repair-guide", icon: "tool" }, { l: "Avantages", p: "avantages", icon: "leaf" }, { l: "Qui sommes-nous", p: "about", icon: "info" }, { l: "Contact", p: "contact", icon: "chat" }, { l: "FAQ", p: "faq", icon: "book" }];
  return <><button type="button" aria-label="Fermer le menu" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 200, backdropFilter: "blur(4px)", border: "none", cursor: "pointer", transition: "opacity .25s" }} onClick={onClose} />
    <aside role="dialog" aria-label="Menu de navigation" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 320, background: "#fff", zIndex: 201, overflowY: "auto", boxShadow: "16px 0 48px rgba(0,0,0,.12)", transition: "transform .3s cubic-bezier(0.22,1,0.36,1)" }}>
      <div style={{ padding: "24px 24px", background: "linear-gradient(135deg, #1B4332 0%, #0d2818 100%)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Logo s={36} /><span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-.03em" }}>Compare<span style={{ color: "#52B788" }}>.</span></span></div>
        <button onClick={onClose} aria-label="Fermer le menu" style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,.15)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.25)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.15)"; }}>×</button>
      </div>
      <nav style={{ padding: "24px 20px 32px" }} aria-label="Navigation principale">
        {SIDEBAR_GROUPS.map(grp => {
          const cats = grp.ids.map(id => CATS.find(c => c.id === id)).filter(Boolean);
          return <div key={grp.label} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".08em", paddingLeft: 12 }}>{grp.label}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {cats.map(cat => (
                <li key={cat.id}>
                  <button type="button" onClick={() => { onNav("cat", cat.id); onClose(); }} style={{ padding: "12px 16px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, color: "#374151", fontSize: 15, fontWeight: 600, background: "none", border: "none", width: "100%", textAlign: "left", font: "inherit", transition: "all .2s" }} onMouseEnter={e => { e.currentTarget.style.background = ACCENT + "0C"; e.currentTarget.style.color = ACCENT; e.currentTarget.style.transform = "translateX(4px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.transform = "none"; }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={cat.icon} s={18} color={ACCENT} /></span>
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>;
        })}
        <div style={{ paddingTop: 24, marginTop: 8, borderTop: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".08em", paddingLeft: 12 }}>Informations</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {infoLinks.map(x => (
              <li key={x.l}>
                <button type="button" onClick={() => { onNav(x.p); onClose(); }} style={{ padding: "14px 16px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, color: "#374151", fontSize: 15, fontWeight: 600, background: "#F8FAF9", border: "1px solid #E5E7EB", width: "100%", textAlign: "left", font: "inherit", transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.03)" }} onMouseEnter={e => { e.currentTarget.style.background = ACCENT + "0C"; e.currentTarget.style.borderColor = ACCENT + "30"; e.currentTarget.style.color = ACCENT; e.currentTarget.style.boxShadow = "0 4px 12px rgba(45,106,79,.1)"; }} onMouseLeave={e => { e.currentTarget.style.background = "#F8FAF9"; e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.03)"; }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: ACCENT + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={x.icon} s={20} color={ACCENT} /></span>
                  {x.l}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  </>;
}

// ─── NAVBAR SEARCH (barre de recherche compacte) ───
function NavbarSearch({ onSearch, isHome }) {
  const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
  const qNorm = (q || "").trim().toLowerCase();
  const sug = useMemo(() => qNorm.length > 1 ? ITEMS.filter(i => !PAGES_GENERALES.includes(i.category) && `${i.brand} ${i.name} ${i.productType}`.toLowerCase().includes(qNorm)).slice(0, 5) : [], [qNorm]);
  const exactMatch = useMemo(() => qNorm.length > 0 ? ITEMS.find(i => !PAGES_GENERALES.includes(i.category) && `${i.brand} ${i.name}`.toLowerCase() === qNorm) : null, [qNorm]);
  const containerRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setShow(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  const handleSelect = (id) => { onSearch(id); setQ(""); setShow(false); };
  return (
    <div ref={containerRef} style={{ position: "relative", flex: "1 1 200px", maxWidth: 320, minWidth: 140 }} className="nav-search-wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: isHome ? "#fff" : "#F8F6F0", borderRadius: 10, padding: "8px 14px", border: "1px solid #E0DDD5", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
        <Icon name="search" s={18} color={GREEN} style={{ flexShrink: 0 }} />
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setShow(true); }}
          onFocus={() => setShow(true)}
          placeholder="iPhone, MacBook, PS5..."
          aria-label="Rechercher un produit"
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: F, fontSize: 13, color: "#111" }}
          className="nav-search-input"
        />
        {q.trim() && <button type="button" onClick={() => { setQ(""); setShow(false); }} aria-label="Effacer" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#9CA3AF", fontSize: 16 }}>×</button>}
      </div>
      {show && (qNorm.length > 0) && (
        <div className="page-enter" style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.15)", overflow: "hidden", zIndex: 200, border: "1px solid #E5E7EB" }}>
          {sug.length > 0 ? (
            <ul style={{ margin: 0, padding: "6px 0", listStyle: "none" }}>
              {sug.map(item => (
                <li key={item.id}>
                  <button type="button" onMouseDown={() => handleSelect(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F8FAF9"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                    <ProductImg brand={item.brand} item={item} size={36} expandable={false} />
                    <div><div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{item.brand} {item.name}</div><div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.productType}</div></div>
                  </button>
                </li>
              ))}
            </ul>
          ) : exactMatch ? (
            <button type="button" onMouseDown={() => handleSelect(exactMatch.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", width: "100%", textAlign: "left", background: "#F8FAF9", border: "none", cursor: "pointer", font: "inherit" }}>
              <ProductImg brand={exactMatch.brand} item={exactMatch} size={36} expandable={false} />
              <div><div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{exactMatch.brand} {exactMatch.name}</div><div style={{ fontSize: 11, color: "#9CA3AF" }}>Appuyez pour comparer</div></div>
            </button>
          ) : qNorm.length > 1 ? (
            <div style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>Aucun produit trouvé</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── NAVBAR ───
const GREEN_FOREST = "#1B4332";
function Navbar({ onNav, onSearch, user, onAuth, onMenu, isHome }) {
  const bg = isHome ? "#fff" : GREEN_FOREST;
  const textColor = isHome ? "#111" : "#fff";
  const logoAccent = isHome ? GREEN : "#52B788";
  const hamburgerColor = isHome ? "#374151" : "#fff";
  const linkColor = isHome ? "#4B5563" : "rgba(255,255,255,.9)";
  const linkHoverBg = isHome ? "#F3F4F6" : "rgba(255,255,255,.12)";
  const authBg = isHome ? "#F3F4F6" : "rgba(255,255,255,.15)";
  const authBorder = isHome ? "#E5E7EB" : "rgba(255,255,255,.2)";
  return <header><nav aria-label="Navigation principale" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: bg, padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: F, boxShadow: isHome ? "0 1px 3px rgba(0,0,0,.06)" : "none" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <button onClick={onMenu} aria-label="Ouvrir le menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 3, minWidth: 44, minHeight: 44, justifyContent: "center", alignItems: "center" }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 17, height: 2, background: hamburgerColor, borderRadius: 1 }} />)}
      </button>
      <button type="button" onClick={() => onNav("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", padding: 0, font: "inherit" }} aria-label="Compare. - Retour à l'accueil">
        <Image src="/logo.webp" alt="" width={40} height={40} style={{ width: 40, height: 40, objectFit: "contain", borderRadius: "50%" }} />
        <span className="hide-mobile" style={{ fontSize: 20, fontWeight: 800, color: textColor, letterSpacing: "-.03em" }}>Compare<span style={{ color: logoAccent }}>.</span></span>
      </button>
    </div>
    {onSearch && <NavbarSearch onSearch={onSearch} isHome={isHome} />}
    <div className="nav-links" style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
      {[{ l: "Comment ça marche", p: "guide" }, { l: "Guide", p: "repair-guide" }, { l: "Avantages", p: "avantages" }, { l: "À propos", p: "about" }, { l: "Contact", p: "contact" }, { l: "FAQ", p: "faq" }].map(x =>
        <button key={x.l} onClick={() => onNav(x.p)} style={{ background: "transparent", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, color: linkColor, fontFamily: F, padding: "8px 14px", transition: "color .2s, background .2s" }}
          onMouseEnter={e => { e.target.style.color = isHome ? "#111" : "#fff"; e.target.style.background = linkHoverBg; }} onMouseLeave={e => { e.target.style.color = linkColor; e.target.style.background = "transparent"; }}>{x.l}</button>
      )}
    </div>
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
      <button onClick={onAuth} aria-label={user ? `Connecté en tant que ${user.name}` : "Se connecter"} style={{ background: authBg, color: textColor, border: `1px solid ${authBorder}`, borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F }}>{user ? user.name : "Connexion"}</button>
    </div>
  </nav></header>;
}

// ─── BANNER CAROUSEL (bandeau défilant, flèches intégrées, auto 5s) ───
function BannerCarousel({ banners, onNav }) {
  const [idx, setIdx] = useState(0);
  const b = banners[idx] || banners[0];
  const prev = useCallback((e) => { e?.stopPropagation(); setIdx(i => (i - 1 + banners.length) % banners.length); }, [banners.length]);
  const next = useCallback((e) => { e?.stopPropagation(); setIdx(i => (i + 1) % banners.length); }, [banners.length]);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);
  const arrowBtn = (dir) => {
    const isPrev = dir === "prev";
    return <button onClick={isPrev ? prev : next} aria-label={isPrev ? "Précédent" : "Suivant"} style={{
      position: "absolute", top: "50%", [isPrev ? "left" : "right"]: 12, transform: "translateY(-50%)",
      width: 48, height: 48, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.9)", boxShadow: "0 2px 12px rgba(0,0,0,.12)",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, transition: "all .2s",
    }} onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.9)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round">
        {isPrev ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>;
  };
  return <section aria-label="Bannières catégories" style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 24px", position: "relative" }}>
    <div
      key={idx}
      role="button"
      tabIndex={0}
      onClick={() => onNav("cat", b.catId)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNav("cat", b.catId); } }}
      aria-label={`Voir les produits ${b.title}`}
      className="banner-carousel-card"
      style={{
        animation: "slideFadeIn 0.5s ease-out",
        background: b.image ? undefined : b.bg,
        borderRadius: 16, padding: b.image ? 0 : "36px 56px", cursor: "pointer", minHeight: b.image ? 320 : 200, display: "flex", alignItems: "center", gap: 28, position: "relative", overflow: "hidden", border: "1px solid rgba(0,0,0,.06)", boxShadow: "0 4px 24px rgba(0,0,0,.08)", transition: "transform .25s ease, box-shadow .25s ease", width: "100%", textAlign: "left", font: "inherit",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,.08)"; }}
    >
      {b.image && (
        <Image src={b.image} alt="" fill priority={idx === 0} loading={idx === 0 ? "eager" : "lazy"} sizes="(max-width: 640px) 100vw, 860px" style={{ objectFit: "cover", zIndex: 0 }} />
      )}
      {b.image && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,.2) 50%, transparent 100%)", pointerEvents: "none", zIndex: 1 }} aria-hidden />}
      <div style={{ display: "flex", alignItems: "center", gap: 28, position: "relative", zIndex: 2, padding: b.image ? "36px 56px" : 0, flex: 1, minWidth: 0 }}>
        {!b.image && <div style={{ width: 100, height: 100, borderRadius: 24, background: (b.dark ? "#fff" : ACCENT) + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={b.icon} s={48} color={b.dark ? "#fff" : ACCENT} style={{ opacity: b.dark ? .95 : .85 }} />
        </div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: b.image ? "#fff" : (b.dark ? "#fff" : "#111"), lineHeight: 1.3, marginBottom: 8, textShadow: b.image ? "0 1px 4px rgba(0,0,0,.5)" : "none" }}>{b.title}</h3>
          <p style={{ fontSize: 15, color: b.image ? "rgba(255,255,255,.9)" : (b.dark ? "#B7E4C7" : "#6B7280"), lineHeight: 1.5, textShadow: b.image ? "0 1px 2px rgba(0,0,0,.4)" : "none" }}>{b.sub}</p>
          <span style={{ display: "inline-block", marginTop: 12, fontSize: 14, fontWeight: 700, color: b.image ? "#52B788" : (b.dark ? "#52B788" : GREEN) }}>Voir les produits →</span>
        </div>
      </div>
    </div>
    {arrowBtn("prev")}
    {arrowBtn("next")}
  </section>;
}

// ─── HERO ───
// Images produit : iPhone 16 Pro, PlayStation 5, lave-linge (Unsplash)
const HERO_BANNERS = (W, ACCENT, GREEN) => [
  { bg: `linear-gradient(135deg, ${W} 30%, #E8F5E9)`, image: "https://images.unsplash.com/photo-1727093493864-0bcbd16c7e6d?w=1200&q=75&auto=format&fit=crop&ixlib=rb-4.1.0", title: "Réparer ou remplacer ? La réponse en 30 secondes", sub: "Comparez réparation, reconditionné et neuf pour smartphones, électroménager, consoles…", catId: "smartphones", icon: "smartphone", dark: false },
  { bg: `linear-gradient(135deg, ${ACCENT} 30%, ${GREEN})`, image: "https://images.unsplash.com/photo-1752262526779-bd65a9b83c25?w=1200&q=75&auto=format&fit=crop&ixlib=rb-4.1.0", title: "Console en panne ? Ne la jetez pas tout de suite", sub: "Ventilateur, lecteur disque, alimentation : beaucoup de pannes se réparent. Comparez avant de racheter.", catId: "consoles", icon: "gamepad", dark: true },
  { bg: `linear-gradient(135deg, ${W} 30%, #FDE8CD)`, image: "https://images.unsplash.com/photo-1628843226223-989e20810393?w=1200&q=75&auto=format&fit=crop&ixlib=rb-4.1.0", title: "Lave-linge, four, plaque : réparer ou changer ?", sub: "Fuite, ne chauffe plus, fait du bruit : symptômes, coûts indicatifs et verdict selon votre panne.", catId: "electromenager", icon: "kitchen", dark: false },
];
function Hero({ onSearch, onNav, popularSearches = POPULAR_SEARCHES }) {
  const [q, setQ] = useState(""); const [show, setShow] = useState(false); const [noMatchMsg, setNoMatchMsg] = useState(false);
  const qNorm = (q || "").trim().toLowerCase();
  const sug = useMemo(() => qNorm.length > 1 ? ITEMS.filter(i => !PAGES_GENERALES.includes(i.category) && `${i.brand} ${i.name} ${i.productType}`.toLowerCase().includes(qNorm)).slice(0, 6) : [], [qNorm]);
  const exactMatch = useMemo(() => qNorm.length > 0 ? ITEMS.find(i => !PAGES_GENERALES.includes(i.category) && `${i.brand} ${i.name}`.toLowerCase() === qNorm) : null, [qNorm]);
  const banners = useMemo(() => HERO_BANNERS(W, ACCENT, GREEN), []);
  return <><div style={{ background: `linear-gradient(180deg, ${W} 0%, #F0EDE6 50%, #E8E6E0 100%)`, paddingBottom: 0 }}>
    <section style={{ padding: "40px 20px 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 520 }}>
        <div style={{ marginBottom: 14 }}><Logo s={56} priority /></div>
        <h1 className="hero-title" style={{ fontSize: 38, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-.03em", fontFamily: F, textAlign: "center" }}>Réparer ou racheter<span style={{ color: ACCENT }}> ?</span></h1>
        <p style={{ fontSize: 14, color: "#4B5563", margin: "0 0 28px", maxWidth: 380, fontWeight: 500, lineHeight: 1.5, textAlign: "center" }}>Comparez les coûts. Choisissez malin.</p>
      </div>
      <div style={{ position: "relative", maxWidth: 460, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", background: "#fff", borderRadius: 14, padding: "4px 4px 4px 18px", boxShadow: "0 2px 20px rgba(27,67,50,.12), 0 0 0 1px rgba(27,67,50,.06)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 12, opacity: .6 }} aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <label htmlFor="hero-search" className="sr-only">Rechercher un produit tech (ex: iPhone 15, MacBook, PS5)</label>
          <input id="hero-search" value={q} onChange={e => { setQ(e.target.value); setShow(true); setNoMatchMsg(false); }} onFocus={() => setShow(true)} onBlur={() => setTimeout(() => setShow(false), 200)}
            placeholder="iPhone 15, MacBook Air, PS5..." aria-label="Rechercher un produit" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: F, fontSize: 15, color: "#111", padding: "14px 12px" }} />
          <button onClick={() => {
            setNoMatchMsg(false);
            if (exactMatch) { onSearch(exactMatch.id); setQ(""); }
            else if (sug.length === 0) setNoMatchMsg(true);
            else setNoMatchMsg(true);
          }} className="btn-cta" style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Comparer</button>
        </div>
        {noMatchMsg && !exactMatch && <div className="page-enter" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, padding: "14px 18px", background: "#FEF2F2", borderRadius: 12, border: "1px solid #FECACA", fontSize: 13, color: "#991B1B", zIndex: 50, boxShadow: "0 4px 16px rgba(153,27,27,.08)" }}>
          {sug.length === 0 ? "Aucun produit trouvé. Vérifiez l'orthographe ou parcourez les catégories." : "Sélectionnez un produit dans la liste ci-dessous pour un résultat précis."}
        </div>}
        {show && sug.length > 0 && <ul className="page-enter" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(27,67,50,.12)", overflow: "hidden", zIndex: 50, border: "1px solid rgba(0,0,0,.06)", margin: 0, padding: 0, listStyle: "none" }}>
          {sug.map(item => <li key={item.id}><button type="button" onMouseDown={() => { setQ(""); setNoMatchMsg(false); onSearch(item.id); }} className="link-hover" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", transition: "background .2s", width: "100%", textAlign: "left", background: "none", borderLeft: "none", borderRight: "none", borderTop: "none", font: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.background = "#F8FAF9"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            <ProductImg brand={item.brand} item={item} size={44} />
            <div style={{ textAlign: "left" }}><div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{item.brand} {item.name}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{item.productType} · <ProductPriceNeuf item={item} /></div></div>
          </button></li>)}
        </ul>}
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
        {popularSearches.map((entry, idx) => {
          if (entry.type === "general") {
            return <button key={idx} type="button" onClick={() => onNav("cat-type", { catId: entry.catId, productType: entry.productType })} className="pill-hover" style={{ background: "rgba(255,255,255,.9)", border: "1px solid rgba(45,106,79,.25)", borderRadius: 20, padding: "8px 16px", fontSize: 12, color: "#2D6A4F", cursor: "pointer", fontFamily: F, fontWeight: 500, backdropFilter: "blur(4px)", minHeight: 40 }}>{entry.label}</button>;
          }
          const it = findProductByPopular({ brand: entry.brand, name: entry.name });
          return it ? <button key={it.id} type="button" onClick={() => onSearch(it.id)} className="pill-hover" style={{ background: "rgba(255,255,255,.9)", border: "1px solid rgba(45,106,79,.25)", borderRadius: 20, padding: "8px 16px", fontSize: 12, color: "#2D6A4F", cursor: "pointer", fontFamily: F, fontWeight: 500, backdropFilter: "blur(4px)", minHeight: 40 }}>{entry.label}</button> : null;
        })}
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }} className="stat-grid">
        {[
          { icon: "money", txt: "Jusqu'à 80% d'économies" },
          { icon: "leaf", txt: "Geste pour la planète" },
          { icon: "clock", txt: "Décision en 30 s" },
        ].map((v, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "#374151", fontSize: 13, fontWeight: 600 }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: ACCENT + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={v.icon} s={14} color={ACCENT} />
          </span>
          {v.txt}
        </div>)}
      </div>
      <p style={{ fontSize: 12, color: "#6B7280", marginTop: 16, marginBottom: 0 }}>{ITEMS.length} produits · {CATS.length} catégories</p>
    </section>
    <BannerCarousel banners={banners} onNav={onNav} />
  </div>
  </>;
}

// ─── TYPE PRODUCT GENERAL PAGE (pages générales : réparer ou racheter par type) ───
function TypeProductGeneralPage({ catId, productType, onNav }) {
  const cat = CATS.find(c => c.id === catId);
  const items = ITEMS.filter(i => i.category === catId && i.productType === productType);
  const spec = WHEN_REPAIR_SPEC[productType];
  const tpl = ISS_TPL[productType] || ISS_TPL.default;
  const sampleItem = items[0];
  const refIssues = sampleItem ? getIssues(sampleItem) : [];
  const avgPrice = items.length ? Math.round(items.reduce((s, i) => s + i.priceNew, 0) / items.length) : 0;
  const fallbackIssues = refIssues.length ? refIssues : tpl.slice(0, 8).map((t, i) => ({
    id: 1000 + i, name: t.n, repairMin: avgPrice ? Math.max(5, Math.round(avgPrice * t.rn)) : 50, repairMax: avgPrice ? Math.max(10, Math.round(avgPrice * t.rx)) : 150, diff: t.d, time: t.t, partPrice: avgPrice ? Math.round(avgPrice * t.rn * (t.pr || .3)) : 30, ytQuery: `${t.yt || "réparation"} ${productType}`,
  }));

  const [selPannes, setSelPannes] = useState([]);
  const [cumul, setCumul] = useState(false);
  const [place, setPlace] = useState("");
  const [partsOffers, setPartsOffers] = useState(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (fallbackIssues.length > 0) {
      const first = fallbackIssues[0];
      setSelPannes(p => p.length === 0 ? [first.id ?? first.name] : p);
    }
  }, [catId, productType]);
  useEffect(() => {
    if (!sampleItem) return;
    let cancelled = false;
    getOffersForParts(getProductSlug(sampleItem)).then(({ data }) => {
      if (!cancelled) setPartsOffers(data ?? []);
    });
    return () => { cancelled = true; };
  }, [catId, productType, sampleItem?.id]);
  const togglePanne = (iss) => {
    const id = iss.id ?? iss.name;
    if (cumul) {
      setSelPannes(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    } else {
      setSelPannes(p => (p.includes(id) && p.length === 1) ? [] : [id]);
    }
  };

  const activeIssues = fallbackIssues.filter(iss => selPannes.includes(iss.id ?? iss.name));
  const partsPriceByIssue = useMemo(() => {
    const offers = Array.isArray(partsOffers) ? partsOffers : [];
    const map = {};
    for (const o of offers) {
      const slug = (o.issue_type ?? "").toLowerCase().replace(/_/g, "-");
      if (!slug) continue;
      const p = o.price_amount != null ? Math.round(Number(o.price_amount)) : null;
      if (p != null && (map[slug] == null || p < map[slug])) map[slug] = p;
    }
    return map;
  }, [partsOffers]);
  const enrichedActiveIssues = useMemo(() => {
    return activeIssues.map((i) => {
      const slug = slugify(i.name);
      const supabasePartPrice = partsPriceByIssue[slug] ?? partsPriceByIssue[slug.replace(/-/g, "_")];
      if (supabasePartPrice == null) return i;
      const delta = supabasePartPrice - (i.partPrice || 0);
      return {
        ...i,
        partPrice: supabasePartPrice,
        repairMin: Math.max(5, Math.round((i.repairMin || 0) + delta)),
        repairMax: Math.max(10, Math.round((i.repairMax || 0) + delta)),
      };
    });
  }, [activeIssues, partsPriceByIssue]);
  const refItem = sampleItem || items[0] || { id: 0, category: catId, productType, priceNew: avgPrice || 250, year: new Date().getFullYear() - 3, brand: "Référence", name: "Moyenne" };
  const { priceForCalc: minNeufRef, hasOffer: hasNeufRefOffer, displayText: neufRefDisplayText } = useMinPriceNeuf(sampleItem || items[0]);
  const neufRefPrice = minNeufRef ?? refItem?.priceNew ?? avgPrice;
  const repairEst = refItem && enrichedActiveIssues.length ? getRepairEstimate(enrichedActiveIssues, refItem) : null;
  const tMin = repairEst?.min ?? enrichedActiveIssues.reduce((s, i) => s + (i.repairMin || 0), 0);
  const tMax = repairEst?.max ?? enrichedActiveIssues.reduce((s, i) => s + (i.repairMax || 0), 0);
  const tPart = enrichedActiveIssues.reduce((s, i) => s + (i.partPrice || 0), 0);
  const recon = refItem ? Math.round(refItem.priceNew * (OCC_CATS.includes(catId) ? .55 : .62)) : 0;
  const v = refItem && enrichedActiveIssues.length ? getVerdict(enrichedActiveIssues, refItem) : null;
  const timeInfo = activeIssues.length ? getCumulTimeInfo(activeIssues) : { diyLabel: "—", diyFeasible: false };
  const sl = shLabel(catId);
  const retPcs = getRet(catId, "pcs");
  const retOcc = getRet(catId, "occ");
  const retNeuf = getRet(catId, "neuf");

  if (!cat || !productType) return null;

  const typeLower = productType.toLowerCase();
  const reparerBase = spec?.reparer || `Pour un ${typeLower}, les pannes courantes (pièces d'usure, joints, cartes électroniques) sont souvent réparables.`;
  const remplacerBase = spec?.remplacer || `Remplacer si la réparation dépasse 40 % du prix neuf, si l'appareil a plus de 10 ans, ou si les pièces sont introuvables.`;
  const panneNames = activeIssues.map(i => i.name).join(", ");
  const reparerPersonalized = activeIssues.length
    ? `${reparerBase} Pour la panne « ${panneNames} » : réparer soi-même dès ${Math.round(tPart)} € (pièces), ou chez un pro dès ${Math.round(tMin)} € (pièce + main d'œuvre). Un appareil récent (< 5 ans) mérite souvent la réparation.`
    : `${reparerBase} Prenez en compte l'âge de l'appareil, la garantie restante et la disponibilité des pièces.`;
  const remplacerPersonalized = activeIssues.length
    ? `${remplacerBase} Pour « ${panneNames} », si le coût dépasse ${Math.round((neufRefPrice || avgPrice) * .4)} € ou si l'appareil a plus de 10 ans, le remplacement est souvent plus logique.`
    : `${remplacerBase} Tenez compte de l'âge : au-delà de 10–12 ans, le remplacement est souvent plus logique.`;

  return (
    <div className="page-enter" style={{ fontFamily: F, minHeight: "100vh" }}>
      {/* Hero vert forêt — même style que pages catégorie */}
      <div style={{ background: "linear-gradient(135deg, #1B4332 0%, #0d2818 50%, #1B4332 100%)", padding: "24px 20px 32px" }}>
        <nav aria-label="Fil d'Ariane" style={{ maxWidth: 960, margin: "0 auto", fontSize: 13, color: "rgba(255,255,255,.9)", display: "flex", gap: 6, alignItems: "center", marginBottom: 16 }}>
          <button type="button" onClick={() => onNav("home")} style={{ cursor: "pointer", color: "#fff", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>Accueil</button>
          <Chev />
          <button type="button" onClick={() => onNav("cat", catId)} style={{ cursor: "pointer", color: "#fff", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>{cat.name}</button>
          <Chev />
          <span>{productType}</span>
        </nav>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={cat?.icon || "washer"} s={28} color="#fff" />
          </span>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-.03em" }}>Réparer un {typeLower} ou le remplacer ?</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)" }}>Sélectionnez votre panne pour une recommandation personnalisée.</p>
          </div>
        </div>
      </div>
      <div style={{ background: "#F8F6F0", padding: "24px 20px 80px", minHeight: "50vh" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* 1. Sélection des pannes */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #E5E3DE", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT }} /> Quel est le problème ?
            </label>
            <button onClick={() => { setCumul(!cumul); if (!cumul && selPannes.length > 1) setSelPannes(selPannes.slice(0, 1)); }} style={{ fontSize: 11, fontWeight: 600, color: cumul ? ACCENT : "#64748B", background: cumul ? ACCENT + "12" : "#fff", border: cumul ? `1.5px solid ${ACCENT}50` : "1px solid #CBD5E1", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: F }}>
              {cumul ? "Mode cumul actif" : "Plusieurs problèmes ?"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {fallbackIssues.map((iss, i) => {
              const id = iss.id ?? iss.name;
              const active = selPannes.includes(id);
              return (
                <Pill key={i} active={active} onClick={() => togglePanne(iss)}>
                  {iss.name}
                </Pill>
              );
            })}
          </div>
          {cumul && selPannes.length > 1 && <p style={{ fontSize: 12, color: ACCENT, fontWeight: 600, marginTop: 10 }}>{selPannes.length} pannes sélectionnées — coûts cumulés</p>}
        </div>

        {/* 2. Verdict (réparer / remplacer) — affiché après sélection */}
        {v && activeIssues.length > 0 && (
          <div style={{ background: `linear-gradient(135deg, #fff 0%, ${v.color}08 100%)`, border: `3px solid ${v.color}`, borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: `0 8px 32px ${v.color}25` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: v.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={v.icon} s={28} color={v.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: v.color, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Notre recommandation</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>{v.label}</h2>
                <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 8, background: v.color + "18", color: v.color, fontSize: 13, fontWeight: 800 }}>{v.pertinence}</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0 }}>{v.why}</p>
          </div>
        )}

        {/* 3. Quand réparer / Quand remplacer — affiché directement */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="grid-2">
          <div style={{ background: "#ECFDF5", border: "1.5px solid #2D6A4F", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Icon name="tool" s={20} color="#2D6A4F" />
              <span style={{ fontSize: 14, fontWeight: 800, color: "#2D6A4F" }}>Quand réparer</span>
            </div>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{reparerPersonalized}</p>
          </div>
          <div style={{ background: "#FEF3E2", border: "1.5px solid #F59E0B", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Icon name="swap" s={20} color="#F59E0B" />
              <span style={{ fontSize: 14, fontWeight: 800, color: "#B45309" }}>Quand remplacer</span>
            </div>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{remplacerPersonalized}</p>
          </div>
        </div>

        {/* 4. Tableau comparatif — simplifié, mobile-first */}
        <details style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E3DE", marginBottom: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <summary style={{ padding: "16px 20px", cursor: "pointer", fontWeight: 700, fontSize: 15, color: "#111", listStyle: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="chart" s={18} color={ACCENT} /> Comparer les 3 options
          </summary>
          <div style={{ padding: "0 20px 20px" }}>
          {(() => {
            const neuf = neufRefPrice || avgPrice;
            const econRep = activeIssues.length ? neuf - tMax : null;
            const econRecon = neuf - recon;
            const econRepLabel = econRep !== null ? (econRep > 0 ? `Économisez jusqu'à ${Math.round(econRep)} €` : econRep < 0 ? `Surcoût ${Math.round(Math.abs(econRep))} €` : "—") : "—";
            const econReconLabel = econRecon > 0 ? `Économisez ${Math.round(econRecon)} €` : "—";
            const diffLabel = activeIssues.length ? (activeIssues.some(i => i.diff === "difficile") ? "●●● Difficile" : activeIssues.some(i => i.diff === "moyen") ? "●● Moyen" : "● Facile") : "—";
            const priceRep = activeIssues.length ? `${Math.round(tPart)}–${Math.round(tMax)} €` : "Variable";
            const priceNeuf = neuf ? (hasNeufRefOffer ? neufRefDisplayText : `${Math.round(neuf)} €`) : "Variable";
            const bestChoiceBanner = v?.v === "reparer" && econRep > 0
              ? { label: "Réparer", econ: `Économisez jusqu'à ${Math.round(econRep)} €`, color: GREEN }
              : v?.v === "remplacer" && econRecon > 0
              ? { label: sl, econ: `Économisez ${Math.round(econRecon)} €`, color: AMBER }
              : null;
            if (isMobile) {
              return <>
                {neuf && <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 12 }}>Référence : {hasNeufRefOffer ? neufRefDisplayText : `${Math.round(neuf)} €`} neuf</div>}
                {bestChoiceBanner && (
                  <div style={{ background: bestChoiceBanner.color + "12", border: `1px solid ${bestChoiceBanner.color}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, color: bestChoiceBanner.color }}>✓</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Meilleur rapport : {bestChoiceBanner.label}</span>
                    <span style={{ fontSize: 12, color: bestChoiceBanner.color, fontWeight: 600 }}>{bestChoiceBanner.econ}</span>
                  </div>
                )}
                {v?.v === "reparer" && isQualiReparEligible(catId) && (
                  <div style={{ marginBottom: 12, padding: "10px 14px", background: AMBER + "08", borderRadius: 8, border: "1px solid " + AMBER + "30", fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                    <strong style={{ color: "#B45309" }}>Bonus QualiRépar</strong> — Chez un réparateur labellisé, vous économisez {getQualiReparBonus(productType) ?? "15 à 60"} € (aide de l'État déduite sur la facture).
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Réparer soi-même — pièces seules */}
                  <div style={{ background: v?.v === "reparer" ? GREEN + "08" : "#F8FAFC", borderRadius: 12, padding: 14, border: v?.v === "reparer" ? `2px solid ${GREEN}` : "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: GREEN + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="tool" s={16} color={GREEN} /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Réparer soi-même</span>
                      {v?.v === "reparer" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: GREEN, color: "#fff" }}>Recommandé</span>}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 2 }}>{activeIssues.length ? `dès ${Math.round(tPart)} €` : "Variable"}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Pièces seules · tutoriel vidéo</div>
                    {activeIssues.length > 0 && <div style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>{econRepLabel}</div>}
                    {activeIssues.length > 0 && <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Temps : {timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis"}</div>}
                  </div>
                  {/* Réparateur professionnel — pièce + main d'œuvre */}
                  <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 14, border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: "#6366F112", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="pin" s={16} color="#6366F1" /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Réparateur pro</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 2 }}>{activeIssues.length ? `dès ${Math.round(tMin)} €` : "Variable"}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Pièce + main d&apos;œuvre · devis recommandé</div>
                    {activeIssues.length > 0 && tMin !== tMax && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Fourchette : {Math.round(tMin)}–{Math.round(tMax)} €</div>}
                  </div>
                  <div style={{ background: v?.v === "remplacer" ? AMBER + "08" : "#F8FAFC", borderRadius: 12, padding: 14, border: v?.v === "remplacer" ? `2px solid ${AMBER}` : "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: AMBER + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="recycle" s={16} color={AMBER} /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{sl}</span>
                      {v?.v === "remplacer" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: AMBER, color: "#fff" }}>Recommandé</span>}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 4 }}>~{recon} €</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{sl.toLowerCase()} garanti</div>
                    <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginTop: 2 }}>{econReconLabel}</div>
                  </div>
                  <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 14, border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: "#DC262612", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="cart" s={16} color="#DC2626" /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Neuf</span>
                      <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>référence</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 4 }}>{priceNeuf}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>Prix de base</div>
                  </div>
                </div>
              </>;
            }
            const tableRows = [
              { l: "Prix", diy: activeIssues.length ? `dès ${Math.round(tPart)} €` : "—", pro: activeIssues.length ? `dès ${Math.round(tMin)} €` : "—", o: `~${recon} €`, n: priceNeuf, bold: true },
              { l: "Détail", diy: activeIssues.length ? "Pièces seules · tutoriel" : "—", pro: activeIssues.length ? (tMin !== tMax ? `Pièce + main d'œuvre (${Math.round(tMin)}–${Math.round(tMax)} €)` : "Pièce + main d'œuvre") : "—", o: `${sl.toLowerCase()} garanti`, n: "Référence" },
              { l: "Économie vs neuf", diy: econRepLabel, pro: "—", o: econReconLabel, n: "—", hDiy: econRep > 0 ? GREEN : null, hO: econRecon > 0 ? AMBER : null },
              { l: "Temps / Difficulté", diy: activeIssues.length ? (timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis") : "—", pro: "—", o: "—", n: "—", hDiy: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : null },
            ];
            return <>
              {neuf && <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>Référence : {hasNeufRefOffer ? neufRefDisplayText : `${Math.round(neuf)} €`} neuf</div>}
              {bestChoiceBanner && (
                <div style={{ background: bestChoiceBanner.color + "12", border: `1px solid ${bestChoiceBanner.color}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: bestChoiceBanner.color }}>✓</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Meilleur rapport : {bestChoiceBanner.label}</span>
                  <span style={{ fontSize: 12, color: bestChoiceBanner.color, fontWeight: 600 }}>{bestChoiceBanner.econ}</span>
                </div>
              )}
              {v?.v === "reparer" && isQualiReparEligible(catId) && (
                <div style={{ marginBottom: 10, padding: "10px 14px", background: AMBER + "08", borderRadius: 8, border: "1px solid " + AMBER + "30", fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                  <strong style={{ color: "#B45309" }}>Bonus QualiRépar</strong> — Chez un réparateur labellisé, vous économisez {getQualiReparBonus(productType) ?? "15 à 60"} € (aide de l'État déduite sur la facture).
                </div>
              )}
              <div className="table-compare-scroll" style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DDD5", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr style={{ background: W }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#9CA3AF", fontSize: 11, width: "22%" }}></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: GREEN, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="tool" s={14} color={GREEN} /> Soi-même</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#6366F1", fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="pin" s={14} color="#6366F1" /> Pro</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: AMBER, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="recycle" s={14} color={AMBER} /> {sl}</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#DC2626", fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="cart" s={14} color="#DC2626" /> Neuf</span></th>
                  </tr></thead>
                  <tbody>
                    {tableRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "9px 14px", fontWeight: 600, color: "#374151", fontSize: 12 }}>{row.l}</td>
                        <td style={{ padding: "9px 14px", textAlign: "center", color: row.hDiy || "#6B7280", fontWeight: row.bold || row.hDiy ? 700 : 400, background: v?.v === "reparer" ? GREEN + "06" : "transparent" }}>{row.diy}</td>
                        <td style={{ padding: "9px 14px", textAlign: "center", color: "#6B7280", fontWeight: row.bold ? 700 : 400, background: v?.v === "reparer" ? "#6366F106" : "transparent" }}>{row.pro}</td>
                        <td style={{ padding: "9px 14px", textAlign: "center", color: row.hO || "#6B7280", fontWeight: row.bold || row.hO ? 700 : 400, background: v?.v === "remplacer" ? AMBER + "06" : "transparent" }}>{row.o}</td>
                        <td style={{ padding: "9px 14px", textAlign: "center", color: row.hN || "#6B7280", fontWeight: row.bold || row.hN ? 700 : 400 }}>{row.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>;
          })()}
          </div>
        </details>

        {/* 5. Vos options — 3 cartes directes vers pages */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 14 }}>Vos options</h2>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>Cliquez sur une option pour voir les pièces, modèles et offres chez les prestataires.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} className="grid-3">
            {[
              { key: "reparer", color: GREEN, label: "Réparer", splitPrice: true, priceDiy: Math.round(tPart), pricePro: Math.round(tMin), sub: "Pièces seules ou réparateur", icon: "tool", top: v?.v === "reparer", action: () => onNav("repair", { catId, productType }) },
              { key: "occ", color: AMBER, label: sl, price: `~${recon} €`, sub: "garanti 12–24 mois", icon: "recycle", top: v?.v === "remplacer", action: () => onNav("models-list", { catId, productType, affType: "occ" }) },
              { key: "neuf", color: "#DC2626", label: "Neuf", price: neufRefPrice ? (hasNeufRefOffer ? `À partir de ${minNeufRef} €` : `~${Math.round(neufRefPrice)} €`) : "Variable", sub: "Amazon, Leroy Merlin, Darty…", icon: "cart", top: v?.v === "remplacer", action: () => onNav("models-list", { catId, productType, affType: "neuf" }) },
            ].map(o => (
              <div key={o.key} onClick={o.action} className="card-hover" style={{
                background: "#fff", border: o.top ? `2px solid ${o.color}` : "1px solid #E5E3DE",
                borderRadius: 12, padding: 16, cursor: "pointer", textAlign: "center",
                boxShadow: o.top ? `0 3px 14px ${o.color}18` : "0 1px 4px rgba(0,0,0,.05)",
              }}>
                {o.top && <div style={{ fontSize: 8, fontWeight: 700, color: o.color, marginBottom: 4 }}>RECOMMANDÉ</div>}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: o.color + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><Icon name={o.icon} s={22} color={o.color} /></div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{o.label}</div>
                {o.splitPrice ? (
                  <div style={{ marginTop: 8, marginBottom: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#F8FAFC", borderRadius: 8, fontSize: 11 }}>
                      <span style={{ color: "#6B7280", fontWeight: 600 }}>Soi-même</span>
                      <span style={{ fontWeight: 800, color: o.color }}>dès {o.priceDiy} €</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#F8FAFC", borderRadius: 8, fontSize: 11 }}>
                      <span style={{ color: "#6B7280", fontWeight: 600 }}>Pro</span>
                      <span style={{ fontWeight: 800, color: "#6366F1" }}>dès {o.pricePro} €</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 18, fontWeight: 800, color: o.color }}>{o.price}</div>
                )}
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{o.sub}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: o.color, marginTop: 8 }}>Voir →</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tutoriel pour réparer — repliable, sans prix prestataires (réservés à la page Réparer) */}
        {activeIssues.length > 0 && (
          <details style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E3DE", marginBottom: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
            <summary style={{ padding: "16px 20px", cursor: "pointer", fontWeight: 700, fontSize: 15, color: "#111", listStyle: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="tool" s={18} color={GREEN} /> Tutoriel pour réparer
            </summary>
            <div style={{ padding: "0 20px 20px" }}>
              {activeIssues.map((iss, i) => {
                const timeLabel = iss.time ? formatSingleTime(iss.time) : "Variable";
                const tutoSteps = getTutorialSteps(productType);
                const ytQuery = getYoutubeRepairQuery(productType, iss.name);
                const partBase = Math.round(iss.partPrice || 30);
                return (
                  <div key={i} style={{ marginBottom: i < activeIssues.length - 1 ? 24 : 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", margin: "0 0 12px" }}>{iss.name}</h3>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6B7280", marginBottom: 14, flexWrap: "wrap" }}>
                      <span><Icon name="money" s={14} color="#9CA3AF" /> Pièce : ~{partBase} €</span>
                      <span><Icon name="tool" s={14} color="#9CA3AF" /> Difficulté : {iss.diff === "facile" ? "Facile" : iss.diff === "moyen" ? "Moyen" : "Difficile"}</span>
                      <span><Icon name="clock" s={14} color="#9CA3AF" /> Durée : {timeLabel}</span>
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 14, borderLeft: `4px solid ${GREEN}` }}>
                      <p style={{ fontSize: 14, color: "#374151", margin: "0 0 10px", fontWeight: 700 }}>Étapes principales :</p>
                      <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "#374151", lineHeight: 1.8 }}>{tutoSteps.map((s, si) => <li key={si}>{s}</li>)}</ol>
                    </div>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, background: "#FF0000", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                      <Icon name="play" s={16} color="#fff" /> Tutoriel vidéo
                    </a>
                    <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 12 }}>Pour comparer les prix des pièces chez les prestataires, cliquez sur « Réparer » ci-dessus.</p>
                  </div>
                );
              })}
            </div>
          </details>
        )}

        {/* Indice réparabilité & QualiRépar — affichés uniquement si éligible */}
        {(isRepairabilityEligible(catId) || isQualiReparEligible(catId)) && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            {isRepairabilityEligible(catId) && (
              <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(45,106,79,.06)" }}>
                <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
                  <InfoCardBlock><RepairabilityLogo score={getRepairabilityIndex(productType)} /></InfoCardBlock>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Indice de réparabilité</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                      Note obligatoire sur 10 affichée sur les appareils. Plus elle est élevée, plus l'appareil est conçu pour être réparable. Consultez la fiche produit pour la note de votre modèle.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {isQualiReparEligible(catId) && (() => {
              const bonus = getQualiReparBonus(productType);
              const bonusLabel = bonus != null ? `${bonus} €` : "15–60 €";
              return (
                <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(245,158,11,.06)" }}>
                  <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
                    <InfoCardBlock><QualiReparLogo bonusLabel={bonusLabel} color={AMBER} /></InfoCardBlock>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Aide de l'État — Bonus QualiRépar</div>
                      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 10px 0" }}>
                        {bonus != null ? `Vous économisez ${bonus} €` : "Jusqu'à 60 € d'économie"} sur la réparation chez un réparateur labellisé. Réduction appliquée sur la facture, aucune démarche.
                      </p>
                      <a href={QUALUREPAR_ANNUAIRE_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: AMBER, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        Trouver un réparateur labellisé →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Google Maps */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DDD5", padding: 18, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="pin" s={18} color={ACCENT} /> Trouver un réparateur près de chez vous
          </h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="Ville ou code postal" style={{ flex: 1, minWidth: 140, padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: F }} />
            <a href={buildRepairerMapsUrlForType(productType, place) || "#"} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 18px", borderRadius: 8, background: place.trim() ? ACCENT : "#E5E7EB", color: place.trim() ? "#fff" : "#9CA3AF", fontSize: 13, fontWeight: 700, textDecoration: "none", pointerEvents: place.trim() ? "auto" : "none" }}>
              Voir sur Google Maps
            </a>
          </div>
        </div>

        {/* 8. FAQ */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 10 }}>Questions fréquentes — {productType}</h3>
        {[
          { q: `Combien coûte la réparation d'un ${typeLower} ?`, a: `Les tarifs varient selon la panne : de ${fallbackIssues.reduce((m,i) => Math.min(m,i.repairMin),999)}€ à ${fallbackIssues.reduce((m,i) => Math.max(m,i.repairMax),0)}€ (pièces + main d’œuvre). La panne « ${fallbackIssues[0]?.name} » revient en général à ${fallbackIssues[0]?.repairMin}–${fallbackIssues[0]?.repairMax}€. Demandez un devis pour confirmer.` },
            { q: `Vaut-il mieux réparer ou remplacer un ${typeLower} ?`, a: `Tout dépend de la panne et de l’âge de l’appareil. Une réparation peu coûteuse (pièce d’usure, panne courante) reste souvent le meilleur choix. Si le devis s’approche du prix d’un neuf ou si l’appareil a plus de 10 ans, le remplacement devient plus logique. Utilisez notre comparateur pour voir les trois options côte à côte.` },
            { q: `Peut-on réparer un ${typeLower} soi-même ?`, a: `Les pannes notées « Facile » sont accessibles avec un tutoriel vidéo. Pour les interventions « Difficile » ou nécessitant un pro, confiez l’appareil à un réparateur agréé — le bonus QualiRépar (15 à 60 €) s’applique automatiquement chez un labellisé.` },
            { q: `Où trouver les pièces détachées ?`, a: "Spareka, Amazon et Rue du Commerce proposent des pièces pour l’électroménager et la tech. Vérifiez la référence exacte de votre modèle avant d’acheter. Comparez les prix entre enseignes." },
          ].map((f, i) => (
            <details key={i} style={{ background: "#fff", borderRadius: 6, marginBottom: 4, border: "1px solid #E0DDD5" }}>
              <summary style={{ padding: "10px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#111" }}>{f.q}</summary>
              <p style={{ padding: "0 14px 10px", fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

// ─── MODELS LIST PAGE (Occasion / Neuf par type — pages générales) ───
function ModelsListPage({ catId, productType, affType, onNav }) {
  const cat = CATS.find(c => c.id === catId);
  const items = ITEMS.filter(i => i.category === catId && i.productType === productType);
  const [selBrand, setSelBrand] = useState(null);
  const [sort, setSort] = useState("price-asc");

  const brands = useMemo(() => {
    const m = {};
    items.forEach(i => { m[i.brand] = (m[i.brand] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }, [items]);

  const filtered = useMemo(() => {
    let f = items;
    if (selBrand) f = f.filter(i => i.brand === selBrand);
    if (sort === "price-asc") f = [...f].sort((a, b) => (affType === "neuf" ? a.priceNew - b.priceNew : Math.round(a.priceNew * .55) - Math.round(b.priceNew * .55)));
    else if (sort === "price-desc") f = [...f].sort((a, b) => (affType === "neuf" ? b.priceNew - a.priceNew : Math.round(b.priceNew * .55) - Math.round(a.priceNew * .55)));
    else if (sort === "year") f = [...f].sort((a, b) => b.year - a.year);
    return f;
  }, [items, selBrand, sort, affType]);

  const isNeuf = affType === "neuf";
  const modeColor = isNeuf ? "#DC2626" : AMBER;
  const sl = shLabel(catId);

  if (!cat || !productType) return null;

  return (
    <div className="page-enter" style={{ fontFamily: F }}>
      <nav aria-label="Fil d'Ariane" style={{ padding: "12px 20px", maxWidth: 860, margin: "0 auto", fontSize: 12, color: "#6B7280", display: "flex", gap: 5, alignItems: "center" }}>
        <button type="button" onClick={() => onNav("home")} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>Accueil</button>
        <Chev />
        <button type="button" onClick={() => onNav("cat", catId)} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>{cat.name}</button>
        <Chev />
        <button type="button" onClick={() => onNav("cat-type", { catId, productType })} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>{productType}</button>
        <Chev />
        <span>{isNeuf ? "Neuf" : sl}</span>
      </nav>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: modeColor + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={isNeuf ? "cart" : "recycle"} s={20} color={modeColor} />
              </span>
              {productType} — {isNeuf ? "Acheter neuf" : sl}
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280" }}>{filtered.length} modèle{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {brands.length > 1 && (
              <select value={selBrand || ""} onChange={e => setSelBrand(e.target.value || null)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #E0DDD5", fontSize: 13, fontFamily: F, color: "#374151", background: "#fff", cursor: "pointer" }}>
                <option value="">Toutes les marques</option>
                {brands.map(b => <option key={b.name} value={b.name}>{b.name} ({b.count})</option>)}
              </select>
            )}
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #E0DDD5", fontSize: 13, fontFamily: F, color: "#374151", background: "#fff", cursor: "pointer" }}>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="year">Plus récent</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {filtered.map(item => (
            <Card key={item.id} onClick={() => onNav("aff", { item, issues: getIssues(item).slice(0, 1), affType, alts: getAlternatives(item) })} style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ProductImg brand={item.brand} item={item} size={72} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{item.brand} {item.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{item.productType} · {item.year}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: modeColor }}>{isNeuf ? <ProductPriceNeuf item={item} /> : `~${Math.round(item.priceNew * .55)} €`}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{isNeuf ? "neuf" : sl.toLowerCase()}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>Voir les offres →</span>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: 40, color: "#6B7280", fontSize: 14 }}>Aucun modèle ne correspond à ces filtres.</p>}
      </div>
    </div>
  );
}

// ─── REPAIR PAGE (Réparer — références pièces, tutos génériques) ───
function RepairPage({ catId, productType, onNav }) {
  const cat = CATS.find(c => c.id === catId);
  const items = ITEMS.filter(i => i.category === catId && i.productType === productType);
  const tpl = ISS_TPL[productType] || ISS_TPL.default;
  const avgPrice = items.length ? Math.round(items.reduce((s, i) => s + i.priceNew, 0) / items.length) : 0;
  const fallbackIssues = tpl.slice(0, 8).map((t, i) => ({
    id: 2000 + i, name: t.n, repairMin: avgPrice ? Math.max(5, Math.round(avgPrice * t.rn)) : 50, repairMax: avgPrice ? Math.max(10, Math.round(avgPrice * t.rx)) : 150, diff: t.d, time: t.t, partPrice: avgPrice ? Math.round(avgPrice * t.rn * (t.pr || .3)) : 30,
    ytQuery: `réparation ${t.n} ${productType}`,
  }));
  const [selPannes, setSelPannes] = useState(() => fallbackIssues.length ? [fallbackIssues[0].id ?? fallbackIssues[0].name] : []);
  const [place, setPlace] = useState("");
  const [partsOffers, setPartsOffers] = useState(null);
  const typeLower = productType.toLowerCase();
  const retPcs = getRet(catId, "pcs");
  const sampleItem = items[0];

  useEffect(() => {
    if (!sampleItem) return;
    let cancelled = false;
    getOffersForParts(getProductSlug(sampleItem)).then(({ data }) => {
      if (!cancelled) setPartsOffers(data ?? []);
    });
    return () => { cancelled = true; };
  }, [catId, productType, sampleItem?.id]);

  const activeIssues = fallbackIssues.filter(iss => selPannes.includes(iss.id ?? iss.name));
  const togglePanne = (iss) => {
    const id = iss.id ?? iss.name;
    setSelPannes(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  if (!cat || !productType) return null;

  return (
    <div className="page-enter" style={{ fontFamily: F }}>
      <nav aria-label="Fil d'Ariane" style={{ padding: "12px 20px", maxWidth: 960, margin: "0 auto", fontSize: 12, color: "#6B7280", display: "flex", gap: 5, alignItems: "center" }}>
        <button type="button" onClick={() => onNav("home")} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>Accueil</button>
        <Chev />
        <button type="button" onClick={() => onNav("cat", catId)} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>{cat.name}</button>
        <Chev />
        <button type="button" onClick={() => onNav("cat-type", { catId, productType })} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>{productType}</button>
        <Chev />
        <span>Réparer</span>
      </nav>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: GREEN + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="tool" s={24} color={GREEN} /></span>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111", margin: 0 }}>Réparer un {typeLower} — pièces et tutoriels</h1>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Sélectionnez la panne pour voir les références de pièces et tutoriels vidéo.</p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #E5E3DE", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 10, display: "block" }}>Quelle panne ?</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {fallbackIssues.map((iss, i) => {
              const id = iss.id ?? iss.name;
              const active = selPannes.includes(id);
              return <Pill key={i} active={active} onClick={() => togglePanne(iss)}>{iss.name}</Pill>;
            })}
          </div>
        </div>

        {activeIssues.length > 0 && activeIssues.map((iss, i) => {
          const ytQuery = getYoutubeRepairQuery(productType, iss.name);
          const timeLabel = iss.time ? formatSingleTime(iss.time) : "Variable";
          const tutoSteps = getTutorialSteps(productType);
          const partBase = Math.round(iss.partPrice || 30);
          const partOff = [-0.05, 0, 0.08, 0.12];
          const issueSlug = slugify(iss.name);
          const offers = Array.isArray(partsOffers) ? partsOffers : [];
          const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
          const findOfferForParts = (r) => {
            if (!offers.length) return null;
            const m = (o) => (o.merchant ?? o.retailer ?? "").toLowerCase();
            return offers.find(
              (o) => m(o) && (norm(m(o)).includes(norm(r.n)) || norm(r.n).includes(norm(m(o)))) && ((o.issue_type ?? "").toLowerCase() === issueSlug || (o.issue_type ?? "").toLowerCase().replace(/_/g, "-") === issueSlug)
            );
          };
          const retsWithPrice = retPcs.map((r, idx) => ({ r, price: Math.round(partBase * (1 + (partOff[idx] ?? 0))) }));
          const merged = retsWithPrice.map(({ r, price: fallbackPrice }) => {
            const offer = findOfferForParts(r);
            const price = offer?.price_amount != null ? Math.round(Number(offer.price_amount)) : Math.round(fallbackPrice);
            const url = offer?.url?.trim() || buildRetailerUrlForParts(r, productType, iss.name);
            return { r, offer, price, url };
          });
          const sortedRets = [...merged].sort((a, b) => a.price - b.price);
          const partDisplay = sortedRets[0]?.price != null && sortedRets[0].price > 0 ? Math.round(sortedRets[0].price) : partBase;
          return (
            <div key={i} style={{ background: "#fff", border: "1px solid #E5E3DE", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: "0 0 16px" }}>{iss.name}</h2>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6B7280", marginBottom: 16, flexWrap: "wrap" }}>
                <span><Icon name="money" s={14} color="#9CA3AF" /> Pièce : {sortedRets.some(x => x.price > 0) ? `${partDisplay} €` : `~${partBase} €`}</span>
                <span><Icon name="tool" s={14} color="#9CA3AF" /> Difficulté : {iss.diff === "facile" ? "Facile" : iss.diff === "moyen" ? "Moyen" : "Difficile"}</span>
                <span><Icon name="clock" s={14} color="#9CA3AF" /> Durée : {timeLabel}</span>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 16, borderLeft: `4px solid ${GREEN}` }}>
                <p style={{ fontSize: 14, color: "#374151", margin: "0 0 10px", fontWeight: 700 }}>Étapes principales :</p>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "#374151", lineHeight: 1.8 }}>{tutoSteps.map((s, si) => <li key={si}>{s}</li>)}</ol>
              </div>
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, background: "#FF0000", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none", marginBottom: 20 }}>
                <Icon name="play" s={16} color="#fff" /> Tutoriel vidéo
              </a>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Pièces à acheter</div>
                <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 14 }}>Comparez les prix chez les prestataires.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {sortedRets.map(({ r, offer, price, url }, rank) => {
                    const isBest = rank === 0;
                    const priceStr = price > 0 ? `${Math.round(price)} €` : `~${partBase} €`;
                    const offerLabel = buildPartsOfferLabel(offer, sampleItem, iss.name);
                    const subLabel = `Sur ${r.n}`;
                    return (
                      <a key={r.n} href={url} target="_blank" rel="noopener noreferrer sponsored" className="card-hover" style={{
                        background: "#fff", border: isBest ? "2px solid #111" : "1px solid #E5E3DE", borderRadius: 12, padding: "16px 18px",
                        display: "flex", alignItems: "center", gap: 16, cursor: "pointer", boxShadow: isBest ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.05)",
                        textDecoration: "none", color: "inherit",
                      }}>
                        <RetailerLogo r={r} size={48} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{offerLabel}</span>
                            {isBest && price > 0 && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#111", color: "#fff", flexShrink: 0 }}>Meilleur prix</span>}
                            {offer && (offer.is_fallback_model === true || offer.match_status === "fallback") && (
                              <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#FEF3C7", color: "#92400E", flexShrink: 0 }}>Alternative plus récente</span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{subLabel}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 20, color: "#111" }}>{priceStr}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Voir l'offre</div>
                        </div>
                        <div style={{ padding: "10px 18px", borderRadius: 8, background: r.c || "#111", color: "#fff", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>Voir l'offre →</div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #E5E3DE", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon name="pin" s={18} color={ACCENT} /> Trouver un réparateur</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="Ville ou code postal" style={{ flex: 1, minWidth: 140, padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: F }} />
            <a href={buildRepairerMapsUrlForType(productType, place) || "#"} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 18px", borderRadius: 8, background: place.trim() ? ACCENT : "#E5E7EB", color: place.trim() ? "#fff" : "#9CA3AF", fontSize: 13, fontWeight: 700, textDecoration: "none", pointerEvents: place.trim() ? "auto" : "none" }}>Voir sur Google Maps</a>
          </div>
        </div>

        {(isRepairabilityEligible(catId) || isQualiReparEligible(catId)) && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {isRepairabilityEligible(catId) && (
              <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(45,106,79,.06)" }}>
                <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
                  <InfoCardBlock><RepairabilityLogo score={getRepairabilityIndex(productType)} /></InfoCardBlock>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Indice de réparabilité</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                      Note obligatoire sur 10 affichée sur les appareils. Plus elle est élevée, plus l'appareil est conçu pour être réparable. Consultez la fiche produit pour la note de votre modèle.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {isQualiReparEligible(catId) && (() => {
              const bonus = getQualiReparBonus(productType);
              const bonusLabel = bonus != null ? `${bonus} €` : "15–60 €";
              return (
                <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(245,158,11,.06)" }}>
                  <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
                    <InfoCardBlock><QualiReparLogo bonusLabel={bonusLabel} color={AMBER} /></InfoCardBlock>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Aide de l'État — Bonus QualiRépar</div>
                      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 10px 0" }}>
                        {bonus != null ? `Vous économisez ${bonus} €` : "Jusqu'à 60 € d'économie"} sur la réparation chez un réparateur labellisé. Réduction appliquée sur la facture, aucune démarche.
                      </p>
                      <a href={QUALUREPAR_ANNUAIRE_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: AMBER, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        Trouver un réparateur labellisé →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CATEGORY PAGE ───
function CategoryPage({ catId, onNav, initialProductType, initialBrandSlug }) {
  const cat = CATS.find(c => c.id === catId);
  const items = ITEMS.filter(i => i.category === catId);
  const types = PTYPES[catId] || [];
  const [selType, setSelType] = useState(null);
  const [selBrand, setSelBrand] = useState(null);
  const [sort, setSort] = useState("pop");
  const isBrandFirst = PAGES_PRECISES.includes(catId);

  useEffect(() => {
    setSelType(initialProductType || null);
    const brand = initialBrandSlug ? items.find(i => slugify(i.brand) === initialBrandSlug)?.brand : null;
    setSelBrand(brand || null);
    setSort("pop");
  }, [catId, initialProductType, initialBrandSlug, items]);

  const brands = useMemo(() => {
    const baseItems = selType ? items.filter(i => i.productType === selType) : items;
    const m = {};
    baseItems.forEach(i => { m[i.brand] = (m[i.brand] || 0) + 1; });
    return Object.entries(m).sort((a,b) => b[1] - a[1]).map(([b,c]) => ({ name: b, count: c }));
  }, [items, selType]);

  const filtered = useMemo(() => {
    let f = items;
    if (selType) f = f.filter(i => i.productType === selType);
    if (selBrand) f = f.filter(i => i.brand === selBrand);
    if (sort === "price-asc") f = [...f].sort((a,b) => a.priceNew - b.priceNew);
    else if (sort === "price-desc") f = [...f].sort((a,b) => b.priceNew - a.priceNew);
    else if (sort === "year") f = [...f].sort((a,b) => b.year - a.year);
    return f;
  }, [items, selType, selBrand, sort]);

  const typesFiltered = useMemo(() => selBrand ? items.filter(i => i.brand === selBrand) : items, [items, selBrand]);

  if (!cat) return null;

  const resetFilters = () => { setSelType(null); setSelBrand(null); setSort("pop"); };
  const hasFilters = selType || selBrand;

  return <div className="page-enter" style={{ fontFamily: F, minHeight: "100vh" }}>
    {/* Hero vert forêt — titre, icône, nombre de produits, fil d'Ariane intégré */}
    <div style={{ background: "linear-gradient(135deg, #1B4332 0%, #0d2818 50%, #1B4332 100%)", padding: "24px 20px 32px" }}>
      <nav aria-label="Fil d'Ariane" style={{ maxWidth: 960, margin: "0 auto", fontSize: 13, color: "rgba(255,255,255,.9)", display: "flex", gap: 6, alignItems: "center", marginBottom: 16 }}>
        <button type="button" onClick={() => onNav("home")} style={{ cursor: "pointer", color: "#fff", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>Accueil</button><Chev /><span>{cat.name}</span>
        {selBrand && <><Chev /><span>{selBrand}</span></>}
        {selType && <><Chev /><span>{selType}</span></>}
      </nav>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={cat.icon} s={28} color="#fff" />
        </span>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-.03em" }}>{cat.name}</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)" }}>{filtered.length} produit{filtered.length > 1 ? "s" : ""}{hasFilters ? " (filtré)" : ""}</p>
        </div>
      </div>
    </div>

    {/* Zone de contenu — fond crème */}
    <div style={{ background: "#F8F6F0", padding: "24px 20px 80px", minHeight: "50vh" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Filter bar — uniquement pour pages précises (tech) ; sans labels MARQUE/Type ; barre plus large, coins 20px, ombre renforcée */}
      {isBrandFirst && (
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E0DDD5", padding: "20px 24px", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
        {types.length > 1 && <div style={{ marginBottom: brands.length > 1 ? 14 : 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Pill active={!selType} onClick={() => onNav("cat", catId)}>Tous</Pill>
            {types.map(t => { const c = typesFiltered.filter(i => i.productType === t).length; return c > 0 && <Pill key={t} active={selType === t} onClick={() => onNav("cat-type", { catId, productType: t })}>{t} ({c})</Pill>; })}
          </div>
        </div>}
        {brands.length > 1 && <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Pill active={!selBrand} onClick={() => onNav(selType ? "cat-type" : "cat", selType ? { catId, productType: selType } : catId)}>Toutes</Pill>
            {brands.slice(0, 12).map(b => <Pill key={b.name} active={selBrand === b.name} onClick={() => onNav("cat-brand", { catId, productType: selType, brand: b.name })}>{b.name} ({b.count})</Pill>)}
            {brands.length > 12 && !selBrand && <span style={{ fontSize: 12, color: "#9CA3AF", alignSelf: "center" }}>+{brands.length - 12} marques</span>}
          </div>
        </div>}
        {hasFilters && <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F3F4F6" }}>
          <button onClick={() => onNav("cat", catId)} style={{ fontSize: 13, color: ACCENT, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: F, padding: 0 }}>✕ Réinitialiser les filtres</button>
        </div>}
      </div>
      )}

      {/* Brand grid — cartes plus grandes, logos 72px, padding 32px, coins 20px, ombre plus marquée, hover -6px + ombre verte */}
      {isBrandFirst && !selBrand && !selType && brands.length > 3 && <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 16 }}>
          Choisir une marque
        </div>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {brands.slice(0, 8).map(b => (
            <div key={b.name} onClick={() => onNav("cat-brand", { catId, productType: null, brand: b.name })} style={{ background: "#fff", border: "2px solid #E0DDD5", borderRadius: 20, padding: 32, cursor: "pointer", textAlign: "center", transition: "all .3s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 4px 16px rgba(0,0,0,.06)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(45,106,79,.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.06)"; }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <BrandLogo brand={b.name} size={72} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{b.name}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{b.count} produit{b.count > 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      </div>}

      {/* Type grid — images 120px, même style de cartes (Électroménager) */}
      {!isBrandFirst && !selType && types.length > 1 && !selBrand && <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 16 }}>
          Choisir un type d'appareil
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {types.map(t => {
            const c = items.filter(i => i.productType === t).length;
            if (c === 0) return null;
            return <div key={t} onClick={() => onNav("cat-type", { catId, productType: t })} style={{ background: "#fff", border: "2px solid #E0DDD5", borderRadius: 20, padding: 32, cursor: "pointer", transition: "all .3s cubic-bezier(0.22,1,0.36,1)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,.06)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(45,106,79,.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.06)"; }}>
              {PAGES_GENERALES.includes(catId) && (
                <div style={{ marginBottom: 16 }}>
                  <ProductTypeImg productType={t} size={120} iconName={cat?.icon || "washer"} iconColor="#B45309" />
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{t}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{c} produit{c > 1 ? "s" : ""}</div>
            </div>;
          })}
        </div>
      </div>}

      {/* Products list — design épuré pour catégories précises, classique pour générales */}
      {(hasFilters || items.length <= 15 || (isBrandFirst && brands.length <= 3) || (!isBrandFirst && types.length <= 1)) && <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 24, letterSpacing: "-.02em" }}>
          {selBrand && selType ? `${selBrand} — ${selType}` : selBrand ? `Produits ${selBrand}` : selType ? selType : "Tous les produits"}
        </div>
        {isBrandFirst && hasFilters ? (
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {filtered.map(item => (
              <button key={item.id} type="button" onClick={() => onNav("compare", item.id)} style={{ background: "#fff", border: "2px solid #E0DDD5", borderRadius: 20, padding: 0, cursor: "pointer", textAlign: "center", font: "inherit", overflow: "hidden", transition: "all .3s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 4px 16px rgba(0,0,0,.04)", display: "flex", flexDirection: "column", alignItems: "stretch" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(45,106,79,.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.04)"; }}>
                <div style={{ padding: "24px 20px 16px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 140, background: "#FAFAF9" }}>
                  <ProductImg brand={item.brand} item={item} size={100} />
                </div>
                <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a", lineHeight: 1.3, letterSpacing: "-.02em" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}><ProductPriceNeuf item={item} /></div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GREEN, marginTop: 8 }}>Comparer →</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {filtered.map(item => (
              <Card key={item.id} onClick={() => onNav("compare", item.id)} style={{ padding: 18, borderRadius: 14, border: "2px solid #E0DDD5", transition: "all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.boxShadow = "0 8px 24px rgba(45,106,79,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ProductImg brand={item.brand} item={item} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.brand} {item.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{item.productType} · {item.year}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}><ProductPriceNeuf item={item} /> neuf</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>Comparer →</span>
                </div>
              </Card>
            ))}
          </div>
        )}
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: 40, color: "#9CA3AF", fontSize: 14 }}>Aucun produit ne correspond à ces filtres.</p>}
      </div>}
    </div>
  </div>
  </div>;
}

// ─── COMPARATOR ───
function ComparatorPage({ itemId, onNav, user, onAuth, initialIssueId }) {
  const item = ITEMS.find(i => i.id === itemId);
  const issues = item ? getIssues(item) : [];
  const [selIssue, setSelIssue] = useState(initialIssueId ?? issues[0]?.id);
  const [cumul, setCumul] = useState(false);
  const [selMulti, setSelMulti] = useState([]);
  const isMobile = useIsMobile();
  const [place, setPlace] = useState("");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [minOccPrice, setMinOccPrice] = useState(null);
  const [partsOffers, setPartsOffers] = useState(null);
  const [deviceUsé, setDeviceUsé] = useState(null);
  const [isBricoleur, setIsBricoleur] = useState(null);
  const deviceUséStable = useDebouncedValue(deviceUsé, 380);
  const isBricoleurStable = useDebouncedValue(isBricoleur, 380);
  const cat = item ? CATS.find(c => c.id === item.category) : null;
  const sl = item ? shLabel(item.category) : "Reconditionné";

  useEffect(() => {
    const iss = item ? getIssues(item) : [];
    setSelIssue(initialIssueId ?? iss[0]?.id);
    setCumul(false); setSelMulti([]); setPlace(""); setReviews([]); setReviewText("");
  }, [itemId, initialIssueId]);
  useEffect(() => { setDeviceUsé(null); setIsBricoleur(null); }, [itemId]);

  // Prix neuf unifié (hook) + chargement occasion + pièces
  const { priceForCalc: minNeufPrice, hasOffer: hasNeufOffer, displayText: neufDisplayText } = useMinPriceNeuf(item);
  useEffect(() => {
    if (!item) return;
    let cancelled = false;
    Promise.all([
      getOffersForOcc(getProductSlug(item)),
      getOffersForParts(getProductSlug(item)),
    ]).then(([occRes, partsRes]) => {
      if (cancelled) return;
      const occMin = occRes.data?.[0]?.price_amount != null ? Math.round(Number(occRes.data[0].price_amount)) : null;
      setMinOccPrice(occMin);
      setPartsOffers(partsRes.data ?? []);
    });
    return () => { cancelled = true; };
  }, [item?.id]);

  if (!item) return <div style={{ padding: 80, textAlign: "center", fontFamily: F }}>Produit non trouvé</div>;

  const activeIssues = cumul ? issues.filter(i => selMulti.includes(i.id)) : [issues.find(i => i.id === selIssue)].filter(Boolean);

  // Enrichir les issues avec les prix pièces Supabase (min par type de panne)
  const partsPriceByIssue = useMemo(() => {
    const offers = Array.isArray(partsOffers) ? partsOffers : [];
    const map = {};
    for (const o of offers) {
      const slug = (o.issue_type ?? "").toLowerCase().replace(/_/g, "-");
      if (!slug) continue;
      const p = o.price_amount != null ? Math.round(Number(o.price_amount)) : null;
      if (p != null && (map[slug] == null || p < map[slug])) map[slug] = p;
    }
    return map;
  }, [partsOffers]);

  const enrichedActiveIssues = useMemo(() => {
    return activeIssues.map((i) => {
      const slug = slugify(i.name);
      const supabasePartPrice = partsPriceByIssue[slug] ?? partsPriceByIssue[slug.replace(/-/g, "_")];
      if (supabasePartPrice == null) return i;
      const delta = supabasePartPrice - (i.partPrice || 0);
      return {
        ...i,
        partPrice: supabasePartPrice,
        repairMin: Math.max(5, Math.round((i.repairMin || 0) + delta)),
        repairMax: Math.max(10, Math.round((i.repairMax || 0) + delta)),
      };
    });
  }, [activeIssues, partsPriceByIssue]);

  const repairEst = enrichedActiveIssues.length ? getRepairEstimate(enrichedActiveIssues, item) : null;
  const tMin = repairEst?.min ?? enrichedActiveIssues.reduce((s, i) => s + i.repairMin, 0);
  const tMax = repairEst?.max ?? enrichedActiveIssues.reduce((s, i) => s + i.repairMax, 0);
  const tPart = enrichedActiveIssues.reduce((s, i) => s + i.partPrice, 0);
  const reconFallback = activeIssues[0]?.reconPrice || Math.round(item.priceNew * .6);
  const recon = Math.round(minOccPrice != null ? minOccPrice : reconFallback);
  const neufDisplay = minNeufPrice != null ? minNeufPrice : Math.round(item.priceNew);
  const v = enrichedActiveIssues.length ? getVerdict(enrichedActiveIssues, item, { deviceUsé: deviceUséStable === true, isBricoleur: isBricoleurStable === true, priceNeufOverride: minNeufPrice ?? undefined, priceOccOverride: minOccPrice ?? undefined }) : null;
  const timeInfo = getCumulTimeInfo(activeIssues);
  const alts = item ? getAlternatives(item) : null;
  const bestNewer = alts?.newer?.[0] || null;
  const smartReplacement = v?.v === "remplacer" ? getSmartReplacementRecommendation(item, { priceNeufOverride: minNeufPrice ?? undefined, priceOccOverride: minOccPrice ?? undefined }) : null;

  const toggleMulti = (id) => setSelMulti(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const submitReview = () => {
    if (!reviewText.trim()) return;
    setReviews([{ user: user?.name || "Invité", text: reviewText, date: "Aujourd'hui" }, ...reviews]);
    setReviewText(""); setShowWriteReview(false);
  };

  return <div className="page-enter" style={{ fontFamily: F }}>
    <div style={{ padding: "12px 20px", maxWidth: 860, margin: "0 auto", fontSize: 12, color: "#9CA3AF", display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev />
      <span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("cat", item.category)}>{cat?.name}</span><Chev />
      <span>{item.brand} {item.name}</span>
    </div>
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 80px" }}>
      {/* En-tête produit + sélection panne — problème sous le nom */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <ProductImg brand={item.brand} item={item} size={72} />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0 }}>
              {!cumul && activeIssues.length === 1 ? `${getSeoProductName(item)} — ${activeIssues[0].name}` : `${item.brand} ${item.name}`}
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>{item.productType} · {item.year} · {neufDisplayText} neuf</p>
          </div>
        </div>
        {!cumul && activeIssues.length === 1 && v && (() => {
          const question = getSeoQuestionPhrase(activeIssues[0], item, v);
          return question ? <p style={{ fontSize: 15, fontWeight: 600, color: "#334155", marginBottom: 16, lineHeight: 1.5 }}>{question}</p> : null;
        })()}
        <div style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)", borderRadius: 12, padding: "14px 18px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT }} /> Quel est le problème ?
            </label>
            <button onClick={() => { setCumul(!cumul); setSelMulti(cumul ? [] : [selIssue]); }} style={{ fontSize: 11, fontWeight: 600, color: cumul ? ACCENT : "#64748B", background: cumul ? ACCENT + "12" : "#fff", border: cumul ? `1.5px solid ${ACCENT}50` : "1px solid #CBD5E1", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: F }}>
              {cumul ? "Mode cumul actif" : "Plusieurs problèmes ?"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {issues.map(iss => {
              const active = cumul ? selMulti.includes(iss.id) : selIssue === iss.id;
              return <Pill key={iss.id} active={active} onClick={() => cumul ? toggleMulti(iss.id) : onNav("issue", { item, issue: iss })}>{iss.name}</Pill>;
            })}
          </div>
          {cumul && selMulti.length > 1 && <p style={{ fontSize: 12, color: ACCENT, fontWeight: 600, marginTop: 10 }}>{selMulti.length} problèmes sélectionnés — coûts cumulés</p>}

          {/* Bloc diagnostic — intégré, cliquable, sélection persistante, impact visible */}
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: "2px dashed #E2E8F0", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="help" s={18} color={ACCENT} />
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>Affinez votre diagnostic</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>Cliquez sur vos réponses — elles modifient la recommandation ci-dessous</div>
                </div>
              </div>
              {(deviceUsé !== null || isBricoleur !== null) && (
                <span style={{ padding: "4px 10px", borderRadius: 6, background: GREEN + "15", color: GREEN, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  ✓ Pris en compte
                </span>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Appareil usé ou ≥ 5 ans ?</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[{ v: true, l: "Oui" }, { v: false, l: "Non" }].map(o => (
                    <button key={String(o.v)} type="button" onClick={() => setDeviceUsé(o.v)} style={{ padding: "8px 14px", borderRadius: 8, border: deviceUsé === o.v ? `2px solid ${ACCENT}` : "1.5px solid #CBD5E1", background: deviceUsé === o.v ? ACCENT + "18" : "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, color: deviceUsé === o.v ? "#B45309" : "#64748B", transition: "all .15s ease" }}>{o.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>À l'aise avec le bricolage ?</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[{ v: true, l: "Oui" }, { v: false, l: "Non" }].map(o => (
                    <button key={String(o.v)} type="button" onClick={() => setIsBricoleur(o.v)} style={{ padding: "8px 14px", borderRadius: 8, border: isBricoleur === o.v ? `2px solid ${ACCENT}` : "1.5px solid #CBD5E1", background: isBricoleur === o.v ? ACCENT + "18" : "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, color: isBricoleur === o.v ? "#B45309" : "#64748B", transition: "all .15s ease" }}>{o.l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {v && activeIssues.length > 0 && <>
        {/* Layout 2 colonnes : contenu principal | sidebar sticky (3 options + infos clés) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }} className="grid-2">
          <div style={{ minWidth: 0 }}>
        {/* VERDICT — priorité n°1, c'est la réponse ! */}
        <div style={{ background: `linear-gradient(135deg, #fff 0%, ${v.color}08 100%)`, border: `3px solid ${v.color}`, borderRadius: 16, padding: "24px 24px", marginBottom: 24, boxShadow: `0 8px 32px ${v.color}25`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: v.color + "12", borderRadius: "0 0 0 100%", opacity: .6 }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12, position: "relative" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: v.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={v.icon} s={28} color={v.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: v.color, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Avis expert — {item.productType}</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>{v.label}</h2>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 8, background: v.color + "18", color: v.color, fontSize: 13, fontWeight: 800 }}>{v.pertinence}</div>
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0, position: "relative" }}>{v.why}</p>
          {v.v === "reparer" && (
            <>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #86EFAC", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 4 }}>Deux façons de réparer</div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                  {v.repairMode === "autonome" ? (
                    <>
                      <strong>Réparation autonome</strong> — Acheter la pièce et faire soi-même (tutoriels vidéo). Économie maximale. Recommandé si vous êtes à l'aise avec le démontage.<br />
                      <strong>Réparateur professionnel</strong> — Confier à un pro (QualiRépar = aide État {getQualiReparBonus(item.productType) ?? "15–60"} € déduite). Plus sûr pour les pannes délicates.
                    </>
                  ) : (
                    <>
                      <strong>Réparateur professionnel</strong> — Confier à un pro (QualiRépar = aide État {getQualiReparBonus(item.productType) ?? "15–60"} € déduite). Recommandé pour plus de sécurité.<br />
                      <strong>Réparation autonome</strong> — Acheter la pièce et faire soi-même (tutoriels vidéo). Économie maximale, mais déconseillé sans expérience.
                    </>
                  )}
                </div>
              </div>
              {isQualiReparEligible(item.category) && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: AMBER + "08", borderRadius: 8, border: "1px solid " + AMBER + "30", fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                  <strong style={{ color: "#B45309" }}>Bonus QualiRépar</strong> — Chez un réparateur labellisé, vous économisez {getQualiReparBonus(item.productType) ?? "15 à 60"} € (aide de l'État déduite sur la facture).
                </div>
              )}
            </>
          )}
        </div>

        {/* Indication discrète : modèle plus récent conseillé (si remplacement) */}
        {smartReplacement && (
          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 20, lineHeight: 1.5 }}>
            {smartReplacement.preferredOption === "newer" ? (
              <>Modèle plus récent conseillé : <button type="button" onClick={() => onNav("aff", { item: smartReplacement.newerModel.item, issues: getIssues(smartReplacement.newerModel.item), affType: "occ", alts: getAlternatives(smartReplacement.newerModel.item) })} style={{ background: "none", border: "none", padding: 0, fontSize: 12, fontWeight: 700, color: GREEN, cursor: "pointer", fontFamily: F, textDecoration: "underline" }}>{smartReplacement.newerModel.item.brand} {smartReplacement.newerModel.item.name}</button> — {smartReplacement.reason}</>
            ) : (
              <>Envisagez aussi le <button type="button" onClick={() => onNav("aff", { item: smartReplacement.newerModel.item, issues: getIssues(smartReplacement.newerModel.item), affType: "occ", alts: getAlternatives(smartReplacement.newerModel.item) })} style={{ background: "none", border: "none", padding: 0, fontSize: 12, fontWeight: 600, color: GREEN, cursor: "pointer", fontFamily: F, textDecoration: "underline" }}>{smartReplacement.newerModel.item.brand} {smartReplacement.newerModel.item.name}</button> (modèle plus récent).</>
            )}
          </p>
        )}

        {/* Résumé réparation — compact, l'essentiel en un coup d'œil */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E3DE", padding: "16px 20px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>En bref</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Problème</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{activeIssues.map(i => i.name).join(", ") || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Difficulté</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : activeIssues.some(i => i.diff === "moyen") ? AMBER : GREEN }}>
                {activeIssues.some(i => i.diff === "difficile") ? "Difficile" : activeIssues.some(i => i.diff === "moyen") ? "Moyen" : "Facile"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Durée</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Pièces seules (DIY)</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: GREEN }}>dès {Math.round(tPart)} €</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Réparateur pro</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#6366F1" }}>dès {Math.round(tMin)} €</div>
            </div>
          </div>
        </div>

        {/* 3 options — mobile only (sidebar visible sur desktop) */}
        <div className="show-mobile" style={{ flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {(() => {
            const repairFeas = v.repairFeasibility || "facile";
            const repairTop = v.v === "reparer";
            const repairBtnShort = repairFeas === "peu_realiste" ? "Options pro →" : repairFeas === "technique" && v.repairMode !== "autonome" ? "Réparateur pro →" : "Voir les options →";
            return <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                { top: repairTop, color: GREEN, label: "Réparer", splitPrice: true, priceDiy: Math.round(tPart), pricePro: Math.round(tMin), sub: "Pièces seules ou réparateur", btn: repairBtnShort, aff: "pcs" },
                { top: v.v === "remplacer" && TECH_CATS.includes(item.category), color: AMBER, label: sl, price: minOccPrice != null ? `${recon} €` : `~${recon} €`, sub: TECH_CATS.includes(item.category) ? "Très en vogue (tech)" : "garanti 12 mois", btn: `Voir ${sl.toLowerCase()} →`, aff: "occ" },
                { top: v.v === "remplacer" && !TECH_CATS.includes(item.category), color: "#DC2626", label: "Neuf", price: neufDisplayText, sub: !TECH_CATS.includes(item.category) ? "Référence (électroménager)" : "meilleur prix", btn: "Comparer neuf →", aff: "neuf" },
              ].map((o, idx) => <div key={idx} onClick={() => onNav("aff", { item, issues: enrichedActiveIssues, affType: o.aff, alts })} className="card-hover" style={{
                background: "#fff", border: o.top ? `2px solid ${o.color}` : "1px solid #E5E3DE",
                borderRadius: 12, padding: 14, cursor: "pointer", textAlign: "center",
                boxShadow: o.top ? `0 3px 14px ${o.color}18` : "0 1px 4px rgba(0,0,0,.05)",
              }}>
                {o.top && <div style={{ fontSize: 8, fontWeight: 700, color: o.color, marginBottom: 4 }}>RECOMMANDÉ</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{o.label}</div>
                {o.splitPrice ? (
                  <div style={{ marginTop: 6, marginBottom: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "6px 10px", background: "#F8FAFC", borderRadius: 8, marginBottom: 4, fontSize: 11 }}>
                      <span style={{ color: "#6B7280", fontWeight: 600 }}>Soi-même</span>
                      <span style={{ fontWeight: 800, color: o.color }}>dès {o.priceDiy} €</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "6px 10px", background: "#F8FAFC", borderRadius: 8, fontSize: 11 }}>
                      <span style={{ color: "#6B7280", fontWeight: 600 }}>Pro</span>
                      <span style={{ fontWeight: 800, color: "#6366F1" }}>dès {o.pricePro} €</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 800, color: o.color }}>{o.price}</div>
                )}
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{o.sub}</div>
                <button style={{ width: "100%", padding: 6, borderRadius: 6, border: "none", background: o.top ? o.color : "#F3F4F6", color: o.top ? "#fff" : "#374151", fontWeight: 700, fontSize: 10, cursor: "pointer", fontFamily: F, marginTop: 6 }}>{o.btn}</button>
              </div>)}
            </div>;
          })()}
        </div>

        {/* En savoir plus — sections repliables pour ne pas surcharger */}
        <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 32, marginBottom: 12 }}>En savoir plus</div>

        {/* Réparer / Remplacer / réparation autonome — repliable */}
        <details style={{ marginBottom: 12, background: "#FAFBFC", borderRadius: 10, border: "1px solid #E8E6E1", overflow: "hidden" }}>
          <summary style={{ padding: "12px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#6B7280", listStyle: "none" }}>Quand réparer, remplacer ou faire soi-même ?</summary>
          <div style={{ padding: "0 16px 16px" }}>
            {(() => {
              const hasSpec = (OCC_CATS.includes(item.category) || TECH_CATS.includes(item.category)) && WHEN_REPAIR_SPEC[item.productType];
              const spec = hasSpec ? WHEN_REPAIR_SPEC[item.productType] : null;
              const age = new Date().getFullYear() - item.year;
              const multiProbs = activeIssues.length > 1;
              const panneNames = activeIssues.map(i => i.name).join(", ");
              const reparerBase = spec ? spec.reparer : `Pour votre ${item.brand} ${item.name} (${item.productType}), la réparation est pertinente quand le coût reste sous 30 % du prix neuf, que la pièce est disponible et que vous pouvez le faire vous-même ou via un pro à tarif raisonnable.`;
              const reparerPerso = `${reparerBase} Pour ${multiProbs ? `les pannes « ${panneNames} »` : `la panne « ${panneNames} »`}, ${age <= 4 ? `votre ${item.productType.toLowerCase()} de ${item.year} est encore récent — la réparation mérite souvent d'être envisagée si le coût reste sous 30 % du neuf.` : age <= 7 ? `avec ${age} ans, l'appareil peut encore valoir la réparation si le coût reste raisonnable.` : `à ${age} ans, l'appareil est âgé — la réparation n'est pertinente que si le coût reste très bas (< 25 % du neuf).`}`;
              const remplacerBase = spec ? spec.remplacer : `Quand la réparation dépasse 40–45 % du prix neuf, quand l'intervention nécessite un pro (coût élevé) ou quand l'appareil est déjà ancien.`;
              const remplacerPerso = `${remplacerBase} ${multiProbs ? `Avec plusieurs pannes cumulées (${panneNames}), le remplacement est souvent plus logique. ` : ""}${age >= 8 ? `Votre appareil a ${age} ans — le remplacement (${sl.toLowerCase()} ou neuf) offre généralement un meilleur rapport qualité/prix.` : ""}`;
              return <>
            <div style={{ borderLeft: `4px solid ${GREEN}`, paddingLeft: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="check" s={16} color={GREEN} /> Quand réparer reste pertinent
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>{reparerPerso}</p>
            </div>
            <div style={{ borderLeft: "4px solid #DC2626", paddingLeft: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="swap" s={16} color="#DC2626" /> Quand remplacer devient préférable
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>{remplacerPerso}</p>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginTop: 8, padding: "8px 10px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                <strong>Par catégorie :</strong> {TECH_CATS.includes(item.category) ? `pour les ${item.productType.toLowerCase()}s, le reconditionné est très en vogue (garanti 12 à 24 mois).` : `pour l'électroménager et la plomberie, le neuf reste souvent la référence.`}
              </p>
            </div>
            <div style={{ borderLeft: `4px solid ${ACCENT}`, paddingLeft: 14, marginBottom: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="tool" s={16} color={ACCENT} /> Peut-on réparer soi-même ?
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                {timeInfo.needsPro
                  ? `Non — c'est vraiment impossible seul. Pour « ${panneNames} » sur un ${item.brand} ${item.name}, l'intervention relève exclusivement du professionnel : outillage spécialisé, soudure ou risque élevé de casse. Tenter la réparation soi-même peut rendre l'appareil définitivement inutilisable. À confier à un réparateur agréé ou à remplacer.`
                  : v?.repairFeasibility === "facile"
                  ? `Possible, sous conditions. La réparation « ${panneNames} » est indiquée comme facile — un tutoriel vidéo peut vous guider. ${multiProbs ? `Avec plusieurs pannes, le cumul des interventions augmente le risque d'erreur. ` : ""}À tenter uniquement si vous êtes à l'aise ; sinon, un pro ou le ${sl.toLowerCase()} reste plus sûr.`
                  : v?.repairFeasibility === "technique"
                  ? `Déconseillé sans expérience. La réparation « ${panneNames} » sur ce ${item.brand} ${item.name} est technique : démontage délicat, outillage spécifique, risque de casser des connecteurs. Beaucoup de particuliers échouent. En pratique, passer par un réparateur ou remplacer est souvent plus rentable.`
                  : `Non, pas de façon réaliste. Sans outillage et compétences pro, vous risquez d'endommager définitivement votre ${item.brand} ${item.name}. Ne tentez pas la réparation autonome : privilégiez un réparateur agréé ou le remplacement (${sl.toLowerCase()} / neuf).`}
              </p>
            </div>
          </>;
            })()}
          </div>
        </details>

        {/* REPAIRER FINDER (Google Maps) */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DDD5", padding: "16px 18px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#111" }}>
              <Icon name="pin" s={16} color={ACCENT} /> Trouver un réparateur près de chez moi
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Ouverture dans Google Maps</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={place} onChange={e => setPlace(e.target.value)} placeholder="Ville ou code postal" style={{ flex: 1, minWidth: 220, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: 13, fontFamily: F, outline: "none" }} />
            <a href={buildRepairerMapsUrl(item, place) || undefined} target="_blank" rel="noopener noreferrer"
              style={{
                padding: "10px 14px", borderRadius: 8, background: place.trim() ? ACCENT : "#E5E7EB",
                color: place.trim() ? "#fff" : "#9CA3AF", fontSize: 13, fontWeight: 700, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8, pointerEvents: place.trim() ? "auto" : "none"
              }}>
              Voir les réparateurs à proximité <Chev />
            </a>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 8, lineHeight: 1.5 }}>
            Suggestion de recherche : <strong style={{ color: "#111" }}>{`réparateur ${TECH_CATS.includes(item.category) ? `${item.brand} ${item.name}` : item.productType}`}</strong>
          </div>
        </div>

        {/* Tableau comparatif — replié par défaut pour ne pas surcharger */}
        <details style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", overflow: "hidden", marginBottom: 24 }}>
          <summary style={{ padding: "14px 18px", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#374151", display: "flex", alignItems: "center", gap: 8, listStyle: "none" }}>
            <Icon name="chart" s={16} color={ACCENT} /> Comparer réparer, pro, reconditionné et neuf
          </summary>
          <div style={{ padding: "0 16px 16px" }}>
          {(() => {
            const neuf = neufDisplay;
            const econRep = neuf - tMax;
            const econRecon = neuf - recon;
            const econRepLabel = econRep > 0 ? `Économisez jusqu'à ${Math.round(econRep)} €` : econRep < 0 ? `Surcoût ${Math.round(Math.abs(econRep))} €` : "—";
            const econReconLabel = econRecon > 0 ? `Économisez ${Math.round(econRecon)} €` : "—";
            const diffLabel = activeIssues.some(i => i.diff === "difficile") ? "●●● Difficile" : activeIssues.some(i => i.diff === "moyen") ? "●● Moyen" : "● Facile";
            const bestChoiceBanner = v.v === "reparer" && econRep > 0
              ? { label: "Réparer", econ: `Économisez jusqu'à ${econRep} €`, color: GREEN }
              : v.v === "remplacer" && econRecon > 0
              ? { label: sl, econ: `Économisez ${econRecon} €`, color: AMBER }
              : null;
            if (isMobile) {
              return <>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 12 }}>Référence : {neufDisplayText} neuf</div>
                {bestChoiceBanner && (
                  <div style={{ background: bestChoiceBanner.color + "12", border: `1px solid ${bestChoiceBanner.color}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, color: bestChoiceBanner.color }}>✓</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Meilleur rapport : {bestChoiceBanner.label}</span>
                    <span style={{ fontSize: 12, color: bestChoiceBanner.color, fontWeight: 600 }}>{bestChoiceBanner.econ}</span>
                  </div>
                )}
                {v.v === "reparer" && isQualiReparEligible(item.category) && (
                  <div style={{ marginBottom: 12, padding: "10px 14px", background: AMBER + "08", borderRadius: 8, border: "1px solid " + AMBER + "30", fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                    <strong style={{ color: "#B45309" }}>Bonus QualiRépar</strong> — Chez un réparateur labellisé, vous économisez {getQualiReparBonus(item.productType) ?? "15 à 60"} € (aide de l'État déduite sur la facture).
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: v.v === "reparer" ? GREEN + "08" : "#F8FAFC", borderRadius: 12, padding: 14, border: v.v === "reparer" ? `2px solid ${GREEN}` : "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: GREEN + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="tool" s={16} color={GREEN} /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Réparer soi-même</span>
                      {v.v === "reparer" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: GREEN, color: "#fff" }}>Recommandé</span>}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 2 }}>dès {Math.round(tPart)} €</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Pièces seules · tutoriel vidéo</div>
                    <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>{econRepLabel}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Temps : {timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis"}</div>
                  </div>
                  <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 14, border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: "#6366F112", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="pin" s={16} color="#6366F1" /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Réparateur pro</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 2 }}>dès {Math.round(tMin)} €</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Pièce + main d&apos;œuvre · devis recommandé</div>
                    {tMin !== tMax && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Fourchette : {Math.round(tMin)}–{Math.round(tMax)} €</div>}
                  </div>
                  <div style={{ background: v.v === "remplacer" ? AMBER + "08" : "#F8FAFC", borderRadius: 12, padding: 14, border: v.v === "remplacer" ? `2px solid ${AMBER}` : "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: AMBER + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="recycle" s={16} color={AMBER} /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{sl}</span>
                      {v.v === "remplacer" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: AMBER, color: "#fff" }}>Recommandé</span>}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 4 }}>{minOccPrice != null ? "" : "~"}{recon} €</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{sl.toLowerCase()} garanti</div>
                    <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginTop: 2 }}>{econReconLabel}</div>
                  </div>
                  <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 14, border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: "#DC262612", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="cart" s={16} color="#DC2626" /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Neuf</span>
                      <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>référence</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 4 }}>{neufDisplayText}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>Prix de base</div>
                  </div>
                </div>
              </>;
            }
            const tableRows = [
              { l: "Prix", diy: `dès ${Math.round(tPart)} €`, pro: `dès ${Math.round(tMin)} €`, o: minOccPrice != null ? `${recon} €` : `~${recon} €`, n: hasNeufOffer ? neufDisplayText : `${Math.round(neuf)} €`, bold: true },
              { l: "Détail", diy: "Pièces seules · tutoriel", pro: tMin !== tMax ? `Pièce + main d'œuvre (${Math.round(tMin)}–${Math.round(tMax)} €)` : "Pièce + main d'œuvre", o: `${sl.toLowerCase()} garanti`, n: "Référence" },
              { l: "Économie vs neuf", diy: econRepLabel, pro: "—", o: econReconLabel, n: "—", hDiy: econRep > 0 ? GREEN : null, hO: econRecon > 0 ? AMBER : null },
              { l: "Temps / Difficulté", diy: timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis", pro: "—", o: "—", n: "—", hDiy: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : null },
            ];
            return <>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>Référence : {neufDisplayText} neuf</div>
              {bestChoiceBanner && (
                <div style={{ background: bestChoiceBanner.color + "12", border: `1px solid ${bestChoiceBanner.color}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: bestChoiceBanner.color }}>✓</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Meilleur rapport : {bestChoiceBanner.label}</span>
                  <span style={{ fontSize: 12, color: bestChoiceBanner.color, fontWeight: 600 }}>{bestChoiceBanner.econ}</span>
                </div>
              )}
              {v.v === "reparer" && isQualiReparEligible(item.category) && (
                <div style={{ marginBottom: 10, padding: "10px 14px", background: AMBER + "08", borderRadius: 8, border: "1px solid " + AMBER + "30", fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                  <strong style={{ color: "#B45309" }}>Bonus QualiRépar</strong> — Chez un réparateur labellisé, vous économisez {getQualiReparBonus(item.productType) ?? "15 à 60"} € (aide de l'État déduite sur la facture).
                </div>
              )}
              <div className="table-compare-scroll" style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DDD5", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr style={{ background: W }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#9CA3AF", fontSize: 11, width: "22%" }}></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: GREEN, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="tool" s={14} color={GREEN} /> Soi-même</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#6366F1", fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="pin" s={14} color="#6366F1" /> Pro</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: AMBER, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="recycle" s={14} color={AMBER} /> {sl}</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#DC2626", fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="cart" s={14} color="#DC2626" /> Neuf</span></th>
                  </tr></thead>
                  <tbody>
                    {tableRows.map((row, i) => <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "9px 14px", fontWeight: 600, color: "#374151", fontSize: 12 }}>{row.l}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", color: row.hDiy || "#6B7280", fontWeight: row.bold || row.hDiy ? 700 : 400, background: v.v === "reparer" ? GREEN + "06" : "transparent" }}>{row.diy}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", color: "#6B7280", fontWeight: row.bold ? 700 : 400, background: v.v === "reparer" ? "#6366F106" : "transparent" }}>{row.pro}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", color: row.hO || "#6B7280", fontWeight: row.bold || row.hO ? 700 : 400, background: v.v === "remplacer" ? AMBER + "06" : "transparent" }}>{row.o}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", color: row.hN || "#6B7280", fontWeight: row.bold || row.hN ? 700 : 400 }}>{row.n}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </>;
          })()}
          </div>
        </details>

        {/* Smart alternatives section — repliable */}
        {alts && (alts.newer.length > 0 || alts.equiv.length > 0) && <details style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", marginBottom: 16, overflow: "hidden" }}>
          <summary style={{ padding: "12px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#6B7280", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="swap" s={16} color={ACCENT} />
            {alts.type === "tech" ? "Alternatives plus récentes" : "Produits équivalents"}
          </summary>
          <div style={{ padding: "0 18px 18px" }}>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14 }}>
            {alts.type === "tech"
              ? "Versions plus récentes ou équivalentes à considérer si vous optez pour le remplacement."
              : "Modèles compatibles et équivalents pour remplacer votre appareil."}
          </p>

          {/* Current model baseline */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: W, borderRadius: 6, border: "1px solid #E0DDD5", marginBottom: 8, opacity: .7 }}>
            <ProductImg brand={item.brand} item={item} size={42} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{item.brand} {item.name} <span style={{ fontSize: 10, color: "#9CA3AF" }}>({item.year})</span></div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Votre modèle actuel</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: AMBER, fontWeight: 600 }}>{minOccPrice != null ? "" : "~"}{recon} € {sl.toLowerCase()}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{neufDisplayText} neuf</div>
            </div>
          </div>

          {/* Newer models (tech) — clic principal = page achat, secondaire = comparatif */}
          {alts.newer.map((n, idx) => {
            const altIssues = getIssues(n.item);
            const altAlts = getAlternatives(n.item);
            return <div key={n.item.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: idx === 0 ? GREEN + "06" : "#fff",
              borderRadius: 6, border: idx === 0 ? `1.5px solid ${GREEN}40` : "1px solid #E0DDD5", marginBottom: 6, transition: "all .15s",
            }}>
              <ProductImg brand={n.item.brand} item={n.item} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>
                  {n.item.brand} {n.item.name} <span style={{ fontSize: 10, color: "#9CA3AF" }}>({n.item.year})</span>
                  {idx === 0 && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: GREEN, color: "#fff" }}>RECOMMANDÉ</span>}
                </div>
                <div style={{ fontSize: 11, color: GREEN, fontWeight: 500 }}>{n.reason}</div>
                <button type="button" onClick={e => { e.stopPropagation(); onNav("compare", n.item.id); }} style={{ marginTop: 6, background: "none", border: "none", padding: 0, fontSize: 10, color: "#9CA3AF", cursor: "pointer", fontFamily: F, textDecoration: "underline" }}>Voir le comparatif complet</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: AMBER }}>~{n.reconPrice} € recon.</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}><ProductPriceNeuf item={n.item} /> neuf</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button type="button" onClick={e => { e.stopPropagation(); onNav("aff", { item: n.item, issues: altIssues, affType: "neuf", alts: altAlts }); }} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#DC2626", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Prix neuf</button>
                  <button type="button" onClick={e => { e.stopPropagation(); onNav("aff", { item: n.item, issues: altIssues, affType: "occ", alts: altAlts }); }} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: AMBER, color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Reconditionné</button>
                </div>
              </div>
            </div>;
          })}

          {/* Equivalent models — même logique: direct vers achat neuf/occ, lien comparatif */}
          {alts.equiv.map(e => {
            const altIssues = getIssues(e.item);
            const altAlts = getAlternatives(e.item);
            return <div key={e.item.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#fff",
              borderRadius: 6, border: "1px solid #E0DDD5", marginBottom: 6, transition: "all .15s",
            }}>
              <ProductImg brand={e.item.brand} item={e.item} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>
                  {e.item.brand} {e.item.name} <span style={{ fontSize: 10, color: "#9CA3AF" }}>({e.item.year})</span>
                </div>
                <div style={{ fontSize: 11, color: AMBER, fontWeight: 500 }}>{e.reason}</div>
                <button type="button" onClick={ev => { ev.stopPropagation(); onNav("compare", e.item.id); }} style={{ marginTop: 6, background: "none", border: "none", padding: 0, fontSize: 10, color: "#9CA3AF", cursor: "pointer", fontFamily: F, textDecoration: "underline" }}>Voir le comparatif complet</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>~{e.reconPrice} € {shLabel(e.item.category).toLowerCase()}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}><ProductPriceNeuf item={e.item} /> neuf</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button type="button" onClick={ev => { ev.stopPropagation(); onNav("aff", { item: e.item, issues: altIssues, affType: "neuf", alts: altAlts }); }} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#DC2626", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Prix neuf</button>
                  <button type="button" onClick={ev => { ev.stopPropagation(); onNav("aff", { item: e.item, issues: altIssues, affType: "occ", alts: altAlts }); }} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: AMBER, color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: F }}>{sl}</button>
                </div>
              </div>
            </div>;
          })}

          {/* Explanation */}
          <div style={{ marginTop: 8, padding: "8px 12px", background: W, borderRadius: 6, fontSize: 11, color: "#6B7280", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Icon name="info" s={16} color="#9CA3AF" style={{ marginTop: 1 }} />
            <div>
            {alts.type === "tech"
              ? "Pour un produit technologique, une version plus récente peut offrir un meilleur rapport qualité-prix, surtout en reconditionné. Cliquez sur un modèle pour voir le comparatif détaillé."
              : "Pour ce type de produit, nous privilégions des modèles équivalents et compatibles. Le remplacement par un modèle similaire garantit la même qualité d'usage."}
            </div>
          </div>
          </div>
        </details>}

        {/* REPAIR DETAIL section — repliable */}
        <details style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", marginBottom: 20, overflow: "hidden" }}>
          <summary style={{ padding: "12px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#6B7280", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="tool" s={16} color={ACCENT} /> Détail de la réparation — {item.brand} {item.name}
          </summary>
          <div style={{ padding: "0 18px 18px" }}>
          {activeIssues.length > 1 && v.v === "remplacer" && (
            <div style={{ padding: "14px 16px", marginBottom: 16, background: "#FEF2F2", border: "2px solid #DC2626", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <Icon name="warn" s={22} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#991B1B", marginBottom: 4 }}>Réparation vraiment pas conseillée</div>
                <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>
                  Avec {activeIssues.length} pannes cumulées ({activeIssues.map(i => i.name).join(", ")}), la réparation serait trop compliquée et coûteuse. Le remplacement ({sl.toLowerCase()} ou neuf) est la meilleure option dans votre cas.
                </p>
              </div>
            </div>
          )}
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>
            Pour la panne « {enrichedActiveIssues.map(i => i.name).join(", ")} » sur votre {item.brand} {item.name} : tutoriel adapté à votre modèle, niveau de difficulté et coût estimé.
            {v.v === "reparer" ? " La réparation est l'option la plus économique et écologique dans votre cas." : ""}
          </p>
          {enrichedActiveIssues.map(iss => {
            const diffColor = iss.diff === "facile" ? GREEN : iss.diff === "moyen" ? AMBER : "#DC2626";
            const diffStars = iss.diff === "facile" ? 1 : iss.diff === "moyen" ? 2 : 3;
            const diffLabel = iss.diff === "facile" ? "Facile" : iss.diff === "moyen" ? "Moyen" : "Difficile";
            const timeLabel = formatSingleTime(iss.time);
            const impossibleSeul = iss.time === "pro";
            const tutoSteps = getTutorialSteps(item.productType);
            return <div key={iss.id} style={{ padding: "18px 0", borderBottom: "1px solid #F3F4F6" }}>
              {/* En-tête : problème + badges (difficulté, durée, coûts) */}
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: "0 0 12px" }}>{iss.name}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: diffColor + "14", color: diffColor, fontWeight: 700, fontSize: 12 }}>
                  {[1,2,3].map(s => <span key={s} style={{ width: 8, height: 8, borderRadius: 2, background: s <= diffStars ? diffColor : "#E5E7EB", display: "inline-block" }} />)}
                  {diffLabel}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "#F3F4F6", color: "#374151", fontWeight: 600, fontSize: 12 }}>
                  <Icon name="clock" s={14} color="#6B7280" /> {timeLabel}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: GREEN + "14", color: GREEN, fontWeight: 700, fontSize: 12 }}>
                  <Icon name="tool" s={14} color={GREEN} /> DIY : dès {iss.partPrice} €
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "#6366F114", color: "#6366F1", fontWeight: 700, fontSize: 12 }}>
                  <Icon name="pin" s={14} color="#6366F1" /> Pro : {iss.repairMin}–{iss.repairMax} €
                </span>
                {impossibleSeul && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, background: "#DC262614", color: "#DC2626", fontWeight: 700, fontSize: 11 }}>
                    <Icon name="warn" s={12} color="#DC2626" /> Pro requis
                  </span>
                )}
              </div>
              {/* Étapes principales */}
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, marginBottom: 12, borderLeft: `4px solid ${GREEN}` }}>
                <p style={{ fontSize: 13, color: "#374151", margin: "0 0 8px", fontWeight: 700 }}>Étapes principales :</p>
                <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{tutoSteps.map((s, si) => <li key={si}>{s}</li>)}</ol>
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, marginBottom: 10 }}>
                {impossibleSeul
                  ? `Pour « ${iss.name} » sur ce ${item.brand} ${item.name}, l'intervention relève exclusivement du professionnel : outillage spécialisé, soudure ou risque élevé de casse. Ne tentez pas seul — confiez à un réparateur agréé. Pensez au bonus QualiRépar (jusqu'à 45 €).`
                  : iss.diff === "facile"
                  ? `Réparation accessible avec un tutoriel vidéo. Comptez ${timeLabel} de travail + 1 à 3 jours de livraison pour la pièce (${iss.partPrice} €). Recherchez « ${iss.ytQuery} » sur YouTube pour des démonstrations adaptées à votre modèle.`
                  : iss.diff === "moyen"
                  ? `Réparation de niveau intermédiaire : démontage délicat, outillage spécifique. Un tutoriel vidéo détaillé vous guidera ; si vous hésitez, un pro sera plus rapide (délai : 2 à 5 jours). Pièce : ${iss.partPrice} €.`
                  : `Intervention complexe, outillage pro recommandé. Beaucoup de particuliers échouent. En pratique, passer par un réparateur agréé ou remplacer est souvent plus rentable. Pensez au bonus QualiRépar (jusqu'à 45 €).`
                }
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(iss.ytQuery)}`} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 16px", borderRadius: 8, background: "#FF0000", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="play" s={14} color="#fff" /> Tutoriel vidéo
                </a>
                <button onClick={() => onNav("aff", { item, issues: [iss], affType: "pcs", alts })} style={{ padding: "10px 16px", borderRadius: 8, background: GREEN, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="cart" s={14} color="#fff" /> Acheter les pièces{iss.partPrice != null ? ` (${iss.partPrice} €)` : ""}
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#9CA3AF", lineHeight: 1.4 }}>
                Recherche YouTube : « {iss.ytQuery.length > 55 ? iss.ytQuery.substring(0, 55) + "…" : iss.ytQuery} »
              </div>
            </div>;
          })}
          </div>
        </details>

        {/* Reviews */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>Retours d'expérience ({reviews.length})</h3>
            <button onClick={() => { if (!user) { onAuth(); return; } setShowWriteReview(!showWriteReview); }} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #D1D5DB", background: "#fff", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: F }}>{user ? "Écrire un avis" : "Se connecter pour donner un avis"}</button>
          </div>
          {showWriteReview && user && <div style={{ padding: 14, background: "#FAFAFA", borderRadius: 10, border: "1px solid #E5E7EB", marginBottom: 10 }}>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Partagez votre expérience..." style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: 13, fontFamily: F, outline: "none", minHeight: 60, resize: "vertical", marginBottom: 8 }} />
            <button onClick={submitReview} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: F }}>Publier</button>
          </div>}
          {reviews.length === 0 && !showWriteReview && <p style={{ fontSize: 13, color: "#9CA3AF", padding: "16px 0", textAlign: "center", background: "#FAFAFA", borderRadius: 10 }}>Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>}
          {reviews.map((r, i) => <div key={i} style={{ padding: "12px 14px", background: "#FAFAFA", borderRadius: 10, marginBottom: 5, border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{r.user}</span><span style={{ fontSize: 11, color: "#9CA3AF" }}>{r.date}</span></div>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, margin: "4px 0 0" }}>{r.text}</p>
          </div>)}
        </div>

        {/* Contextual FAQ */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 10 }}>Questions fréquentes — {item.brand} {item.name}</h3>
          {[
            { q: `Combien coûte la réparation d'un ${item.brand} ${item.name} ?`, a: `Selon la panne, le coût varie de ${issues.reduce((m,i) => Math.min(m,i.repairMin),999)}€ à ${issues.reduce((m,i) => Math.max(m,i.repairMax),0)}€ (pièces + main d’œuvre). La panne « ${issues[0]?.name} » revient en général à ${issues[0]?.repairMin}–${issues[0]?.repairMax}€. Demandez un devis pour confirmer.` },
            { q: `Vaut-il mieux réparer ou racheter un ${item.brand} ${item.name} ?`, a: `Cela dépend de la panne. Pour les réparations simples (${issues.filter(i=>i.diff==="facile").map(i=>i.name).join(", ") || "batterie, pièces d’usure"}), la réparation est généralement plus rentable. Au-delà de 40 % du prix neuf (${Math.round(item.priceNew*.4)}€), un modèle ${sl.toLowerCase()} peut être plus avantageux.` },
            { q: `Peut-on réparer un ${item.brand} ${item.name} soi-même ?`, a: `Les réparations notées « Facile » (${issues.filter(i=>i.diff==="facile").map(i=>i.name).join(", ") || "certaines pièces"}) sont accessibles aux débutants avec un tutoriel vidéo YouTube. Les réparations « Difficile » nécessitent un professionnel.` },
            { q: `Où trouver les pièces détachées pour ${item.brand} ${item.name} ?`, a: OCC_CATS.includes(item.category) ? "Les pièces sont disponibles chez Spareka, Castorama et Amazon. Spareka propose aussi des guides de réparation adaptés." : "Les pièces sont disponibles chez Spareka, Amazon et les revendeurs spécialisés. Des tutoriels vidéo YouTube ciblés existent pour de nombreux modèles." },
            { q: `Le bonus QualiRépar s'applique-t-il au ${item.brand} ${item.name} ?`, a: `Oui. Le bonus QualiRépar (${getQualiReparBonus(item.productType) ?? "15 à 60"} €) est applicable sur la réparation des ${item.productType.toLowerCase()}s chez un réparateur agréé. La réduction est automatique, aucune démarche nécessaire.` },
          ].map((f, i) => <details key={i} style={{ background: "#fff", borderRadius: 6, marginBottom: 4, border: "1px solid #E0DDD5" }}>
            <summary style={{ padding: "10px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#111" }}>{f.q}</summary>
            <p style={{ padding: "0 14px 10px", fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{f.a}</p>
          </details>)}
        </div>

        {/* Related */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 10 }}>Modèles similaires</h3>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {ITEMS.filter(i => i.category === item.category && i.productType === item.productType && i.id !== item.id).slice(0, 4).map(rel =>
              <Card key={rel.id} onClick={() => onNav("compare", rel.id)} style={{ padding: 12, textAlign: "center" }}>
                <ProductImg brand={rel.brand} item={rel} size={48} />
                <div style={{ fontWeight: 600, fontSize: 11, color: "#111", marginTop: 4 }}>{rel.brand}</div>
                <div style={{ fontSize: 10, color: "#6B7280" }}>{rel.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}><ProductPriceNeuf item={rel} /></div>
              </Card>)}
          </div>
        </div>
        </div>

        {/* SIDEBAR — sticky : 3 options + infos clés */}
        <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 12 }} className="hide-mobile">
          {(() => {
            const repairFeas = v.repairFeasibility || "facile";
            const repairTop = v.v === "reparer";
            const repairBtnShort = repairFeas === "peu_realiste" ? "Options pro →" : repairFeas === "technique" && v.repairMode !== "autonome" ? "Réparateur pro →" : "Voir les options →";
            return <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { top: repairTop, color: GREEN, label: "Réparer", splitPrice: true, priceDiy: Math.round(tPart), pricePro: Math.round(tMin), sub: "Pièces seules ou réparateur", btn: repairBtnShort, aff: "pcs" },
                  { top: v.v === "remplacer" && TECH_CATS.includes(item.category), color: AMBER, label: sl, price: `~${recon} €`, sub: TECH_CATS.includes(item.category) ? "Très en vogue (tech)" : "garanti 12 mois", btn: `Voir ${sl.toLowerCase()} →`, aff: "occ" },
                  { top: v.v === "remplacer" && !TECH_CATS.includes(item.category), color: "#DC2626", label: "Neuf", price: neufDisplayText, sub: !TECH_CATS.includes(item.category) ? "Référence (électroménager)" : "meilleur prix", btn: "Comparer prix neuf →", aff: "neuf" },
                ].map((o, idx) => <div key={idx} onClick={() => onNav("aff", { item, issues: enrichedActiveIssues, affType: o.aff, alts })} className="card-hover" style={{
                  background: "#fff", border: o.top ? `2px solid ${o.color}` : "1px solid #E5E3DE",
                  borderRadius: 12, padding: 14, cursor: "pointer", position: "relative",
                  boxShadow: o.top ? `0 3px 14px ${o.color}18` : "0 1px 4px rgba(0,0,0,.05)",
                }}>
                  {o.top && <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", background: o.color, color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>RECOMMANDÉ</div>}
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: "2px 0 0" }}>{o.label}</h3>
                    {o.splitPrice ? (
                      <div style={{ marginTop: 8, marginBottom: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#F8FAFC", borderRadius: 8, fontSize: 11 }}>
                          <span style={{ color: "#6B7280", fontWeight: 600 }}>Soi-même</span>
                          <span style={{ fontWeight: 800, color: o.color }}>dès {o.priceDiy} €</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#F8FAFC", borderRadius: 8, fontSize: 11 }}>
                          <span style={{ color: "#6B7280", fontWeight: 600 }}>Pro</span>
                          <span style={{ fontWeight: 800, color: "#6366F1" }}>dès {o.pricePro} €</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 18, fontWeight: 800, color: o.color }}>{o.price}</div>
                    )}
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>{o.sub}</div>
                  </div>
                  <button style={{ width: "100%", padding: 8, borderRadius: 6, border: "none", background: o.top ? o.color : "#F3F4F6", color: o.top ? "#fff" : "#374151", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: F, marginTop: 8 }}>{o.btn}</button>
                </div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { icon: "money", label: "Économie vs neuf", value: v.v === "reparer" ? `${Math.max(0, neufDisplay - tMax)} €` : v.v === "remplacer" ? `${neufDisplay - recon} € (${sl})` : "—", color: v.v === "reparer" ? GREEN : v.v === "remplacer" ? AMBER : "#999" },
                  { icon: "tool", label: "Difficulté", value: activeIssues.some(i => i.diff === "difficile") ? "Difficile" : activeIssues.some(i => i.diff === "moyen") ? "Moyenne" : "Facile", color: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : activeIssues.some(i => i.diff === "moyen") ? AMBER : GREEN },
                  (() => {
                    const idx = isRepairabilityEligible(item.category) ? getRepairabilityIndex(item.productType, item) : null;
                    const idxColor = idx != null ? (idx >= 7 ? GREEN : idx >= 5 ? AMBER : "#DC2626") : "#9CA3AF";
                    return { icon: "shield", label: "Indice de réparabilité", value: idx != null ? `${idx}/10` : "—", color: idxColor };
                  })(),
                  { icon: "leaf", label: "Impact écologique", value: v.v === "reparer" ? "Minimal" : v.v === "remplacer" ? "Variable" : "Important", color: v.v === "reparer" ? GREEN : v.v === "remplacer" ? AMBER : "#DC2626" },
                ].map((s, i) => <div key={i} style={{ background: "#fff", borderRadius: 10, border: "1.5px solid #E0DDD5", padding: "14px 12px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: s.color + "14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={s.icon} s={18} color={s.color} />
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                </div>)}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {v.v === "reparer" && <span style={{ padding: "3px 8px", borderRadius: 4, background: GREEN + "14", color: GREEN, fontSize: 10, fontWeight: 600 }}>Éco</span>}
                {v.v === "reparer" && <span style={{ padding: "3px 8px", borderRadius: 4, background: GREEN + "14", color: GREEN, fontSize: 10, fontWeight: 600 }}>Zéro déchet</span>}
                {repairEst?.confidence != null && <span style={{ padding: "3px 8px", borderRadius: 4, background: repairEst.confidence >= 70 ? GREEN + "12" : AMBER + "12", color: "#111", fontSize: 10, fontWeight: 600 }}>Fiabilité {repairEst.confidence}%</span>}
              </div>
              <details style={{ background: "#fff", borderRadius: 6, border: "1px solid #E0DDD5", overflow: "hidden" }}>
                <summary style={{ padding: "8px 10px", cursor: "pointer", fontWeight: 600, fontSize: 11, color: "#6B7280", listStyle: "none" }}>Méthodologie</summary>
                <p style={{ padding: "8px 10px", fontSize: 10, color: "#6B7280", lineHeight: 1.6, margin: 0, borderTop: "1px solid #E0DDD5" }}>
                  Nous comparons le coût estimé de la réparation au prix du neuf et du reconditionné. Si la réparation reste nettement moins chère, nous la recommandons. Si le coût s’approche du prix d’un appareil de remplacement, nous conseillons plutôt de remplacer. Nous tenons compte de la difficulté de la panne (certaines se font soi-même avec un tutoriel, d’autres nécessitent un pro), du nombre de pannes cumulées, et de l’âge ou de l’état d’usure de l’appareil que vous indiquez. Les estimations de coût sont indicatives et varient selon les réparateurs et les régions — un devis reste la référence.
                </p>
              </details>
            </>;
          })()}
        </div>
        </div>
      </>}
    </div>
  </div>;
}

/** Associe merchant (Supabase) → retailer RET pour logo/couleur */
function getRetailerForMerchant(merchant) {
  if (!merchant) return { n: "?", t: "", c: "#111", logoUrl: null };
  const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
  const m = norm(String(merchant));
  const all = [...RET.neuf, ...RET.occ];
  const match = all.find((r) => m.includes(norm(r.n)) || norm(r.n).includes(m));
  return match || { n: merchant, t: "", c: "#111", logoUrl: null };
}

/** Image sur une carte d'offre : tente offer.image_url (Awin), puis image produit, puis icône panier */
function OfferCardImg({ offerImgUrl, item, productImgUrl, lightbox }) {
  const fallbacks = [offerImgUrl, productImgUrl, PRODUCT_IMAGES[item?.id]].filter(Boolean);
  const [idx, setIdx] = useState(0);
  const src = fallbacks[idx] ?? null;
  return (
    <div
      role={src ? "button" : undefined}
      tabIndex={src ? 0 : undefined}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (src && lightbox) lightbox.openLightbox(src); }}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && src && lightbox) { e.preventDefault(); lightbox.openLightbox(src); } }}
      style={{ width: 96, height: 96, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", cursor: src ? "zoom-in" : "default" }}
    >
      {src ? (
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} loading="lazy" onError={() => setIdx((i) => i + 1)} />
      ) : (
        <div style={{ padding: "8px 6px", textAlign: "center" }}>
          {item?.brand && <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.2 }}>{item.brand}</div>}
          {item?.name && <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 3, lineHeight: 1.3, wordBreak: "break-word" }}>{item.name}</div>}
        </div>
      )}
    </div>
  );
}

// ─── AFFILIATE PAGE ───
function AffPage({ item, issues, affType, onNav, alts: passedAlts }) {
  const [place, setPlace] = useState("");
  const [supabaseOffers, setSupabaseOffers] = useState(null);
  const [supabaseDebug, setSupabaseDebug] = useState(null);
  const productImageUrl = useProductImage(item);
  const lightbox = useImageLightbox();
  const cat = CATS.find(c => c.id === item.category);
  const rets = getRet(item.category, affType);
  const sl = shLabel(item.category);
  const titles = { neuf: "Acheter neuf", occ: sl, pcs: "Pièces & réparation" };
  const alts = passedAlts || getAlternatives(item);
  // Coût réparation = pièces + main d'œuvre pro (pas seulement les pièces)
  const repairTotalMin = Math.round(issues?.reduce((s, i) => s + i.repairMin, 0) ?? 0);
  const repairTotalMax = Math.round(issues?.reduce((s, i) => s + i.repairMax, 0) ?? 0);
  const repairAvg = Math.round((repairTotalMin + repairTotalMax) / 2);
  const { priceForCalc: minNeufPriceAff } = useMinPriceNeuf(item);
  const base = affType === "neuf" ? (minNeufPriceAff ?? item.priceNew) : affType === "occ" ? (issues?.[0]?.reconPrice || Math.round(item.priceNew * .6)) : (repairAvg || 30);
  const off = [0, -.04, .03, -.06, .05];
  // Tri du moins cher au plus cher (lisibilité)
  const retsWithPrice = rets.map((r, idx) => ({ r, price: Math.round(base * (1 + (off[idx] ?? 0))), idx }));
  const sortedRets = [...retsWithPrice].sort((a, b) => a.price - b.price);

  // Chargement offres Supabase pour neuf, occasion et pièces (image produit via useProductImage)
  useEffect(() => {
    if ((affType !== "neuf" && affType !== "occ" && affType !== "pcs") || !item) return;
    let cancelled = false;
    const slug = getProductSlug(item);
    const fetchOffers = affType === "neuf" ? getOffersForNeuf : affType === "occ" ? getOffersForOcc : getOffersForParts;
    console.log("[Compare] Chargement offres Supabase:", { affType, slug, itemId: item?.id });
    fetchOffers(slug).then(({ data, error }) => {
      if (cancelled) return;
      console.log("[Compare] Offres Supabase reçues:", { slug, count: data?.length ?? 0, error: error?.message ?? null, sample: data?.[0] ?? null });
      setSupabaseDebug({ ok: !error, count: data?.length ?? 0, error: error?.message ?? null });
      setSupabaseOffers(error ? [] : data ?? []);
    }).catch((err) => {
      if (!cancelled) {
        console.error("[Compare] Erreur Supabase (catch):", err?.message ?? err);
        setSupabaseDebug({ ok: false, count: 0, error: err?.message ?? String(err) });
        setSupabaseOffers([]);
      }
    });
    return () => { cancelled = true; };
  }, [affType, item?.id]);
  const isTech = alts.type === "tech";
  const isOcc = affType === "occ";
  const isNeuf = affType === "neuf";
  const isPcs = affType === "pcs";
  const reconMult = OCC_CATS.includes(item.category) ? .55 : .62;

  // Build sorted alternatives list with scoring for this specific mode
  const buildAltList = () => {
    if (isPcs) return [];
    const list = [];
    const refPrice = isNeuf ? (minNeufPriceAff ?? item.priceNew) : Math.round(item.priceNew * reconMult);
    const pickTag = ({ kind, priceDiff, yearGain, sameBrand }) => {
      if (kind === "newer") return "Version plus récente";
      if (kind === "equiv") {
        if (priceDiff < 0) return "Même usage, prix plus intéressant";
        if (sameBrand) return "Modèle proche";
        return "Modèle équivalent";
      }
      return "Alternative";
    };

    // Newer models (tech only, scored by value)
    alts.newer.forEach((n, idx) => {
      const neufP = n.neufPrice;
      const reconP = n.reconPrice;
      const price = isNeuf ? neufP : reconP;
      const priceDiff = price - refPrice;
      const yearGain = n.yearDiff;

      // Score: newer + cheaper = best
      let score = yearGain * 10 - (priceDiff / refPrice) * 22;
      let badge = null;
      let reason = "";

      if (price <= refPrice) { badge = "Meilleur choix"; score += 16; }
      else if (price <= refPrice * 1.1) { badge = "Recommandé"; score += 10; }
      else if (yearGain >= 2 && price <= refPrice * 1.25) { badge = "Version plus récente"; score += 7; }

      if (isNeuf) {
        reason = badge === "Meilleur choix"
          ? `Version ${n.item.year}, même prix ou moins cher — meilleur rapport qualité/prix`
          : badge === "Recommandé"
          ? `Version ${n.item.year} pour seulement +${priceDiff} € — investissement rentable`
          : `Version ${n.item.year}, plus récente (+${priceDiff} €)`;
      } else {
        const delta = priceDiff > 0 ? `+${priceDiff}` : `${priceDiff}`;
        reason = badge === "Meilleur choix"
          ? `${n.item.year} ${sl.toLowerCase()} au même prix — génération plus récente`
          : badge === "Recommandé"
          ? `${n.item.year} ${sl.toLowerCase()}, faible écart de prix pour une version plus récente`
          : `Version ${n.item.year} en ${sl.toLowerCase()} (${delta} €)`;
      }

      const microTag = pickTag({ kind: "newer", priceDiff, yearGain, sameBrand: true });
      list.push({ ...n, price, priceDiff, score, badge, displayReason: reason, microTag, type: "newer" });
    });

    // Equivalent models
    alts.equiv.forEach(e => {
      const neufP = e.neufPrice;
      const reconP = e.reconPrice;
      const price = isNeuf ? neufP : reconP;
      const priceDiff = price - refPrice;
      let score = -Math.abs(priceDiff) / refPrice * 10;
      let badge = null;
      let reason = "";

      const sameBrand = e.item.brand === item.brand;
      if (price <= refPrice * 0.85) { badge = "Meilleur choix"; score += 9; }
      else if (price <= refPrice * 0.95) { badge = "Recommandé"; score += 6; }

      if (isNeuf) {
        if (badge === "Meilleur choix") reason = `${e.item.brand}, même usage pour ${Math.abs(priceDiff)} € de moins`;
        else if (Math.abs(priceDiff) < refPrice * 0.06) reason = `${e.item.brand}, modèle équivalent au même prix`;
        else reason = e.reason;
      } else {
        if (badge === "Meilleur choix") reason = `${e.item.brand} en ${sl.toLowerCase()} à prix réduit (même usage)`;
        else reason = isTech ? `${e.item.brand} en ${sl.toLowerCase()}, alternative comparable` : e.reason;
      }

      const microTag = pickTag({ kind: "equiv", priceDiff, yearGain: 0, sameBrand });
      list.push({ ...e, price, priceDiff, score, badge, displayReason: reason, microTag, type: "equiv" });
    });

    return list.sort((a, b) => b.score - a.score);
  };

  const altList = buildAltList();
  const showAlts = !isPcs && altList.length > 0;
  const myPrice = isNeuf ? (minNeufPriceAff ?? item.priceNew) : Math.round(item.priceNew * reconMult);
  const modeColor = isNeuf ? "#DC2626" : AMBER;
  const modeLabel = isNeuf ? "neuf" : sl.toLowerCase();
  const smartReplacementAff = (isOcc || isNeuf) ? getSmartReplacementRecommendation(item, { priceNeufOverride: minNeufPriceAff ?? undefined }) : null;

  return <div className="page-enter" style={{ fontFamily: F }}>
    <div style={{ padding: "12px 20px", maxWidth: 860, margin: "0 auto", fontSize: 12, color: "#9CA3AF", display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev />
      <span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("cat", item.category)}>{cat?.name}</span><Chev />
      <span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("compare", item.id)}>{item.brand} {item.name}</span><Chev />
      <span>{titles[affType]}</span>
    </div>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>
      {/* Header + photo produit + description */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flexShrink: 0 }}>
          <ProductImg brand={item.brand} item={item} size={160} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: "0 0 4px" }}>{titles[affType]} — {item.brand} {item.name}</h1>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
                {isPcs ? (
                  <>Panne : <strong style={{ color: "#111" }}>{issues?.map(i => i.name).join(", ")}</strong> — Pièces seules dès {Math.round(issues?.reduce((s, i) => s + (i.partPrice || 0), 0) || 0)} € · Réparateur pro dès {Math.round(repairTotalMin)} €</>
                ) : issues?.map(i => i.name).join(", ")}
              </p>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, maxWidth: 560 }}>
                {isPcs
                  ? `Comparez les offres de pièces détachées ci-dessous. Deux options : acheter les pièces et réparer vous-même (tutoriel vidéo), ou confier à un réparateur professionnel.`
                  : `Le ${item.brand} ${item.name} est un ${item.productType.toLowerCase()} de ${item.year}. Comparez les offres des prestataires ci-dessous.`}
              </p>
            </div>
            {!isPcs && <div style={{ padding: "4px 10px", borderRadius: 4, background: modeColor + "12", color: modeColor, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name={isNeuf ? "cart" : "recycle"} s={14} color={modeColor} />
                {isNeuf ? "Prix neuf uniquement" : `${sl} uniquement`}
              </span>
            </div>}
          </div>
        </div>
      </div>

      {/* Modèle plus récent recommandé — sur pages neuf/reconditionné (vert = opportunité) */}
      {smartReplacementAff && (
        <div
          onClick={() => onNav("aff", { item: smartReplacementAff.newerModel.item, issues: getIssues(smartReplacementAff.newerModel.item), affType, alts: getAlternatives(smartReplacementAff.newerModel.item) })}
          className="card-hover"
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", marginBottom: 20, background: GREEN + "12", border: "2px solid " + GREEN + "50", borderRadius: 12, cursor: "pointer", boxShadow: "0 2px 12px " + GREEN + "15" }}
        >
          <Icon name="swap" s={22} color={GREEN} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>
              Modèle plus récent recommandé : {smartReplacementAff.newerModel.item.brand} {smartReplacementAff.newerModel.item.name}
            </div>
            <div style={{ fontSize: 12, color: "#374151", marginTop: 4, fontWeight: 500 }}>{smartReplacementAff.newerModel.reason} · ~{smartReplacementAff.newerModel.reconPrice} € {sl.toLowerCase()}</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: GREEN }}>Voir les offres →</span>
        </div>
      )}

      {/* 1. Détail réparation — EN PREMIER (sans prestataires) : étapes, puis prix */}
      {isPcs && issues?.length > 0 && (
        <details open style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E3DE", marginBottom: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <summary style={{ padding: "16px 20px", cursor: "pointer", fontWeight: 700, fontSize: 15, color: "#111", listStyle: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="tool" s={18} color={GREEN} /> Détail de la réparation
          </summary>
          <div style={{ padding: "0 20px 20px" }}>
            {issues.length > 1 && (() => { const vPcs = getVerdict(issues, item); return vPcs?.v === "remplacer"; })() && (
              <div style={{ padding: "14px 16px", marginBottom: 16, background: "#FEF2F2", border: "2px solid #DC2626", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Icon name="warn" s={22} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#991B1B", marginBottom: 4 }}>Réparation vraiment pas conseillée</div>
                  <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>
                    Avec {issues.length} pannes cumulées ({issues.map(i => i.name).join(", ")}), la réparation serait trop compliquée et coûteuse. Le remplacement ({sl.toLowerCase()} ou neuf) est la meilleure option dans votre cas.
                  </p>
                </div>
              </div>
            )}
            {issues.map((iss, i) => {
              const timeLabel = iss.time ? formatSingleTime(iss.time) : "Variable";
              const tutoSteps = getTutorialSteps(item.productType);
              const ytQuery = getYoutubeRepairQuery(item.productType, iss.name);
              const partBase = Math.round(iss.partPrice || 30);
              const diffLabel = iss.diff === "facile" ? "Facile" : iss.diff === "moyen" ? "Moyen" : "Difficile";
              const diffColor = iss.diff === "facile" ? GREEN : iss.diff === "moyen" ? AMBER : "#DC2626";
              const impossibleSeul = iss.time === "pro";
              return (
                <div key={i} style={{ marginBottom: i < issues.length - 1 ? 24 : 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", margin: "0 0 12px" }}>{iss.name}</h3>
                  {/* 1. Étapes principales — en premier */}
                  <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 14, borderLeft: `4px solid ${GREEN}` }}>
                    <p style={{ fontSize: 14, color: "#374151", margin: "0 0 10px", fontWeight: 700 }}>Étapes principales :</p>
                    <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "#374151", lineHeight: 1.8 }}>{tutoSteps.map((s, si) => <li key={si}>{s}</li>)}</ol>
                  </div>
                  {/* 2. Prix et infos — ensuite */}
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6B7280", marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                    <span><Icon name="money" s={14} color="#9CA3AF" /> Pièce : ~{partBase} €</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, background: diffColor + "18", color: diffColor, fontWeight: 700 }}>
                      <Icon name="tool" s={14} color={diffColor} /> Niveau : {diffLabel}
                    </span>
                    <span><Icon name="clock" s={14} color="#9CA3AF" /> Durée : {timeLabel}</span>
                    {impossibleSeul && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, background: "#DC262618", color: "#DC2626", fontWeight: 700 }}>
                        <Icon name="warn" s={14} color="#DC2626" /> Réparation impossible seul — pro requis
                      </span>
                    )}
                    {!impossibleSeul && iss.diff === "difficile" && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, background: AMBER + "18", color: AMBER, fontWeight: 700 }}>
                        Pro recommandé
                      </span>
                    )}
                  </div>
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, background: "#FF0000", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                    <Icon name="play" s={16} color="#fff" /> Tutoriel vidéo
                  </a>
                </div>
              );
            })}
          </div>
        </details>
      )}

      {/* Bloc récapitulatif réparation (AffPage pièces) — avant les offres */}
      {isPcs && issues?.length > 0 && (() => {
        const timeInfo = getCumulTimeInfo(issues);
        const partTotal = Math.round(issues.reduce((s, i) => s + (i.partPrice || 0), 0) || 0);
        const diffLabel = issues.some(i => i.diff === "difficile") ? "Difficile" : issues.some(i => i.diff === "moyen") ? "Moyen" : "Facile";
        const diffColor = diffLabel === "Difficile" ? "#DC2626" : diffLabel === "Moyen" ? AMBER : GREEN;
        return (
          <div style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)", borderRadius: 14, border: "1px solid #E5E3DE", padding: "18px 20px", marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Problème</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{issues.map(i => i.name).join(", ")}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Difficulté</div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, background: diffColor + "18", color: diffColor, fontWeight: 700, fontSize: 13 }}>
                <Icon name="tool" s={14} color={diffColor} /> {diffLabel}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Durée</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{timeInfo.diyLabel}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Pièces seules (DIY)</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: GREEN }}>dès {partTotal} €</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Réparateur pro</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>{repairTotalMin}–{repairTotalMax} €</div>
            </div>
          </div>
        );
      })()}

      {/* 2. Indice réparabilité & QualiRépar — AVANT les offres (page pièces) */}
      {isPcs && (isRepairabilityEligible(item.category) || isQualiReparEligible(item.category)) && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          {isRepairabilityEligible(item.category) && (
            <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(45,106,79,.06)" }}>
              <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
                <InfoCardBlock><RepairabilityLogo score={getRepairabilityIndex(item.productType, item)} /></InfoCardBlock>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Indice de réparabilité</div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                    Note obligatoire sur 10 affichée sur les appareils. Plus elle est élevée, plus l'appareil est conçu pour être réparable. Consultez la fiche produit pour la note de votre modèle.
                  </p>
                </div>
              </div>
            </div>
          )}
          {isQualiReparEligible(item.category) && (() => {
            const bonus = getQualiReparBonus(item.productType);
            const bonusLabel = bonus != null ? `${bonus} €` : "15–60 €";
            return (
              <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(37,99,235,.06)" }}>
                <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
                  <InfoCardBlock><QualiReparLogo bonusLabel={bonusLabel} color="#2563EB" /></InfoCardBlock>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Aide de l'État — Bonus QualiRépar</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 10px 0" }}>
                      {bonus != null ? `Vous économisez ${bonus} €` : "Jusqu'à 60 € d'économie"} sur la réparation chez un réparateur labellisé. Réduction appliquée sur la facture, aucune démarche.
                    </p>
                    <a href={QUALUREPAR_ANNUAIRE_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      Trouver un réparateur labellisé →
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. Prix — comparer les offres prestataires */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Icon name={isPcs ? "tool" : isNeuf ? "cart" : "recycle"} s={18} color={ACCENT} />
          {isPcs ? "Offres de pièces détachées" : isNeuf ? "Comparer les prix neuf" : `Comparer les offres ${sl.toLowerCase()}`}
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 14 }}>
          {isPcs
            ? `Achetez les pièces ci-dessous pour réparer vous-même (tutoriel vidéo disponible), ou confiez à un réparateur professionnel.`
            : isNeuf
            ? `Les meilleures offres pour acheter ${item.brand} ${item.name} neuf. Livraison rapide, garantie fabricant.`
            : `Les meilleures offres ${sl.toLowerCase()} pour ${item.brand} ${item.name}. Garantie 12 à 24 mois, qualité vérifiée.`}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(isNeuf || isOcc) ? (() => {
            const offers = Array.isArray(supabaseOffers) ? supabaseOffers : [];
            const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
            // Offres Supabase avec URL valide, meilleur prix par marchand
            const byMerchant = {};
            for (const o of offers) {
              const m = norm(String(o.merchant ?? o.retailer ?? ""));
              if (!m || !o.url?.trim()) continue;
              const price = Number(o.price_amount) ?? 99999;
              if (!byMerchant[m] || price < (Number(byMerchant[m].price_amount) ?? 99999)) {
                byMerchant[m] = o;
              }
            }
            const supabaseList = Object.values(byMerchant)
              .map((offer) => {
                const r = getRetailerForMerchant(offer.merchant ?? offer.retailer);
                return { r, offer, price: Math.round(Number(offer.price_amount)) || 0, url: offer.url.trim() };
              })
              .filter((x) => x.url)
              .sort((a, b) => a.price - b.price);
            // Fallback : liens génériques sur les marchands par défaut si aucune offre Supabase
            const displayList = supabaseList.length > 0 ? supabaseList : retsWithPrice.map(({ r, price: fallbackPrice }) => ({
              r, offer: null, price: Math.round(fallbackPrice), url: buildRetailerUrl(r, item, affType),
            })).sort((a, b) => a.price - b.price);
            const productImgUrl = productImageUrl?.trim() || null;
            return displayList.map(({ r, offer, price, url }, rank) => {
              const isBestPrice = rank === 0;
              const priceStr = price > 0 ? `${price} €` : "—";
              const cardStyle = {
                background: "#fff",
                border: isBestPrice ? "2px solid #111" : "1px solid #E5E3DE",
                borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 18,
                boxShadow: isBestPrice ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.05)",
                textDecoration: "none", color: "inherit", cursor: "pointer",
              };
              return (
                <a key={`${r.n}-${rank}`} href={url} target="_blank" rel="noopener noreferrer sponsored" className="card-hover retailer-card-mobile" style={cardStyle}>
                  <OfferCardImg offerImgUrl={offer?.image_url?.trim() || null} item={item} productImgUrl={productImgUrl} lightbox={lightbox} />
                  <div className="retailer-main" style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                    <RetailerLogo r={r} size={56} className="retailer-logo" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{r.n}</span>
                        {isBestPrice && price > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#111", color: "#fff", flexShrink: 0 }}>Meilleur prix</span>}
                        {offer && (offer.is_fallback_model === true || offer.match_status === "fallback") && (
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#FEF3C7", color: "#92400E", flexShrink: 0 }}>Alternative plus récente</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#111", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{item.brand} {item.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.t}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 20, color: "#111" }}>{priceStr}</div>
                    </div>
                  </div>
                  <div className="retailer-cta" style={{
                    padding: "12px 18px", borderRadius: 10, fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    background: r.c || "#111", color: "#fff", transition: "transform .2s",
                  }}>
                    Voir l&apos;offre →
                  </div>
                </a>
              );
            });
          })() : (() => {
            const offers = Array.isArray(supabaseOffers) ? supabaseOffers : [];
            const issueSlugs = (issues ?? []).map((i) => slugify(i.name));
            const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
            const findOfferForParts = (r) => {
              if (!offers.length || !issueSlugs.length) return null;
              const m = (o) => (o.merchant ?? o.retailer ?? "").toLowerCase();
              return offers.find(
                (o) => m(o) && (norm(m(o)).includes(norm(r.n)) || norm(r.n).includes(norm(m(o)))) && issueSlugs.some((s) => (o.issue_type ?? "").toLowerCase() === s || (o.issue_type ?? "").toLowerCase().replace(/_/g, "-") === s)
              );
            };
            const merged = sortedRets.map(({ r, price: fallbackPrice }) => {
              const offer = isPcs ? findOfferForParts(r) : null;
              const price = offer?.price_amount != null ? Math.round(Number(offer.price_amount)) : Math.round(fallbackPrice);
              let url;
              if (isPcs && offer?.url?.trim()) {
                url = offer.url.trim();
              } else if (isPcs) {
                url = buildRetailerUrlForParts(r, item.productType, issues?.[0]?.name || "pièce");
              } else {
                url = buildRetailerUrl(r, item, affType);
              }
              return { r, offer, price, url };
            });
            const sorted = [...merged].sort((a, b) => a.price - b.price);
            const productImgUrl2 = productImageUrl?.trim() || null;
            return sorted.map(({ r, offer, price, url }, rank) => {
              const isBestPrice = rank === 0;
              const priceStr = price > 0 ? `${price} €` : "—";
              const matchedIssue = offer && issues?.length ? issues.find((i) => slugify(i.name) === (offer.issue_type ?? "").toLowerCase().replace(/_/g, "-")) : null;
              const offerLabel = buildPartsOfferLabel(offer, item, matchedIssue?.name ?? issues?.[0]?.name);
              const subLabel = `Pièces détachées sur ${r.n}`;
              return (
                <a key={r.n} href={url} target="_blank" rel="noopener noreferrer sponsored" className="card-hover retailer-card-mobile" style={{
                  background: "#fff",
                  border: isBestPrice ? "2px solid #111" : "1px solid #E5E3DE",
                  borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 18, cursor: "pointer", boxShadow: isBestPrice ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.05)", textDecoration: "none", color: "inherit",
                }}>
                  <OfferCardImg offerImgUrl={offer?.image_url?.trim() || null} item={item} productImgUrl={productImgUrl2} lightbox={lightbox} />
                  <div className="retailer-main" style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                    <RetailerLogo r={r} size={56} className="retailer-logo" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{offerLabel}</span>
                        {isBestPrice && price > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#111", color: "#fff", flexShrink: 0 }}>Meilleur prix</span>}
                        {offer && (offer.is_fallback_model === true || offer.match_status === "fallback") && (
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#FEF3C7", color: "#92400E", flexShrink: 0 }}>Alternative plus récente</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#111", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{item.brand} {item.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subLabel}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 20, color: "#111" }}>{priceStr}</div>
                    </div>
                  </div>
                  <div className="retailer-cta" style={{ padding: "12px 18px", borderRadius: 10, background: r.c || "#111", color: "#fff", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s", flexShrink: 0 }}>Acheter les pièces →</div>
                </a>
              );
            });
          })()}
        </div>
      </div>

      {/* Trouver un réparateur — pour page pcs */}
      {isPcs && (
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DDD5", padding: "18px 20px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#111" }}>
              <Icon name="pin" s={16} color={ACCENT} /> Trouver un réparateur près de chez moi
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Ouverture dans Google Maps</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={place} onChange={e => setPlace(e.target.value)} placeholder="Ville ou code postal" style={{ flex: 1, minWidth: 220, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: 13, fontFamily: F, outline: "none" }} />
            <a href={buildRepairerMapsUrl(item, place) || undefined} target="_blank" rel="noopener noreferrer"
              style={{
                padding: "10px 14px", borderRadius: 8, background: place.trim() ? ACCENT : "#E5E7EB",
                color: place.trim() ? "#fff" : "#9CA3AF", fontSize: 13, fontWeight: 700, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8, pointerEvents: place.trim() ? "auto" : "none"
              }}>
              Voir les réparateurs à proximité <Chev />
            </a>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 8, lineHeight: 1.5 }}>
            Suggestion : <strong style={{ color: "#111" }}>{`réparateur ${TECH_CATS.includes(item.category) ? `${item.brand} ${item.name}` : item.productType}`}</strong>
          </div>
        </div>
      )}

      {/* Model comparison section (neuf/occ only) — APRÈS les prix */}
      {showAlts && <>
        {/* Section title */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 10 }}>
          {isTech ? "Comparer les modèles" : "Modèles équivalents"} — {modeLabel}
        </div>

        {/* Alternatives — une seule section "Autres options" */}
        {altList.length > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginTop: 10, marginBottom: 6 }}>Autres options</div>}
        {altList.map(alt => {
          const altIssues = getIssues(alt.item);
          const altAlts = getAlternatives(alt.item);
          return <div key={alt.item.id} onClick={() => onNav("aff", { item: alt.item, issues: altIssues, affType, alts: altAlts })} className="card-hover alt-card-mobile" style={{
            background: "#fff", border: "1px solid #E5E3DE", borderRadius: 12, padding: "10px 14px",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
          }}>
            <ProductImg brand={alt.item.brand} item={alt.item} size={42} />
            <div className="alt-main" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{alt.item.brand} {alt.item.name}</span>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>({alt.item.year})</span>
                {alt.badge && <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 4px", borderRadius: 3, background: GREEN + "18", color: GREEN }}>{alt.badge}</span>}
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{alt.displayReason}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div className="alt-price" style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{alt.price} €</div>
            </div>
            <Chev />
          </div>;
        })}

        {/* Mode explanation */}
        <div style={{ marginTop: 8, padding: "10px 14px", background: W, borderRadius: 6, fontSize: 11, color: "#6B7280", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Icon name="info" s={16} color="#9CA3AF" style={{ marginTop: 1 }} />
          <div>
            {isNeuf
              ? isTech
                ? "Tous les prix ci-dessus sont en neuf. Une version plus récente peut offrir un meilleur rapport qualité-prix si l'écart est faible."
                : "Tous les prix ci-dessus sont en neuf. Pour ce type de produit, privilégiez un modèle compatible et au meilleur prix."
              : isTech
                ? `Tous les prix ci-dessus sont en ${sl.toLowerCase()}, garanti 12 à 24 mois. Opter pour un modèle plus récent reconditionné peut être un excellent compromis.`
                : `Tous les prix ci-dessus sont en ${sl.toLowerCase()}. Pour ce type de produit, un modèle équivalent d'occasion offre le même usage à prix réduit.`}
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: "#E0DDD5", margin: "18px 0 16px" }} />
      </>}

      {/* Disclaimer */}
      <div style={{ marginTop: 14, padding: "12px 16px", background: "#F8FAFC", borderRadius: 8, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
        {isPcs ? "Prix indicatifs (pièces + main d'œuvre). " : ""}Prix indicatifs {isNeuf ? "neufs" : isOcc ? `en ${sl.toLowerCase()}` : ""}. Compare. reçoit une commission sur les achats via ces liens, sans surcoût pour vous.
      </div>
    </div>
  </div>;
}

// ─── FOOTER ───
function Footer({ onNav }) {
  return <footer style={{ background: ACCENT, color: "#B7E4C7", padding: "28px 20px", fontFamily: F, fontSize: 12 }}>
    <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><Logo s={36} /><span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Compare<span style={{ color: "#52B788" }}>.</span></span></div>
        <p style={{ maxWidth: 200, lineHeight: 1.5 }}>La marketplace de la réparation intelligente. Paris.</p>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        <div><div style={{ color: "#52B788", fontWeight: 600, marginBottom: 5, fontSize: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>Technologies</div>{SIDEBAR_GROUPS[0].ids.map(id => CATS.find(c => c.id === id)).filter(Boolean).map(c => <button key={c.id} type="button" onClick={() => onNav("cat", c.id)} style={{ marginBottom: 2, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit", color: "inherit" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#B7E4C7"}>{c.name}</button>)}</div>
        <div><div style={{ color: "#52B788", fontWeight: 600, marginBottom: 5, fontSize: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>Maison</div>{SIDEBAR_GROUPS[1].ids.map(id => CATS.find(c => c.id === id)).filter(Boolean).map(c => <button key={c.id} type="button" onClick={() => onNav("cat", c.id)} style={{ marginBottom: 2, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit", color: "inherit" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#B7E4C7"}>{c.name}</button>)}</div>
        <div><div style={{ color: "#52B788", fontWeight: 600, marginBottom: 5, fontSize: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>Compare.</div>
          {[{ l: "Comment ça marche", p: "guide" }, { l: "Avantages", p: "avantages" }, { l: "À propos", p: "about" }, { l: "Contact", p: "contact" }, { l: "FAQ", p: "faq" }, { l: "Mentions légales", p: "legal" }].map(x => <button key={x.l} type="button" onClick={() => onNav(x.p)} style={{ marginBottom: 2, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit", color: "inherit" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#B7E4C7"}>{x.l}</button>)}
        </div>
      </div>
    </div>
    <div style={{ maxWidth: 860, margin: "12px auto 0", borderTop: `1px solid ${GREEN}`, paddingTop: 10, fontSize: 10, color: "#74C69D" }}>© 2025 Compare. — Liens d'affiliation</div>
  </footer>;
}

// ═══════════════ APP ═══════════════
export default function App() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);
  const popularSearches = isIOS ? POPULAR_SEARCHES_IPHONE : POPULAR_SEARCHES;

  useEffect(() => {
    const unsub = subscribeToAuth((fbUser) => {
      if (fbUser) setUser({ name: fbUser.displayName || fbUser.email?.split("@")[0] || "Utilisateur" });
      else setUser(null);
    });
    return unsub;
  }, []);

  // Params SEO (nouvelles routes)
  const categorySlug = params?.categorySlug;
  const productTypeSlug = params?.productTypeSlug;
  const brandSlug = params?.brandSlug;
  const productSlug = params?.productSlug;
  const issueSlug = params?.issueSlug;

  // Fallback anciennes routes /c/ et /p/
  const legacyCatSlug = params?.category ?? (pathname?.match(/^\/c\/([^/]+)/)?.[1]);
  const legacyIdParam = params?.id;
  const legacyItemId = legacyIdParam ? parseInt(String(legacyIdParam).split("-")[0], 10) : null;

  const panneParam = searchParams?.get("panne") || "";
  const panneIds = panneParam ? panneParam.split(",").map(x => parseInt(x, 10)).filter(Boolean) : [];

  let pageType = "home";
  let affType = "neuf";

  if (pathname === "/") pageType = "home";
  else if (pathname === "/avantages") pageType = "avantages";
  else if (pathname === "/comment-ca-marche") pageType = "guide";
  else if (pathname === "/guide/reparer-ou-racheter") pageType = "repair-guide";
  else if (pathname === "/faq") pageType = "faq";
  else if (pathname === "/mentions-legales") pageType = "legal";
  else if (pathname === "/a-propos") pageType = "about";
  else if (pathname === "/contact") pageType = "contact";
  else   if (pathname?.startsWith("/categories/")) {
    if (brandSlug === "occasion" || brandSlug === "acheter-neuf") {
      pageType = "models-list";
      affType = brandSlug === "occasion" ? "occ" : "neuf";
    } else if (brandSlug === "reparer") {
      pageType = "repair";
    } else if (brandSlug) pageType = "cat-brand";
    else if (productTypeSlug) {
      const catForResolve = categorySlug ? findCategoryBySlug(categorySlug) : null;
      const ptype = catForResolve ? findProductTypeBySlug(catForResolve.id, productTypeSlug) : null;
      const isBrand = catForResolve && ITEMS.some(i => i.category === catForResolve.id && slugify(i.brand) === productTypeSlug);
      pageType = ptype ? "cat-type" : isBrand ? "cat-brand" : "cat-type";
    } else pageType = "cat";
  } else if (pathname?.startsWith("/produits/")) {
    if (pathname?.endsWith("/reparer")) {
      pageType = "aff";
      affType = "pcs";
    } else if (pathname?.endsWith("/acheter-neuf")) {
      pageType = "aff";
      affType = "neuf";
    } else if (pathname?.endsWith("/acheter-reconditionne")) {
      pageType = "aff";
      affType = "occ";
    } else if (issueSlug) {
      pageType = "issue";
    } else {
      pageType = "compare";
    }
  } else if (pathname?.startsWith("/c/")) pageType = "cat";
  else if (pathname?.startsWith("/p/") && pathname?.endsWith("/aff")) {
    pageType = "aff";
    affType = searchParams?.get("type") || "neuf";
  } else if (pathname?.startsWith("/p/")) pageType = "compare";
  else if (pathname === "/guide") pageType = "guide";
  else if (pathname === "/guide-reparation") pageType = "repair-guide";

  const page = { type: pageType, catId: undefined, productType: undefined, brandSlug: undefined, itemId: null, item: null, issue: null, issues: [], affType, alts: null };

  if (pageType === "cat" || pageType === "cat-type" || pageType === "cat-brand" || pageType === "models-list" || pageType === "repair") {
    const slug = categorySlug || legacyCatSlug;
    const cat = slug ? findCategoryBySlug(slug) : null;
    page.catId = cat?.id || slug;
    if (pageType === "cat-type" || pageType === "cat-brand" || pageType === "models-list" || pageType === "repair") {
      const ptype = findProductTypeBySlug(page.catId, productTypeSlug);
      page.productType = ptype || undefined;
      page.brandSlug = pageType === "cat-brand" ? (brandSlug || productTypeSlug) : undefined;
    }
    if (pageType === "models-list") page.affType = affType;
  }

  if ((pageType === "compare" || pageType === "issue" || pageType === "aff") && (productSlug || legacyItemId)) {
    page.item = productSlug ? findProductBySlug(productSlug) : ITEMS.find(i => i.id === legacyItemId);
    if (page.item) {
      const allIssues = getIssues(page.item);
      if (pageType === "issue" && issueSlug) {
        page.issue = findIssueBySlug(page.item, issueSlug);
        page.issues = page.issue ? [page.issue] : allIssues.slice(0, 1);
      } else if (pageType === "aff") {
        const matched = panneIds.length ? allIssues.filter(i => panneIds.includes(i.id)) : [];
        page.issues = matched.length > 0 ? matched : allIssues.slice(0, 1);
      } else {
        page.issues = [];
      }
      if (pageType === "aff") page.alts = getAlternatives(page.item);
    }
    page.itemId = page.item?.id ?? legacyItemId;
  }


  // Redirection produits maison vers pages type (compare/issue uniquement — pas aff : l'utilisateur doit voir les prestataires Occasion/Neuf/Pièces)
  useEffect(() => {
    if (!router || !page.item) return;
    if (PAGES_GENERALES.includes(page.item.category) && (page.type === "compare" || page.type === "issue")) {
      router.replace(pathProductType(page.item.category, page.item.productType));
    }
  }, [router, page.item, page.type]);

  // Redirection des anciennes routes /c/ et /p/ vers les URLs SEO
  useEffect(() => {
    if (!pathname || !router) return;
    if (pathname.startsWith("/c/") && page.catId) {
      const target = pathCategory(page.catId);
      if (pathname !== target) router.replace(target);
    } else if (pathname.startsWith("/p/") && page.item && !pathname.endsWith("/aff")) {
      const target = pathProduct(page.item);
      if (pathname !== target) router.replace(target);
    } else if (pathname.startsWith("/p/") && pathname.endsWith("/aff") && page.item) {
      const target = pathAff(page.item, page.affType, page.issues);
      if (!pathname.startsWith(target.split("?")[0])) router.replace(target);
    }
  }, [pathname, page.catId, page.item, page.affType, page.issues]);

  function nav(type, data) {
    if (type === "home") router.push("/");
    else if (type === "cat") router.push(pathCategory(data));
    else if (type === "cat-type") router.push(pathProductType(data.catId, data.productType));
    else if (type === "cat-brand") router.push(pathBrand(data.catId, data.productType, data.brand));
    else if (type === "compare") { const item = typeof data === "number" ? ITEMS.find(i => i.id === data) : data; if (item) router.push(pathProduct(item)); }
    else if (type === "issue") { if (data?.item && data?.issue) router.push(pathProductIssue(data.item, data.issue)); }
    else if (type === "aff") router.push(pathAff(data.item, data.affType || "neuf", data.issues));
    else if (type === "models-list") router.push(pathModelsList(data.catId, data.productType, data.affType));
    else if (type === "repair") router.push(pathRepairPage(data.catId, data.productType));
    else if (type === "faq") router.push("/faq");
    else if (type === "legal") router.push("/mentions-legales");
    else if (type === "avantages") router.push("/avantages");
    else if (type === "guide") router.push("/comment-ca-marche");
    else if (type === "repair-guide") router.push("/guide/reparer-ou-racheter");
    else if (type === "about") router.push("/a-propos");
    else if (type === "contact") router.push("/contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <div style={{ minHeight: "100vh", background: W }}>
    <style>{CSS}</style>
    <a href="#main" className="skip-link">Aller au contenu</a>
    {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    <Sidebar open={sidebar} onClose={() => setSidebar(false)} onNav={nav} />
    <Navbar onNav={nav} onSearch={page.type === "home" ? undefined : (id) => nav("compare", id)} isHome={page.type === "home"} user={user} onAuth={() => user ? logout() : setShowAuth(true)} onMenu={() => setSidebar(true)} />
    <main id="main" style={{ paddingTop: 60 }}>
    {page.type === "home" && (
      <HomePage onSearch={(id) => nav("compare", id)} onNav={nav} ProductImg={ProductImg} ProductPriceNeuf={ProductPriceNeuf} />
    )}
    {page.type === "cat-type" && PAGES_GENERALES.includes(page.catId) && page.productType && (
      <TypeProductGeneralPage catId={page.catId} productType={page.productType} onNav={nav} />
    )}
    {page.type === "models-list" && page.catId && page.productType && (
      <ModelsListPage catId={page.catId} productType={page.productType} affType={page.affType || "neuf"} onNav={nav} />
    )}
    {page.type === "repair" && page.catId && page.productType && (
      <RepairPage catId={page.catId} productType={page.productType} onNav={nav} />
    )}
    {(page.type === "cat" || page.type === "cat-brand" || (page.type === "cat-type" && !PAGES_GENERALES.includes(page.catId))) && (
      <CategoryPage
        catId={page.catId}
        onNav={nav}
        initialProductType={page.productType}
        initialBrandSlug={page.brandSlug}
      />
    )}
    {(page.type === "compare" || page.type === "issue") && (
      <ComparatorPage
        itemId={page.itemId}
        onNav={nav}
        user={user}
        onAuth={() => setShowAuth(true)}
        initialIssueId={page.issue?.id}
      />
    )}
    {page.type === "aff" && (page.item ? <AffPage item={page.item} issues={page.issues} affType={page.affType} alts={page.alts} onNav={nav} /> : <div style={{ padding: 80, textAlign: "center", fontFamily: F, color: "#6B7280" }}>Produit non trouvé</div>)}
    {page.type === "faq" && <FaqPage onNav={nav} />}
    {page.type === "legal" && <LegalPage onNav={nav} />}
    {page.type === "avantages" && <AdvantagesPage onNav={nav} />}
    {page.type === "guide" && <GuidePage onNav={nav} />}
    {page.type === "repair-guide" && <RepairGuidePage onNav={nav} />}
    {page.type === "about" && <AboutPage onNav={nav} />}
    {page.type === "contact" && <ContactPage onNav={nav} />}
    </main>
    <Footer onNav={nav} />
  </div>;
}
