-- Migration : Qualification des offres partenaires (Awin, RueDuCommerce, etc.)
-- Concerne UNIQUEMENT les offres importées automatiquement. Amazon manuel inchangé.
-- Tous les champs sont optionnels (NULL) pour ne pas casser l'existant.

-- offer_kind : nature de l'offre
-- Valeurs : main_product, alternative_product, part, accessory, service
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS offer_kind text DEFAULT NULL;

-- match_status : qualité du matching produit
-- Valeurs : exact, close, fallback, rejected, manual
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS match_status text DEFAULT NULL;

-- match_confidence : score de confiance (0-1 ou autre échelle)
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS match_confidence numeric DEFAULT NULL;

-- is_exact_match : match exact produit (boolean)
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS is_exact_match boolean DEFAULT NULL;

-- is_fallback_model : produit de repli (ex: variante stockage)
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS is_fallback_model boolean DEFAULT NULL;

-- fallback_reason : raison si is_fallback_model = true
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS fallback_reason text DEFAULT NULL;

-- source : origine de l'offre
-- Valeurs : manual, awin_feed, import_script
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS source text DEFAULT NULL;

-- Commentaires pour documentation
COMMENT ON COLUMN public.offers.offer_kind IS 'Nature: main_product, alternative_product, part, accessory, service';
COMMENT ON COLUMN public.offers.match_status IS 'Qualité match: exact, close, fallback, rejected, manual';
COMMENT ON COLUMN public.offers.source IS 'Origine: manual (Amazon), awin_feed, import_script';
