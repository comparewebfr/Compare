"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getProductImageMap, getProductPrimaryImageBySlug } from "./supabase-queries";
import { getProductSlug } from "./routes";

const ProductImageContext = createContext(null);

/** Cache slug → url (string | null). undefined = pas encore chargé. */
const cache = {};
let imageMapPromise = null;

export function ProductImageProvider({ children }) {
  const [, setVersion] = useState(0);

  const getImageUrl = useCallback(async (slug) => {
    if (!slug) return null;
    if (cache[slug] !== undefined) return cache[slug];

    if (!imageMapPromise) imageMapPromise = getProductImageMap();
    const map = await imageMapPromise;
    const slugNorm = (s) => (s || "").toLowerCase().replace(/[-_\s]/g, "");
    const urlFromMap = map.get(slug.toLowerCase()) ?? map.get(slugNorm(slug));
    if (urlFromMap) {
      cache[slug] = urlFromMap;
      setVersion((v) => v + 1);
      return urlFromMap;
    }
    const url = await getProductPrimaryImageBySlug(slug);
    cache[slug] = url ?? null;
    setVersion((v) => v + 1);
    return cache[slug];
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
    });
    return () => { cancelled = true; };
  }, [ctx, slug]);

  return url;
}
