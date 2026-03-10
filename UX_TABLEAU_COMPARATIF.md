# Refonte UX — Tableau comparatif

## Problèmes actuels

| Problème | Impact |
|----------|--------|
| Trop de lignes (10+) | L'utilisateur noie l'info |
| "Économie vs neuf" en € | Pas immédiat : 320 € = économie ou surcoût ? |
| "~" devant recon | Ambiguïté sur la nature du prix |
| Colonnes égales | Pas de hiérarchie, neuf pas mis en avant |
| Recommandation noyée | Perdue dans la masse |

---

## Objectif : comprendre en 3 secondes

1. **Combien coûte chaque option ?**
2. **Quelle option est la plus rentable ?**
3. **Combien j'économise vs le neuf ?**

---

## 1. Nouvelle structure — 3 blocs prioritaires

### Bloc A : Résumé prix (au-dessus du tableau)

```
┌─────────────────────────────────────────────────────────────┐
│  Référence : 969 € neuf                                     │
│  (iPhone 15, prix indicatif)                                │
└─────────────────────────────────────────────────────────────┘
```

### Bloc B : Tableau simplifié — 4 lignes max

| | Réparer | Reconditionné | Neuf |
|---|---------|---------------|------|
| **Prix** | 80–150 € | ~580 € | **969 €** |
| **Économie** | **Économisez 819 €** | Économisez 389 € | Référence |
| Difficulté | ●● Moyen | — | — |
| Garantie | Variable | 12–24 mois | 24 mois |

**Règles :**
- Ligne 1 : Prix (gros, gras)
- Ligne 2 : Économie en phrase claire ("Économisez X €" ou "Référence")
- Lignes 3–4 : Infos secondaires (optionnel, repliable)

### Bloc C : Meilleur choix mis en avant

```
┌─────────────────────────────────────────┐
│  ✓ Meilleur rapport : Réparer            │
│  Économisez jusqu'à 819 € vs le neuf      │
└─────────────────────────────────────────┘
```

---

## 2. Hiérarchie des options

| Ordre | Option | Rôle |
|-------|--------|------|
| 1 | Neuf | **Référence** — toujours à droite, prix de base |
| 2 | Réparer | Alternative économique si panne simple |
| 3 | Reconditionné | Compromis qualité/prix |

**Affichage :** Réparer | Reconditionné | **Neuf (référence)**

---

## 3. Affichage de l'économie

| Format actuel | Problème | Format proposé |
|---------------|----------|----------------|
| `320 €` | On ne sait pas si c'est économie ou surcoût | `Économisez 320 €` |
| `—` pour neuf | OK | `Référence` ou `Prix de base` |
| `0 €` si réparation > neuf | Confus | `Surcoût : 50 €` ou masquer |

**Règle :** Toujours une phrase explicite.

---

## 4. Version mobile optimisée

### Option A : Cartes empilées (recommandée)

```
┌─────────────────────────────────────┐
│  Réparer                             │
│  80–150 €                            │
│  Économisez jusqu'à 819 €            │
│  [Recommandé]                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Reconditionné                       │
│  ~580 €                              │
│  Économisez 389 €                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Neuf (référence)                    │
│  969 €                               │
│  Prix de base                        │
└─────────────────────────────────────┘
```

### Option B : Tableau horizontal scroll

- 3 colonnes fixes, scroll horizontal
- En-tête sticky : Réparer | Recon | Neuf
- 4 lignes : Prix, Économie, Difficulté, Garantie

---

## 5. Exemple de tableau final lisible

### Desktop

```
                    Réparer      Reconditionné    Neuf
                    ───────      ─────────────   ─────
Prix                80–150 €     ~580 €          969 €
Économie vs neuf    819 €        389 €           —
                     (vert)       (ambre)      (réf.)
```

### Mobile (cartes)

```
┌──────────────────────────┐
│ 🔧 Réparer               │
│ 80–150 €                 │
│ Économisez jusqu'à 819 € │
│ ✓ Recommandé             │
└──────────────────────────┘

┌──────────────────────────┐
│ ♻ Reconditionné          │
│ ~580 €                   │
│ Économisez 389 €         │
└──────────────────────────┘

┌──────────────────────────┐
│ 🛒 Neuf (référence)      │
│ 969 €                    │
│ Prix de base             │
└──────────────────────────┘
```

---

## Implémentation

- Réduire à 4 lignes : Prix, Économie, Difficulté, Garantie
- Remplacer "Économie vs neuf" par "Économisez X €" ou "Référence"
- Ajouter bloc "Référence : X € neuf" en en-tête
- Mobile : cartes empilées avec économie en vert
- Mettre "Meilleur choix" en évidence au-dessus du tableau
