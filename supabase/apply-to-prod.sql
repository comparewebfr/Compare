-- Compare. — Appliquer sur le projet Supabase de prod
-- Exécuter dans SQL Editor : https://supabase.com/dashboard → ton projet → SQL Editor

-- ========== MIGRATION (tables) ==========
create table if not exists public.products (
  id bigint primary key generated always as identity,
  slug text unique,
  product_slug text,
  brand text,
  name text,
  product_type text,
  year int,
  price_new numeric,
  created_at timestamptz default now()
);

create table if not exists public.offers (
  id bigint primary key generated always as identity,
  product_id bigint references public.products(id) on delete cascade,
  merchant text,
  condition text,
  product_condition text,
  issue_type text,
  price_amount numeric,
  price_currency text default 'EUR',
  url text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.product_assets (
  id bigint primary key generated always as identity,
  product_id bigint references public.products(id) on delete cascade,
  image_url text,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_offers_product_id on public.offers(product_id);
create index if not exists idx_offers_condition on public.offers(condition);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_product_assets_product_id on public.product_assets(product_id);

alter table public.products enable row level security;
alter table public.offers enable row level security;
alter table public.product_assets enable row level security;

drop policy if exists "Allow public read on products" on public.products;
drop policy if exists "Allow public read on offers" on public.offers;
drop policy if exists "Allow public read on product_assets" on public.product_assets;

create policy "Allow public read on products" on public.products for select using (true);
create policy "Allow public read on offers" on public.offers for select using (true);
create policy "Allow public read on product_assets" on public.product_assets for select using (true);

-- ========== SEED (données de test iPhone 13) ==========
-- Supprime les données existantes si tu veux repartir de zéro (optionnel)
-- truncate public.offers, public.product_assets, public.products restart identity;

insert into public.products (slug, product_slug, brand, name, product_type, year, price_new)
values ('apple-iphone-13', 'apple-iphone-13', 'Apple', 'iPhone 13', 'Smartphone', 2021, 769)
on conflict (slug) do nothing;

-- Offres neuf (product_id = 1)
insert into public.offers (product_id, merchant, condition, price_amount, price_currency, url)
select id, 'Amazon', 'new', 729, 'EUR', 'https://amzn.to/iphone13-neuf' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, price_amount, price_currency, url)
select id, 'Fnac', 'new', 749, 'EUR', 'https://www.fnac.com/iphone13' from public.products where slug = 'apple-iphone-13' limit 1;

-- Offres occasion
insert into public.offers (product_id, merchant, condition, price_amount, price_currency, url)
select id, 'Back Market', 'refurbished', 449, 'EUR', 'https://www.backmarket.fr/iphone-13' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, price_amount, price_currency, url)
select id, 'Amazon', 'refurbished', 469, 'EUR', 'https://amzn.to/iphone13-occ' from public.products where slug = 'apple-iphone-13' limit 1;

-- Offres pièces
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'ecran-casse', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'batterie-usee', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'camera-avant-face-id', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'connecteur-de-charge', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'haut-parleur', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'bouton-power-volume', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'vitre-arriere-cassee', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'wifi-bluetooth-hs', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;
insert into public.offers (product_id, merchant, condition, issue_type, url)
select id, 'amazon', 'parts', 'vibreur-hs', 'https://amzn.to/4s32KgK' from public.products where slug = 'apple-iphone-13' limit 1;

-- Image produit
insert into public.product_assets (product_id, image_url, is_primary)
select id, 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-select-2021', true from public.products where slug = 'apple-iphone-13' limit 1;
