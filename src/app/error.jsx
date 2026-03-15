"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Compare — erreur client:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F6F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 12, textAlign: "center" }}>
        Oups, une erreur est survenue
      </h1>
      <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24, maxWidth: 320 }}>
        Le chargement a échoué. Vérifiez votre connexion et réessayez.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          background: "#2D6A4F",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Réessayer
      </button>
      <a
        href="/"
        style={{
          marginTop: 16,
          fontSize: 13,
          color: "#2D6A4F",
          textDecoration: "underline",
          fontWeight: 500,
        }}
      >
        Retour à l&apos;accueil
      </a>
    </div>
  );
}
