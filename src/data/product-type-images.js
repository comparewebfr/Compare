/**
 * Images par type de produit — Compare.
 * URLs Unsplash (licence libre) pour les cartes catégories électroménager.
 */
const U = (id) => `https://images.unsplash.com/photo-${id}?w=400&q=75&auto=format&fit=crop&ixlib=rb-4.1.0`;

export const PRODUCT_TYPE_IMAGES = {
  "Lave-linge": U("1628843226223-989e20810393"),
  "Lave-vaisselle": U("1722764386982-a13a55ad3708"),
  "Sèche-linge": U("1729073375325-99978ce4d052"),
  "Réfrigérateur": U("1646592491770-c113dd6f8827"),
  "Four": U("1677727852911-74e9d5269003"),
  "Four encastrable": U("1677727852911-74e9d5269003"),
  "Micro-ondes": U("1566205874284-e14d2178f0d4"),
  "Aspirateur balai": U("1569698134101-f15cde5cd66c"),
  "Aspirateur robot": U("1757478558214-5671402e85d9"),
};
