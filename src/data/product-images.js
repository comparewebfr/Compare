/**
 * Images produits — Compare.
 * URLs Unsplash (licence libre) pour remplacer les placeholders.
 * La clé = id du produit (voir data.js, ordre RAW).
 */
const U = (id) => `https://images.unsplash.com/photo-${id}?w=400&q=75&auto=format&fit=crop&ixlib=rb-4.1.0`;

// iPhone 16 Pro (Unsplash)
const IPHONE = U("1727093493864-0bcbd16c7e6d");
// Samsung Galaxy (Unsplash)
const SAMSUNG = U("1565967249821-083c4775e5bc");

export const PRODUCT_IMAGES = {
  // Smartphones Apple (ids 1–16)
  1: IPHONE, 2: IPHONE, 3: IPHONE, 4: IPHONE, 5: IPHONE, 6: IPHONE, 7: IPHONE, 8: IPHONE,
  9: IPHONE, 10: IPHONE, 11: IPHONE, 12: IPHONE, 13: IPHONE, 14: IPHONE, 15: IPHONE, 16: IPHONE,
  // Smartphones Samsung (ids 17–30)
  17: SAMSUNG, 18: SAMSUNG, 19: SAMSUNG, 20: SAMSUNG, 21: SAMSUNG, 22: SAMSUNG, 23: SAMSUNG,
  24: SAMSUNG, 25: SAMSUNG, 26: SAMSUNG, 27: SAMSUNG, 28: SAMSUNG, 29: SAMSUNG, 30: SAMSUNG,
  // Smartphones Google, Xiaomi, etc. (ids 31–34)
  31: SAMSUNG, 32: SAMSUNG, 33: SAMSUNG, 34: SAMSUNG,
};
