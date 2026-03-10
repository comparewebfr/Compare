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
import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { PRODUCT_IMAGES } from "../data/product-images";
import { PRODUCT_TYPE_IMAGES } from "../data/product-type-images";
import { ACCENT, GREEN, AMBER, W, F, CSS } from "../lib/constants";
import { auth, signInWithGoogle, signInWithApple, signUpWithEmail, signInWithEmail, subscribeToAuth, logout } from "../lib/firebase";
import { CATS, PTYPES, ITEMS, OCC_CATS, SIDEBAR_GROUPS, CHIP_TO_PRODUCT, POPULAR_SEARCHES, POPULAR_SEARCHES_IPHONE, RET, LOGO_BG, TECH_CATS, WHEN_REPAIR_SPEC, PAGES_PRECISES, PAGES_GENERALES, ISS_TPL } from "../lib/data";
import { slugify, getIssues, getVerdict, getRepairEstimate, getAlternatives, getRet, buildRetailerUrl, buildRetailerUrlForParts, buildRepairerMapsUrl, buildRepairerMapsUrlForType, pathCategory, pathProduct, pathProductType, pathProductIssue, pathBrand, pathCompare, pathAff, pathModelsList, pathRepairPage, buildSeo, findProductByChip, findProductByPopular, findCategoryBySlug, findProductBySlug, findProductTypeBySlug, findIssueBySlug, shLabel, getCumulTimeInfo, parseTimeRange, formatTimeRangeLabel, formatSingleTime, isRepairabilityEligible, isQualiReparEligible, getRepairabilityIndex, getTutorialSteps, getYoutubeRepairQuery } from "../lib/helpers";
import { getOffersForNeuf } from "../lib/supabase-queries";
import { getProductSlug } from "../lib/routes";
import { useProductImage } from "../lib/product-image-context";
import { useImageLightbox } from "../lib/image-lightbox-context";

// ─── LOGO ───
function Logo({ s = 32, priority = false }) {
  return <Image src="/logo.png" alt="Compare." width={s} height={s} sizes={`${s}px`} priority={priority} style={{ width: s, height: s, objectFit: "contain", borderRadius: "50%" }} />;
}

// ─── MINIMAL ICONS (decorative, aria-hidden) ───
function Icon({ name, s = 18, color = "#111", style = {} }) {
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", style: { display: "block", ...style }, "aria-hidden": true, focusable: false };
  switch (name) {
    case "check": return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
    case "tool": return <svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.7-2.7 2-2z" /></svg>;
    case "recycle": return <svg {...common}><path d="M7 19h10" /><path d="M7 19l-2-3" /><path d="M17 19l2-3" /><path d="M7 19l3-5" /><path d="M17 19l-3-5" /><path d="M9 9l3-5 3 5" /><path d="M12 4v5" /></svg>;
    case "swap": return <svg {...common}><path d="M7 7h14l-3-3" /><path d="M17 17H3l3 3" /></svg>;
    case "cart": return <svg {...common}><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6l-2-2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>;
    case "chart": return <svg {...common}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-3" /></svg>;
    case "money": return <svg {...common}><path d="M3 7h18v10H3z" /><path d="M7 7v10" /><path d="M17 7v10" /><circle cx="12" cy="12" r="2" /></svg>;
    case "leaf": return <svg {...common}><path d="M21 3c-8 1-14 7-15 15" /><path d="M6 18c6 0 10-4 10-10" /></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></svg>;
    case "warn": return <svg {...common}><path d="M12 3 2 21h20z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
    case "info": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 10v6" /><path d="M12 7h.01" /></svg>;
    case "shield": return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" /></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M3 11h18" /></svg>;
    case "pin": return <svg {...common}><path d="M12 21s6-5 6-10a6 6 0 1 0-12 0c0 5 6 10 6 10z" /><circle cx="12" cy="11" r="2" /></svg>;
    case "chat": return <svg {...common}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg>;
    case "book": return <svg {...common}><path d="M4 19a2 2 0 0 1 2-2h14" /><path d="M6 3h14v18H6a2 2 0 0 0-2 2V5a2 2 0 0 1 2-2z" /></svg>;
    case "play": return <svg {...common}><path d="M8 5v14l11-7z" /></svg>;
    case "x": return <svg {...common}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></svg>;
    // Category icons
    case "smartphone": return <svg {...common}><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></svg>;
    case "tablet": return <svg {...common}><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M11 17h2" /></svg>;
    case "laptop": return <svg {...common}><path d="M4 6h16v10H4z" /><path d="M2 18h20" /></svg>;
    case "washer": return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 7h.01" /><path d="M12 7h.01" /></svg>;
    case "tv": return <svg {...common}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M8 20h8" /></svg>;
    case "gamepad": return <svg {...common}><path d="M8 14H6a3 3 0 0 1-3-3 4 4 0 0 1 4-4h10a4 4 0 0 1 4 4 3 3 0 0 1-3 3h-2" /><path d="M7 12h2" /><path d="M8 11v2" /><path d="M16 11h.01" /><path d="M18 13h.01" /></svg>;
    case "headphones": return <svg {...common}><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v5a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2" /><path d="M20 13v5a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2" /></svg>;
    case "camera": return <svg {...common}><path d="M4 7h4l2-2h4l2 2h4v12H4z" /><circle cx="12" cy="13" r="3" /></svg>;
    case "shower": return <svg {...common}><path d="M7 7a5 5 0 0 1 10 0" /><path d="M17 7H7" /><path d="M12 7v2" /><path d="M9 12h.01" /><path d="M12 13h.01" /><path d="M15 12h.01" /><path d="M10 16h.01" /><path d="M14 16h.01" /></svg>;
    case "flame": return <svg {...common}><path d="M12 3s-3 3-3 7a3 3 0 0 0 6 0c0-4-3-7-3-7z" /><path d="M8 14a4 4 0 0 0 8 0" /></svg>;
    case "kitchen": return <svg {...common}><path d="M6 3v8" /><path d="M10 3v8" /><path d="M6 7h4" /><path d="M14 3v6a3 3 0 0 0 6 0V3" /><path d="M4 21h16" /></svg>;
    case "home": return <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 10v11h14V10" /></svg>;
    case "sofa": return <svg {...common}><path d="M5 12V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><path d="M4 12h16v5H4z" /><path d="M6 17v2" /><path d="M18 17v2" /></svg>;
    case "bike": return <svg {...common}><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17l4-7h4l4 7" /><path d="M10 10l-2-3h4" /></svg>;
    case "watch": return <svg {...common}><rect x="7" y="6" width="10" height="12" rx="2" /><path d="M9 6V4h6v2" /><path d="M9 18v2h6v-2" /><path d="M12 10v3l2 1" /></svg>;
    default: return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="3" /></svg>;
  }
}

// ═══════════════ UI COMPONENTS ═══════════════

