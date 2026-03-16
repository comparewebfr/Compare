"use client";

import { useState, useMemo } from "react";
import { CATS, ITEMS, POPULAR_SEARCHES, PAGES_GENERALES, SIDEBAR_GROUPS, FAQ_QUESTIONS } from "../lib/data";
import { findProductByPopular } from "../lib/helpers";
import { Icon } from "./shared";
import styles from "./HomePage.module.css";

/**
 * HomePage — Page d'accueil redesignée
 * Hero + Catégories + Recherches populaires + Footer
 * ProductImg et ProductPriceNeuf sont fournis par CompareApp (contexte providers)
 */
export default function HomePage({
  onSearch,
  onNav,
  popularSearches = POPULAR_SEARCHES,
  ProductImg,
  ProductPriceNeuf,
}) {
  const [q, setQ] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noMatchMsg, setNoMatchMsg] = useState(false);

  const qNorm = (q || "").trim().toLowerCase();
  const suggestions = useMemo(
    () =>
      qNorm.length > 1
        ? ITEMS.filter(
            (i) =>
              !PAGES_GENERALES.includes(i.category) &&
              `${i.brand} ${i.name} ${i.productType}`.toLowerCase().includes(qNorm)
          ).slice(0, 6)
        : [],
    [qNorm]
  );
  const exactMatch = useMemo(
    () =>
      qNorm.length > 0
        ? ITEMS.find(
            (i) =>
              !PAGES_GENERALES.includes(i.category) &&
              `${i.brand} ${i.name}`.toLowerCase() === qNorm
          )
        : null,
    [qNorm]
  );

  const handleSearch = () => {
    setNoMatchMsg(false);
    if (exactMatch) {
      onSearch(exactMatch.id);
      setQ("");
    } else if (suggestions.length === 0) {
      setNoMatchMsg(true);
    } else {
      setNoMatchMsg(true);
    }
  };

  const handleSelectProduct = (item) => {
    setQ("");
    setNoMatchMsg(false);
    onSearch(item.id);
  };

  return (
    <div className={styles.home}>
      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Réparer ou remplacer ?</h1>
        <p className={styles.heroSubtitle}>
          Comparez les coûts de réparation, reconditionné et neuf. La réponse en 30 secondes.
        </p>

        <div className={styles.searchWrap}>
          <div className={styles.searchBar}>
            <svg
              className={styles.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <label htmlFor="hero-search" className={styles.srOnly}>
              Rechercher un produit (ex: iPhone 15, MacBook, PS5)
            </label>
            <input
              id="hero-search"
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setShowSuggestions(true);
                setNoMatchMsg(false);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="iPhone 15, MacBook Air, PS5..."
              className={styles.searchInput}
              aria-label="Rechercher un produit"
            />
            <button
              type="button"
              onClick={handleSearch}
              className={styles.searchBtn}
            >
              Comparer
            </button>
          </div>

          {noMatchMsg && !exactMatch && (
            <div className={styles.noMatch} role="alert">
              {suggestions.length === 0
                ? "Aucun produit trouvé. Vérifiez l'orthographe ou parcourez les catégories."
                : "Sélectionnez un produit dans la liste pour un résultat précis."}
            </div>
          )}

          {showSuggestions && suggestions.length > 0 && ProductImg && ProductPriceNeuf && (
            <ul className={styles.suggestions} role="listbox">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseDown={() => handleSelectProduct(item)}
                    className={styles.suggestionItem}
                    role="option"
                  >
                    <ProductImg brand={item.brand} item={item} size={44} />
                    <div className={styles.suggestionText}>
                      <span className={styles.suggestionName}>
                        {item.brand} {item.name}
                      </span>
                      <span className={styles.suggestionMeta}>
                        {item.productType} · <ProductPriceNeuf item={item} />
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ─── CATÉGORIES ─── */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Parcourir par catégorie</h2>
        <p className={styles.sectionSubtitle}>
          Comparez réparation, occasion et neuf pour chaque type d'appareil
        </p>
        {SIDEBAR_GROUPS.map((group) => {
          const groupCats = group.ids
            .map((id) => CATS.find((c) => c.id === id))
            .filter(Boolean);
          return (
            <div key={group.label} className={styles.categoryGroup}>
              <h3 className={styles.groupLabel}>{group.label}</h3>
              <div className={styles.categoryGrid}>
                {groupCats.map((cat) => {
                  const count = ITEMS.filter((i) => i.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onNav("cat", cat.id)}
                      className={styles.categoryCard}
                      title={cat.name}
                    >
                      <span className={styles.categoryIcon}>
                        <Icon name={cat.icon} s={22} color="#2D6A4F" />
                      </span>
                      <div className={styles.categoryContent}>
                        <span className={styles.categoryName}>{cat.name}</span>
                        <span className={styles.categoryCount}>{count} produits</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ─── RECHERCHES POPULAIRES ─── */}
      <section className={styles.popular}>
        <h2 className={styles.sectionTitle}>Recherches populaires</h2>
        <p className={styles.sectionSubtitle}>
          Les diagnostics et produits les plus consultés
        </p>
        <div className={styles.pillWrap}>
          {popularSearches.map((entry, idx) => {
            if (entry.type === "general") {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    onNav("cat-type", {
                      catId: entry.catId,
                      productType: entry.productType,
                    })
                  }
                  className={styles.pill}
                >
                  {entry.label}
                </button>
              );
            }
            const item = findProductByPopular({
              brand: entry.brand,
              name: entry.name,
            });
            return item ? (
              <button
                key={item.id}
                type="button"
                onClick={() => onSearch(item.id)}
                className={styles.pill}
              >
                {entry.label}
              </button>
            ) : null;
          })}
        </div>
      </section>

      {/* ─── QUI SOMMES-NOUS ─── */}
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Qui sommes-nous</h2>
        <div className={styles.aboutContent}>
          <p>
            Basés à Paris, nous avons créé Compare. pour répondre à une question que tout le monde se pose : <strong>réparer, acheter d'occasion ou racheter neuf ?</strong> Pas de réponse toute faite — tout dépend de la panne, de l'âge de l'appareil et du coût.
          </p>
          <p>
            Notre objectif : vous donner les éléments pour trancher en 30 secondes. Coûts indicatifs, verdict clair, liens vers les tutoriels, pièces et marchands. Que vous soyez bricoleur ou que vous préfériez confier à un pro, vous savez où vous en êtes.
          </p>
          <p>
            Un appareil réparé, c'est un appareil de moins à produire et à recycler. Chaque réparation compte — et chaque euro économisé aussi.
          </p>
        </div>
        <div className={styles.aboutStats}>
          <div className={styles.aboutStat}>
            <span className={styles.aboutStatNum}>{ITEMS.length}+</span>
            <span className={styles.aboutStatLabel}>Produits référencés</span>
          </div>
          <div className={styles.aboutStat}>
            <span className={styles.aboutStatNum}>{CATS.length}</span>
            <span className={styles.aboutStatLabel}>Catégories</span>
          </div>
          <div className={styles.aboutStat}>
            <span className={styles.aboutStatNum}>100%</span>
            <span className={styles.aboutStatLabel}>Gratuit</span>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Questions fréquentes</h2>
        <div className={styles.faqList}>
          {FAQ_QUESTIONS.map((f, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{f.q}</summary>
              <p className={styles.faqAnswer}>{f.a}</p>
            </details>
          ))}
        </div>
        <p className={styles.faqContact}>
          Une question ? <a href="mailto:compare.webfr@gmail.com">compare.webfr@gmail.com</a> — Réponse sous 24h.
        </p>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <p className={styles.footerName}>compare-fr.com</p>
        <p className={styles.footerTagline}>
          Réparer ou remplacer ? La réponse en 30 secondes.
        </p>
        <p className={styles.footerYear}>© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
