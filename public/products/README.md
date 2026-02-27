# Images produits

## Comment ajouter des images

### Méthode 1 : Fichiers locaux

Placez vos images dans ce dossier avec le nom `{id}.jpg` ou `{id}.png`.

- **id** = l'identifiant numérique du produit (visible dans l'URL ou la liste des produits)
- Exemple : `42.jpg` pour le produit dont l'id est 42

### Méthode 2 : URLs externes

Éditez `src/data/product-images.js` et ajoutez vos URLs :

```js
export const PRODUCT_IMAGES = {
  1: "/products/1.jpg",           // Fichier local
  2: "https://example.com/iphone.png",  // URL externe
  42: "https://m.media-amazon.com/images/I/71xxx.jpg",  // Ex. Amazon
};
```

### Priorité d'affichage

1. **PRODUCT_IMAGES** (fichier config) — priorité maximale
2. **public/products/{id}.jpg** — puis .png si jpg absent
3. **Placeholder** — image générique si aucun fichier
4. **Initiales** — fallback final (ex. "App" pour Apple)
