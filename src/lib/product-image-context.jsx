"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getProductPrimaryImageBySlug } from "./supabase-queries";
import { getProductSlug } from "./routes";

const ProductImageContext = createContext(null);

/** Cache slug → url (string | null). undefined = pas encore chargé. */
const cache = {};
const pending = {};

export function ProductImageProvider({ children }) {
  const [, setVersion] = useState(0);

  const getImageUrl = useCallback(async (slug) => {
    if (!slug) return null;
    if (cache[slug] !== undefined) return cache[slug];
    if (pending[slug]) return pending[slug];

    const promise = getProductPrimaryImageBySlug(slug)
      .then((url) => {
        cache[slug] = url ?? null;
        delete pending[slug];
        setVersion((v) => v + 1);
        return cache[slug];
      })
      .catch(() => {
        cache[slug] = null;
        delete pending[slug];
        setVersion((v) => v + 1);
        return null;
      });
    pending[slug] = promise;
    return promise;
  }, []);

  const getCachedUrl = useCallback((slug) => {
    if (!slug) return undefined;
    return cache[slug];
  }, []);

  return (
    <ProductImageContext.Provider value={{ getImageUrl, getCachedUrl }}>
      {children}
    </ProductImageContext.Provider>
  );
}

export function useProductImage(item) {
  const ctx = useContext(ProductImageContext);
  const slug = item ? getProductSlug(item) : "";
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (!ctx || !slug) {
      setUrl(undefined);
      return;
    }
    const cached = cache[slug];
    if (cached !== undefined) {
      setUrl(cached);
      return;
    }
    let cancelled = false;
    ctx.getImageUrl(slug).then((u) => {
      if (!cancelled) setUrl(u);
    }).catch(() => {
      if (!cancelled) setUrl(null);
    });
    return () => { cancelled = true; };
  }, [ctx, slug]);

  return url;
}
