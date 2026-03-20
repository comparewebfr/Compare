import { Suspense } from "react";
import CompareApp from "../../../../../components/CompareAppWrapper";
import { ITEMS } from "../../../../../lib/data";
import { findProductBySlug, getIssues, findIssueBySlug } from "../../../../../lib/helpers";
import { getProductSlug, getIssueSlug } from "../../../../../lib/routes";

const SITE_URL = "https://compare-fr.com";

// Mapping slug panne → labels SEO
const ISSUE_LABELS = {
  "ecran-casse": { label: "Écran cassé", short: "écran cassé", article: "un" },
  "dalle-cassee": { label: "Dalle cassée", short: "dalle cassée", article: "une" },
  "batterie-usee": { label: "Batterie usée", short: "batterie usée", article: "une" },
  "batterie-faible": { label: "Batterie faible", short: "batterie faible", article: "une" },
  "batterie-ecouteur-usee": { label: "Batterie écouteur usée", short: "batterie écouteur usée", article: "une" },
  "batterie-boitier-usee": { label: "Batterie boîtier usée", short: "batterie boîtier usée", article: "une" },
  "camera-arriere-hs": { label: "Caméra arrière HS", short: "caméra arrière HS", article: "une" },
  "camera-avant-face-id": { label: "Caméra avant / Face ID HS", short: "caméra avant HS", article: "une" },
  "connecteur-de-charge": { label: "Connecteur de charge HS", short: "connecteur de charge HS", article: "un" },
  "connecteur-charge": { label: "Connecteur de charge HS", short: "connecteur de charge HS", article: "un" },
  "port-usb-hdmi": { label: "Port USB / HDMI HS", short: "port USB/HDMI HS", article: "un" },
  "port-hdmi-hs": { label: "Port HDMI HS", short: "port HDMI HS", article: "un" },
  "port-hdmi": { label: "Port HDMI HS", short: "port HDMI HS", article: "un" },
  "port-hdmi-displayport": { label: "Port HDMI / DisplayPort HS", short: "port HDMI/DP HS", article: "un" },
  "haut-parleur": { label: "Haut-parleur HS", short: "haut-parleur HS", article: "un" },
  "haut-parleurs": { label: "Haut-parleurs HS", short: "haut-parleurs HS", article: "des" },
  "haut-parleur-hs": { label: "Haut-parleur HS", short: "haut-parleur HS", article: "un" },
  "micro-hs": { label: "Micro HS", short: "micro HS", article: "un" },
  "son-d-un-cote-seulement": { label: "Son d'un seul côté", short: "son un seul côté", article: "un" },
  "bouton-power-volume": { label: "Bouton power / volume HS", short: "bouton power/volume HS", article: "un" },
  "bouton-power": { label: "Bouton power HS", short: "bouton power HS", article: "un" },
  "bouton-home-touch-id": { label: "Bouton Home / Touch ID HS", short: "bouton Home HS", article: "un" },
  "boutons-defectueux": { label: "Boutons défectueux", short: "boutons défectueux", article: "des" },
  "vitre-arriere-cassee": { label: "Vitre arrière cassée", short: "vitre arrière cassée", article: "une" },
  "wifi-bluetooth-hs": { label: "WiFi / Bluetooth HS", short: "WiFi/Bluetooth HS", article: "un" },
  "wifi-bluetooth": { label: "WiFi / Bluetooth HS", short: "WiFi/Bluetooth HS", article: "un" },
  "bluetooth-connexion": { label: "Bluetooth / Connexion HS", short: "Bluetooth HS", article: "un" },
  "vibreur-hs": { label: "Vibreur HS", short: "vibreur HS", article: "un" },
  "vibration-hs": { label: "Vibration HS", short: "vibration HS", article: "une" },
  "grille-mesh-sale": { label: "Grille mesh sale", short: "grille mesh sale", article: "une" },
  "coussinets-uses": { label: "Coussinets usés", short: "coussinets usés", article: "des" },
  "arceau-casse": { label: "Arceau cassé", short: "arceau cassé", article: "un" },
  "cable-audio": { label: "Câble audio HS", short: "câble audio HS", article: "un" },
  "bracelet-use": { label: "Bracelet usé", short: "bracelet usé", article: "un" },
  "capteurs-hs": { label: "Capteurs HS", short: "capteurs HS", article: "des" },
  "clavier-defectueux": { label: "Clavier défectueux", short: "clavier défectueux", article: "un" },
  "upgrade-ssd": { label: "Upgrade SSD", short: "upgrade SSD", article: "un" },
  "upgrade-ram": { label: "Upgrade RAM", short: "upgrade RAM", article: "un" },
  "charniere-cassee": { label: "Charnière cassée", short: "charnière cassée", article: "une" },
  "ventilateur-bruyant": { label: "Ventilateur bruyant", short: "ventilateur bruyant", article: "un" },
  "ventilateur": { label: "Ventilateur HS", short: "ventilateur HS", article: "un" },
  "touchpad-hs": { label: "Touchpad HS", short: "touchpad HS", article: "un" },
  "lecteur-disque-hs": { label: "Lecteur disque HS", short: "lecteur disque HS", article: "un" },
  "surchauffe-pate-thermique": { label: "Surchauffe / pâte thermique", short: "surchauffe", article: "une" },
  "alimentation-hs": { label: "Alimentation HS", short: "alimentation HS", article: "une" },
  "ssd-stockage-plein": { label: "SSD / Stockage plein", short: "stockage plein", article: "un" },
  "stick-drift-joystick": { label: "Stick drift / joystick", short: "stick drift", article: "un" },
  "stick-drift": { label: "Stick drift", short: "stick drift", article: "un" },
  "gachettes-cassees": { label: "Gâchettes cassées", short: "gâchettes cassées", article: "des" },
  "rail-joy-con-port": { label: "Rail Joy-Con HS", short: "rail Joy-Con HS", article: "un" },
  "retroeclairage-hs": { label: "Rétroéclairage HS", short: "rétroéclairage HS", article: "un" },
  "carte-alimentation": { label: "Carte alimentation HS", short: "carte alimentation HS", article: "une" },
  "carte-t-con": { label: "Carte T-Con HS", short: "carte T-Con HS", article: "une" },
  "carte-electronique": { label: "Carte électronique HS", short: "carte électronique HS", article: "une" },
  "moteur-hs": { label: "Moteur HS", short: "moteur HS", article: "un" },
  "filtre-bouche": { label: "Filtre bouché", short: "filtre bouché", article: "un" },
  "brosse-motorisee": { label: "Brosse motorisée HS", short: "brosse motorisée HS", article: "une" },
  "brosse-principale": { label: "Brosse principale HS", short: "brosse principale HS", article: "une" },
  "tube-manche-casse": { label: "Tube / manche cassé", short: "tube cassé", article: "un" },
  "roue-roulette": { label: "Roue / roulette HS", short: "roue HS", article: "une" },
  "reservoir-serpillere": { label: "Réservoir / serpillère HS", short: "réservoir HS", article: "un" },
  "station-de-charge": { label: "Station de charge HS", short: "station de charge HS", article: "une" },
  "piece-d-usure": { label: "Pièce d'usure", short: "pièce d'usure", article: "une" },
  "usure-normale": { label: "Usure normale", short: "usure normale", article: "une" },
};

