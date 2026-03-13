"use client";

import { useState } from "react";
import { Icon, Logo, Chev } from "../shared";
import { ACCENT, GREEN, AMBER, F } from "../../lib/constants";
import { ITEMS, CATS } from "../../lib/data";

// ─── FAQ ───
export function FaqPage({ onNav }) {
  const faqs = [
    { q: "Comment fonctionne Compare. ?", a: "Tapez le nom de votre appareil (iPhone 15, lave-linge Bosch, PS5…), choisissez la panne, et Compare. affiche côte à côte : coût de réparation estimé, prix reconditionné et prix neuf. Un verdict vous indique l'option la plus logique. Le tout en une trentaine de secondes." },
    { q: "Les prix affichés sont-ils fiables ?", a: "Ce sont des fourchettes basées sur les tarifs moyens en France (pièces + main d'œuvre). Ils varient selon le réparateur, la région et la disponibilité des pièces. À utiliser comme ordre de grandeur — un devis reste la référence pour trancher." },
    { q: "C'est quoi le bonus QualiRépar ?", a: "Une aide de l'État (15 à 60 €) déduite automatiquement chez un réparateur labellisé QualiRépar. Pas de dossier à remplir : vous allez chez le pro, la réduction est appliquée sur la facture. Éligible : smartphones, électroménager, ordinateurs, TV, consoles, etc." },
    { q: "Compare. est-il gratuit ?", a: "Oui, 100 % gratuit. Nous sommes rémunérés par des commissions d'affiliation lorsque vous achetez via nos liens — sans surcoût pour vous." },
    { q: "Puis-je cumuler plusieurs pannes ?", a: "Oui. Sur chaque page produit, cliquez sur « Plusieurs problèmes ? » pour sélectionner plusieurs pannes et voir le coût total. Pratique quand votre appareil cumule écran cassé + batterie usée, par exemple." },
    { q: "Comment sont calculées les estimations de réparation ?", a: "Nous nous appuyons sur les tarifs moyens des pièces détachées et de la main d'œuvre en France, les tutoriels vidéo et les retours de réparateurs. Les fourchettes donnent un ordre de grandeur réaliste — un devis reste la référence." },
    { q: "Puis-je suggérer un produit à ajouter ?", a: "Oui. Utilisez la page Contact pour nous envoyer votre suggestion. Nous intégrons les appareils les plus demandés." },
    { q: "Les liens d'achat sont-ils sécurisés ?", a: "Oui. Nous redirigeons vers des marchands reconnus (Amazon, Back Market, Fnac, Darty, etc.). Vous achetez directement chez eux — nous ne stockons aucune donnée de paiement." },
    { q: "Compare. affiche-t-il les vrais prix en temps réel ?", a: "Les prix neuf et reconditionné sont indicatifs (basés sur les tarifs habituels). Pour les prix exacts, cliquez sur les liens pour voir les offres actuelles sur chaque site partenaire." },
    { q: "Comment proposer un produit manquant ?", a: "Rendez-vous sur la page Contact. Nous examinons chaque suggestion et ajoutons les appareils les plus demandés." },
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
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Avantages</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Les avantages de la réparation</h1></div>
    <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>Réparer plutôt que remplacer, c'est souvent le meilleur choix : économies, durée de vie prolongée, impact écologique. Voici pourquoi.</p>

    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 14 }}>Pourquoi réparer ?</h2>
    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
      {[
        { icon: "money", title: "Économies réelles", desc: "Une réparation coûte souvent 50 à 200 € — bien moins qu'un remplacement (400 à 1000 € pour un smartphone ou un lave-linge). Vous gardez un appareil fonctionnel sans vous ruiner." },
        { icon: "clock", title: "Durée de vie prolongée", desc: "Un appareil bien réparé peut tenir encore plusieurs années. Vous maximisez votre investissement initial au lieu de racheter trop tôt." },
        { icon: "shield", title: "Bonus QualiRépar", desc: "L'État déduit 15 à 60 € directement chez un réparateur labellisé. Aucune démarche — la réduction s'applique sur la facture." },
        { icon: "tool", title: "Apprendre en faisant", desc: "Beaucoup de pannes (batterie, joint, filtre) se réparent en réparation autonome avec un tutoriel. Une compétence utile pour la suite." },
      ].map((a, i) => <div key={i} style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", padding: "16px 18px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: ACCENT + "10", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <Icon name={a.icon} s={18} color={ACCENT} />
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>{a.title}</h3>
        <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{a.desc}</p>
      </div>)}
    </div>

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

    <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16, lineHeight: 1.6 }}>Consultez aussi notre <button type="button" onClick={() => onNav("repair-guide")} style={{ background: "none", border: "none", padding: 0, font: "inherit", color: ACCENT, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>guide réparer ou racheter</button> pour les critères de décision détaillés.</p>

    <div style={{ textAlign: "center", padding: "24px 20px", background: `linear-gradient(135deg, ${ACCENT}, ${GREEN})`, borderRadius: 10 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Comparez pour votre appareil</h3>
      <p style={{ fontSize: 13, color: "#B7E4C7", marginBottom: 14 }}>Découvrez si la réparation est le meilleur choix pour vous.</p>
      <button onClick={() => onNav("home")} className="btn-cta" style={{ padding: "12px 28px", borderRadius: 10, border: "2px solid #fff", background: "#fff", color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Comparer maintenant →</button>
    </div>
  </div>;
}

// ─── GUIDE PAGE ───
export function GuidePage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Comment ça marche</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Comment ça marche ?</h1></div>
    <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>Compare. vous aide à trancher : réparer, racheter d'occasion ou remplacer par du neuf. En 3 étapes, sans inscription.</p>

    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 32 }}>
      {[
        { n: "1", icon: "search", title: "Recherchez votre appareil", desc: `Tapez le nom de votre produit parmi nos ${ITEMS.length} références : iPhone, MacBook, lave-linge Bosch, PS5, chauffe-eau… Si votre modèle n'apparaît pas, suggérez-le via la page Contact.`, color: GREEN },
        { n: "2", icon: "chart", title: "Comparez les 3 options", desc: "Indiquez votre panne (écran cassé, batterie HS, fuite…). Compare. estime le coût de réparation, le prix reconditionné et le prix neuf. Un verdict vous indique la solution la plus logique.", color: AMBER },
        { n: "3", icon: "check", title: "Passez à l'action", desc: "Accédez aux tutoriels vidéo, aux pièces détachées ou aux offres des marchands. Vous savez combien vous économisez et quelle option fait sens pour votre situation.", color: ACCENT },
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

    <div style={{ textAlign: "center", padding: "24px 20px", background: `linear-gradient(135deg, ${ACCENT}, ${GREEN})`, borderRadius: 10 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Logo s={40} /></div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Prêt à comparer ?</h3>
      <p style={{ fontSize: 13, color: "#B7E4C7", marginBottom: 14 }}>Trouvez la meilleure option pour votre appareil en quelques secondes.</p>
      <button onClick={() => onNav("home")} className="btn-cta" style={{ padding: "12px 28px", borderRadius: 10, border: "2px solid #fff", background: "#fff", color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Comparer maintenant →</button>
    </div>
  </div>;
}

// ─── REPAIR GUIDE PAGE ───
export function RepairGuidePage({ onNav }) {
  return <div className="page-enter" style={{ fontFamily: F, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, display: "flex", gap: 5, alignItems: "center" }}><span style={{ cursor: "pointer", color: "#111", fontWeight: 500 }} onClick={() => onNav("home")}>Accueil</span><Chev /><span>Guide</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><Logo s={48} /><h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: 0 }}>Réparer ou racheter : le guide complet</h1></div>
    <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.7 }}>Vous hésitez entre faire réparer votre appareil ou le remplacer ? Ce guide vous aide à prendre la bonne décision selon votre panne, l'âge de l'appareil et le coût.</p>

    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 12 }}>Les critères de décision</h2>
    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
      {[
        { icon: "money", title: "Le coût de réparation", desc: "Comparez le devis à la valeur d'un appareil neuf ou reconditionné. Une réparation peu coûteuse (pièce d'usure, panne courante) reste presque toujours rentable. Quand le devis s'approche du prix du neuf, le remplacement devient plus logique." },
        { icon: "calendar", title: "L'âge de l'appareil", desc: "Un appareil récent a encore une longue durée de vie devant lui — la réparation maximise votre investissement. Au-delà de 7 à 10 ans, les pièces se raréfient et les modèles récents offrent souvent plus de performance ou d'économies d'énergie." },
        { icon: "tool", title: "La difficulté technique", desc: "Batterie, filtre, joint : ces pannes sont souvent réparables en réparation autonome avec un tutoriel. Les interventions plus lourdes (carte électronique, démontage complexe) demandent un professionnel — pensez au bonus QualiRépar." },
        { icon: "leaf", title: "L'impact écologique", desc: "Chaque appareil réparé, c'est un appareil de moins à produire et à recycler. Réparer un smartphone évite environ 70 kg de CO₂ ; un lave-linge, ~200 kg. L'impact est concret, sans être miraculeux." },
      ].map((c, i) => <div key={i} style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", padding: "16px 18px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: ACCENT + "10", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <Icon name={c.icon} s={18} color={ACCENT} />
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>{c.title}</h3>
        <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{c.desc}</p>
      </div>)}
    </div>

    <div style={{ background: GREEN + "10", borderRadius: 8, border: `1px solid ${GREEN}30`, padding: "18px 20px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: GREEN, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="check" s={16} color={GREEN} /> Quand réparer ?
      </h2>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 6 }}><strong>Devis raisonnable :</strong> quand la réparation reste bien en dessous du prix d'un neuf ou d'un reconditionné, c'est presque toujours le meilleur choix. Vous gardez un appareil fonctionnel et vous réalisez une vraie économie.</p>
        <p style={{ marginBottom: 6 }}><strong>Panne simple et courante :</strong> écran cassé, batterie usée, pompe de vidange HS, joint de porte abîmé. Ces pannes sont fréquentes, bien documentées et les pièces circulent.</p>
        <p style={{ marginBottom: 6 }}><strong>Appareil récent :</strong> un produit de moins de 3 à 5 ans a encore une longue durée de vie devant lui. La réparation maximise votre investissement initial.</p>
        <p><strong>Pièces disponibles :</strong> si les pièces existent (Spareka, Amazon), la réparation est viable. Compare. vous aide à estimer le coût et à trouver les références.</p>
      </div>
    </div>

    <div style={{ background: "#DC262610", borderRadius: 8, border: "1px solid #DC262630", padding: "18px 20px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#DC2626", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="swap" s={16} color="#DC2626" /> Quand remplacer ?
      </h2>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 6 }}><strong>Devis qui s'approche du neuf :</strong> quand la réparation coûte presque autant qu'un appareil neuf ou reconditionné, le remplacement devient plus logique. Le reconditionné offre souvent un bon compromis (garantie, prix réduit).</p>
        <p style={{ marginBottom: 6 }}><strong>Pannes multiples :</strong> si votre appareil cumule plusieurs problèmes, le coût total peut vite dépasser le seuil de rentabilité. Un seul devis global vous aidera à trancher.</p>
        <p style={{ marginBottom: 6 }}><strong>Appareil obsolète :</strong> au-delà de 7 à 10 ans, les pièces se raréfient. Les modèles récents sont souvent plus performants, plus économes ou plus sûrs.</p>
        <p><strong>Carte mère ou composant critique HS :</strong> ces réparations sont coûteuses et la fiabilité n'est pas toujours garantie. Le remplacement est souvent plus rassurant.</p>
      </div>
    </div>

    <div style={{ background: AMBER + "10", borderRadius: 8, border: `1px solid ${AMBER}30`, padding: "18px 20px", marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: AMBER, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="recycle" s={16} color={AMBER} /> L'option reconditionné / occasion
      </h2>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 6 }}>Quand la réparation coûte trop cher mais que le neuf vous semble excessif, le reconditionné fait souvent sens. Garanti 12 à 24 mois, testé et remis à neuf, il offre un appareil quasi-neuf à prix réduit. Très développé pour la tech (smartphones, consoles, PC), moins pour l'électroménager.</p>
        <p>Compare. référence Back Market, Amazon Renewed, Rakuten et Cdiscount pour comparer les offres selon votre produit.</p>
      </div>
    </div>

    <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0DDD5", padding: "18px 20px", marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: ACCENT, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="shield" s={16} color={ACCENT} /> L'aide de l'État — Bonus QualiRépar
      </h2>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <p style={{ marginBottom: 6 }}>L'État français propose une aide de <strong>15 à 60 €</strong> sur la réparation d'appareils électriques et électroniques. Le montant varie selon le produit (ex. : smartphone 25 €, lave-linge 50 €, TV 60 €). La réduction est déduite directement sur la facture chez un réparateur labellisé QualiRépar.</p>
        <p style={{ marginBottom: 6 }}><strong>Conditions :</strong> réparateur labellisé QualiRépar, appareil hors garantie constructeur. Aucune démarche : la réduction s'applique automatiquement à la caisse.</p>
        <p><strong>Appareils éligibles :</strong> smartphones, tablettes, ordinateurs, TV, consoles, électroménager, aspirateurs, machines à café, vélos électriques, etc.</p>
      </div>
    </div>

    <div style={{ background: "#F8FAFC", borderRadius: 8, border: "1px solid #E5E3DE", padding: "18px 20px", marginBottom: 28 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 10 }}>Guides par type de produit</h3>
      <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 12, lineHeight: 1.5 }}>Consultez nos recommandations spécifiques : symptômes, pannes courantes et verdict selon le produit.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[
          { catId: "electromenager", productType: "Lave-linge" },
          { catId: "electromenager", productType: "Lave-vaisselle" },
          { catId: "electromenager", productType: "Réfrigérateur" },
          { catId: "electromenager", productType: "Sèche-linge" },
          { catId: "electromenager", productType: "Four" },
          { catId: "electromenager", productType: "Plaque induction" },
          { catId: "smartphones", productType: "Smartphone" },
          { catId: "consoles", productType: "Console de salon" },
          { catId: "plomberie", productType: "Chauffe-eau" },
          { catId: "ordinateurs", productType: "PC Portable" },
        ].map(({ catId, productType }) => (
          <button key={productType} type="button" onClick={() => onNav("cat-type", { catId, productType })} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #E0DDD5", background: "#fff", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: F }} onMouseEnter={e => { e.currentTarget.style.background = ACCENT + "12"; e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }} onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E0DDD5"; e.currentTarget.style.color = "#374151"; }}>{productType}</button>
        ))}
      </div>
    </div>

    <div style={{ textAlign: "center", padding: "24px 20px", background: `linear-gradient(135deg, ${ACCENT}, ${GREEN})`, borderRadius: 10 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Testez Compare. sur votre appareil</h3>
      <p style={{ fontSize: 13, color: "#B7E4C7", marginBottom: 14 }}>Recherchez votre produit et découvrez le verdict en quelques secondes.</p>
      <button onClick={() => onNav("home")} className="btn-cta" style={{ padding: "12px 28px", borderRadius: 10, border: "2px solid #fff", background: "#fff", color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Comparer maintenant →</button>
    </div>
  </div>;
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
