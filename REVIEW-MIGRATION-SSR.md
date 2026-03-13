# Revue de code — Migration SSR pour Compare.

## Contexte

Migration SEO/SSR sur un site Next.js 16 (comparateur "réparer vs occasion vs neuf"). L'objectif : que Google reçoive des métadonnées et du contenu HTML côté serveur au lieu de "Chargement...".

## Fichiers modifiés / créés

### Créés
- `src/components/JsonLd.jsx` — Composants JSON-LD (Product, FAQ, Breadcrumb)
- `src/lib/data.js` — Ajout de `FAQ_QUESTIONS` (export)

### Modifiés
- `src/app/layout.jsx` — Suppression du `<link rel="canonical" href="https://compare-fr.com/" />`
- `src/app/page.jsx` — Ajout de `HomeSeoContent` (sr-only)
- `src/app/faq/page.jsx` — metadata + FaqJsonLd
- `src/app/produits/[productSlug]/page.jsx` — generateMetadata, generateStaticParams, ProductSeoContent, JsonLd
- `src/app/produits/[productSlug]/[issueSlug]/page.jsx` — generateMetadata adapté
- `src/app/produits/[productSlug]/acheter-neuf/page.jsx` — generateMetadata, generateStaticParams
- `src/app/produits/[productSlug]/acheter-reconditionne/page.jsx` — idem
- `src/app/produits/[productSlug]/reparer/page.jsx` — idem
- `src/app/categories/[categorySlug]/page.jsx` — generateMetadata, generateStaticParams, CategorySeoContent, BreadcrumbJsonLd
- `src/app/categories/[categorySlug]/[productTypeSlug]/page.jsx` — idem + BreadcrumbJsonLd
- `src/app/categories/[categorySlug]/[productTypeSlug]/[brandSlug]/page.jsx` — generateMetadata, generateStaticParams, BreadcrumbJsonLd
- `src/app/a-propos/page.jsx`, `contact/page.jsx`, `mentions-legales/page.jsx`, `avantages/page.jsx`, `comment-ca-marche/page.jsx`, `guide/reparer-ou-racheter/page.jsx` — export const metadata
- `src/components/CompareApp.jsx` — Suppression du useEffect qui modifiait document.title, meta description et canonical
- `src/components/pages/StaticPages.jsx` — Utilise FAQ_QUESTIONS depuis data.js

---

## Points à vérifier

1. **generateMetadata** : `await params` utilisé partout (Next.js 16)
2. **Contenu sr-only** : Pas de cloaking — contenu indexable, masqué visuellement (aria-hidden="false")
3. **JSON-LD** : Schémas Product, FAQPage, BreadcrumbList valides
4. **Canonical** : Chaque page gère le sien via generateMetadata → alternates.canonical
5. **Build** : `npm run build` passe sans erreur

---

## Code clé à revoir

### 1. Page produit (exemple complet)
`src/app/produits/[productSlug]/page.jsx`

```jsx
export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  const item = findProductBySlug(productSlug);
  if (!item) return { title: "Produit introuvable | Compare.", description: "Ce produit n'existe pas sur Compare." };
  const name = `${item.brand} ${item.name}`;
  return {
    title: `Réparer ou remplacer ${name} ? | Compare.`,
    description: `Faut-il réparer votre ${name} ou en racheter un ? ...`,
    alternates: { canonical: `https://compare-fr.com/produits/${productSlug}` },
    openGraph: { title, description, siteName: "Compare.", type: "website" },
  };
}

export async function generateStaticParams() {
  return ITEMS.filter(i => !["electromenager", "plomberie", "chauffage", "jardin"].includes(i.category))
    .map(item => ({ productSlug: getProductSlug(item) }));
}

// ProductSeoContent avec className="sr-only" aria-hidden="false"
// ProductJsonLd, BreadcrumbJsonLd
```

### 2. JsonLd.jsx (Server Component)
```jsx
export function ProductJsonLd({ item }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.brand} ${item.name}`,
    brand: { "@type": "Brand", name: item.brand },
    category: item.productType,
    offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: ..., highPrice: item.priceNew },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
// FaqJsonLd, BreadcrumbJsonLd similaires
```

### 3. Layout — canonical supprimé
```jsx
<head>
  <link rel="preload" as="image" href="/banner-hero.jpg" ... />
  <!-- link canonical supprimé -->
</head>
```

### 4. CompareApp.jsx — useEffect SEO supprimé
Le bloc suivant a été retiré :
```jsx
useEffect(() => {
  const seo = buildSeo(page.type, data);
  document.title = seo.title;
  meta.setAttribute("content", seo.description);
  linkCanonical.href = canonicalHref;
}, [...]);
```

---

## Questions pour la revue

1. Les schémas JSON-LD sont-ils conformes et complets ?
2. Le contenu sr-only respecte-t-il les bonnes pratiques SEO (pas de cloaking) ?
3. Y a-t-il des risques de régression (navigation, rendu client) ?
4. Les canonical sont-ils corrects sur toutes les routes ?
