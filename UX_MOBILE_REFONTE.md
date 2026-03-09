# Refonte UX/UI Mobile — Compare.

## Problèmes identifiés

| Problème | Impact |
|----------|--------|
| 4 éléments en ligne (logo, nom+badge, prix, bouton) | Superposition sur écran étroit |
| Badge "Meilleur prix" inline avec le nom | Masque du contenu, wrap incontrôlé |
| Cartes alternatives trop longues | Scroll excessif, info noyée |
| Hiérarchie floue | L'utilisateur ne voit pas la meilleure option en 2 s |
| Bouton "Voir l'offre" dupliqué (texte + bloc) | Redondance, confusion |

---

## 1. Nouvelle structure de carte mobile

### Carte Retailer (marchand)

```
┌─────────────────────────────────────────┐
│ [Logo]  Back Market          Meilleur  │  ← Ligne 1 : Logo + Marque + Badge (si #1)
│ 40px    gras 14px             prix     │     Badge en position fixe, ne chevauche pas
│         ─────────────────────────────  │
│         Garantie 12-24 mois             │  ← Ligne 2 : Sous-titre (optionnel, 1 ligne)
│         ─────────────────────────────  │
│         549 €        [Voir l'offre →]  │  ← Ligne 3 : Prix (gros) + CTA unique
└─────────────────────────────────────────┘
Hauteur cible : 72-80px
```

**Règles :**
- Badge "Meilleur prix" en **coin supérieur droit** de la carte, pas inline
- Un seul CTA par carte
- Prix en **18-20px**, gras
- Logo réduit à 40px sur mobile

### Carte Alternative (modèle)

```
┌─────────────────────────────────────────┐
│ [Img]  iPhone 15 Pro    -45 €            │  ← Marque + modèle + économie
│ 36px   gras 13px       vert, gras       │
│        Reconditionné · 2023              │  ← Sous-titre compact
│        549 €              [→]           │  ← Prix + chevron
└─────────────────────────────────────────┘
Hauteur cible : 64-72px
```

---

## 2. Hiérarchie visuelle idéale

| Priorité | Élément | Taille | Poids |
|----------|---------|--------|-------|
| 1 | Prix | 18-20px | 800 |
| 2 | Marque / Modèle | 13-14px | 700 |
| 3 | Économie (si négative) | 11-12px | 600, vert |
| 4 | Badge "Meilleur prix" | 9-10px | 700, pill |
| 5 | Sous-titre (garantie, année) | 10-11px | 400, gris |

---

## 3. Layout mobile optimisé

- **Padding** : 12px horizontal, 10px vertical par carte
- **Gap** : 8px entre cartes
- **Logo** : 40px (retailers), 36px (alternatives)
- **Badge** : position `absolute` top-right, ne participe pas au flow
- **CTA** : pleine largeur en bas OU inline à droite du prix (pas les deux)

---

## 4. Recommandations UX

1. **Badge "Meilleur prix"** : position absolue `top: 8px; right: 8px` pour éviter tout chevauchement
2. **Supprimer** le texte "Voir l'offre" sous le prix — un seul CTA suffit
3. **Cartes alternatives** : masquer "Voir le comparatif complet" sur mobile (ou le mettre en accordéon)
4. **Économie** : afficher en vert uniquement si négative (-X €)
5. **Espacement** : `min-height` sur les cartes pour éviter le collapse

---

## 5. Wireframe — Liste retailers mobile

```
┌──────────────────────────────────────┐
│  Où acheter iPhone 15 ?              │
│  3 offres trouvées                    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ [B]  Back Market          [Meilleur]  │
│      N°1 reconditionné        prix   │
│      549 €          [ Voir l'offre ]  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ [A]  Amazon Renewed                   │
│      Garantie Amazon                  │
│      569 €          [ Voir l'offre ]  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ [C]  Certideal                        │
│      Made in France                   │
│      589 €          [ Voir l'offre ]  │
└──────────────────────────────────────┘
```

---

## Implémentation

Les changements sont appliqués via :
- `AffPage` : cartes retailers
- Cartes alternatives (bestAlt, otherAlts)
- Cartes "Recherches populaires" (accueil)
- CSS mobile dans `constants.js`
