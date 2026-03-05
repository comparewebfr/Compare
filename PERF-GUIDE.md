# Guide d'optimisation PageSpeed — Compare.

## Modifications appliquées

### 1. Images
- **Logo** : `<img>` → `next/image` avec width/height explicites
- **Banner hero** : `next/image` avec `priority` + `fill` + `sizes` pour le LCP
- **ProductImg** : `next/image` pour images locales/externes, `loading="lazy"`, `sizes` adapté
- **Fallback** : simplifié (plus de banner en double) pour éviter CLS et régression desktop

### 2. Fonts
- `next/font` DM Sans déjà en place
- Poids réduits : 400, 500, 600, 700 (suppression 300, 800)
- `display: "swap"` pour éviter le blocage

### 3. JavaScript
- **useMemo** : `sug`, `exactMatch`, `banners` (Hero), `filtered`, `brands`, `typesFiltered` (CategoryPage)
- **useCallback** : `prev`, `next` (BannerCarousel)
- **Banners** : déplacés dans constante `HERO_BANNERS` pour éviter recréation à chaque render

### 4. CSS / Réseau
- Suppression import `CSS` inutilisé dans CompareApp
- Preload `/banner-hero.jpg` conservé
- GA : `next/script` avec `strategy="afterInteractive"`

---

## Comment re-tester

### Lighthouse (Chrome DevTools)
1. Ouvrir le site en production (ou `npm run build && npm run start`)
2. F12 → onglet **Lighthouse**
3. Cocher **Performance**, **Mobile** ou **Desktop**
4. Cliquer **Analyze page load**

### PageSpeed Insights
- https://pagespeed.web.dev/
- Coller l’URL : `https://www.compare-fr.com/`
- Choisir **Mobile** ou **Desktop**

### Repérer les problèmes
- **Unused JS** : Lighthouse → Diagnostics → "Reduce unused JavaScript"
- **Render blocking** : Lighthouse → Opportunities → "Eliminate render-blocking resources"
- **LCP** : Lighthouse → Metrics → "Largest Contentful Paint"
- **CLS** : Lighthouse → Metrics → "Cumulative Layout Shift"

---

## Checklist post-déploiement

- [ ] Build OK (`npm run build`)
- [ ] Pas de CLS visible (images, blocs, fonts)
- [ ] LCP < 2,5 s (objectif)
- [ ] TBT < 200 ms (objectif)
- [ ] CLS = 0 (objectif)
