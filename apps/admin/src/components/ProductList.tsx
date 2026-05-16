"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminProduct } from "../data/adminProducts";
import styles from "./ProductList.module.css";

type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "year-desc"
  | "year-asc";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);

const storageKey = "gamehub-admin-products";

export function ProductList({
  initialProducts,
}: {
  initialProducts: AdminProduct[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    try {
      const savedProducts = window.localStorage.getItem(storageKey);
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts) as AdminProduct[]);
      }
    } catch {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  const platforms = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.platforms))),
    [products],
  );
  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const filteredProducts = products
    .filter((product) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        String(product.releaseYear).includes(normalizedQuery);
      const matchesPlatform =
        platform === "all" || product.platforms.includes(platform);
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesStatus =
        status === "all" ||
        (status === "active" && product.active) ||
        (status === "inactive" && !product.active);

      return matchesQuery && matchesPlatform && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "year-desc":
          return b.releaseYear - a.releaseYear;
        case "year-asc":
          return a.releaseYear - b.releaseYear;
        default:
          return a.id - b.id;
      }
    });

  const toggleProductState = (productId: number) => {
    const nextProducts = products.map((product) =>
      product.id === productId ? { ...product, active: !product.active } : product,
    );
    setProducts(nextProducts);
    window.localStorage.setItem(storageKey, JSON.stringify(nextProducts));

    const product = products.find((item) => item.id === productId);
    if (product) {
      setStatusMessage(
        `${product.title} is now ${product.active ? "out of stock" : "available"}.`,
      );
    }
  };

  return (
    <section className={styles.section} aria-label="Product management">
      <div className={styles.filters}>
        <div>
          <label htmlFor="query">Search products</label>
          <input
            id="query"
            type="text"
            placeholder="Title or release year"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="platform">Platform</label>
          <select
            id="platform"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            <option value="all">All platforms</option>
            {platforms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category">Genre</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All genres</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status">Product status</label>
          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "all" | "active" | "inactive")
            }
          >
            <option value="all">All products</option>
            <option value="active">Available</option>
            <option value="inactive">Out of stock</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortBy">Sort by</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
          >
            <option value="featured">Featured order</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="year-desc">Newest release</option>
            <option value="year-asc">Oldest release</option>
          </select>
        </div>
      </div>

      {statusMessage && (
        <p className={styles.notice} role="status">
          {statusMessage}
        </p>
      )}

      <div className={styles.toolbar}>
        <div>
          <p className={styles.eyebrow}>Catalogue</p>
          <h2>Manage Products</h2>
        </div>
        <p>{filteredProducts.length} products shown</p>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <article key={product.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={product.imageUrl} alt={product.title} />
              <span>{product.platforms.join(", ")}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.meta}>
                    {product.category} / {product.releaseYear}
                  </p>
                  <h3>{product.title}</h3>
                </div>
                <strong>{formatPrice(product.price)}</strong>
              </div>
              <p className={styles.description}>{product.description}</p>
              <div className={styles.productFacts}>
                <span>Release: {product.releaseDate}</span>
              </div>
              <div className={styles.cardActions}>
                <a href={`/product/${product.urlId}`}>Edit product</a>
                <a href={`http://localhost:3001/post/${product.urlId}`}>
                  View storefront
                </a>
                <button
                  type="button"
                  className={product.active ? styles.activeBtn : styles.hiddenBtn}
                  onClick={() => toggleProductState(product.id)}
                >
                  {product.active ? "Available" : "Out of Stock"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
