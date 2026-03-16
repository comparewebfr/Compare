"use client";

import { useState } from "react";
import { Icon, Logo, Chev } from "../shared";
import { ACCENT, GREEN, AMBER, F } from "../../lib/constants";
import { ITEMS, CATS, FAQ_QUESTIONS } from "../../lib/data";
import guideStyles from "./Guide.module.css";

// ─── FAQ ───
export function FaqPage({ onNav }) {
  const faqs = FAQ_QUESTIONS;
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
export function LegalPage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Mentions légales</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Mentions légales</h1></div>
    <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 28 }}>Conformément aux dispositions des articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), les présentes mentions légales sont portées à la connaissance des utilisateurs du site Compare.</p>
    {[
      { t: "Éditeur du site", c: "Le site Compare. est édité par [Raison sociale]. Siège social : [Adresse complète]. SIRET : [numéro]. Directeur de la publication : [nom du responsable]." },
      { t: "Hébergement", c: "Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis." },
      { t: "Programmes d'affiliation", c: "Compare. participe à des programmes d'affiliation (Amazon Partenaires, Awin, CJ Affiliate, etc.). Lorsque vous cliquez sur un lien partenaire et effectuez un achat, nous percevons une commission sans surcoût pour vous. Les prix affichés restent ceux pratiqués par les marchands." },
      { t: "Données personnelles (RGPD)", c: "Conformément au Règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Pour exercer ces droits ou pour toute question : compare.webfr@gmail.com. Nous ne collectons pas de données personnelles identifiables via les fonctionnalités de comparaison." },
      { t: "Cookies", c: "Le site utilise des cookies techniques nécessaires au fonctionnement et, le cas échéant, des cookies analytiques pour mesurer l'audience. Vous pouvez gérer vos préférences via les paramètres de votre navigateur." },
      { t: "Propriété intellectuelle", c: "L'ensemble du contenu (textes, visuels, structure) est protégé par le droit d'auteur. Toute reproduction, représentation ou exploitation non autorisée est interdite." },
      { t: "Limitation de responsabilité", c: "Les informations (prix, estimations de réparation, verdicts) sont fournies à titre indicatif. Compare. ne garantit pas leur exactitude ni leur exhaustivité. Les prix peuvent varier selon les marchands et le moment. Nous déclinons toute responsabilité quant aux achats effectués auprès des partenaires ou à la qualité des réparations réalisées par des tiers." },
      { t: "Liens hypertextes", c: "Le site peut contenir des liens vers des sites externes. Compare. n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu." },
    ].map((s, i) => <div key={i} style={{ marginBottom: 20 }}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 6 }}>{s.t}</h3><p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>{s.c}</p></div>)}
    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 24 }}>Dernière mise à jour : février 2025</p>
  </div>;
}

