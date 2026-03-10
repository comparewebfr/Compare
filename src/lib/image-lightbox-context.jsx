"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ImageLightboxContext = createContext(null);

export function ImageLightboxProvider({ children }) {
  const [imageUrl, setImageUrl] = useState(null);

  const openLightbox = useCallback((url) => {
    if (url?.trim()) setImageUrl(url.trim());
  }, []);

  const closeLightbox = useCallback(() => setImageUrl(null), []);

  useEffect(() => {
    if (!imageUrl) return;
    const onEsc = (e) => { if (e.key === "Escape") closeLightbox(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [imageUrl, closeLightbox]);

  return (
    <ImageLightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      {imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image agrandie"
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={closeLightbox}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(255,255,255,.1)",
              border: "none",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
          <img
            src={imageUrl}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        </div>
      )}
    </ImageLightboxContext.Provider>
  );
}

export function useImageLightbox() {
  return useContext(ImageLightboxContext);
}
