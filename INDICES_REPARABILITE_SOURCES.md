# Indices de réparabilité — Sources et références

Ce document recense les **indices officiels** (ou issus de sources fiables) pour chaque produit du catalogue Compare.

**Sources principales :**
- [indicereparabilite.fr](https://www.indicereparabilite.fr/) — base officielle française
- [Apple Support](https://support.apple.com/fr-fr/circular-economy-repairability-indices) — PDFs officiels Apple
- [seb117.fr](https://seb117.fr/indice-de-reparabilite/) — réparateur labellisé, cite les indices officiels

---

## Smartphones

### Apple
| Modèle | Indice | Source |
|--------|--------|--------|
| iPhone 16 Pro Max | 8.3 | Versus, ADEME |
| iPhone 16 Pro | 8.3 | Même génération |
| iPhone 16 | 7.0 | iFixit, design modulaire |
| iPhone 16 Plus | 7.0 | Même que iPhone 16 |
| iPhone 15 Pro Max | 7.7 | seb117.fr |
| iPhone 15 Pro | 7.6 | seb117.fr |
| iPhone 15 | 7.5 | seb117.fr, iFixit |
| iPhone 15 Plus | 7.5 | Même que iPhone 15 |
| iPhone 14 Pro Max | 7.0 | indicereparabilite, Apple PDF |
| iPhone 14 Pro | 7.0 | indicereparabilite |
| iPhone 14 | 7.0 | indicereparabilite |
| iPhone 14 Plus | 7.0 | indicereparabilite |
| iPhone 13 | 6.2 | indicereparabilite.fr |
| iPhone 13 Pro | 6.2 | indicereparabilite.fr |
| iPhone 13 Pro Max | 6.2 | indicereparabilite.fr |
| iPhone 12 | 6.0 | indicereparabilite.fr |
| iPhone 12 Pro | 6.0 | indicereparabilite.fr |
| iPhone 12 Pro Max | 6.0 | indicereparabilite.fr |
| iPhone 11 | 4.6 | indicereparabilite.fr |
| iPhone SE 2022 | 6.2 | indicereparabilite (SE 3e gen) |
| iPhone XR | 4.5 | indicereparabilite.fr |

### Samsung
| Modèle | Indice | Source |
|--------|--------|--------|
| Galaxy S25 Ultra | 8.5 | seb117, Frandroid |
| Galaxy S25+ | 9.0 | Frandroid |
| Galaxy S25 | 8.5 | seb117.fr |
| Galaxy S24 Ultra | 8.5 | seb117.fr |
| Galaxy S24 | 8.5 | seb117.fr, indicereparabilite |
| Galaxy S23 | 8.2 | seb117.fr |
| Galaxy S22 | 8.2 | seb117.fr |
| Galaxy A55 | 8.5 | GSM Arena, Frandroid |
| Galaxy A54 | 8.4 | seb117.fr |
| Galaxy A35 | 8.0 | GSM Arena (estimation) |
| Galaxy A25 | 7.5 | Estimation (gamme A) |
| Galaxy A15 | 7.0 | Estimation |
| Galaxy Z Flip 6 | 8.0 | seb117.fr (Z Flip 5 = 8.0, évolution) |
| Galaxy Z Fold 6 | 6.5 | Estimation (foldable, plus complexe) |

### Google
| Modèle | Indice | Source |
|--------|--------|--------|
| Pixel 9 Pro XL | 8.2 | Charlestech (amélioration vs 8) |
| Pixel 9 Pro | 8.2 | Charlestech |
| Pixel 9 | 8.2 | Charlestech |
| Pixel 8 Pro | 8.2 | seb117.fr |
| Pixel 8 | 8.2 | seb117.fr |
| Pixel 8a | 8.2 | seb117.fr, gamme Pixel 8 |

### Autres marques
Les modèles Xiaomi, OnePlus, Huawei, Oppo, Nothing, Motorola, Honor, Realme n'ont pas d'indices officiels facilement accessibles sur indicereparabilite.fr. On conserve la valeur par type (Smartphone: 6.5) comme fallback.

---

## Électroménager (indicereparabilite.fr)

Les indices par **type** sont des moyennes indicatives. Les valeurs varient selon les modèles et marques.

| Type | Indice projet | Source |
|------|---------------|--------|
| Lave-linge | 7.2 | Samsung EcoBubble: 8.7, moyenne marques |
| Lave-vaisselle | 7.0 | Grille ADEME |
| Sèche-linge | 6.8 | Grille ADEME |
| Réfrigérateur | 6.5 | Grille ADEME |
| Congélateur | 6.2 | Grille ADEME |
| Four | 6.5 | Grille ADEME |
| Micro-ondes | 6.8 | Grille ADEME |
| Aspirateur balai | 6.8 | Grille ADEME |
| Aspirateur robot | 5.5 | Grille ADEME |

---

## Tablettes (Apple iPad)

| Modèle | Indice | Source |
|--------|--------|--------|
| iPad Pro M4 13" | 6.0 | indicereparabilite (moyenne tablette) |
| iPad Pro M4 11" | 6.0 | indicereparabilite |
| iPad Air M2 | 6.0 | indicereparabilite |
| iPad 10e gen. | 5.8 | indicereparabilite |
| iPad Mini 7 | 6.0 | indicereparabilite |
| iPad 9e gen. | 5.5 | indicereparabilite |

---

## Ordinateurs

| Type / Modèle | Indice | Source |
|---------------|--------|--------|
| MacBook Air M3 15" | 6.5 | Apple Support PDF (A2681, M2) |
| MacBook Air M3 13" | 6.5 | Apple |
| MacBook Air M2 | 6.5 | Apple A2681 |
| MacBook Air M1 | 6.2 | Apple A2337 |
| MacBook Pro 16" M3 Max | 6.5 | Apple A2780 |
| MacBook Pro 14" M3 Pro | 6.5 | Apple A2779 |
| MacBook Pro 14" M3 | 6.5 | Apple |
| PC Portable (moyenne) | 6.2 | indicereparabilite |
| PC Bureau | 7.5 | Plus modulaire |
| All-in-One | 5.0 | Plus complexe |

---

## Mise à jour

Pour ajouter ou corriger un indice :
1. Vérifier sur [indicereparabilite.fr](https://www.indicereparabilite.fr/)
2. Pour Apple : [support.apple.com](https://support.apple.com/fr-fr/circular-economy-repairability-indices)
3. Mettre à jour `REPAIRABILITY_INDEX_BY_PRODUCT` dans `src/lib/data.js`
4. Documenter la source dans ce fichier