// ─── AVANTAGES PAGE ───
export function AdvantagesPage({ onNav }) {
  const advantages = [
    { icon: "money", title: "Économies réelles", desc: "Une réparation coûte souvent 50 à 200 € — bien moins qu'un remplacement (400 à 1000 € pour un smartphone ou un lave-linge). Vous gardez un appareil fonctionnel sans vous ruiner.", highlight: "50–200 € vs 400–1000 €" },
    { icon: "clock", title: "Durée de vie prolongée", desc: "Un appareil bien réparé peut tenir encore plusieurs années. Vous maximisez votre investissement initial au lieu de racheter trop tôt.", highlight: "+ plusieurs années" },
    { icon: "shield", title: "Bonus QualiRépar", desc: "L'État déduit 15 à 60 € directement chez un réparateur labellisé. Aucune démarche — la réduction s'applique sur la facture.", highlight: "15–60 € déduits" },
    { icon: "tool", title: "Apprendre en faisant", desc: "Beaucoup de pannes (batterie, joint, filtre) se réparent en réparation autonome avec un tutoriel. Une compétence utile pour la suite.", highlight: "DIY possible" },
  ];
  return (
    <div className={`page-enter ${guideStyles.guide}`}>
      <header className={guideStyles.hero}>
        <nav className={guideStyles.breadcrumb} aria-label="Fil d'Ariane">
          <button type="button" className={guideStyles.breadcrumbBtn} onClick={() => onNav("home")}>Accueil</button>
          <Chev />
          <span>Avantages</span>
        </nav>
        <div className={guideStyles.heroContent}>
          <h1 className={guideStyles.heroTitle}>Les avantages de la réparation</h1>
          <p className={guideStyles.heroSubtitle}>Économies, durée de vie prolongée, impact écologique. Voici pourquoi réparer est souvent le meilleur choix.</p>
        </div>
      </header>
      <main className={guideStyles.content}>
        <div className={guideStyles.contentInner}>
          <h2 className={guideStyles.sectionTitle}>Pourquoi réparer ?</h2>
          <div className={guideStyles.advantageGrid}>
            {advantages.map((a, i) => (
              <div key={i} className={guideStyles.advantageCard}>
                <div className={guideStyles.advantageIcon}><Icon name={a.icon} s={24} color={ACCENT} /></div>
                <span className={guideStyles.advantageHighlight}>{a.highlight}</span>
                <h3 className={guideStyles.advantageTitle}>{a.title}</h3>
                <p className={guideStyles.advantageDesc}>{a.desc}</p>
              </div>
            ))}
          </div>

          <div className={`${guideStyles.tipBlock} ${guideStyles.tipGreen} ${guideStyles.planetBlock}`}>
            <h3 className={guideStyles.tipTitle}><Icon name="leaf" s={20} color={GREEN} /> Bon pour la planète ?</h3>
            <p className={guideStyles.planetLead}>Oui. Réparer réduit les déchets et les émissions de CO₂. Chaque appareil réparé, c'est un appareil de moins à produire et à recycler.</p>
            <div className={guideStyles.planetExamples}>
              <span>Smartphone : ~70 kg CO₂ évités</span>
              <span>Lave-linge : ~200 kg CO₂ évités</span>
            </div>
            <p className={guideStyles.planetNote}>L'impact est concret — une contribution parmi d'autres gestes du quotidien.</p>
          </div>

          <p className={guideStyles.advantageLink}>Consultez aussi notre <button type="button" onClick={() => onNav("repair-guide")} className={guideStyles.advantageLinkBtn}>guide réparer ou racheter</button> pour les critères de décision détaillés.</p>

          <div className={guideStyles.ctaBlock}>
            <h3 className={guideStyles.ctaTitle}>Comparez pour votre appareil</h3>
            <p className={guideStyles.ctaSub}>Découvrez si la réparation est le meilleur choix pour vous.</p>
            <button type="button" onClick={() => onNav("home")} className={guideStyles.ctaBtn}>Comparer maintenant →</button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── GUIDE PAGE (Comment ça marche) ───
export function GuidePage({ onNav }) {
  const steps = [
    { n: "1", icon: "search", title: "Recherchez", desc: `Tapez le nom de votre appareil (iPhone, MacBook, lave-linge…). ${ITEMS.length}+ références. Modèle absent ? Suggérez-le via Contact.`, color: GREEN },
    { n: "2", icon: "chart", title: "Comparez", desc: "Indiquez la panne. Compare. affiche réparation, reconditionné et neuf côte à côte, avec un verdict clair.", color: AMBER },
    { n: "3", icon: "check", title: "Agissez", desc: "Tutoriels vidéo, pièces détachées, offres marchands. Vous savez quoi faire en 30 secondes.", color: ACCENT },
  ];
  const benefits = [
    { icon: "money", title: "Économies", desc: "Jusqu'à 80% vs neuf" },
    { icon: "clock", title: "Rapidité", desc: "Décision en 30 s" },
    { icon: "leaf", title: "Écologie", desc: "Moins de CO₂" },
    { icon: "tool", title: "Tutoriels", desc: "Vidéos par panne" },
    { icon: "chart", title: "Transparence", desc: "3 options comparées" },
    { icon: "shield", title: "QualiRépar", desc: "15–60 € d'aide" },
  ];
  return (
    <div className={`page-enter ${guideStyles.guide}`}>
      <header className={guideStyles.hero}>
        <nav className={guideStyles.breadcrumb} aria-label="Fil d'Ariane">
          <button type="button" className={guideStyles.breadcrumbBtn} onClick={() => onNav("home")}>Accueil</button>
          <Chev />
          <span>Comment ça marche</span>
        </nav>
        <div className={guideStyles.heroContent}>
          <h1 className={guideStyles.heroTitle}>Comment ça marche ?</h1>
          <p className={guideStyles.heroSubtitle}>Réparer, occasion ou neuf ? En 3 étapes, sans inscription.</p>
        </div>
      </header>
      <main className={guideStyles.content}>
        <div className={guideStyles.contentInner}>
          <h2 className={guideStyles.sectionTitle}>3 étapes simples</h2>
          {steps.map((s, i) => (
            <div key={i} className={guideStyles.stepCard}>
              <div className={guideStyles.stepNum} style={{ background: s.color }}>{s.n}</div>
              <div>
                <h3 className={guideStyles.stepTitle}>{s.title}</h3>
                <p className={guideStyles.stepDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
          <h2 className={guideStyles.sectionTitle}>Ce que vous gagnez</h2>
          <div className={guideStyles.benefitGrid}>
            {benefits.map((f, i) => (
              <div key={i} className={guideStyles.benefitCard}>
                <div className={guideStyles.benefitIcon}><Icon name={f.icon} s={20} color={ACCENT} /></div>
                <div className={guideStyles.benefitTitle}>{f.title}</div>
                <div className={guideStyles.benefitDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div className={guideStyles.ctaBlock}>
            <h3 className={guideStyles.ctaTitle}>Prêt à comparer ?</h3>
            <p className={guideStyles.ctaSub}>Trouvez la meilleure option en quelques secondes.</p>
            <button type="button" onClick={() => onNav("home")} className={guideStyles.ctaBtn}>Comparer maintenant →</button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── REPAIR GUIDE PAGE (Réparer ou racheter) ───
export function RepairGuidePage({ onNav }) {
  const criteria = [
    { icon: "money", title: "Le coût", desc: "Réparation peu chère = souvent rentable. Devis proche du neuf = remplacement plus logique." },
    { icon: "calendar", title: "L'âge", desc: "Appareil récent = réparer. Au-delà de 7–10 ans = pièces rares, modèles récents plus performants." },
    { icon: "tool", title: "La difficulté", desc: "Batterie, joint, filtre = DIY possible. Carte électronique = pro (pensez QualiRépar)." },
    { icon: "leaf", title: "L'impact", desc: "Réparer = moins de CO₂. Smartphone ~70 kg, lave-linge ~200 kg évités." },
  ];
  const productTypes = [
    { catId: "electromenager", productType: "Lave-linge" },
    { catId: "electromenager", productType: "Lave-vaisselle" },
    { catId: "electromenager", productType: "Réfrigérateur" },
    { catId: "electromenager", productType: "Four" },
    { catId: "smartphones", productType: "Smartphone" },
    { catId: "consoles", productType: "Console de salon" },
    { catId: "plomberie", productType: "Chauffe-eau" },
    { catId: "ordinateurs", productType: "PC Portable" },
  ];
  return (
    <div className={`page-enter ${guideStyles.guide}`}>
      <header className={guideStyles.hero}>
        <nav className={guideStyles.breadcrumb} aria-label="Fil d'Ariane">
          <button type="button" className={guideStyles.breadcrumbBtn} onClick={() => onNav("home")}>Accueil</button>
          <Chev />
          <span>Guide réparer ou racheter</span>
        </nav>
        <div className={guideStyles.heroContent}>
          <h1 className={guideStyles.heroTitle}>Réparer ou racheter ?</h1>
          <p className={guideStyles.heroSubtitle}>Les critères pour prendre la bonne décision selon votre panne et votre appareil.</p>
        </div>
      </header>
      <main className={guideStyles.content}>
        <div className={guideStyles.contentInner}>
          <div className={guideStyles.criteriaSection}>
            <h2 className={guideStyles.sectionTitle}>4 critères</h2>
            <div className={guideStyles.criteriaGrid}>
            {criteria.map((c, i) => (
              <div key={i} className={guideStyles.criteriaCard}>
                <div className={guideStyles.criteriaIcon}><Icon name={c.icon} s={24} color={ACCENT} /></div>
                <h3 className={guideStyles.criteriaTitle}>{c.title}</h3>
                <p className={guideStyles.criteriaDesc}>{c.desc}</p>
              </div>
            ))}
            </div>
          </div>

          <div className={`${guideStyles.tipBlock} ${guideStyles.tipGreen}`}>
            <h3 className={guideStyles.tipTitle}><Icon name="check" s={18} color={GREEN} /> Quand réparer ?</h3>
            <ul className={guideStyles.tipList}>
              <li>Devis raisonnable (bien en dessous du neuf/reconditionné)</li>
              <li>Panne simple : écran, batterie, joint, pompe de vidange</li>
              <li>Appareil récent (&lt; 3–5 ans)</li>
              <li>Pièces disponibles (Spareka, Amazon)</li>
            </ul>
          </div>

          <div className={`${guideStyles.tipBlock} ${guideStyles.tipRed}`}>
            <h3 className={guideStyles.tipTitle}><Icon name="swap" s={18} color="#DC2626" /> Quand remplacer ?</h3>
            <ul className={guideStyles.tipList}>
              <li>Devis proche du neuf ou reconditionné</li>
              <li>Pannes multiples (coût total élevé)</li>
              <li>Appareil obsolète (7–10 ans+)</li>
              <li>Carte mère ou composant critique HS</li>
            </ul>
          </div>

          <div className={`${guideStyles.tipBlock} ${guideStyles.tipAmber}`}>
            <h3 className={guideStyles.tipTitle}><Icon name="recycle" s={18} color={AMBER} /> Reconditionné</h3>
            <p className={guideStyles.tipText}>Quand la réparation coûte trop cher mais que le neuf semble excessif : reconditionné garanti 12–24 mois, quasi-neuf à prix réduit. Très développé pour la tech, moins pour l'électroménager. Compare. référence Back Market, Amazon Renewed, Rakuten, Cdiscount.</p>
          </div>

          <div className={guideStyles.qualireparBlock}>
            <h3 className={guideStyles.qualireparTitle}><Icon name="shield" s={18} color={ACCENT} /> Bonus QualiRépar</h3>
            <p className={guideStyles.qualireparText}>Aide de l'État : <strong>15 à 60 €</strong> déduits sur la facture chez un réparateur labellisé. Smartphone 25 €, lave-linge 50 €, TV 60 €. Aucune démarche — réduction automatique à la caisse.</p>
          </div>

          <h2 className={guideStyles.sectionTitle}>Guides par produit</h2>
          <div className={guideStyles.pillWrap}>
            {productTypes.map(({ catId, productType }) => (
              <button key={productType} type="button" className={guideStyles.pill} onClick={() => onNav("cat-type", { catId, productType })}>{productType}</button>
            ))}
          </div>

          <div className={guideStyles.ctaBlock}>
            <h3 className={guideStyles.ctaTitle}>Testez sur votre appareil</h3>
            <p className={guideStyles.ctaSub}>Recherchez et découvrez le verdict en quelques secondes.</p>
            <button type="button" onClick={() => onNav("home")} className={guideStyles.ctaBtn}>Comparer maintenant →</button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── ABOUT PAGE ───
export function AboutPage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 660, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>À propos</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>À propos de Compare.</h1></div>
    <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
      <p style={{ marginBottom: 12 }}>Basés à Paris, nous avons créé Compare. pour répondre à une question que tout le monde se pose : <strong>réparer, acheter d'occasion ou racheter neuf ?</strong> Pas de réponse toute faite — tout dépend de la panne, de l'âge de l'appareil et du coût.</p>
      <p style={{ marginBottom: 12 }}>Notre objectif : vous donner les éléments pour trancher en 30 secondes. Coûts indicatifs, verdict clair, liens vers les tutoriels, pièces et marchands. Que vous soyez bricoleur ou que vous préfériez confier à un pro, vous savez où vous en êtes.</p>
      <p style={{ marginBottom: 12 }}>Un appareil réparé, c'est un appareil de moins à produire et à recycler. Chaque réparation compte — et chaque euro économisé aussi.</p>
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
export function ContactPage({ onNav }) {
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
