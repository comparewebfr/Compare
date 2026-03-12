-- Compare. — Tables pour produits, offres, assets
-- Base de test locale Supabase

-- Table products (produits référencés)
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

-- Table offers (offres neuf, occasion, pièces)
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

-- Table product_assets (images produits)
create table if not exists public.product_assets (
  id bigint primary key generated always as identity,
  product_id bigint references public.products(id) on delete cascade,
  image_url text,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Index pour les recherches
create index if not exists idx_offers_product_id on public.offers(product_id);
create index if not exists idx_offers_condition on public.offers(condition);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_product_assets_product_id on public.product_assets(product_id);

-- RLS : lecture publique (anon peut lire)
alter table public.products enable row level security;
alter table public.offers enable row level security;
alter table public.product_assets enable row level security;

create policy "Allow public read on products" on public.products for select using (true);
create policy "Allow public read on offers" on public.offers for select using (true);
create policy "Allow public read on product_assets" on public.product_assets for select using (true);
