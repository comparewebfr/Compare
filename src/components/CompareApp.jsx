"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PRODUCT_IMAGES } from "../data/product-images";
import { ACCENT, GREEN, AMBER, W, F, CSS } from "../lib/constants";
import { CATS, PTYPES, ITEMS, OCC_CATS, SIDEBAR_GROUPS, CHIP_TO_PRODUCT, POPULAR_SEARCHES, RET, TECH_CATS, WHEN_REPAIR_SPEC } from "../lib/data";
import { slugify, getIssues, getVerdict, getRepairEstimate, getAlternatives, getRet, buildRetailerUrl, buildRepairerMapsUrl, pathCategory, pathProduct, pathProductType, pathProductIssue, pathBrand, pathCompare, pathAff, buildSeo, findProductByChip, findProductByPopular, findCategoryBySlug, findProductBySlug, findProductTypeBySlug, findIssueBySlug, shLabel, getCumulTimeInfo, parseTimeRange, formatTimeRangeLabel, formatSingleTime } from "../lib/helpers";

// ─── LOGO ───
function Logo({ s = 32 }) {
  return <Image src="/logo.png" alt="Compare." width={s} height={s} style={{ width: s, height: s, objectFit: "contain", borderRadius: "50%" }} />;
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
// Priorité : 1) PRODUCT_IMAGES (src/data/product-images.js)  2) public/products/{id}.jpg  3) placeholder
function getProductImageSrc(item, ext = "jpg") {
  if (!item?.id) return null;
  if (PRODUCT_IMAGES[item.id]) return PRODUCT_IMAGES[item.id];
  return `/products/${item.id}.${ext}`;
}
function getPlaceholderSrc(item) {
  if (!item?.id) return null;
  const seed = `${item.id}-${(item.brand || "")}-${(item.name || "")}`.replace(/\s/g, "-");
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/400`;
}

function ProductImg({ brand, item, size = 48 }) {
  const [step, setStep] = useState(0); // 0=jpg, 1=png, 2=placeholder, 3=initials
  useEffect(() => { setStep(0); }, [item?.id]);
  const initials = ((brand || item?.brand) || "?").slice(0, 3);
  const fallbackDiv = <div style={{ width: size, height: size, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E5E7EB", flexShrink: 0 }}>
    <span style={{ fontSize: Math.max(8, size * .15), fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase" }}>{initials}</span>
  </div>;
  let src = null;
  if (item) {
    if (step <= 1) src = getProductImageSrc(item, step === 0 ? "jpg" : "png");
    else if (step === 2) src = getPlaceholderSrc(item);
  }
  const onError = () => {
    if (step === 0 && PRODUCT_IMAGES[item.id]) setStep(2); // URL custom échouée → placeholder
    else if (step < 2) setStep(s => s + 1);
    else setStep(3);
  };
  if (!item || step === 3) return fallbackDiv;
  return (
    <Image src={src} alt={`Produit : ${item?.brand || ""} ${item?.name || ""}`.trim()} onError={onError} loading="lazy" width={size} height={size} sizes={`${size}px`} style={{ width: size, height: size, borderRadius: 10, objectFit: "cover", border: "1px solid #E5E7EB", flexShrink: 0, background: "#F3F4F6" }} />
  );
}

// ─── AUTH MODAL ───
function AuthModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  useEffect(() => {
    closeBtnRef.current?.focus();
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onEsc); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="auth-title" ref={dialogRef} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, width: 370, maxWidth: "90vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 id="auth-title" style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>Se connecter</h2>
          <button ref={closeBtnRef} onClick={onClose} aria-label="Fermer" style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {["Google", "Apple"].map(p => <button key={p} onClick={() => onLogin(p)} style={{ width: "100%", padding: 11, borderRadius: 10, border: p === "Apple" ? "1.5px solid #111" : "1.5px solid #D1D5DB", background: p === "Apple" ? "#111" : "#fff", color: p === "Apple" ? "#fff" : "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F, marginBottom: 8 }}>Continuer avec {p}</button>)}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}><div style={{ flex: 1, height: 1, background: "#E5E7EB" }} /><span style={{ fontSize: 12, color: "#9CA3AF" }}>ou</span><div style={{ flex: 1, height: 1, background: "#E5E7EB" }} /></div>
        <label htmlFor="auth-email" className="sr-only">Adresse email</label>
        <input id="auth-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemple.com" type="email" autoComplete="email" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #D1D5DB", fontSize: 14, fontFamily: F, marginBottom: 8, outline: "none" }} />
        <button onClick={() => onLogin("email")} style={{ width: "100%", padding: 11, borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F }}>Se connecter</button>
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
            {[{ l: "Comment ça marche", p: "guide", icon: "search" }, { l: "Guide réparation", p: "repair-guide", icon: "tool" }, { l: "À propos", p: "about", icon: "info" }, { l: "Contact", p: "contact", icon: "chat" }, { l: "FAQ", p: "faq", icon: "book" }].map(x =>
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
    <div className="nav-links" style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[{ l: "Comment ça marche", p: "guide" }, { l: "Guide", p: "repair-guide" }, { l: "À propos", p: "about" }, { l: "Contact", p: "contact" }].map(x =>
        <button key={x.l} onClick={() => onNav(x.p)} style={{ background: "transparent", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 500, color: "#B7E4C7", fontFamily: F, padding: "6px 8px" }}
          onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#B7E4C7"}>{x.l}</button>
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
    <button type="button" key={idx} onClick={() => onNav("cat", b.catId)} aria-label={`Voir les produits ${b.title}`} style={{
      animation: "slideFadeIn 0.5s ease-out",
      background: b.image ? undefined : b.bg,
      borderRadius: 16, padding: b.image ? 0 : "36px 56px", cursor: "pointer", minHeight: b.image ? 320 : 200, display: "flex", alignItems: "center", gap: 28, position: "relative", overflow: "hidden", border: "1px solid rgba(0,0,0,.06)", boxShadow: "0 4px 24px rgba(0,0,0,.08)", transition: "transform .25s ease, box-shadow .25s ease", width: "100%", textAlign: "left", font: "inherit",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.12)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,.08)"; }}>
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
      {arrowBtn("prev")}
      {arrowBtn("next")}
    </button>
  </section>;
}

// ─── HERO ───
const HERO_BANNERS = (W, ACCENT, GREEN) => [
  { bg: `linear-gradient(135deg, ${W} 30%, #E8F5E9)`, image: "/banner-hero.jpg", title: "Les meilleurs prix pour votre smartphone", sub: "Comparez, réparez ou rachetez un smartphone reconditionné", catId: "smartphones", icon: "smartphone", dark: false },
  { bg: `linear-gradient(135deg, ${ACCENT} 30%, ${GREEN})`, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&q=75", title: "Réparez votre console de jeux", sub: "Donnez une seconde vie à votre PS5", catId: "consoles", icon: "gamepad", dark: true },
  { bg: `linear-gradient(135deg, ${W} 30%, #FDE8CD)`, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=640&q=75", title: "Un problème dans votre cuisine ?", sub: "Réparez vos appareils à prix imbattables", catId: "cuisine", icon: "kitchen", dark: false },
];
function Hero({ onSearch, onNav }) {
  const [q, setQ] = useState(""); const [show, setShow] = useState(false); const [noMatchMsg, setNoMatchMsg] = useState(false);
  const qNorm = (q || "").trim().toLowerCase();
  const sug = useMemo(() => qNorm.length > 1 ? ITEMS.filter(i => `${i.brand} ${i.name} ${i.productType}`.toLowerCase().includes(qNorm)).slice(0, 6) : [], [qNorm]);
  const exactMatch = useMemo(() => qNorm.length > 0 ? ITEMS.find(i => `${i.brand} ${i.name}`.toLowerCase() === qNorm) : null, [qNorm]);
  const banners = useMemo(() => HERO_BANNERS(W, ACCENT, GREEN), []);
  return <><div style={{ background: `linear-gradient(180deg, ${W} 0%, #F0EDE6 50%, #E8E6E0 100%)`, paddingBottom: 0 }}>
    <section style={{ padding: "40px 20px 32px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Logo s={56} /></div>
      <h1 className="hero-title" style={{ fontSize: 38, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, margin: "0 0 6px", letterSpacing: "-.03em", fontFamily: F }}>Réparer ou racheter<span style={{ color: ACCENT }}> ?</span></h1>
      <p style={{ fontSize: 14, color: "#4B5563", margin: "0 auto 28px", maxWidth: 380, fontWeight: 500, lineHeight: 1.5 }}>Comparez les coûts. Choisissez malin.</p>
      <div style={{ position: "relative", maxWidth: 460, margin: "0 auto" }}>
        <div style={{ display: "flex", background: "#fff", borderRadius: 14, padding: "4px 4px 4px 18px", boxShadow: "0 2px 20px rgba(27,67,50,.12), 0 0 0 1px rgba(27,67,50,.06)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 12, opacity: .6 }} aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <label htmlFor="hero-search" className="sr-only">Rechercher un produit (ex: iPhone 15, lave-linge Bosch, PS5)</label>
          <input id="hero-search" value={q} onChange={e => { setQ(e.target.value); setShow(true); setNoMatchMsg(false); }} onFocus={() => setShow(true)} onBlur={() => setTimeout(() => setShow(false), 200)}
            placeholder="iPhone 15, lave-linge Bosch, PS5..." aria-label="Rechercher un produit" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: F, fontSize: 15, color: "#111", padding: "14px 12px" }} />
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
            <ProductImg brand={item.brand} item={item} size={34} />
            <div style={{ textAlign: "left" }}><div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{item.brand} {item.name}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{item.productType} · {item.priceNew} €</div></div>
          </button></li>)}
        </ul>}
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
        {["iPhone 13", "MacBook Air M3", "Galaxy S24", "Lave-linge Bosch", "PlayStation 5", "Dyson V15", "Thermomix TM6", "iPad Pro"].map(label => {
          const it = findProductByChip(label);
          return it ? <button key={it.id} type="button" onClick={() => onSearch(it.id)} className="pill-hover" style={{ background: "rgba(255,255,255,.9)", border: "1px solid rgba(45,106,79,.25)", borderRadius: 20, padding: "8px 16px", fontSize: 12, color: "#2D6A4F", cursor: "pointer", fontFamily: F, fontWeight: 500, backdropFilter: "blur(4px)", minHeight: 40 }}>{label}</button> : null;
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

// ─── CATEGORY PAGE ───
const BRAND_CATS = ["smartphones","tablettes","ordinateurs","tv","consoles","audio","photo","montres","velo"];
function CategoryPage({ catId, onNav, initialProductType, initialBrandSlug }) {
  const cat = CATS.find(c => c.id === catId);
  const items = ITEMS.filter(i => i.category === catId);
  const types = PTYPES[catId] || [];
  const [selType, setSelType] = useState(null);
  const [selBrand, setSelBrand] = useState(null);
  const [sort, setSort] = useState("pop");
  const isBrandFirst = BRAND_CATS.includes(catId);

  useEffect(() => {
    setSelType(initialProductType || null);
    const brand = initialBrandSlug ? items.find(i => slugify(i.brand) === initialBrandSlug)?.brand : null;
    setSelBrand(brand || null);
    setSort("pop");
  }, [catId, initialProductType, initialBrandSlug, items]);

  const brands = useMemo(() => {
    const m = {};
    items.forEach(i => { m[i.brand] = (m[i.brand] || 0) + 1; });
    return Object.entries(m).sort((a,b) => b[1] - a[1]).map(([b,c]) => ({ name: b, count: c }));
  }, [items]);

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

      {/* Filter bar */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DDD5", padding: "14px 16px", marginBottom: 18, transition: "all .25s ease", boxShadow: "0 1px 3px rgba(0,0,0,.03)" }}>
        {/* Type filter */}
        {types.length > 1 && <div style={{ marginBottom: isBrandFirst && brands.length > 1 ? 12 : 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>{isBrandFirst ? "Type de produit" : "Type d'appareil"}</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Pill active={!selType} onClick={() => onNav("cat", catId)}>Tous</Pill>
            {types.map(t => { const c = typesFiltered.filter(i => i.productType === t).length; return c > 0 && <Pill key={t} active={selType === t} onClick={() => onNav("cat-type", { catId, productType: t })}>{t} ({c})</Pill>; })}
          </div>
        </div>}

        {/* Brand filter */}
        {brands.length > 1 && <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>Marque</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Pill active={!selBrand} onClick={() => onNav(selType ? "cat-type" : "cat", selType ? { catId, productType: selType } : catId)}>Toutes</Pill>
            {brands.slice(0, 12).map(b => <Pill key={b.name} active={selBrand === b.name} onClick={() => onNav("cat-brand", { catId, productType: selType, brand: b.name })}>{b.name} ({b.count})</Pill>)}
            {brands.length > 12 && !selBrand && <span style={{ fontSize: 11, color: "#9CA3AF", alignSelf: "center" }}>+{brands.length - 12} marques</span>}
          </div>
        </div>}

        {/* Reset */}
        {hasFilters && <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #F3F4F6" }}>
          <button onClick={() => onNav("cat", catId)} style={{ fontSize: 12, color: ACCENT, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: F, padding: 0 }}>✕ Réinitialiser les filtres</button>
        </div>}
      </div>

      {/* Brand grid — shown when NO brand is selected on brand-first categories */}
      {isBrandFirst && !selBrand && !selType && brands.length > 3 && <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 10 }}>Choisir une marque</div>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {brands.slice(0, 8).map(b => {
            const sample = items.filter(i => i.brand === b.name)[0];
            return <div key={b.name} onClick={() => onNav("cat-brand", { catId, productType: null, brand: b.name })} style={{ background: "#fff", border: "1px solid #E0DDD5", borderRadius: 8, padding: "16px 12px", cursor: "pointer", textAlign: "center", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.transform = "none"; }}>
              <ProductImg brand={b.name} item={sample} size={36} />
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
            return <div key={t} onClick={() => onNav("cat-type", { catId, productType: t })} style={{ background: "#fff", border: "1px solid #E0DDD5", borderRadius: 8, padding: "16px 14px", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.transform = "none"; }}>
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
                <ProductImg brand={item.brand} item={item} size={38} />
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
          <ProductImg brand={item.brand} item={item} size={56} />
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

        {/* Réparer / Remplacer / DIY — détaillé, spécialisé par produit (maison) ou générique (tech) */}
        <details style={{ marginBottom: 16, background: "#FAFBFC", borderRadius: 10, border: "1px solid #E8E6E1", overflow: "hidden" }}>
          <summary style={{ padding: "12px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#374151", listStyle: "none" }}>Quand réparer, remplacer ou faire soi-même ?</summary>
          <div style={{ padding: "0 16px 16px" }}>
            {(() => {
              const spec = OCC_CATS.includes(item.category) && WHEN_REPAIR_SPEC[item.productType];
              return <>
            <div style={{ borderLeft: `4px solid ${GREEN}`, paddingLeft: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="check" s={16} color={GREEN} /> Quand réparer reste pertinent
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                {spec ? spec.reparer : `Pour votre ${item.brand} ${item.name} (${item.productType}), la réparation est pertinente quand le coût reste sous 30 % du prix neuf (${Math.round(item.priceNew * .3)} €), que la pièce est disponible et que vous pouvez le faire vous-même ou via un pro à tarif raisonnable. Pour la panne « ${activeIssues.map(i => i.name).join(", ")} », le coût estimé est de ${tMin}–${tMax} € (soit ${Math.round((tMin + tMax) / 2 / item.priceNew * 100)} % du neuf). En bon état général, votre ${item.productType.toLowerCase()} ${item.year} mérite souvent la réparation — c'est le choix le plus économique et durable.`}
              </p>
              {spec && <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>Pour « {activeIssues.map(i => i.name).join(", ")} » sur ce {item.brand} {item.name}, coût estimé : {tMin}–{tMax} € (soit {Math.round((tMin + tMax) / 2 / item.priceNew * 100)} % du neuf {item.priceNew} €).</p>}
            </div>
            <div style={{ borderLeft: "4px solid #DC2626", paddingLeft: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="swap" s={16} color="#DC2626" /> Quand remplacer devient préférable
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                {spec ? spec.remplacer : `Quand la réparation dépasse 40–45 % du prix neuf (${Math.round(item.priceNew * .45)} €), quand l'intervention nécessite un pro (coût élevé) ou quand l'appareil est déjà ancien (${item.year}). Le remplacement (reconditionné ou neuf) offre alors souvent un meilleur rapport qualité/prix.`}
              </p>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginTop: 8, padding: "8px 10px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                <strong>Par catégorie :</strong> pour les smartphones et l'électronique, le reconditionné est très en vogue (~{recon} €, garanti). Pour une plaque de cuisson ou l'électroménager, c'est moins courant — le neuf ({item.priceNew} €) reste souvent la référence.
              </p>
            </div>
            </>;
            })()}
            <div style={{ borderLeft: `4px solid ${ACCENT}`, paddingLeft: 14, marginBottom: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="tool" s={16} color={ACCENT} /> Peut-on réparer soi-même ?
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                {timeInfo.needsPro
                  ? `Non. Pour « ${activeIssues.map(i => i.name).join(", ")} » sur un ${item.brand} ${item.name}, l'intervention relève du professionnel : outillage spécialisé, soudure ou risque élevé de casse. Tenter la réparation soi-même peut rendre l'appareil définitivement inutilisable. À confier à un réparateur agréé ou à remplacer.`
                  : v?.repairFeasibility === "facile"
                  ? `Possible, sous conditions. La réparation « ${activeIssues.map(i => i.name).join(", ")} » est indiquée comme facile avec un tutoriel vidéo (durée estimée : ${timeInfo.diyLabel}). Une erreur peut toutefois aggraver la panne. À tenter uniquement si vous êtes à l'aise ; sinon, un pro ou le ${sl.toLowerCase()} reste plus sûr.`
                  : v?.repairFeasibility === "technique"
                  ? `Déconseillé sans expérience. La réparation « ${activeIssues.map(i => i.name).join(", ")} » sur ce ${item.brand} ${item.name} est technique : démontage délicat, outillage spécifique, risque de casser des connecteurs. Beaucoup de particuliers échouent. En pratique, passer par un réparateur ou remplacer est souvent plus rentable.`
                  : `Non, pas de façon réaliste. Sans outillage et compétences pro, vous risquez d'endommager définitivement votre ${item.brand} ${item.name}. Ne tentez pas le DIY : privilégiez un réparateur agréé ou le remplacement (${sl.toLowerCase()} / neuf).`}
              </p>
            </div>
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

        {/* Tableau comparatif — repliable (ouvert par défaut pour SEO) */}
        <details open style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", overflow: "hidden", marginBottom: 20 }}>
          <summary style={{ padding: "12px 16px", cursor: "pointer", fontWeight: 700, fontSize: 15, color: "#111", display: "flex", alignItems: "center", gap: 8, listStyle: "none" }}>
            <Icon name="chart" s={16} color={ACCENT} /> Tableau comparatif détaillé
          </summary>
          <div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ background: W }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#9CA3AF", fontSize: 11, width: "28%" }}></th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: GREEN, fontSize: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="tool" s={14} color={GREEN} /> Réparer</span>
              </th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: AMBER, fontSize: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="recycle" s={14} color={AMBER} /> {sl}</span>
              </th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#DC2626", fontSize: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="cart" s={14} color="#DC2626" /> Neuf</span>
              </th>
            </tr></thead>
            <tbody>
              {[
                { l: "Coût total", r: `${tMin}–${tMax} €`, o: `~${recon} €`, n: `${item.priceNew} €`, bold: true },
                { l: "Pièce seule", r: `${tPart} €`, o: "—", n: "—" },
                { l: "Économie vs neuf", r: `${Math.max(0, item.priceNew - tMax)} €`, o: `${item.priceNew - recon} €`, n: "—", hR: GREEN, hO: AMBER },
                { l: "Temps (DIY)", r: timeInfo.diyFeasible ? timeInfo.diyLabel : "Professionnel requis", o: "—", n: "—" },
                { l: "Temps (pro)", r: activeIssues.length === 1 ? "1-5 jours" : "3-7 jours", o: "2-5 jours", n: "1-3 jours" },
                { l: "Difficulté", r: activeIssues.some(i => i.diff === "difficile") ? "●●● Difficile" : activeIssues.some(i => i.diff === "moyen") ? "●● Moyen" : "● Facile", o: "Aucune", n: "Aucune", hR: activeIssues.some(i => i.diff === "difficile") ? "#DC2626" : activeIssues.some(i => i.diff === "moyen") ? AMBER : GREEN },
                { l: "Garantie", r: "Variable", o: "12–24 mois", n: "24 mois" },
                { l: "Impact écolo", r: "Minimal", o: "Modéré", n: "Important" },
                { l: "Recommandation", r: v.v === "reparer" ? "Recommandé" : "—", o: v.v === "remplacer" ? "Recommandé" : "—", n: v.v === "remplacer" ? "Recommandé" : "—", hR: v.v === "reparer" ? GREEN : null, hO: v.v === "remplacer" ? AMBER : null, hN: v.v === "remplacer" ? "#DC2626" : null },
                ...(bestNewer ? [{ l: "Alternative récente", r: "—", o: `${bestNewer.item.brand} ${bestNewer.item.name} ~${bestNewer.reconPrice} €`, n: `${bestNewer.item.brand} ${bestNewer.item.name} ${bestNewer.neufPrice} €`, hO: AMBER, hN: "#DC2626" }] : []),
              ].map((row, i) => <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "9px 14px", fontWeight: 600, color: "#374151", fontSize: 12 }}>{row.l}</td>
                <td style={{ padding: "9px 14px", textAlign: "center", color: row.hR || "#6B7280", fontWeight: row.bold || row.hR ? 700 : 400, background: v.v === "reparer" ? GREEN + "06" : "transparent" }}>{row.r}</td>
                <td style={{ padding: "9px 14px", textAlign: "center", color: row.hO || "#6B7280", fontWeight: row.bold || row.hO ? 700 : 400, background: v.v === "remplacer" ? AMBER + "06" : "transparent" }}>{row.o}</td>
                <td style={{ padding: "9px 14px", textAlign: "center", color: row.hN || "#6B7280", fontWeight: row.bold || row.hN ? 700 : 400, background: v.v === "remplacer" ? "#DC262606" : "transparent" }}>{row.n}</td>
              </tr>)}
            </tbody>
          </table>
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
            <ProductImg brand={item.brand} item={item} size={32} />
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
              <ProductImg brand={n.item.brand} item={n.item} size={32} />
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
              <ProductImg brand={e.item.brand} item={e.item} size={32} />
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

        {/* REPAIR DETAIL section — repliable */}
        <details style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", marginBottom: 18, overflow: "hidden" }}>
          <summary style={{ padding: "14px 18px", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#111", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="tool" s={16} color={ACCENT} /> Détail de la réparation — {item.brand} {item.name}
          </summary>
          <div style={{ padding: "0 18px 18px" }}>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>
            Pour la panne « {activeIssues.map(i => i.name).join(", ")} » sur votre {item.brand} {item.name} : coût estimé, difficulté, temps et tutoriels adaptés à votre modèle.
            {OCC_CATS.includes(item.category)
              ? " Des tutoriels vidéo et guides Spareka sont disponibles pour ce type d'appareil."
              : " Des tutoriels vidéo ciblés sont disponibles pour vous accompagner."}
            {v.v === "reparer" ? " La réparation est l'option la plus économique et écologique dans votre cas." : ""}
          </p>
          {activeIssues.map(iss => {
            const diffColor = iss.diff === "facile" ? GREEN : iss.diff === "moyen" ? AMBER : "#DC2626";
            const diffStars = iss.diff === "facile" ? 1 : iss.diff === "moyen" ? 2 : 3;
            const timeLabel = formatSingleTime(iss.time);
            return <div key={iss.id} style={{ padding: "14px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{iss.name}</span>
                <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
                  {[1,2,3].map(s => <span key={s} style={{ width: 12, height: 12, borderRadius: 2, background: s <= diffStars ? diffColor : "#E5E7EB", display: "inline-block" }} />)}
                  <span style={{ fontSize: 11, color: diffColor, fontWeight: 600, marginLeft: 4 }}>{iss.diff === "facile" ? "Facile" : iss.diff === "moyen" ? "Moyen" : "Difficile"}</span>
                </span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6B7280", marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="money" s={14} color="#9CA3AF" /> <strong>{iss.repairMin}–{iss.repairMax} €</strong> tout compris</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="tool" s={14} color="#9CA3AF" /> Pièce : <strong>{iss.partPrice} €</strong></span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="clock" s={14} color="#9CA3AF" /> Durée : <strong>{timeLabel}</strong></span>
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, marginBottom: 10 }}>
                {iss.diff === "facile" 
                  ? `Pour « ${iss.name} » sur votre ${item.brand} ${item.name} : réparation accessible avec un tutoriel vidéo. Comptez ${timeLabel} de travail + 1 à 3 jours de livraison pour la pièce (${iss.partPrice} €). Recherchez « ${iss.ytQuery} » sur YouTube pour des démonstrations adaptées à votre modèle.`
                  : iss.diff === "moyen"
                  ? `Pour « ${iss.name} » sur ce ${item.brand} ${item.name} : réparation de niveau intermédiaire. Un tutoriel vidéo détaillé vous guidera ; un professionnel sera plus rapide si vous hésitez (délai pro : 2 à 5 jours). Pièce : ${iss.partPrice} €.`
                  : `Pour « ${iss.name} » sur votre ${item.brand} ${item.name} : intervention complexe, outillage pro requis. Nous recommandons un réparateur agréé. ${iss.time === "pro" ? "Ne tentez pas sans expérience." : ""} Pensez au bonus QualiRépar (jusqu'à 45 €).`
                }
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(iss.ytQuery)}`} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 14px", borderRadius: 8, background: "#FF0000", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="play" s={14} color="#fff" /> Tutoriel YouTube
                </a>
                {iss.altResource && <a href={iss.altResource.url} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 14px", borderRadius: 8, background: iss.altResource.color, color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name={iss.altResource.icon} s={14} color="#fff" /> {iss.altResource.label}
                </a>}
                <button onClick={() => onNav("aff", { item, issues: [iss], affType: "pcs", alts })} style={{ padding: "8px 14px", borderRadius: 8, background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: F, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="cart" s={14} color="#fff" /> Acheter la pièce
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#9CA3AF", lineHeight: 1.4 }}>
                {iss.diff === "difficile" ? "Réparation pro recommandée — les tutoriels sont indicatifs." : `Recherche YouTube : « ${iss.ytQuery.substring(0, 60)}… »`}
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
            { q: `Où trouver les pièces détachées pour ${item.brand} ${item.name} ?`, a: OCC_CATS.includes(item.category) ? "Les pièces sont disponibles chez Spareka, Leroy Merlin, ManoMano et Amazon. Spareka propose aussi des guides de réparation adaptés." : "Les pièces sont disponibles chez SOSav, Amazon et les revendeurs spécialisés. Des tutoriels vidéo YouTube ciblés existent pour de nombreux modèles." },
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
                <ProductImg brand={rel.brand} item={rel} size={36} />
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
                  { icon: "clock", label: "Temps estimé", value: timeInfo.diyLabel, color: ACCENT },
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

// ─── AFFILIATE PAGE ───
function AffPage({ item, issues, affType, onNav, alts: passedAlts }) {
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
  const sortedRets = [...retsWithPrice].sort((a, b) => a.price - b.price); // croissant : prix bas → prix haut
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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: "0 0 4px" }}>{titles[affType]} — {item.brand} {item.name}</h1>
          <p style={{ fontSize: 13, color: "#6B7280" }}>
          {isPcs ? `Coût total estimé (pièces + main d'œuvre pro) : ${repairTotalMin}–${repairTotalMax} €` : issues?.map(i => i.name).join(", ")}
        </p>
        </div>
        {!isPcs && <div style={{ padding: "4px 10px", borderRadius: 4, background: modeColor + "12", color: modeColor, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name={isNeuf ? "cart" : "recycle"} s={14} color={modeColor} />
            {isNeuf ? "Prix neuf uniquement" : `${sl} uniquement`}
          </span>
        </div>}
      </div>

      {/* Model comparison section (neuf/occ only) */}
      {showAlts && <>
        {/* Section title */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 10 }}>
          {isTech ? "Comparer les modèles" : "Modèles équivalents"} — {modeLabel}
        </div>

        {/* YOUR MODEL — reference */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 6 }}>Votre modèle</div>
        <div style={{ background: "#fff", border: "1px solid #E5E3DE", borderRadius: 10, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <ProductImg brand={item.brand} item={item} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
              {item.brand} {item.name}
              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: "#E0DDD5", color: "#6B7280" }}>VOTRE MODÈLE</span>
            </div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{item.productType} · {item.year}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: modeColor }}>{myPrice} €</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{modeLabel}</div>
          </div>
        </div>

        {/* BEST ALTERNATIVE — clic = page achat même mode, secondaire = comparatif */}
        {bestAlt && <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginTop: 10, marginBottom: 6 }}>Alternative recommandée</div>}
        {bestAlt && (() => {
          const altIssues = getIssues(bestAlt.item);
          const altAlts = getAlternatives(bestAlt.item);
          return <div onClick={() => onNav("aff", { item: bestAlt.item, issues: altIssues, affType, alts: altAlts })} className="card-hover" style={{
            background: isTech && bestAlt.type === "newer"
              ? `linear-gradient(90deg, ${GREEN}10, ${GREEN}05, #fff)`
              : GREEN + "06",
            border: `1.5px solid ${GREEN}40`, borderRadius: 12, padding: "14px 16px",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
          }}>
            <ProductImg brand={bestAlt.item.brand} item={bestAlt.item} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                {bestAlt.item.brand} {bestAlt.item.name}
                {bestAlt.badge && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: GREEN, color: "#fff" }}>{bestAlt.badge}</span>}
              </div>
              {bestAlt.microTag && <div style={{ marginTop: 4 }}>
                <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: "#fff", border: `1px solid ${GREEN}35`, color: GREEN }}>
                  {bestAlt.microTag}
                </span>
              </div>}
              <div style={{ fontSize: 11, color: GREEN, fontWeight: 500, marginTop: 2 }}>{bestAlt.displayReason}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{bestAlt.item.productType} · {bestAlt.item.year}</div>
              <button type="button" onClick={e => { e.stopPropagation(); onNav("compare", bestAlt.item.id); }} style={{ marginTop: 6, background: "none", border: "none", padding: 0, fontSize: 10, color: "#9CA3AF", cursor: "pointer", fontFamily: F, textDecoration: "underline" }}>Voir le comparatif complet</button>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: modeColor }}>{bestAlt.price} €</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{modeLabel}</div>
              {bestAlt.priceDiff !== 0 && <div style={{ fontSize: 10, color: bestAlt.priceDiff > 0 ? "#9CA3AF" : GREEN, fontWeight: 600 }}>
                {bestAlt.priceDiff > 0 ? `+${bestAlt.priceDiff}` : bestAlt.priceDiff} €
              </div>}
            </div>
            <Chev />
          </div>;
        })()}

        {/* OTHER ALTERNATIVES — clic = page achat même mode */}
        {otherAlts.length > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginTop: 10, marginBottom: 6 }}>Autres options</div>}
        {otherAlts.map(alt => {
          const altIssues = getIssues(alt.item);
          const altAlts = getAlternatives(alt.item);
          return <div key={alt.item.id} onClick={() => onNav("aff", { item: alt.item, issues: altIssues, affType, alts: altAlts })} className="card-hover" style={{
            background: "#fff", border: "1px solid #E5E3DE", borderRadius: 12, padding: "14px 16px",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
          }}>
            <ProductImg brand={alt.item.brand} item={alt.item} size={34} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>
                {alt.item.brand} {alt.item.name} <span style={{ fontSize: 10, color: "#9CA3AF" }}>({alt.item.year})</span>
                {alt.badge && <span style={{ marginLeft: 4, fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: GREEN + "18", color: GREEN }}>{alt.badge}</span>}
              </div>
              {alt.microTag && <div style={{ marginTop: 3, fontSize: 10, fontWeight: 700, color: "#6B7280" }}>{alt.microTag}</div>}
              <div style={{ fontSize: 11, color: "#6B7280" }}>{alt.displayReason}</div>
              <button type="button" onClick={e => { e.stopPropagation(); onNav("compare", alt.item.id); }} style={{ marginTop: 4, background: "none", border: "none", padding: 0, fontSize: 10, color: "#9CA3AF", cursor: "pointer", fontFamily: F, textDecoration: "underline" }}>Voir le comparatif complet</button>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: modeColor }}>{alt.price} €</div>
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

      {/* WHERE TO BUY — titre + accroche pour donner envie */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Icon name={isPcs ? "tool" : isNeuf ? "cart" : "recycle"} s={18} color={ACCENT} />
          {isPcs ? "Comparer les offres pièces & réparation" : isNeuf ? "Comparer les prix neuf" : `Comparer les offres ${sl.toLowerCase()}`}
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
          {isPcs
            ? `Comparez les prix pour réparer votre ${item.brand} ${item.name}. Cliquez sur une offre pour accéder directement au site partenaire.`
            : isNeuf
            ? `Les meilleures offres pour acheter ${item.brand} ${item.name} neuf. Livraison rapide, garantie fabricant.`
            : `Les meilleures offres ${sl.toLowerCase()} pour ${item.brand} ${item.name}. Garantie 12 à 24 mois, qualité vérifiée.`}
        </p>
      </div>

      {/* Retailers — design comparateur : logo, nom, prix, CTA clair pour donner envie d'acheter */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sortedRets.map(({ r, price }, rank) => {
          const isBestPrice = rank === 0;
          const url = buildRetailerUrl(r, item, affType);
          return <a key={r.n} href={url} target="_blank" rel="noopener noreferrer sponsored" className="card-hover" style={{
            background: "#fff",
            border: isBestPrice ? "2px solid #111" : "1px solid #E5E3DE",
            borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", boxShadow: isBestPrice ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.05)", textDecoration: "none", color: "inherit",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#374151", flexShrink: 0 }}>{(r.logo || r.n[0])}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{r.n}</span>
                {isBestPrice && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "#111", color: "#fff" }}>Meilleur prix</span>}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{r.t}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#111" }}>{price} €</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Voir l'offre</div>
            </div>
            <div style={{ padding: "10px 18px", borderRadius: 8, background: "#111", color: "#fff", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "transform .2s" }}>Voir l'offre →</div>
          </a>;
        })}
      </div>

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

// ─── GUIDE PAGE ───
function GuidePage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Comment ça marche</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Comment ça marche ?</h1></div>
    <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>Compare. vous aide à prendre la meilleure décision en 3 étapes simples. Gratuit, instantané, sans inscription.</p>
    
    {/* 3 steps */}
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 32 }}>
      {[
        { n: "1", icon: "search", title: "Recherchez votre appareil", desc: `Tapez le nom exact de votre produit parmi nos ${ITEMS.length} références : smartphones, électroménager, consoles, plomberie, mobilier… Si votre produit n'existe pas, contactez-nous pour le suggérer.`, color: GREEN },
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
        <p>Compare. référence les meilleurs vendeurs : Back Market, Amazon Renewed, Certideal pour l'électronique, Rakuten et Cdiscount pour le mobilier et l'électroménager.</p>
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
          {[{ l: "Comment ça marche", p: "guide" }, { l: "À propos", p: "about" }, { l: "Contact", p: "contact" }, { l: "FAQ", p: "faq" }, { l: "Mentions légales", p: "legal" }].map(x => <button key={x.l} type="button" onClick={() => onNav(x.p)} style={{ marginBottom: 2, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit", color: "inherit" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#B7E4C7"}>{x.l}</button>)}
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
  else if (pathname === "/comment-ca-marche") pageType = "guide";
  else if (pathname === "/guide/reparer-ou-racheter") pageType = "repair-guide";
  else if (pathname === "/faq") pageType = "faq";
  else if (pathname === "/mentions-legales") pageType = "legal";
  else if (pathname === "/a-propos") pageType = "about";
  else if (pathname === "/contact") pageType = "contact";
  else   if (pathname?.startsWith("/categories/")) {
    if (brandSlug) pageType = "cat-brand";
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

  if (pageType === "cat" || pageType === "cat-type" || pageType === "cat-brand") {
    const slug = categorySlug || legacyCatSlug;
    const cat = slug ? findCategoryBySlug(slug) : null;
    page.catId = cat?.id || slug;
    if (pageType === "cat-type" || pageType === "cat-brand") {
      const ptype = findProductTypeBySlug(page.catId, productTypeSlug);
      page.productType = ptype || undefined;
      page.brandSlug = pageType === "cat-brand" ? (brandSlug || productTypeSlug) : undefined;
    }
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
    const data = page.type === "cat" || page.type === "cat-type" || page.type === "cat-brand" ? { cat: page.catId } : page.type === "compare" || page.type === "issue" ? { item: page.item, issue: page.issue } : page.type === "aff" ? { item: page.item, affType: page.affType } : null;
    const seo = buildSeo(page.type, data);
    document.title = seo.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", seo.description);
  }, [page.type, page.itemId, page.catId, page.item, page.issue, page.affType]);

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
    else if (type === "faq") router.push("/faq");
    else if (type === "legal") router.push("/mentions-legales");
    else if (type === "guide") router.push("/comment-ca-marche");
    else if (type === "repair-guide") router.push("/guide/reparer-ou-racheter");
    else if (type === "about") router.push("/a-propos");
    else if (type === "contact") router.push("/contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <div style={{ minHeight: "100vh", background: W }}>
    <style>{CSS}</style>
    <a href="#main" className="skip-link">Aller au contenu</a>
    {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={m => { setUser({ name: m === "email" ? "Utilisateur" : `Utilisateur ${m}`, method: m }); setShowAuth(false); }} />}
    <Sidebar open={sidebar} onClose={() => setSidebar(false)} onNav={nav} />
    <Navbar onNav={nav} user={user} onAuth={() => user ? setUser(null) : setShowAuth(true)} onMenu={() => setSidebar(true)} />
    <main id="main">
    {page.type === "home" && <>
      <Hero onSearch={id => nav("compare", id)} onNav={nav} />
      {/* Populaires — FIRST */}
      <section style={{ padding: "36px 20px", background: "#fff", borderBottom: "1px solid #E0DDD5", transition: "all .25s ease" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", textAlign: "center", marginBottom: 4 }}>Recherches populaires</h2>
          <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginBottom: 16 }}>Les diagnostics et produits les plus consultés</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }} className="grid-2">
            {POPULAR_SEARCHES.map(({ label, intent, brand, name }) => {
              const item = findProductByPopular({ brand, name });
              if (!item) return null;
              const iss = getIssues(item);
              const v = getVerdict([iss[0]], item);
              return <Card key={item.id} onClick={() => nav("compare", item.id)} style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <ProductImg brand={item.brand} item={item} size={34} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: "#111" }}>{item.brand} {item.name}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{intent} · {iss[0].repairMin}–{iss[0].repairMax} €</div>
                </div>
                <Badge color={v.color}>{v.label}</Badge>
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
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#111", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", ...(cat.id === "electromenager" ? { whiteSpace: "nowrap" } : { wordBreak: "break-word", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }) }}>{cat.name}</div>
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
    {(page.type === "cat" || page.type === "cat-type" || page.type === "cat-brand") && (
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
    {page.type === "guide" && <GuidePage onNav={nav} />}
    {page.type === "repair-guide" && <RepairGuidePage onNav={nav} />}
    {page.type === "about" && <AboutPage onNav={nav} />}
    {page.type === "contact" && <ContactPage onNav={nav} />}
    </main>
    <Footer onNav={nav} />
  </div>;
}
