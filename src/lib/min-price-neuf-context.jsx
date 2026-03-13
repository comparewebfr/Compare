"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getMinPriceNeuf } from "./supabase-queries";
import { getProductSlug } from "./routes";

const MinPriceNeufContext = createContext(null);

/** Cache slug → { minPrice, hasOffer }. undefined = pas encore chargé. */
const cache = {};
const pending = {};

export function MinPriceNeufProvider({ children }) {
  const [, setVersion] = useState(0);

  const fetchMinPrice = useCallback(async (slug) => {
    if (!slug) return { minPrice: null, hasOffer: false };
    if (cache[slug] !== undefined) return cache[slug];
    if (pending[slug]) return pending[slug];

    const promise = getMinPriceNeuf(slug).then((res) => {
      cache[slug] = res;
      delete pending[slug];
      setVersion((v) => v + 1);
      return res;
    });
    pending[slug] = promise;
    return promise;
  }, []);

  const getCached = useCallback((slug) => {
    if (!slug) return undefined;
    return cache[slug];
  }, []);

  return (
    <MinPriceNeufContext.Provider value={{ fetchMinPrice, getCached }}>
      {children}
    </MinPriceNeufContext.Provider>
  );
}

/**
 * Hook pour afficher le prix neuf unifié (min des offres new actives).
 * @param {object} item - Produit (ITEMS)
 * @returns {{ minPrice: number|null, hasOffer: boolean, loading: boolean, displayText: string }}
 */
export function useMinPriceNeuf(item) {
  const ctx = useContext(MinPriceNeufContext);
  const slug = item ? getProductSlug(item) : "";
  const [state, setState] = useState({ minPrice: null, hasOffer: false, loading: true });

  useEffect(() => {
    if (!ctx || !slug) {
      setState({ minPrice: null, hasOffer: false, loading: false });
      return;
    }
    const cached = cache[slug];
    if (cached !== undefined) {
      setState({ ...cached, loading: false });
      return;
    }
    let cancelled = false;
    ctx.fetchMinPrice(slug).then((res) => {
      if (!cancelled) setState({ ...res, loading: false });
    });
    return () => { cancelled = true; };
  }, [ctx, slug]);

  const fallbackPrice = item?.priceNew ?? null;
  const displayText = state.loading
    ? (fallbackPrice != null ? `~${Math.round(fallbackPrice)} €` : "—")
    : state.hasOffer
      ? `À partir de ${state.minPrice} €`
      : fallbackPrice != null
        ? `~${Math.round(fallbackPrice)} €`
        : "Prix non disponible";

  return {
    ...state,
    displayText,
    /** Prix à utiliser pour les calculs (min Supabase ou fallback item.priceNew) */
    priceForCalc: state.hasOffer ? state.minPrice : (fallbackPrice != null ? Math.round(fallbackPrice) : null),
  };
}