function Pill({ active, onClick, children }) {
  return <button type="button" onClick={onClick} className="pill-hover" style={{ padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontFamily: F, fontSize: 13, fontWeight: active ? 700 : 500, background: active ? ACCENT : "#fff", color: active ? "#fff" : "#374151", border: active ? `2px solid ${ACCENT}` : "1.5px solid #E0DDD5", whiteSpace: "nowrap", minHeight: 44 }}>{children}</button>;
}
function Badge({ color, children }) {
  return <span style={{ display: "inline-block", padding: "5px 11px", borderRadius: 100, background: color + "18", color, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", border: `1px solid ${color}30` }}>{children}</span>;
}
function Card({ children, onClick, style = {}, as: Tag = "div", ...rest }) {
  const baseStyle = { background: "#fff", border: "1px solid #E5E3DE", borderRadius: 12, cursor: onClick ? "pointer" : "default", ...style };
  if (onClick && Tag === "div") {
    return <button type="button" onClick={onClick} className="card-hover" style={{ ...baseStyle, width: "100%", textAlign: "left", font: "inherit" }} {...rest}>{children}</button>;
  }
  return <Tag onClick={onClick} className={onClick ? "card-hover" : ""} style={baseStyle} {...rest}>{children}</Tag>;
}
function Chev() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M9 18l6-6-6-6" /></svg>; }

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
  const linkStyle = (base) => ({ ...base, padding: "8px 10px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: "#374151", fontSize: 14, fontWeight: 500, background: "none", border: "none", width: "100%", textAlign: "left", font: "inherit" });
  const infoStyle = (base) => ({ ...base, padding: "14px 16px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, color: "#374151", fontSize: 15, fontWeight: 600, background: "#F8FAF9", border: "1px solid #E8E6E2", width: "100%", textAlign: "left", font: "inherit" });
  return <><button type="button" aria-label="Fermer le menu" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.25)", zIndex: 200, backdropFilter: "blur(2px)", border: "none", cursor: "pointer" }} onClick={onClose} />
    <aside role="dialog" aria-label="Menu de navigation" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 300, background: W, zIndex: 201, overflowY: "auto", boxShadow: "8px 0 32px rgba(0,0,0,.08)" }}>
      <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E8E6E2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Logo s={32} /><span style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: "-.02em" }}>Compare<span style={{ color: ACCENT }}>.</span></span></div>
        <button onClick={onClose} aria-label="Fermer le menu" style={{ width: 44, height: 44, borderRadius: 8, background: "none", border: "none", color: "#6B7280", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#111"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#6B7280"; }}>×</button>
      </div>
      <nav style={{ padding: "16px 16px 24px" }} aria-label="Navigation principale">
        {SIDEBAR_GROUPS.map(grp => {
          const cats = grp.ids.map(id => CATS.find(c => c.id === id)).filter(Boolean);
          return <div key={grp.label} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>{grp.label}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              {cats.map(cat => (
                <li key={cat.id}>
                  <button type="button" onClick={() => { onNav("cat", cat.id); onClose(); }} style={linkStyle({})} onMouseEnter={e => { e.currentTarget.style.background = ACCENT + "08"; e.currentTarget.style.color = ACCENT; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}>
                    <Icon name={cat.icon} s={16} color="currentColor" style={{ opacity: .8 }} />
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>;
        })}
        <div style={{ paddingTop: 20, borderTop: "1px solid #E8E6E2", marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>Infos</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {[{ l: "Comment ça marche", p: "guide", icon: "search" }, { l: "Guide réparation", p: "repair-guide", icon: "tool" }, { l: "Avantages", p: "avantages", icon: "leaf" }, { l: "À propos", p: "about", icon: "info" }, { l: "Contact", p: "contact", icon: "chat" }, { l: "FAQ", p: "faq", icon: "book" }].map(x =>
              <li key={x.l}>
                <button type="button" onClick={() => { onNav(x.p); onClose(); }} style={infoStyle({})} onMouseEnter={e => { e.currentTarget.style.background = ACCENT + "12"; e.currentTarget.style.borderColor = ACCENT + "40"; e.currentTarget.style.color = ACCENT; }} onMouseLeave={e => { e.currentTarget.style.background = "#F8FAF9"; e.currentTarget.style.borderColor = "#E8E6E2"; e.currentTarget.style.color = "#374151"; }}>
                  <Icon name={x.icon} s={20} color="currentColor" style={{ opacity: .85 }} />
                  {x.l}
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </aside>
  </>;
}

// ─── NAVBAR ───
function Navbar({ onNav, user, onAuth, onMenu }) {
  return <header><nav aria-label="Navigation principale" style={{ position: "sticky", top: 0, zIndex: 100, background: ACCENT, padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: F }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button onClick={onMenu} aria-label="Ouvrir le menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 3, minWidth: 44, minHeight: 44, justifyContent: "center", alignItems: "center" }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 17, height: 2, background: "#fff", borderRadius: 1 }} />)}
      </button>
      <button type="button" onClick={() => onNav("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: 0, font: "inherit" }} aria-label="Compare. - Retour à l'accueil">
        <Image src="/logo.png" alt="" width={44} height={44} style={{ width: 44, height: 44, objectFit: "contain", borderRadius: "50%" }} />
        <span style={{ fontSize: 24, fontWeight: 800, color: W, letterSpacing: "-.03em" }}>Compare<span style={{ color: "#52B788" }}>.</span></span>
      </button>
    </div>
    <div className="nav-links" style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {[{ l: "Comment ça marche", p: "guide" }, { l: "Guide", p: "repair-guide" }, { l: "Avantages", p: "avantages" }, { l: "À propos", p: "about" }, { l: "Contact", p: "contact" }].map(x =>
        <button key={x.l} onClick={() => onNav(x.p)} style={{ background: "transparent", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.9)", fontFamily: F, padding: "10px 16px", transition: "color .2s, background .2s" }}
          onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.background = "rgba(255,255,255,.12)"; }} onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,.9)"; e.target.style.background = "transparent"; }}>{x.l}</button>
      )}
    </div>
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <button onClick={onAuth} aria-label={user ? `Connecté en tant que ${user.name}` : "Se connecter"} style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F }}>{user ? user.name : "Connexion"}</button>
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
const HERO_BANNERS = (W, ACCENT, GREEN) => [
  { bg: `linear-gradient(135deg, ${W} 30%, #E8F5E9)`, image: "/banner-hero.jpg", title: "Les meilleurs prix pour votre smartphone", sub: "Comparez, réparez ou rachetez un smartphone reconditionné", catId: "smartphones", icon: "smartphone", dark: false },
  { bg: `linear-gradient(135deg, ${ACCENT} 30%, ${GREEN})`, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=480&q=70", title: "Réparez votre console de jeux", sub: "Donnez une seconde vie à votre PS5", catId: "consoles", icon: "gamepad", dark: true },
  { bg: `linear-gradient(135deg, ${W} 30%, #FDE8CD)`, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=480&q=70", title: "Un problème dans votre cuisine ?", sub: "Réparez vos appareils à prix imbattables", catId: "electromenager", icon: "kitchen", dark: false },
];
function Hero({ onSearch, onNav, popularSearches = POPULAR_SEARCHES }) {
  const [q, setQ] = useState(""); const [show, setShow] = useState(false); const [noMatchMsg, setNoMatchMsg] = useState(false);
  const qNorm = (q || "").trim().toLowerCase();
  const sug = useMemo(() => qNorm.length > 1 ? ITEMS.filter(i => !PAGES_GENERALES.includes(i.category) && `${i.brand} ${i.name} ${i.productType}`.toLowerCase().includes(qNorm)).slice(0, 6) : [], [qNorm]);
  const exactMatch = useMemo(() => qNorm.length > 0 ? ITEMS.find(i => !PAGES_GENERALES.includes(i.category) && `${i.brand} ${i.name}`.toLowerCase() === qNorm) : null, [qNorm]);
  const banners = useMemo(() => HERO_BANNERS(W, ACCENT, GREEN), []);
  return <><div style={{ background: `linear-gradient(180deg, ${W} 0%, #F0EDE6 50%, #E8E6E0 100%)`, paddingBottom: 0 }}>
    <section style={{ padding: "40px 20px 32px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Logo s={56} priority /></div>
      <h1 className="hero-title" style={{ fontSize: 38, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, margin: "0 0 6px", letterSpacing: "-.03em", fontFamily: F }}>Réparer ou racheter<span style={{ color: ACCENT }}> ?</span></h1>
      <p style={{ fontSize: 14, color: "#4B5563", margin: "0 auto 28px", maxWidth: 380, fontWeight: 500, lineHeight: 1.5 }}>Comparez les coûts. Choisissez malin.</p>
      <div style={{ position: "relative", maxWidth: 460, margin: "0 auto" }}>
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
            <div style={{ textAlign: "left" }}><div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{item.brand} {item.name}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{item.productType} · {item.priceNew} €</div></div>
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
  const isMobile = useIsMobile();
  useEffect(() => {
    if (fallbackIssues.length > 0) {
      const first = fallbackIssues[0];
      setSelPannes(p => p.length === 0 ? [first.id ?? first.name] : p);
    }
  }, [catId, productType]);
  const togglePanne = (iss) => {
    const id = iss.id ?? iss.name;
    if (cumul) {
      setSelPannes(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    } else {
      setSelPannes(p => (p.includes(id) && p.length === 1) ? [] : [id]);
    }
  };

  const activeIssues = fallbackIssues.filter(iss => selPannes.includes(iss.id ?? iss.name));
  const refItem = sampleItem || items[0] || { id: 0, category: catId, productType, priceNew: avgPrice || 250, year: new Date().getFullYear() - 3, brand: "Référence", name: "Moyenne" };
  const repairEst = refItem && activeIssues.length ? getRepairEstimate(activeIssues, refItem) : null;
  const tMin = repairEst?.min ?? activeIssues.reduce((s, i) => s + (i.repairMin || 0), 0);
  const tMax = repairEst?.max ?? activeIssues.reduce((s, i) => s + (i.repairMax || 0), 0);
  const tPart = activeIssues.reduce((s, i) => s + (i.partPrice || 0), 0);
  const recon = refItem ? Math.round(refItem.priceNew * (OCC_CATS.includes(catId) ? .55 : .62)) : 0;
  const v = refItem && activeIssues.length ? getVerdict(activeIssues, refItem) : null;
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
    ? `${reparerBase} Pour la panne « ${panneNames} », le coût estimé est de ${tMin}–${tMax} € (soit ${Math.round((tMin + tMax) / 2 / (refItem?.priceNew || avgPrice || 1) * 100)} % du neuf). Un appareil récent (< 5 ans) avec cette panne mérite souvent la réparation.`
    : `${reparerBase} Prenez en compte l'âge de l'appareil, la garantie restante et la disponibilité des pièces.`;
  const remplacerPersonalized = activeIssues.length
    ? `${remplacerBase} Pour « ${panneNames} », si le coût dépasse ${Math.round((refItem?.priceNew || avgPrice) * .4)} € ou si l'appareil a plus de 10 ans, le remplacement est souvent plus logique.`
    : `${remplacerBase} Tenez compte de l'âge : au-delà de 10–12 ans, le remplacement est souvent plus logique.`;

  return (
    <div className="page-enter" style={{ fontFamily: F }}>
      <nav aria-label="Fil d'Ariane" style={{ padding: "12px 20px", maxWidth: 960, margin: "0 auto", fontSize: 12, color: "#6B7280", display: "flex", gap: 5, alignItems: "center" }}>
        <button type="button" onClick={() => onNav("home")} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>Accueil</button>
        <Chev />
        <button type="button" onClick={() => onNav("cat", catId)} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>{cat.name}</button>
        <Chev />
        <span>{productType}</span>
      </nav>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
          {PAGES_GENERALES.includes(catId) ? (
            <ProductTypeImg productType={productType} size={120} iconName={cat?.icon || "washer"} iconColor="#B45309" />
          ) : (
            <span style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #FEF3E2 0%, #FDE8CD 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="washer" s={24} color="#B45309" /></span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111", margin: 0, lineHeight: 1.2 }}>Réparer un {typeLower} ou le remplacer ?</h1>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Sélectionnez votre panne pour une recommandation personnalisée.</p>
          </div>
        </div>

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
            const neuf = refItem?.priceNew || avgPrice;
            const econRep = activeIssues.length ? neuf - tMax : null;
            const econRecon = neuf - recon;
            const econRepLabel = econRep !== null ? (econRep > 0 ? `Économisez jusqu'à ${econRep} €` : econRep < 0 ? `Surcoût ${Math.abs(econRep)} €` : "—") : "—";
            const econReconLabel = econRecon > 0 ? `Économisez ${econRecon} €` : "—";
            const diffLabel = activeIssues.length ? (activeIssues.some(i => i.diff === "difficile") ? "●●● Difficile" : activeIssues.some(i => i.diff === "moyen") ? "●● Moyen" : "● Facile") : "—";
            const priceRep = activeIssues.length ? `${tMin}–${tMax} €` : "Variable";
            const priceNeuf = neuf ? `${neuf} €` : "Variable";
            const bestChoiceBanner = v?.v === "reparer" && econRep > 0
              ? { label: "Réparer", econ: `Économisez jusqu'à ${econRep} €`, color: GREEN }
              : v?.v === "remplacer" && econRecon > 0
              ? { label: sl, econ: `Économisez ${econRecon} €`, color: AMBER }
              : null;
            if (isMobile) {
              return <>
                {neuf && <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 12 }}>Référence : {neuf} € neuf</div>}
                {bestChoiceBanner && (
                  <div style={{ background: bestChoiceBanner.color + "12", border: `1px solid ${bestChoiceBanner.color}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, color: bestChoiceBanner.color }}>✓</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Meilleur rapport : {bestChoiceBanner.label}</span>
                    <span style={{ fontSize: 12, color: bestChoiceBanner.color, fontWeight: 600 }}>{bestChoiceBanner.econ}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: v?.v === "reparer" ? GREEN + "08" : "#F8FAFC", borderRadius: 12, padding: 14, border: v?.v === "reparer" ? `2px solid ${GREEN}` : "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: GREEN + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="tool" s={16} color={GREEN} /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Réparer</span>
                      {v?.v === "reparer" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: GREEN, color: "#fff" }}>Recommandé</span>}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 4 }}>{priceRep}</div>
                    <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>{econRepLabel}</div>
                    {activeIssues.length > 0 && <>
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>Pièce seule : {tPart} €</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>Temps DIY : {timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis"}</div>
                    </>}
                    <div style={{ fontSize: 11, color: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : "#6B7280" }}>Difficulté : {diffLabel}</div>
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
              { l: "Prix", r: priceRep, o: `~${recon} €`, n: priceNeuf, bold: true },
              { l: "Économie vs neuf", r: econRepLabel, o: econReconLabel, n: "Référence", hR: econRep > 0 ? GREEN : null, hO: econRecon > 0 ? AMBER : null },
              { l: "Pièce seule", r: activeIssues.length ? `${tPart} €` : "—", o: "—", n: "—" },
              { l: "Temps (DIY)", r: activeIssues.length ? (timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis") : "—", o: "—", n: "—" },
              { l: "Difficulté", r: diffLabel, o: "—", n: "—", hR: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : null },
              { l: "Garantie", r: "Variable", o: "12–24 mois", n: "24 mois" },
            ];
            return <>
              {neuf && <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>Référence : {neuf} € neuf</div>}
              {bestChoiceBanner && (
                <div style={{ background: bestChoiceBanner.color + "12", border: `1px solid ${bestChoiceBanner.color}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: bestChoiceBanner.color }}>✓</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Meilleur rapport : {bestChoiceBanner.label}</span>
                  <span style={{ fontSize: 12, color: bestChoiceBanner.color, fontWeight: 600 }}>{bestChoiceBanner.econ}</span>
                </div>
              )}
              <div className="table-compare-scroll" style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DDD5", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr style={{ background: W }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#9CA3AF", fontSize: 11, width: "28%" }}></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: GREEN, fontSize: 12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="tool" s={14} color={GREEN} /> Réparer</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: AMBER, fontSize: 12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="recycle" s={14} color={AMBER} /> {sl}</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#DC2626", fontSize: 12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="cart" s={14} color="#DC2626" /> Neuf</span></th>
                  </tr></thead>
                  <tbody>
                    {tableRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "9px 14px", fontWeight: 600, color: "#374151", fontSize: 12 }}>{row.l}</td>
                        <td style={{ padding: "9px 14px", textAlign: "center", color: row.hR || "#6B7280", fontWeight: row.bold || row.hR ? 700 : 400, background: v?.v === "reparer" ? GREEN + "06" : "transparent" }}>{row.r}</td>
                        <td style={{ padding: "9px 14px", textAlign: "center", color: row.hO || "#6B7280", fontWeight: row.bold || row.hO ? 700 : 400, background: v?.v === "remplacer" ? AMBER + "06" : "transparent" }}>{row.o}</td>
                        <td style={{ padding: "9px 14px", textAlign: "center", color: row.hN || "#6B7280", fontWeight: row.bold || row.hN ? 700 : 400, background: v?.v === "remplacer" ? "#DC262606" : "transparent" }}>{row.n}</td>
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
              { key: "reparer", color: GREEN, label: "Réparer", price: activeIssues.length ? `${tMin}–${tMax} €` : "Variable", sub: "pièces + tutoriels", icon: "tool", top: v?.v === "reparer", action: () => onNav("repair", { catId, productType }) },
              { key: "occ", color: AMBER, label: sl, price: `~${recon} €`, sub: "garanti 12–24 mois", icon: "recycle", top: v?.v === "remplacer", action: () => onNav("models-list", { catId, productType, affType: "occ" }) },
              { key: "neuf", color: "#DC2626", label: "Neuf", price: avgPrice ? `~${avgPrice} €` : "Variable", sub: "Amazon, Leroy Merlin, Darty…", icon: "cart", top: v?.v === "remplacer", action: () => onNav("models-list", { catId, productType, affType: "neuf" }) },
            ].map(o => (
              <div key={o.key} onClick={o.action} className="card-hover" style={{
                background: "#fff", border: o.top ? `2px solid ${o.color}` : "1px solid #E5E3DE",
                borderRadius: 12, padding: 16, cursor: "pointer", textAlign: "center",
                boxShadow: o.top ? `0 3px 14px ${o.color}18` : "0 1px 4px rgba(0,0,0,.05)",
              }}>
                {o.top && <div style={{ fontSize: 8, fontWeight: 700, color: o.color, marginBottom: 4 }}>RECOMMANDÉ</div>}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: o.color + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><Icon name={o.icon} s={22} color={o.color} /></div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{o.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: o.color }}>{o.price}</div>
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
                const partBase = iss.partPrice || 30;
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
              <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(45,106,79,.08)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  {(() => {
                    const idx = getRepairabilityIndex(productType);
                    if (idx != null) {
                      const hue = Math.round((idx / 10) * 120);
                      const color = `hsl(${hue}, 55%, 42%)`;
                      return (
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: color + "18", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{idx}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color, opacity: 0.9 }}>/10</span>
                        </div>
                      );
                    }
                    return <div style={{ width: 64, height: 64, borderRadius: 16, background: GREEN + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="tool" s={28} color={GREEN} /></div>;
                  })()}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#2D6A4F", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Indice de réparabilité</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                      Note obligatoire sur 10 affichée sur les appareils. Plus elle est élevée, plus l'appareil est conçu pour être réparable. Consultez la fiche produit pour la note de votre modèle.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {isQualiReparEligible(catId) && (
              <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(245,158,11,.06)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: AMBER + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textAlign: "center" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: AMBER, lineHeight: 1.2 }}>10–45 €</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Bonus QualiRépar</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                      Aide de l'État déduite automatiquement chez un réparateur labellisé. Si votre {typeLower} est éligible, la réduction s'applique sans démarche.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
            { q: `Combien coûte la réparation d'un ${typeLower} ?`, a: `Selon la panne, le coût varie de ${fallbackIssues.reduce((m,i) => Math.min(m,i.repairMin),999)}€ à ${fallbackIssues.reduce((m,i) => Math.max(m,i.repairMax),0)}€ (pièces + main d'œuvre). La panne la plus courante est "${fallbackIssues[0]?.name}" à environ ${fallbackIssues[0]?.repairMin}–${fallbackIssues[0]?.repairMax}€.` },
            { q: `Vaut-il mieux réparer ou remplacer un ${typeLower} ?`, a: `Cela dépend de la panne et de l'âge de l'appareil. Pour les réparations simples (coût < 30 % du neuf), la réparation est généralement plus rentable. Au-delà de 40% du prix neuf ou si l'appareil a plus de 10 ans, le remplacement peut être préférable.` },
            { q: `Peut-on réparer un ${typeLower} soi-même ?`, a: `Les réparations notées "Facile" sont accessibles avec un tutoriel vidéo YouTube. Les réparations "Difficile" ou nécessitant un pro sont à confier à un réparateur agréé. Pensez au bonus QualiRépar (10 à 45€).` },
            { q: `Où trouver les pièces détachées ?`, a: "Les pièces sont disponibles chez Amazon, But, Leroy Merlin et ManoMano. Comparez les prix et ajoutez vos références de pièces pour cette panne." },
          ].map((f, i) => (
            <details key={i} style={{ background: "#fff", borderRadius: 6, marginBottom: 4, border: "1px solid #E0DDD5" }}>
              <summary style={{ padding: "10px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#111" }}>{f.q}</summary>
              <p style={{ padding: "0 14px 10px", fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
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
                  <div style={{ fontSize: 18, fontWeight: 800, color: modeColor }}>{isNeuf ? `${item.priceNew} €` : `~${Math.round(item.priceNew * .55)} €`}</div>
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
  const typeLower = productType.toLowerCase();
  const retPcs = getRet(catId, "pcs");

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
          const partBase = iss.partPrice || 30;
          const partOff = [-0.05, 0, 0.08, 0.12];
          const retsWithPrice = retPcs.map((r, idx) => ({ r, price: Math.round(partBase * (1 + (partOff[idx] ?? 0))) }));
          const sortedRets = [...retsWithPrice].sort((a, b) => a.price - b.price);
          return (
            <div key={i} style={{ background: "#fff", border: "1px solid #E5E3DE", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: "0 0 16px" }}>{iss.name}</h2>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6B7280", marginBottom: 16, flexWrap: "wrap" }}>
                <span><Icon name="money" s={14} color="#9CA3AF" /> Pièce : ~{partBase} €</span>
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
                  {sortedRets.map(({ r, price }, rank) => {
                    const isBest = rank === 0;
                    return (
                      <a key={r.n} href={buildRetailerUrlForParts(r, productType, iss.name)} target="_blank" rel="noopener noreferrer sponsored" className="card-hover" style={{
                        background: "#fff", border: isBest ? "2px solid #111" : "1px solid #E5E3DE", borderRadius: 12, padding: "16px 18px",
                        display: "flex", alignItems: "center", gap: 16, cursor: "pointer", boxShadow: isBest ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.05)",
                        textDecoration: "none", color: "inherit",
                      }}>
                        <RetailerLogo r={r} size={48} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{r.n}</span>
                            {isBest && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#111", color: "#fff", flexShrink: 0 }}>Meilleur prix</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{r.t}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 20, color: "#111" }}>{price} €</div>
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
              <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(45,106,79,.08)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  {(() => {
                    const idx = getRepairabilityIndex(productType);
                    if (idx != null) {
                      const hue = Math.round((idx / 10) * 120);
                      const color = `hsl(${hue}, 55%, 42%)`;
                      return (
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: color + "18", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{idx}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color, opacity: 0.9 }}>/10</span>
                        </div>
                      );
                    }
                    return <div style={{ width: 64, height: 64, borderRadius: 16, background: GREEN + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="tool" s={28} color={GREEN} /></div>;
                  })()}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#2D6A4F", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Indice de réparabilité</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                      Note obligatoire sur 10 affichée sur les appareils. Plus elle est élevée, plus l'appareil est conçu pour être réparable. Consultez la fiche produit pour la note de votre modèle.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {isQualiReparEligible(catId) && (
              <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(245,158,11,.06)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: AMBER + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textAlign: "center" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: AMBER, lineHeight: 1.2 }}>10–45 €</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Bonus QualiRépar</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                      Aide de l'État déduite automatiquement chez un réparateur labellisé. Si votre {typeLower} est éligible, la réduction s'applique sans démarche.
                    </p>
                  </div>
                </div>
              </div>
            )}
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

  return <div className="page-enter" style={{ fontFamily: F }}>
    <nav aria-label="Fil d'Ariane" style={{ padding: "12px 20px", maxWidth: 860, margin: "0 auto", fontSize: 12, color: "#6B7280", display: "flex", gap: 5, alignItems: "center" }}>
      <button type="button" onClick={() => onNav("home")} style={{ cursor: "pointer", color: "#111", fontWeight: 500, background: "none", border: "none", padding: 0, font: "inherit" }}>Accueil</button><Chev /><span>{cat.name}</span>
      {selBrand && <><Chev /><span>{selBrand}</span></>}
      {selType && <><Chev /><span>{selType}</span></>}
    </nav>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 12, background: ACCENT + "10", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={cat.icon} s={18} color={ACCENT} />
            </span>
            {cat.name}
          </h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>{filtered.length} produit{filtered.length > 1 ? "s" : ""}{hasFilters ? " (filtré)" : ""}</p>
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #E0DDD5", fontSize: 12, fontFamily: F, color: "#374151", background: "#fff", cursor: "pointer" }}>
          <option value="pop">Popularité</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="year">Plus récent</option>
        </select>
      </div>

      {/* Filter bar — uniquement pour pages précises (tech) */}
      {isBrandFirst && (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DDD5", padding: "14px 16px", marginBottom: 18, transition: "all .25s ease", boxShadow: "0 1px 3px rgba(0,0,0,.03)" }}>
        {types.length > 1 && <div style={{ marginBottom: brands.length > 1 ? 12 : 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Type de produit</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Pill active={!selType} onClick={() => onNav("cat", catId)}>Tous</Pill>
            {types.map(t => { const c = typesFiltered.filter(i => i.productType === t).length; return c > 0 && <Pill key={t} active={selType === t} onClick={() => onNav("cat-type", { catId, productType: t })}>{t} ({c})</Pill>; })}
          </div>
        </div>}
        {brands.length > 1 && <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Marque</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Pill active={!selBrand} onClick={() => onNav(selType ? "cat-type" : "cat", selType ? { catId, productType: selType } : catId)}>Toutes</Pill>
            {brands.slice(0, 12).map(b => <Pill key={b.name} active={selBrand === b.name} onClick={() => onNav("cat-brand", { catId, productType: selType, brand: b.name })}>{b.name} ({b.count})</Pill>)}
            {brands.length > 12 && !selBrand && <span style={{ fontSize: 11, color: "#9CA3AF", alignSelf: "center" }}>+{brands.length - 12} marques</span>}
          </div>
        </div>}
        {hasFilters && <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #F3F4F6" }}>
          <button onClick={() => onNav("cat", catId)} style={{ fontSize: 12, color: ACCENT, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: F, padding: 0 }}>✕ Réinitialiser les filtres</button>
        </div>}
      </div>
      )}

      {/* Brand grid — shown when NO brand is selected on brand-first categories */}
      {isBrandFirst && !selBrand && !selType && brands.length > 3 && <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 10 }}>Choisir une marque</div>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {brands.slice(0, 8).map(b => {
            const sample = items.filter(i => i.brand === b.name)[0];
            return <div key={b.name} onClick={() => onNav("cat-brand", { catId, productType: null, brand: b.name })} style={{ background: "#fff", border: "1px solid #E0DDD5", borderRadius: 8, padding: "16px 12px", cursor: "pointer", textAlign: "center", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.transform = "none"; }}>
              <ProductImg brand={b.name} item={sample} size={48} />
              <div style={{ fontWeight: 700, fontSize: 13, color: "#111", marginTop: 6 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{b.count} produit{b.count > 1 ? "s" : ""}</div>
            </div>;
          })}
        </div>
      </div>}

      {/* Type grid — shown when NO type is selected on type-first categories */}
      {!isBrandFirst && !selType && types.length > 1 && !selBrand && <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 10 }}>Choisir un type d'appareil</div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {types.map(t => {
            const c = items.filter(i => i.productType === t).length;
            if (c === 0) return null;
            return <div key={t} onClick={() => onNav("cat-type", { catId, productType: t })} style={{ background: "#fff", border: "1px solid #E0DDD5", borderRadius: 8, padding: "16px 14px", cursor: "pointer", transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.transform = "none"; }}>
              {PAGES_GENERALES.includes(catId) && (
                <div style={{ marginBottom: 10 }}>
                  <ProductTypeImg productType={t} size={80} iconName={cat?.icon || "washer"} iconColor="#B45309" />
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{t}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{c} produit{c > 1 ? "s" : ""}</div>
            </div>;
          })}
        </div>
      </div>}

      {/* Products list — shown when a filter is active, or always on small categories */}
      {(hasFilters || items.length <= 15 || (isBrandFirst && brands.length <= 3) || (!isBrandFirst && types.length <= 1)) && <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 10 }}>
          {selBrand && selType ? `${selBrand} — ${selType}` : selBrand ? `Produits ${selBrand}` : selType ? selType : "Tous les produits"}
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {filtered.map(item => {
            const iss = getIssues(item);
            const v = getVerdict([iss[0]], item);
            return <Card key={item.id} onClick={() => onNav("compare", item.id)} style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ProductImg brand={item.brand} item={item} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.brand} {item.name}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{item.productType} · {item.year}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{item.priceNew} € neuf · {iss[0].name} : {iss[0].repairMin}–{iss[0].repairMax} €</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                <Badge color={v.color}>{v.pertinence || v.label}</Badge>
                <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>Comparer →</span>
              </div>
            </Card>;
          })}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: 30, color: "#9CA3AF", fontSize: 13 }}>Aucun produit ne correspond à ces filtres.</p>}
      </div>}
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
  const cat = item ? CATS.find(c => c.id === item.category) : null;
  const sl = item ? shLabel(item.category) : "Reconditionné";

  useEffect(() => {
    const iss = item ? getIssues(item) : [];
    setSelIssue(initialIssueId ?? iss[0]?.id);
    setCumul(false); setSelMulti([]); setPlace(""); setReviews([]); setReviewText("");
  }, [itemId, initialIssueId]);

  if (!item) return <div style={{ padding: 80, textAlign: "center", fontFamily: F }}>Produit non trouvé</div>;

  const activeIssues = cumul ? issues.filter(i => selMulti.includes(i.id)) : [issues.find(i => i.id === selIssue)].filter(Boolean);
  const repairEst = activeIssues.length ? getRepairEstimate(activeIssues, item) : null;
  const tMin = repairEst?.min ?? activeIssues.reduce((s, i) => s + i.repairMin, 0);
  const tMax = repairEst?.max ?? activeIssues.reduce((s, i) => s + i.repairMax, 0);
  const tPart = activeIssues.reduce((s, i) => s + i.partPrice, 0);
  const recon = activeIssues[0]?.reconPrice || Math.round(item.priceNew * .6);
  const v = activeIssues.length ? getVerdict(activeIssues, item) : null;
  const timeInfo = getCumulTimeInfo(activeIssues);
  const alts = item ? getAlternatives(item) : null;
  const bestNewer = alts?.newer?.[0] || null;

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
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0 }}>{item.brand} {item.name}</h1>
            <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>{item.productType} · {item.year} · {item.priceNew} € neuf</p>
          </div>
        </div>
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
        </div>
      </div>

      {v && activeIssues.length > 0 && <>
        {/* Layout 2 colonnes : contenu principal | sidebar sticky (3 options + infos clés) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }} className="grid-2">
          <div style={{ minWidth: 0 }}>
        {/* VERDICT — très mis en valeur, c'est la réponse ! */}
        <div style={{ background: `linear-gradient(135deg, #fff 0%, ${v.color}08 100%)`, border: `3px solid ${v.color}`, borderRadius: 16, padding: "24px 24px", marginBottom: 20, boxShadow: `0 8px 32px ${v.color}25`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: v.color + "12", borderRadius: "0 0 0 100%", opacity: .6 }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12, position: "relative" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: v.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={v.icon} s={28} color={v.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: v.color, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Notre recommandation</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>{v.label}</h2>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 8, background: v.color + "18", color: v.color, fontSize: 13, fontWeight: 800 }}>{v.pertinence}</div>
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0, position: "relative" }}>{v.why}</p>
        </div>

        {/* 3 options — mobile only (sidebar visible sur desktop) */}
        <div className="show-mobile" style={{ flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {(() => {
            const repairFeas = v.repairFeasibility || "facile";
            const repairSub = repairFeas === "peu_realiste" ? "Pro recommandé" : repairFeas === "technique" ? "Technique" : "pièces + main d'œuvre";
            const repairBtn = repairFeas === "peu_realiste" ? "Alternative" : repairFeas === "technique" ? "Réparation →" : "Réparer →";
            const repairTop = v.v === "reparer" && repairFeas === "facile";
            return <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                { top: repairTop, color: GREEN, label: "Réparer", price: `${tMin}–${tMax} €`, sub: repairSub, btn: repairBtn, aff: "pcs" },
                { top: v.v === "remplacer" && TECH_CATS.includes(item.category), color: AMBER, label: sl, price: `~${recon} €`, sub: TECH_CATS.includes(item.category) ? "Très en vogue (tech)" : "garanti 12 mois", btn: `Voir ${sl.toLowerCase()} →`, aff: "occ" },
                { top: v.v === "remplacer" && !TECH_CATS.includes(item.category), color: "#DC2626", label: "Neuf", price: `${item.priceNew} €`, sub: !TECH_CATS.includes(item.category) ? "Référence (électroménager)" : "meilleur prix", btn: "Comparer neuf →", aff: "neuf" },
              ].map((o, idx) => <div key={idx} onClick={() => onNav("aff", { item, issues: activeIssues, affType: o.aff, alts })} className="card-hover" style={{
                background: "#fff", border: o.top ? `2px solid ${o.color}` : "1px solid #E5E3DE",
                borderRadius: 12, padding: 14, cursor: "pointer", textAlign: "center",
                boxShadow: o.top ? `0 3px 14px ${o.color}18` : "0 1px 4px rgba(0,0,0,.05)",
              }}>
                {o.top && <div style={{ fontSize: 8, fontWeight: 700, color: o.color, marginBottom: 4 }}>RECOMMANDÉ</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{o.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: o.color }}>{o.price}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{o.sub}</div>
                <button style={{ width: "100%", padding: 6, borderRadius: 6, border: "none", background: o.top ? o.color : "#F3F4F6", color: o.top ? "#fff" : "#374151", fontWeight: 700, fontSize: 10, cursor: "pointer", fontFamily: F, marginTop: 6 }}>{o.btn}</button>
              </div>)}
            </div>;
          })()}
        </div>

        {/* Réparer / Remplacer / DIY — détaillé, personnalisé par produit (maison + tech) */}
        <details style={{ marginBottom: 16, background: "#FAFBFC", borderRadius: 10, border: "1px solid #E8E6E1", overflow: "hidden" }}>
          <summary style={{ padding: "12px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#374151", listStyle: "none" }}>Quand réparer, remplacer ou faire soi-même ?</summary>
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
                  : `Non, pas de façon réaliste. Sans outillage et compétences pro, vous risquez d'endommager définitivement votre ${item.brand} ${item.name}. Ne tentez pas le DIY : privilégiez un réparateur agréé ou le remplacement (${sl.toLowerCase()} / neuf).`}
              </p>
            </div>
          </>;
            })()}
          </div>
        </details>

        {/* REPAIRER FINDER (Google Maps) — toujours visible */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DDD5", padding: "18px 20px", marginBottom: 18, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
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

        {/* Tableau comparatif — simplifié, mobile-first */}
        <details open style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", overflow: "hidden", marginBottom: 20 }}>
          <summary style={{ padding: "12px 16px", cursor: "pointer", fontWeight: 700, fontSize: 15, color: "#111", display: "flex", alignItems: "center", gap: 8, listStyle: "none" }}>
            <Icon name="chart" s={16} color={ACCENT} /> Comparer les 3 options
          </summary>
          <div style={{ padding: "0 16px 16px" }}>
          {(() => {
            const neuf = item.priceNew;
            const econRep = neuf - tMax;
            const econRecon = neuf - recon;
            const econRepLabel = econRep > 0 ? `Économisez jusqu'à ${econRep} €` : econRep < 0 ? `Surcoût ${Math.abs(econRep)} €` : "—";
            const econReconLabel = econRecon > 0 ? `Économisez ${econRecon} €` : "—";
            const diffLabel = activeIssues.some(i => i.diff === "difficile") ? "●●● Difficile" : activeIssues.some(i => i.diff === "moyen") ? "●● Moyen" : "● Facile";
            const bestChoiceBanner = v.v === "reparer" && econRep > 0
              ? { label: "Réparer", econ: `Économisez jusqu'à ${econRep} €`, color: GREEN }
              : v.v === "remplacer" && econRecon > 0
              ? { label: sl, econ: `Économisez ${econRecon} €`, color: AMBER }
              : null;
            if (isMobile) {
              return <>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 12 }}>Référence : {neuf} € neuf</div>
                {bestChoiceBanner && (
                  <div style={{ background: bestChoiceBanner.color + "12", border: `1px solid ${bestChoiceBanner.color}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, color: bestChoiceBanner.color }}>✓</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Meilleur rapport : {bestChoiceBanner.label}</span>
                    <span style={{ fontSize: 12, color: bestChoiceBanner.color, fontWeight: 600 }}>{bestChoiceBanner.econ}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: v.v === "reparer" ? GREEN + "08" : "#F8FAFC", borderRadius: 12, padding: 14, border: v.v === "reparer" ? `2px solid ${GREEN}` : "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: GREEN + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="tool" s={16} color={GREEN} /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Réparer</span>
                      {v.v === "reparer" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: GREEN, color: "#fff" }}>Recommandé</span>}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 4 }}>{tMin}–{tMax} €</div>
                    <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>{econRepLabel}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>Pièce seule : {tPart} €</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Temps DIY : {timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis"}</div>
                    <div style={{ fontSize: 11, color: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : "#6B7280" }}>Difficulté : {diffLabel}</div>
                  </div>
                  <div style={{ background: v.v === "remplacer" ? AMBER + "08" : "#F8FAFC", borderRadius: 12, padding: 14, border: v.v === "remplacer" ? `2px solid ${AMBER}` : "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: AMBER + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="recycle" s={16} color={AMBER} /></span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{sl}</span>
                      {v.v === "remplacer" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: AMBER, color: "#fff" }}>Recommandé</span>}
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
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 4 }}>{neuf} €</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>Prix de base</div>
                  </div>
                </div>
              </>;
            }
            const tableRows = [
              { l: "Prix", r: `${tMin}–${tMax} €`, o: `~${recon} €`, n: `${neuf} €`, bold: true },
              { l: "Économie vs neuf", r: econRepLabel, o: econReconLabel, n: "Référence", hR: econRep > 0 ? GREEN : null, hO: econRecon > 0 ? AMBER : null },
              { l: "Pièce seule", r: `${tPart} €`, o: "—", n: "—" },
              { l: "Temps (DIY)", r: timeInfo.diyFeasible ? timeInfo.diyLabel : "Pro requis", o: "—", n: "—" },
              { l: "Difficulté", r: diffLabel, o: "—", n: "—", hR: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : null },
              { l: "Garantie", r: "Variable", o: "12–24 mois", n: "24 mois" },
            ];
            return <>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>Référence : {neuf} € neuf</div>
              {bestChoiceBanner && (
                <div style={{ background: bestChoiceBanner.color + "12", border: `1px solid ${bestChoiceBanner.color}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: bestChoiceBanner.color }}>✓</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Meilleur rapport : {bestChoiceBanner.label}</span>
                  <span style={{ fontSize: 12, color: bestChoiceBanner.color, fontWeight: 600 }}>{bestChoiceBanner.econ}</span>
                </div>
              )}
              <div className="table-compare-scroll" style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DDD5", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr style={{ background: W }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#9CA3AF", fontSize: 11, width: "28%" }}></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: GREEN, fontSize: 12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="tool" s={14} color={GREEN} /> Réparer</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: AMBER, fontSize: 12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="recycle" s={14} color={AMBER} /> {sl}</span></th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#DC2626", fontSize: 12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="cart" s={14} color="#DC2626" /> Neuf</span></th>
                  </tr></thead>
                  <tbody>
                    {tableRows.map((row, i) => <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "9px 14px", fontWeight: 600, color: "#374151", fontSize: 12 }}>{row.l}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", color: row.hR || "#6B7280", fontWeight: row.bold || row.hR ? 700 : 400, background: v.v === "reparer" ? GREEN + "06" : "transparent" }}>{row.r}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", color: row.hO || "#6B7280", fontWeight: row.bold || row.hO ? 700 : 400, background: v.v === "remplacer" ? AMBER + "06" : "transparent" }}>{row.o}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", color: row.hN || "#6B7280", fontWeight: row.bold || row.hN ? 700 : 400, background: v.v === "remplacer" ? "#DC262606" : "transparent" }}>{row.n}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </>;
          })()}
          </div>
        </details>

        {/* Smart alternatives section — repliable */}
        {alts && (alts.newer.length > 0 || alts.equiv.length > 0) && <details style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", marginBottom: 20, overflow: "hidden" }}>
          <summary style={{ padding: "14px 18px", cursor: "pointer", fontWeight: 700, fontSize: 15, color: "#111", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
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
              <div style={{ fontSize: 11, color: AMBER, fontWeight: 600 }}>~{recon} € {sl.toLowerCase()}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.priceNew} € neuf</div>
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
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{n.neufPrice} € neuf</div>
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
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{e.neufPrice} € neuf</div>
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

        {/* REPAIR DETAIL section — repliable, inspiré maison : étapes personnalisées, difficulté mise en avant */}
        <details style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", marginBottom: 18, overflow: "hidden" }}>
          <summary style={{ padding: "14px 18px", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#111", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
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
            Pour la panne « {activeIssues.map(i => i.name).join(", ")} » sur votre {item.brand} {item.name} : tutoriel adapté à votre modèle, niveau de difficulté et coût estimé.
            {v.v === "reparer" ? " La réparation est l'option la plus économique et écologique dans votre cas." : ""}
          </p>
          {activeIssues.map(iss => {
            const diffColor = iss.diff === "facile" ? GREEN : iss.diff === "moyen" ? AMBER : "#DC2626";
            const diffStars = iss.diff === "facile" ? 1 : iss.diff === "moyen" ? 2 : 3;
            const diffLabel = iss.diff === "facile" ? "Facile" : iss.diff === "moyen" ? "Moyen" : "Difficile";
            const timeLabel = formatSingleTime(iss.time);
            const impossibleSeul = iss.time === "pro";
            const tutoSteps = getTutorialSteps(item.productType);
            return <div key={iss.id} style={{ padding: "14px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{iss.name}</span>
                <span style={{ display: "inline-flex", gap: 3, alignItems: "center", padding: "4px 10px", borderRadius: 8, background: diffColor + "18", color: diffColor, fontWeight: 700 }}>
                  {[1,2,3].map(s => <span key={s} style={{ width: 10, height: 10, borderRadius: 2, background: s <= diffStars ? diffColor : "#E5E7EB", display: "inline-block" }} />)}
                  <span style={{ fontSize: 12, marginLeft: 4 }}>{diffLabel}</span>
                  {impossibleSeul && (
                    <span style={{ marginLeft: 8, display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 6, background: "#DC262618", color: "#DC2626", fontWeight: 700, fontSize: 11 }}>
                      <Icon name="warn" s={12} color="#DC2626" /> Impossible seul — pro requis
                    </span>
                  )}
                </span>
              </div>
              {/* Étapes principales — tutoriel personnalisé par type de produit */}
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, marginBottom: 12, borderLeft: `4px solid ${GREEN}` }}>
                <p style={{ fontSize: 13, color: "#374151", margin: "0 0 8px", fontWeight: 700 }}>Étapes principales :</p>
                <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{tutoSteps.map((s, si) => <li key={si}>{s}</li>)}</ol>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6B7280", marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="money" s={14} color="#9CA3AF" /> <strong>{iss.repairMin}–{iss.repairMax} €</strong> tout compris</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="tool" s={14} color="#9CA3AF" /> Pièce : <strong>{iss.partPrice} €</strong></span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="clock" s={14} color="#9CA3AF" /> Durée : <strong>{timeLabel}</strong></span>
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
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(iss.ytQuery)}`} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 14px", borderRadius: 8, background: "#FF0000", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="play" s={14} color="#fff" /> Tutoriel YouTube
                </a>
                <button onClick={() => onNav("aff", { item, issues: [iss], affType: "pcs", alts })} style={{ padding: "8px 14px", borderRadius: 8, background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="cart" s={14} color="#fff" /> Acheter la pièce
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
            { q: `Combien coûte la réparation d'un ${item.brand} ${item.name} ?`, a: `Selon la panne, le coût de réparation d'un ${item.brand} ${item.name} varie de ${issues.reduce((m,i) => Math.min(m,i.repairMin),999)}€ à ${issues.reduce((m,i) => Math.max(m,i.repairMax),0)}€ (pièces + main d'œuvre). La panne la plus courante est "${issues[0]?.name}" à environ ${issues[0]?.repairMin}–${issues[0]?.repairMax}€.` },
            { q: `Vaut-il mieux réparer ou racheter un ${item.brand} ${item.name} ?`, a: `Cela dépend de la panne. Pour les réparations simples (${issues.filter(i=>i.diff==="facile").map(i=>i.name).join(", ") || "batterie, pièces d'usure"}), la réparation est généralement plus rentable. Au-delà de 40% du prix neuf (${Math.round(item.priceNew*.4)}€), un modèle ${sl.toLowerCase()} peut être plus avantageux.` },
            { q: `Peut-on réparer un ${item.brand} ${item.name} soi-même ?`, a: `Les réparations notées "Facile" (${issues.filter(i=>i.diff==="facile").map(i=>i.name).join(", ") || "certaines pièces"}) sont accessibles aux débutants avec un tutoriel vidéo YouTube. Les réparations "Difficile" nécessitent un professionnel.` },
            { q: `Où trouver les pièces détachées pour ${item.brand} ${item.name} ?`, a: OCC_CATS.includes(item.category) ? "Les pièces sont disponibles chez Spareka, Castorama, ManoMano et Amazon. Spareka propose aussi des guides de réparation adaptés." : "Les pièces sont disponibles chez Spareka, Amazon et les revendeurs spécialisés. Des tutoriels vidéo YouTube ciblés existent pour de nombreux modèles." },
            { q: `Le bonus QualiRépar s'applique-t-il au ${item.brand} ${item.name} ?`, a: `Oui ! Le bonus QualiRépar (10 à 45€) est applicable sur la réparation des ${item.productType.toLowerCase()}s chez un réparateur agréé. La réduction est automatique, aucune démarche nécessaire.` },
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
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{rel.priceNew} €</div>
              </Card>)}
          </div>
        </div>
        </div>

        {/* SIDEBAR — sticky : 3 options + infos clés */}
        <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 12 }} className="hide-mobile">
          {(() => {
            const repairFeas = v.repairFeasibility || "facile";
            const repairSub = repairFeas === "peu_realiste" ? "Intervention pro recommandée" : repairFeas === "technique" ? "À envisager si équipé" : "pièces + main d'œuvre";
            const repairBtn = repairFeas === "peu_realiste" ? "Alternative plus simple" : repairFeas === "technique" ? "Réparation technique →" : "Options réparation →";
            const repairTop = v.v === "reparer" && repairFeas === "facile";
            return <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { top: repairTop, color: GREEN, label: "Réparer", price: `${tMin}–${tMax} €`, sub: repairSub, btn: repairBtn, aff: "pcs" },
                  { top: v.v === "remplacer" && TECH_CATS.includes(item.category), color: AMBER, label: sl, price: `~${recon} €`, sub: TECH_CATS.includes(item.category) ? "Très en vogue (tech)" : "garanti 12 mois", btn: `Voir ${sl.toLowerCase()} →`, aff: "occ" },
                  { top: v.v === "remplacer" && !TECH_CATS.includes(item.category), color: "#DC2626", label: "Neuf", price: `${item.priceNew} €`, sub: !TECH_CATS.includes(item.category) ? "Référence (électroménager)" : "meilleur prix", btn: "Comparer prix neuf →", aff: "neuf" },
                ].map((o, idx) => <div key={idx} onClick={() => onNav("aff", { item, issues: activeIssues, affType: o.aff, alts })} className="card-hover" style={{
                  background: "#fff", border: o.top ? `2px solid ${o.color}` : "1px solid #E5E3DE",
                  borderRadius: 12, padding: 14, cursor: "pointer", position: "relative",
                  boxShadow: o.top ? `0 3px 14px ${o.color}18` : "0 1px 4px rgba(0,0,0,.05)",
                }}>
                  {o.top && <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", background: o.color, color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>RECOMMANDÉ</div>}
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: "2px 0 0" }}>{o.label}</h3>
                    <div style={{ fontSize: 18, fontWeight: 800, color: o.color }}>{o.price}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>{o.sub}</div>
                  </div>
                  <button style={{ width: "100%", padding: 8, borderRadius: 6, border: "none", background: o.top ? o.color : "#F3F4F6", color: o.top ? "#fff" : "#374151", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: F, marginTop: 8 }}>{o.btn}</button>
                </div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { icon: "money", label: "Économie vs neuf", value: v.v === "reparer" ? `${Math.max(0, item.priceNew - tMax)} €` : v.v === "remplacer" ? `${item.priceNew - recon} € (${sl})` : "—", color: v.v === "reparer" ? GREEN : v.v === "remplacer" ? AMBER : "#999" },
                  { icon: "tool", label: "Difficulté", value: activeIssues.some(i => i.diff === "difficile") ? "Difficile" : activeIssues.some(i => i.diff === "moyen") ? "Moyenne" : "Facile", color: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : activeIssues.some(i => i.diff === "moyen") ? AMBER : GREEN },
                  (() => {
                    const idx = isRepairabilityEligible(item.category) ? getRepairabilityIndex(item.productType) : null;
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
                <p style={{ padding: "8px 10px", fontSize: 10, color: "#6B7280", lineHeight: 1.5, margin: 0, borderTop: "1px solid #E0DDD5" }}>{repairEst?.explanation ?? "Estimation à partir du prix neuf, des ratios par type de panne et de la difficulté. Variation locale ±15–25 %."}</p>
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
  const m = String(merchant).toLowerCase();
  const all = [...RET.neuf, ...RET.occ];
  const match = all.find((r) => m.includes(r.n.toLowerCase()) || r.n.toLowerCase().includes(m));
  return match || { n: merchant, t: "", c: "#111", logoUrl: null };
}

// ─── AFFILIATE PAGE ───
function AffPage({ item, issues, affType, onNav, alts: passedAlts }) {
  const [place, setPlace] = useState("");
  const [supabaseOffers, setSupabaseOffers] = useState(null);
  const productImageUrl = useProductImage(item);
  const lightbox = useImageLightbox();
  const cat = CATS.find(c => c.id === item.category);
  const rets = getRet(item.category, affType);
  const sl = shLabel(item.category);
  const titles = { neuf: "Acheter neuf", occ: sl, pcs: "Pièces & réparation" };
  const alts = passedAlts || getAlternatives(item);
  // Coût réparation = pièces + main d'œuvre pro (pas seulement les pièces)
  const repairTotalMin = issues?.reduce((s, i) => s + i.repairMin, 0) ?? 0;
  const repairTotalMax = issues?.reduce((s, i) => s + i.repairMax, 0) ?? 0;
  const repairAvg = Math.round((repairTotalMin + repairTotalMax) / 2);
  const base = affType === "neuf" ? item.priceNew : affType === "occ" ? (issues?.[0]?.reconPrice || Math.round(item.priceNew * .6)) : (repairAvg || 30);
  const off = [0, -.04, .03, -.06, .05];
  // Tri du moins cher au plus cher (lisibilité)
  const retsWithPrice = rets.map((r, idx) => ({ r, price: Math.round(base * (1 + (off[idx] ?? 0))), idx }));
  const sortedRets = [...retsWithPrice].sort((a, b) => a.price - b.price);

  // Chargement offres Supabase pour page "Acheter neuf" (image produit via useProductImage)
  useEffect(() => {
    if (affType !== "neuf" || !item) return;
    let cancelled = false;
    getOffersForNeuf(getProductSlug(item)).then(({ data, error }) => {
      if (!cancelled) setSupabaseOffers(error ? [] : data ?? []);
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
    const refPrice = isNeuf ? item.priceNew : Math.round(item.priceNew * reconMult);
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
  const bestAlt = altList[0];
  const otherAlts = altList.slice(1).sort((a, b) => a.price - b.price); // du moins cher au plus cher
  const showAlts = !isPcs && altList.length > 0;
  const myPrice = isNeuf ? item.priceNew : Math.round(item.priceNew * reconMult);
  const modeColor = isNeuf ? "#DC2626" : AMBER;
  const modeLabel = isNeuf ? "neuf" : sl.toLowerCase();

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
                {isPcs ? `Coût total estimé (pièces + main d'œuvre pro) : ${repairTotalMin}–${repairTotalMax} €` : issues?.map(i => i.name).join(", ")}
              </p>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, maxWidth: 560 }}>
                Le {item.brand} {item.name} est un {item.productType.toLowerCase()} de {item.year}. Comparez les offres des prestataires ci-dessous.
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
              const partBase = iss.partPrice || 30;
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

      {/* 2. Prix — comparer les offres prestataires */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Icon name={isPcs ? "tool" : isNeuf ? "cart" : "recycle"} s={18} color={ACCENT} />
          {isPcs ? "Comparer les offres pièces & réparation" : isNeuf ? "Comparer les prix neuf" : `Comparer les offres ${sl.toLowerCase()}`}
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 14 }}>
          {isPcs
            ? `Comparez les prix pour réparer votre ${item.brand} ${item.name}. Cliquez sur une offre pour accéder directement au site partenaire.`
            : isNeuf
            ? `Les meilleures offres pour acheter ${item.brand} ${item.name} neuf. Livraison rapide, garantie fabricant.`
            : `Les meilleures offres ${sl.toLowerCase()} pour ${item.brand} ${item.name}. Garantie 12 à 24 mois, qualité vérifiée.`}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {isNeuf ? (() => {
            const offers = Array.isArray(supabaseOffers) ? supabaseOffers : [];
            const findOffer = (r) => offers.find((o) => {
              const m = (o.merchant ?? o.retailer ?? "").toLowerCase();
              return m && (m.includes(r.n.toLowerCase()) || r.n.toLowerCase().includes(m));
            });
            const merged = retsWithPrice.map(({ r, price: fallbackPrice }) => {
              const offer = findOffer(r);
              const price = offer?.price_amount != null ? Number(offer.price_amount) : fallbackPrice;
              const affUrl = offer?.url?.trim() || null;
              const url = affUrl || buildRetailerUrl(r, item, "neuf");
              return { r, offer, price, url };
            });
            const sorted = [...merged].sort((a, b) => a.price - b.price);
            const imgUrl = productImageUrl?.trim() || null;
            return sorted.map(({ r, offer, price, url }, rank) => {
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
                <a key={r.n} href={url} target="_blank" rel="noopener noreferrer sponsored" className="card-hover retailer-card-mobile" style={cardStyle}>
                  {/* Image produit Supabase — cliquable pour agrandir */}
                  <div
                    role="button"
                    tabIndex={0}
                    className="offer-product-img"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (imgUrl && lightbox) lightbox.openLightbox(imgUrl); }}
                    onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && imgUrl && lightbox) { e.preventDefault(); lightbox.openLightbox(imgUrl); } }}
                    style={{ width: 96, height: 96, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", cursor: imgUrl ? "zoom-in" : "default" }}
                  >
                    {imgUrl ? (
                      <img src={imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} loading="lazy" />
                    ) : (
                      <Icon name="cart" s={28} color="#9CA3AF" style={{ opacity: 0.6 }} />
                    )}
                  </div>
                  <div className="retailer-main" style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                    {offer?.image_url ? (
                      <img src={offer.image_url} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "contain", background: "#F3F4F6", flexShrink: 0 }} />
                    ) : (
                      <RetailerLogo r={r} size={56} className="retailer-logo" />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{r.n}</span>
                        {isBestPrice && price > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#111", color: "#fff", flexShrink: 0 }}>Meilleur prix</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.t}</div>
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
          })() : (
            sortedRets.map(({ r, price }, rank) => {
              const isBestPrice = rank === 0;
              const url = buildRetailerUrl(r, item, affType);
              return <a key={r.n} href={url} target="_blank" rel="noopener noreferrer sponsored" className="card-hover retailer-card-mobile" style={{
                background: "#fff",
                border: isBestPrice ? "2px solid #111" : "1px solid #E5E3DE",
                borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 18, cursor: "pointer", boxShadow: isBestPrice ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.05)", textDecoration: "none", color: "inherit",
              }}>
                <div className="retailer-main" style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                  <RetailerLogo r={r} size={56} className="retailer-logo" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{r.n}</span>
                      {isBestPrice && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#111", color: "#fff", flexShrink: 0 }}>Meilleur prix</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.t}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 20, color: "#111" }}>{price} €</div>
                  </div>
                </div>
                <div className="retailer-cta" style={{ padding: "12px 18px", borderRadius: 10, background: r.c || "#111", color: "#fff", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s", flexShrink: 0 }}>Voir l&apos;offre →</div>
              </a>;
            })
          )}
        </div>
      </div>

      {/* 3. Indice réparabilité & QualiRépar — après les prix */}
      {isPcs && (isRepairabilityEligible(item.category) || isQualiReparEligible(item.category)) && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          {isRepairabilityEligible(item.category) && (
            <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(45,106,79,.08)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                {(() => {
                  const idx = getRepairabilityIndex(item.productType);
                  if (idx != null) {
                    const hue = Math.round((idx / 10) * 120);
                    const color = `hsl(${hue}, 55%, 42%)`;
                    return (
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: color + "18", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{idx}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color, opacity: 0.9 }}>/10</span>
                      </div>
                    );
                  }
                  return <div style={{ width: 64, height: 64, borderRadius: 16, background: GREEN + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="tool" s={28} color={GREEN} /></div>;
                })()}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#2D6A4F", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Indice de réparabilité</div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                    Note obligatoire sur 10 affichée sur les appareils. Plus elle est élevée, plus l'appareil est conçu pour être réparable. Consultez la fiche produit pour la note de votre modèle.
                  </p>
                </div>
              </div>
            </div>
          )}
          {isQualiReparEligible(item.category) && (
            <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E3DE", boxShadow: "0 4px 20px rgba(245,158,11,.06)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: AMBER + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: AMBER, lineHeight: 1.2 }}>10–45 €</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Bonus QualiRépar</div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                    Aide de l'État déduite automatiquement chez un réparateur labellisé. Si votre {item.productType.toLowerCase()} est éligible, la réduction s'applique sans démarche.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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

        {/* BEST ALTERNATIVE — clic = page achat même mode, secondaire = comparatif */}
        {bestAlt && <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginTop: 10, marginBottom: 6 }}>Alternative recommandée</div>}
        {bestAlt && (() => {
          const altIssues = getIssues(bestAlt.item);
          const altAlts = getAlternatives(bestAlt.item);
          return <div onClick={() => onNav("aff", { item: bestAlt.item, issues: altIssues, affType, alts: altAlts })} className="card-hover alt-card-mobile" style={{
            background: isTech && bestAlt.type === "newer"
              ? `linear-gradient(90deg, ${GREEN}10, ${GREEN}05, #fff)`
              : GREEN + "06",
            border: `1.5px solid ${GREEN}40`, borderRadius: 12, padding: "12px 14px",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
          }}>
            <ProductImg brand={bestAlt.item.brand} item={bestAlt.item} size={48} />
            <div className="alt-main" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{bestAlt.item.brand} {bestAlt.item.name}</span>
                {bestAlt.badge && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 3, background: GREEN, color: "#fff" }}>{bestAlt.badge}</span>}
                {bestAlt.priceDiff !== 0 && bestAlt.priceDiff < 0 && <span style={{ fontSize: 11, fontWeight: 600, color: GREEN }}>{bestAlt.priceDiff} €</span>}
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{bestAlt.item.productType} · {bestAlt.item.year}</div>
              <div style={{ fontSize: 11, color: GREEN, fontWeight: 500, marginTop: 2 }}>{bestAlt.displayReason}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              <div className="alt-price" style={{ fontSize: 17, fontWeight: 800, color: modeColor }}>{bestAlt.price} €</div>
              <button type="button" onClick={e => { e.stopPropagation(); onNav("compare", bestAlt.item.id); }} className="hide-mobile" style={{ background: "none", border: "none", padding: 0, fontSize: 10, color: "#9CA3AF", cursor: "pointer", fontFamily: F, textDecoration: "underline" }}>Comparatif</button>
            </div>
            <Chev />
          </div>;
        })()}

        {/* OTHER ALTERNATIVES — clic = page achat même mode */}
        {otherAlts.length > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginTop: 10, marginBottom: 6 }}>Autres options</div>}
        {otherAlts.map(alt => {
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
              <div className="alt-price" style={{ fontSize: 15, fontWeight: 700, color: modeColor }}>{alt.price} €</div>
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

// ─── FAQ ───
function FaqPage({ onNav }) {
  const faqs = [
    { q: "Comment fonctionne Compare. ?", a: "Compare. compare automatiquement le coût de réparation, de l'occasion/reconditionné et du neuf pour vous aider à prendre la meilleure décision." },
    { q: "Les prix affichés sont-ils fiables ?", a: "Ce sont des estimations basées sur les tarifs moyens en France. Les prix réels peuvent varier selon le prestataire et votre localisation. Ils incluent pièces et main d'œuvre pour la réparation." },
    { q: "C'est quoi le bonus QualiRépar ?", a: "C'est une aide de l'État de 10 à 45 € déduite directement chez un réparateur labellisé QualiRépar. Aucune démarche, la réduction est appliquée automatiquement." },
    { q: "Compare. est-il gratuit ?", a: "Oui, 100% gratuit. Nous sommes rémunérés par des commissions d'affiliation lorsque vous achetez via nos liens, sans aucun surcoût pour vous." },
    { q: "Puis-je cumuler plusieurs pannes ?", a: "Oui ! Sur chaque page produit, cliquez sur « Plusieurs problèmes ? » pour activer le mode cumul et voir le coût total de toutes vos réparations." },
    { q: "Comment sont calculées les estimations de réparation ?", a: "Nous nous appuyons sur les tarifs moyens des pièces détachées et de la main d'œuvre en France, ainsi que sur les tutoriels vidéo et les retours de réparateurs. Les fourchettes indiquent un ordre de grandeur réaliste." },
    { q: "Puis-je suggérer un produit à ajouter ?", a: "Oui ! Utilisez la page Contact pour nous envoyer votre suggestion. Nous examinons chaque demande et ajoutons les appareils les plus demandés." },
    { q: "Les liens d'achat sont-ils sécurisés ?", a: "Oui. Nous redirigeons vers des marchands reconnus (Amazon, Back Market, Fnac, etc.). Vous achetez directement chez eux, nous ne stockons aucune donnée de paiement." },
    { q: "Compare. compare-t-il les vrais prix en temps réel ?", a: "Les prix neuf et reconditionné sont indicatifs (basés sur les tarifs habituels). Pour les prix exacts, cliquez sur les liens pour voir les offres actuelles sur chaque site partenaire." },
    { q: "Comment proposer un produit manquant ?", a: "Rendez-vous sur la page Contact pour nous envoyer votre suggestion. Nous intégrons les appareils les plus demandés." },
  ];
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 660, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>FAQ</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Questions fréquentes</h1></div>
    {faqs.map((f, i) => <details key={i} style={{ background: "#FAFAFA", borderRadius: 10, marginBottom: 5, border: "1px solid #E5E7EB" }}>
      <summary style={{ padding: "12px 16px", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#111" }}>{f.q}</summary>
      <p style={{ padding: "0 16px 12px", fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{f.a}</p>
    </details>)}
    <div style={{ marginTop: 28, padding: 18, background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E3A5F", marginBottom: 4 }}>Service client</h3>
      <p style={{ fontSize: 13, color: "#3B6998" }}>Une question ? <a href="mailto:compare.webfr@gmail.com" style={{ color: "#1E3A5F", fontWeight: 700 }}>compare.webfr@gmail.com</a> — Réponse sous 24h.</p>
    </div>
  </div>;
}

// ─── LEGAL ───
function LegalPage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 660, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Mentions légales</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Mentions légales</h1></div>
    {[
      { t: "Éditeur", c: "Compare. est édité par [Société]. SIRET : [numéro]. Directeur de la publication : [nom]." },
      { t: "Hébergement", c: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA." },
      { t: "Affiliation", c: "Compare. participe aux programmes d'affiliation Amazon Partenaires, Awin, CJ Affiliate et autres. Nous recevons une commission sans surcoût pour l'utilisateur." },
      { t: "Données personnelles (RGPD)", c: "Vous disposez d'un droit d'accès, modification et suppression de vos données. Contact : compare.webfr@gmail.com." },
      { t: "Cookies", c: "Ce site utilise des cookies fonctionnels et analytiques. Gérez vos préférences dans votre navigateur." },
      { t: "Propriété intellectuelle", c: "Tout le contenu est protégé par le droit d'auteur. Reproduction interdite sans autorisation." },
      { t: "Limitation de responsabilité", c: "Les prix sont indicatifs. Compare. ne peut être tenu responsable de l'exactitude des prix ou de la qualité des réparations." },
    ].map((s, i) => <div key={i} style={{ marginBottom: 14 }}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 3 }}>{s.t}</h3><p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{s.c}</p></div>)}
  </div>;
}

// ─── AVANTAGES PAGE ───
function AdvantagesPage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Avantages</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Les avantages de la réparation</h1></div>
    <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>Réparer plutôt que remplacer, c'est souvent le meilleur choix. Voici pourquoi.</p>

    {/* Avantages principaux */}
    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 14 }}>Pourquoi réparer ?</h2>
    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
      {[
        { icon: "money", title: "Économies réelles", desc: "Jusqu'à 80% d'économies par rapport au prix neuf. Une réparation coûte souvent 50 à 200 € contre 400 à 1000 € pour un remplacement." },
        { icon: "clock", title: "Durée de vie prolongée", desc: "Un appareil bien réparé peut durer encore plusieurs années. Vous maximisez votre investissement initial." },
        { icon: "shield", title: "Bonus QualiRépar", desc: "L'État vous aide : 10 à 45 € déduits automatiquement chez un réparateur labellisé QualiRépar." },
        { icon: "tool", title: "Apprendre en faisant", desc: "Beaucoup de pannes sont réparables soi-même avec un tutoriel. Une compétence utile pour la suite." },
      ].map((a, i) => <div key={i} style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", padding: "16px 18px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: ACCENT + "10", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <Icon name={a.icon} s={18} color={ACCENT} />
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>{a.title}</h3>
        <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{a.desc}</p>
      </div>)}
    </div>

    {/* Section écologie — mise en avant sans exagérer */}
    <div style={{ background: GREEN + "10", borderRadius: 10, border: `1px solid ${GREEN}30`, padding: "20px 22px", marginBottom: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: GREEN, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="leaf" s={20} color={GREEN} /> Bon pour la planète ?
      </h2>
      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, marginBottom: 10 }}>
        Oui. Réparer réduit les déchets et les émissions de CO₂. Chaque appareil réparé, c'est un appareil de moins à produire et à recycler.
      </p>
      <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>
        Exemples : réparer un smartphone évite environ 70 kg de CO₂ ; un lave-linge, ~200 kg. L'impact est concret, sans être miraculeux — c'est une contribution parmi d'autres gestes du quotidien.
      </p>
    </div>

    {/* CTA */}
    <div style={{ textAlign: "center", padding: "24px 20px", background: `linear-gradient(135deg, ${ACCENT}, ${GREEN})`, borderRadius: 10 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Comparez pour votre appareil</h3>
      <p style={{ fontSize: 13, color: "#B7E4C7", marginBottom: 14 }}>Découvrez si la réparation est le meilleur choix pour vous.</p>
      <button onClick={() => onNav("home")} className="btn-cta" style={{ padding: "12px 28px", borderRadius: 10, border: "2px solid #fff", background: "#fff", color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Comparer maintenant →</button>
    </div>
  </div>;
}

// ─── GUIDE PAGE ───
function GuidePage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Comment ça marche</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Comment ça marche ?</h1></div>
    <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>Compare. vous aide à prendre la meilleure décision en 3 étapes simples. Gratuit, instantané, sans inscription.</p>
    
    {/* 3 steps */}
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 32 }}>
      {[
        { n: "1", icon: "search", title: "Recherchez votre appareil", desc: `Tapez le nom exact de votre produit parmi nos ${ITEMS.length} références : smartphones, électroménager, consoles, plomberie, jardin… Si votre produit n'existe pas, contactez-nous pour le suggérer.`, color: GREEN },
        { n: "2", icon: "chart", title: "Comparez les 3 options", desc: "Sélectionnez votre panne (ou cumulez-en plusieurs). Notre algorithme calcule instantanément le coût de réparation, le prix en occasion/reconditionné et le prix neuf. Un verdict clair vous guide.", color: AMBER },
        { n: "3", icon: "check", title: "Choisissez la meilleure solution", desc: "Accédez directement aux tutoriels YouTube, aux pièces détachées ou aux meilleures offres. Vous savez exactement combien vous économisez et quel impact vous avez sur la planète.", color: ACCENT },
      ].map((s, i) => <div key={i} style={{ display: "flex", gap: 18, padding: "24px 0", borderBottom: i < 2 ? "1px solid #E0DDD5" : "none", alignItems: "flex-start" }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: s.color + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
          <Icon name={s.icon} s={26} color={s.color} />
          <div style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 22, background: s.color, color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.n}</div>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 6 }}>{s.title}</h3>
          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>{s.desc}</p>
        </div>
      </div>)}
    </div>

    {/* Features grid */}
    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 14 }}>Ce que Compare. vous apporte</h2>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }} className="grid-2">
      {[
        { icon: "money", title: "Économies réelles", desc: "Jusqu'à 80% d'économies vs le prix neuf" },
        { icon: "clock", title: "Gain de temps", desc: "Décision en 30 secondes, pas des heures de recherche" },
        { icon: "leaf", title: "Impact écologique", desc: "Chaque réparation = moins de CO₂ et de déchets" },
        { icon: "tool", title: "Tutoriels intégrés", desc: "Liens YouTube et guides en ligne pour chaque panne" },
        { icon: "chart", title: "Comparaison transparente", desc: "Prix réparation, occasion et neuf côte à côte" },
        { icon: "shield", title: "Bonus QualiRépar", desc: "Jusqu'à 45€ d'aide de l'État sur les réparations" },
      ].map((f, i) => <div key={i} style={{ background: "#fff", borderRadius: 8, padding: 16, border: "1px solid #E0DDD5" }}>
        <div style={{ width: 34, height: 34, borderRadius: 12, background: ACCENT + "10", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <Icon name={f.icon} s={18} color={ACCENT} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#111", marginBottom: 2 }}>{f.title}</div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{f.desc}</div>
      </div>)}
    </div>

    {/* CTA */}
    <div style={{ textAlign: "center", padding: "24px 20px", background: `linear-gradient(135deg, ${ACCENT}, ${GREEN})`, borderRadius: 10 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Logo s={40} /></div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Prêt à comparer ?</h3>
      <p style={{ fontSize: 13, color: "#B7E4C7", marginBottom: 14 }}>Trouvez la meilleure option pour votre appareil en quelques secondes.</p>
      <button onClick={() => onNav("home")} className="btn-cta" style={{ padding: "12px 28px", borderRadius: 10, border: "2px solid #fff", background: "#fff", color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Comparer maintenant →</button>
    </div>
  </div>;
}

// ─── REPAIR GUIDE PAGE ───
function RepairGuidePage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Guide</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Réparer ou racheter : le guide complet</h1></div>
    <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.7 }}>Vous hésitez entre faire réparer votre appareil ou le remplacer ? Ce guide vous aide à prendre la bonne décision selon votre situation.</p>

    {/* Decision criteria */}
    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 12 }}>Les critères de décision</h2>
    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
      {[
        { icon: "money", title: "Le coût de réparation", desc: "Si la réparation coûte moins de 30% du prix neuf, c'est presque toujours le meilleur choix. Entre 30% et 50%, considérez l'état général de l'appareil. Au-delà de 50%, le remplacement est souvent plus sage." },
        { icon: "calendar", title: "L'âge de l'appareil", desc: "Un appareil de moins de 3 ans mérite généralement d'être réparé. Entre 3 et 7 ans, cela dépend de la panne. Au-delà de 7 ans, le reconditionné ou le neuf peuvent être plus pertinents." },
        { icon: "tool", title: "La difficulté technique", desc: "Les pannes faciles (batterie, filtre, joint) sont idéales pour le DIY. Les pannes moyennes nécessitent un bon tutoriel. Les pannes complexes demandent un professionnel." },
        { icon: "leaf", title: "L'impact écologique", desc: "Réparer un smartphone évite ~70kg de CO₂. Réparer un lave-linge évite ~200kg de CO₂. L'impact est toujours positif : moins de ressources, moins de déchets, moins d'émissions." },
      ].map((c, i) => <div key={i} style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", padding: "16px 18px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: ACCENT + "10", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <Icon name={c.icon} s={18} color={ACCENT} />
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>{c.title}</h3>
        <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{c.desc}</p>
      </div>)}
    </div>

    {/* When to repair */}
    <div style={{ background: GREEN + "10", borderRadius: 8, border: `1px solid ${GREEN}30`, padding: "18px 20px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: GREEN, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="check" s={16} color={GREEN} /> Quand réparer ?
      </h2>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 6 }}><strong>Coût inférieur à 30% du neuf :</strong> la réparation est presque toujours rentable. Vous gardez un appareil fonctionnel et vous réalisez une économie importante.</p>
        <p style={{ marginBottom: 6 }}><strong>Panne simple et courante :</strong> écran cassé, batterie usée, pompe de vidange HS, joint de porte abîmé. Ce sont les pannes les plus fréquentes et les mieux documentées.</p>
        <p style={{ marginBottom: 6 }}><strong>Appareil récent (&lt; 3 ans) :</strong> il a encore une longue durée de vie devant lui. La réparation maximise votre investissement initial.</p>
        <p><strong>Pièces disponibles :</strong> si les pièces existent chez SOSav, Spareka ou Amazon, la réparation est viable. Compare. vérifie ça pour vous.</p>
      </div>
    </div>

    {/* When to replace */}
    <div style={{ background: "#DC262610", borderRadius: 8, border: "1px solid #DC262630", padding: "18px 20px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#DC2626", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="swap" s={16} color="#DC2626" /> Quand remplacer ?
      </h2>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 6 }}><strong>Coût supérieur à 50% du neuf :</strong> la réparation n'est plus rentable. Préférez un modèle reconditionné (économie de 30-40% vs neuf) ou neuf.</p>
        <p style={{ marginBottom: 6 }}><strong>Pannes multiples :</strong> si votre appareil cumule plusieurs problèmes, le coût total de réparation peut vite dépasser le seuil de rentabilité.</p>
        <p style={{ marginBottom: 6 }}><strong>Appareil obsolète (&gt; 7 ans) :</strong> les pièces sont parfois introuvables, et les nouvelles générations sont significativement plus performantes ou économes.</p>
        <p><strong>Panne de carte mère / composant critique :</strong> ces réparations sont coûteuses et risquées. Le remplacement est souvent plus sûr.</p>
      </div>
    </div>

    {/* Occasion option */}
    <div style={{ background: AMBER + "10", borderRadius: 8, border: `1px solid ${AMBER}30`, padding: "18px 20px", marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: AMBER, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="recycle" s={16} color={AMBER} /> L'option reconditionné / occasion
      </h2>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 6 }}>Le reconditionné est un excellent compromis. Garanti 12 à 24 mois, testé et remis à neuf, il offre un appareil quasi-neuf à prix réduit (-30 à -50%).</p>
        <p>Compare. référence les meilleurs vendeurs : Back Market, Amazon Renewed, Certideal pour l'électronique, Rakuten et Cdiscount pour l'électroménager et l'occasion.</p>
      </div>
    </div>

    {/* QualiRépar */}
    <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", padding: "18px 20px", marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: ACCENT, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="shield" s={16} color={ACCENT} /> Le bonus QualiRépar
      </h2>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 6 }}>L'État français propose une aide de <strong>10 à 45 €</strong> sur la réparation d'appareils électriques et électroniques. Cette aide est déduite directement chez un réparateur labellisé QualiRépar.</p>
        <p style={{ marginBottom: 6 }}><strong>Comment en bénéficier ?</strong> Aucune démarche : rendez-vous chez un réparateur agréé QualiRépar et la réduction est appliquée automatiquement sur la facture.</p>
        <p><strong>Appareils éligibles :</strong> smartphones, tablettes, ordinateurs, TV, consoles, électroménager, aspirateurs, machines à café, etc.</p>
      </div>
    </div>

    {/* CTA */}
    <div style={{ textAlign: "center", padding: "24px 20px", background: `linear-gradient(135deg, ${ACCENT}, ${GREEN})`, borderRadius: 10 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Testez Compare. sur votre appareil</h3>
      <p style={{ fontSize: 13, color: "#B7E4C7", marginBottom: 14 }}>Recherchez votre produit et découvrez le verdict en quelques secondes.</p>
      <button onClick={() => onNav("home")} className="btn-cta" style={{ padding: "12px 28px", borderRadius: 10, border: "2px solid #fff", background: "#fff", color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Comparer maintenant →</button>
    </div>
  </div>;
}

// ─── ABOUT PAGE ───
function AboutPage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 660, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>À propos</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>À propos de Compare.</h1></div>
    <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
      <p style={{ marginBottom: 12 }}>Basés à <strong>Paris</strong>, nous avons créé Compare. avec une mission simple : aider chaque personne à faire le meilleur choix entre <strong>réparer</strong> un appareil, l'acheter <strong>d'occasion</strong> ou le racheter <strong>neuf</strong>.</p>
      <p style={{ marginBottom: 12 }}>Notre objectif est de rendre la réparation accessible à tous, en comparant les coûts de manière transparente et en vous orientant vers les meilleures solutions — que ce soit un tutoriel, un réparateur professionnel ou un marchand de confiance.</p>
      <p style={{ marginBottom: 12 }}>Nous croyons qu'un appareil réparé, c'est un appareil de moins dans une décharge. Chaque réparation compte pour la planète, et chaque euro économisé compte pour vous.</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
      {[{ n: ITEMS.length + "+", l: "Produits référencés" }, { n: CATS.length, l: "Catégories" }, { n: "100%", l: "Gratuit" }].map((s, i) =>
        <div key={i} style={{ textAlign: "center", padding: 16, background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: ACCENT }}>{s.n}</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{s.l}</div>
        </div>
      )}
    </div>
  </div>;
}

// ─── CONTACT PAGE ───
function ContactPage({ onNav }) {
  const [sent, setSent] = useState(false);
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 660, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Contact</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Contact</h1></div>
    {sent ? <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5" }}>
      <div style={{ width: 54, height: 54, borderRadius: 16, background: GREEN + "12", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
        <Icon name="check" s={28} color={GREEN} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600 }}>Message envoyé !</p>
      <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Nous vous répondons sous 24h.</p>
    </div> : <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid #E0DDD5" }}>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 14 }}>Une question, une suggestion, un produit à ajouter ? Écrivez-nous.</p>
      <input placeholder="Votre email" style={{ width: "100%", padding: "11px 14px", borderRadius: 6, border: "1.5px solid #D1D5DB", fontSize: 14, fontFamily: F, marginBottom: 8, outline: "none" }} />
      <textarea placeholder="Votre message..." style={{ width: "100%", padding: "11px 14px", borderRadius: 6, border: "1.5px solid #D1D5DB", fontSize: 14, fontFamily: F, marginBottom: 12, outline: "none", minHeight: 80, resize: "vertical" }} />
      <button onClick={() => setSent(true)} style={{ width: "100%", padding: 12, borderRadius: 6, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F }}>Envoyer</button>
      <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>Ou directement : <a href="mailto:compare.webfr@gmail.com" style={{ color: ACCENT, fontWeight: 600 }}>compare.webfr@gmail.com</a></p>
    </div>}
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
        page.issues = panneIds.length ? allIssues.filter(i => panneIds.includes(i.id)) : allIssues.slice(0, 1);
      } else {
        page.issues = [];
      }
      if (pageType === "aff") page.alts = getAlternatives(page.item);
    }
    page.itemId = page.item?.id ?? legacyItemId;
  }


  useEffect(() => {
    let data = null;
    if (page.type === "cat" || page.type === "cat-type" || page.type === "cat-brand") {
      data = { cat: page.catId };
      if (page.type === "cat-type" && page.productType) data.productType = page.productType;
    } else if (page.type === "compare" || page.type === "issue") {
      data = { item: page.item, issue: page.issue };
    } else if (page.type === "aff") {
      data = { item: page.item, affType: page.affType };
    }
    const seo = buildSeo(page.type, data);
    document.title = seo.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", seo.description);
    const base = (typeof window !== "undefined" && window.location.origin) || "https://compare-fr.com";
    const canonicalHref = `${base}${seo.canonicalPath}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.rel = "canonical";
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalHref;
  }, [page.type, page.itemId, page.catId, page.productType, page.item, page.issue, page.affType]);

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
    <Navbar onNav={nav} user={user} onAuth={() => user ? logout() : setShowAuth(true)} onMenu={() => setSidebar(true)} />
    <main id="main">
    {page.type === "home" && <>
      <Hero onSearch={id => nav("compare", id)} onNav={nav} popularSearches={popularSearches} />
      {/* Populaires — FIRST */}
      <section style={{ padding: "36px 20px", background: "#fff", borderBottom: "1px solid #E0DDD5", transition: "all .25s ease" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", textAlign: "center", marginBottom: 4 }}>Recherches populaires</h2>
          <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginBottom: 16 }}>Les diagnostics et produits les plus consultés</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }} className="grid-2">
            {popularSearches.map((entry, idx) => {
              if (entry.type === "general") {
                return <Card key={idx} onClick={() => nav("cat-type", { catId: entry.catId, productType: entry.productType })} className="popular-card-mobile" style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, minHeight: 56 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 8, background: "#FEF3E2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="washer" s={18} color="#B45309" /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>Réparer ou remplacer ?</div>
                  </div>
                  <span style={{ flexShrink: 0 }}><Badge color={AMBER}>Comparer</Badge></span>
                </Card>;
              }
              const item = findProductByPopular({ brand: entry.brand, name: entry.name });
              if (!item) return null;
              const iss = getIssues(item);
              const v = getVerdict([iss[0]], item);
              return <Card key={item.id} onClick={() => nav("compare", item.id)} className="popular-card-mobile" style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, minHeight: 56 }}>
                <ProductImg brand={item.brand} item={item} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.brand} {item.name}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{entry.intent} · {iss[0].repairMin}–{iss[0].repairMax} €</div>
                </div>
                <span style={{ flexShrink: 0 }}><Badge color={v.color}>{v.label}</Badge></span>
              </Card>;
            })}
          </div>
        </div>
      </section>
      {/* Catégories — AFTER */}
      <section style={{ padding: "56px 20px", maxWidth: 860, margin: "0 auto", transition: "all .25s ease" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", textAlign: "center", marginBottom: 8, letterSpacing: "-.03em" }}>Parcourir par catégorie</h2>
        <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 36 }}>Comparez réparation, occasion et neuf pour chaque type d'appareil</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24 }} className="grid-2">
          {SIDEBAR_GROUPS.map((grp, gi) => {
            const cats = grp.ids.map(id => CATS.find(c => c.id === id)).filter(Boolean);
            const isTech = gi === 0;
            const headerBg = isTech ? `linear-gradient(135deg, ${ACCENT}12 0%, #2D6A4F08 100%)` : "linear-gradient(135deg, #FEF3E2 0%, #FDE8CD18 100%)";
            const headerColor = isTech ? ACCENT : "#B45309";
            const cardHoverBg = isTech ? ACCENT + "0A" : "#FEF3E2";
            const cardHoverBorder = isTech ? ACCENT + "30" : "rgba(180,83,9,.2)";
            const iconBg = isTech ? ACCENT + "14" : "#FDE8CD";
            const iconColor = isTech ? ACCENT : "#B45309";
            return <div key={grp.label} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.06)", border: "1px solid rgba(0,0,0,.04)", minHeight: 520, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ padding: "16px 20px", background: headerBg, borderBottom: "1px solid rgba(0,0,0,.04)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: isTech ? ACCENT + "20" : "rgba(180,83,9,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={isTech ? "smartphone" : "home"} s={18} color={headerColor} />
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: headerColor, letterSpacing: "-.02em" }}>{grp.label}</span>
              </div>
              <div style={{ padding: 16, flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gridAutoRows: "92px", gap: 10 }}>
                {cats.map(cat => {
                  const c = ITEMS.filter(i => i.category === cat.id).length;
                  return <button key={cat.id} type="button" onClick={() => nav("cat", cat.id)} title={cat.name} style={{ padding: "14px 16px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "all .2s", border: "1px solid transparent", background: "#FAFAF9", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box", textAlign: "left", font: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.background = cardHoverBg; e.currentTarget.style.borderColor = cardHoverBorder; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#FAFAF9"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                    <span style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={cat.icon} s={20} color={iconColor} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#111", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={cat.name}>{cat.name}</div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{c} produits</div>
                    </div>
                  </button>;
                })}
              </div>
            </div>;
          })}
        </div>
      </section>
      {/* FAQ + Qui sommes-nous — bloc unifié */}
      <section style={{ padding: "40px 20px 48px", maxWidth: 860, margin: "0 auto", background: "linear-gradient(180deg, #fff 0%, #FAFAF8 100%)", borderRadius: "20px 20px 0 0", marginTop: -8 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", textAlign: "center", marginBottom: 20 }}>Questions fréquentes</h2>
        {[
          { q: "Comment fonctionne Compare. ?", a: "Recherchez votre appareil, sélectionnez la panne et comparez instantanément les 3 options : réparer, acheter reconditionné ou racheter neuf. Notre algorithme calcule les coûts et vous recommande la meilleure solution." },
          { q: "Les prix affichés sont-ils fiables ?", a: "Ce sont des estimations basées sur les tarifs moyens en France. Les prix réels peuvent varier selon le prestataire et votre localisation. Ils incluent pièces et main d'œuvre pour la réparation." },
          { q: "C'est quoi le bonus QualiRépar ?", a: "C'est une aide de l'État de 10 à 45 € déduite directement chez un réparateur labellisé QualiRépar. Aucune démarche, la réduction est appliquée automatiquement." },
          { q: "Compare. est-il gratuit ?", a: "Oui, 100% gratuit. Nous sommes rémunérés par des commissions d'affiliation lorsque vous achetez via nos liens, sans aucun surcoût pour vous." },
          { q: "Puis-je cumuler plusieurs pannes ?", a: "Oui ! Sur chaque page produit, cliquez sur « Plusieurs problèmes ? » pour activer le mode cumul et voir le coût total de toutes vos réparations." },
          { q: "Comment sont calculées les estimations de réparation ?", a: "Nous nous appuyons sur les tarifs moyens des pièces détachées et de la main d'œuvre en France, ainsi que sur les tutoriels vidéo et les retours de réparateurs. Les fourchettes indiquent un ordre de grandeur réaliste." },
          { q: "Puis-je suggérer un produit à ajouter ?", a: "Oui ! Utilisez la page Contact pour nous envoyer votre suggestion. Nous examinons chaque demande et ajoutons les appareils les plus demandés." },
          { q: "Les liens d'achat sont-ils sécurisés ?", a: "Oui. Nous redirigeons vers des marchands reconnus (Amazon, Back Market, Fnac, etc.). Vous achetez directement chez eux, nous ne stockons aucune donnée de paiement." },
          { q: "Compare. compare-t-il les vrais prix en temps réel ?", a: "Les prix neuf et reconditionné sont indicatifs (basés sur les tarifs habituels). Pour les prix exacts, cliquez sur les liens pour voir les offres actuelles sur chaque site partenaire." },
        ].map((f, i) => <details key={i} style={{ background: "#fff", borderRadius: 10, marginBottom: 6, border: "1px solid #E8E6E2", transition: "all .2s ease" }}>
          <summary style={{ padding: "14px 18px", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#111" }}>{f.q}</summary>
          <p style={{ padding: "0 18px 14px", fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>{f.a}</p>
        </details>)}
        <div style={{ textAlign: "center", marginTop: 16, marginBottom: 28 }}><button type="button" onClick={() => nav("faq")} style={{ fontSize: 13, fontWeight: 600, color: GREEN, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit" }}>Voir toutes les questions fréquentes →</button></div>
        <div style={{ background: "#fff", border: "1px solid #E8E6E2", borderRadius: 14, padding: 28, marginTop: 24, boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: ACCENT, marginBottom: 12 }}>Qui sommes-nous ?</h2>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 10 }}>Basés à Paris, nous avons créé Compare. pour aider chaque personne à faire le meilleur choix entre réparer, acheter d'occasion ou racheter neuf.</p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 0 }}>Chaque appareil réparé, c'est un appareil de moins en décharge, des ressources préservées et des émissions de CO₂ évitées.</p>
          <button type="button" onClick={() => nav("about")} style={{ display: "inline-block", marginTop: 14, fontSize: 14, fontWeight: 600, color: GREEN, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit" }}>En savoir plus sur Compare. →</button>
        </div>
      </section>
    </>}
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
    {page.type === "aff" && <AffPage item={page.item} issues={page.issues} affType={page.affType} alts={page.alts} onNav={nav} />}
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
