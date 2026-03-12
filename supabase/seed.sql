-- Compare. — Données de test (iPhone 13)
-- Exécuté après supabase db reset

-- Produit iPhone 13 (slug = apple-iphone-13 pour matcher getProductSlug)
insert into public.products (slug, product_slug, brand, name, product_type, year, price_new)
values ('apple-iphone-13', 'apple-iphone-13', 'Apple', 'iPhone 13', 'Smartphone', 2021, 769);

-- Offres neuf (product_id = 1)
insert into public.offers (product_id, merchant, condition, price_amount, price_currency, url)
values
  (1, 'Amazon', 'new', 729, 'EUR', 'https://amzn.to/iphone13-neuf'),
  (1, 'Fnac', 'new', 749, 'EUR', 'https://www.fnac.com/iphone13');

-- Offres occasion/reconditionné
insert into public.offers (product_id, merchant, condition, price_amount, price_currency, url)
values
  (1, 'Back Market', 'refurbished', 449, 'EUR', 'https://www.backmarket.fr/iphone-13'),
  (1, 'Amazon', 'refurbished', 469, 'EUR', 'https://amzn.to/iphone13-occ');

-- Offres pièces de réparation (condition = parts)
insert into public.offers (product_id, merchant, condition, issue_type, url)
values
  (1, 'amazon', 'parts', 'ecran-casse', 'https://amzn.to/4s32KgK'),
  (1, 'amazon', 'parts', 'batterie-usee', 'https://amzn.to/4s32KgK'),
  (1, 'amazon', 'parts', 'camera-avant-face-id', 'https://amzn.to/4s32KgK'),
  (1, 'amazon', 'parts', 'connecteur-de-charge', 'https://amzn.to/4s32KgK'),
  (1, 'amazon', 'parts', 'haut-parleur', 'https://amzn.to/4s32KgK'),
  (1, 'amazon', 'parts', 'bouton-power-volume', 'https://amzn.to/4s32KgK'),
  (1, 'amazon', 'parts', 'vitre-arriere-cassee', 'https://amzn.to/4s32KgK'),
  (1, 'amazon', 'parts', 'wifi-bluetooth-hs', 'https://amzn.to/4s32KgK'),
  (1, 'amazon', 'parts', 'vibreur-hs', 'https://amzn.to/4s32KgK');

-- Image produit (optionnel)
insert into public.product_assets (product_id, image_url, is_primary)
values (1, 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-select-2021', true);