function getIssueInfo(issueType) {
  return ISSUE_LABELS[issueType] || { label: issueType.replace(/-/g, " "), short: issueType.replace(/-/g, " "), article: "un" };
}

export async function generateMetadata({ params }) {
  const { productSlug, issueType } = await params;
  const item = findProductBySlug(productSlug);
  if (!item) return { title: "Produit introuvable | Compare." };

  const name = `${item.brand} ${item.name}`;
  const info = getIssueInfo(issueType);

  // Essayer de trouver l'issue réelle pour les prix
  const issue = findIssueBySlug(item, issueType);
  const repairRange = issue ? `${issue.repairMin}–${issue.repairMax} €` : null;

  const title = `${name} ${info.label} : réparer ou racheter ? | Compare.`;
  const description = repairRange
    ? `Votre ${name} a ${info.article} ${info.short} ? Réparation dès ${issue.repairMin} €, ou rachetez neuf / reconditionné. Comparez toutes les options sur Compare.`
    : `Votre ${name} a ${info.article} ${info.short} ? Comparez le coût de réparation vs racheter neuf ou reconditionné.`;

  const canonical = `${SITE_URL}/produits/${productSlug}/reparer/${issueType}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      siteName: "Compare.",
      type: "website",
      url: canonical,
    },
  };
}

export async function generateStaticParams() {
  const params = [];
  const EXCLUDED_CATS = ["electromenager", "plomberie", "chauffage", "jardin"];

  for (const item of ITEMS) {
    if (EXCLUDED_CATS.includes(item.category)) continue;
    const productSlug = getProductSlug(item);
    const issues = getIssues(item);
    for (const issue of issues) {
      params.push({ productSlug, issueType: getIssueSlug(issue) });
    }
  }
  return params;
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F6F0" }}>Chargement...</div>}>
      <CompareApp />
    </Suspense>
  );
}
