"use client";

import { useMemo, useState } from "react";
import type { Post } from "@repo/db/data";
import { AddToCartButton } from "@/components/Store/AddToCartButton";
import { GameImage } from "@/components/Store/GameImage";
import { formatPrice, postToProduct } from "@/lib/storeProducts";

type SortMode = "default" | "date-desc" | "date-asc" | "price-asc" | "price-desc";

const sortOptions: { value: SortMode; label: string }[] = [
  { value: "default", label: "Featured" },
  { value: "date-desc", label: "Newest Release" },
  { value: "date-asc", label: "Oldest Release" },
  { value: "price-asc", label: "Price Low to High" },
  { value: "price-desc", label: "Price High to Low" },
];

export function ProductGrid({ posts }: { posts: Post[] }) {
  const [sortMode, setSortMode] = useState<SortMode>("default");

  const sortedPosts = useMemo(() => {
    const nextPosts = [...posts];

    if (sortMode === "date-desc") {
      nextPosts.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    if (sortMode === "date-asc") {
      nextPosts.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    if (sortMode === "price-asc") {
      nextPosts.sort((a, b) => postToProduct(a).price - postToProduct(b).price);
    }

    if (sortMode === "price-desc") {
      nextPosts.sort((a, b) => postToProduct(b).price - postToProduct(a).price);
    }

    return nextPosts;
  }, [posts, sortMode]);

  return (
    <section id="catalogue" className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-950/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-normal tracking-tight text-gray-950 dark:text-white">
              Video Games <span className="text-base text-gray-500">{posts.length} items</span>
            </h2>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            Sort by
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/15 dark:border-white/10 dark:bg-gray-900 dark:text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {sortedPosts.map((post) => {
          const product = postToProduct(post);

          return (
            <article
              key={post.id}
              data-test-id={`blog-post-${post.id}`}
              className="group overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-950/10 dark:border-white/10 dark:bg-gray-950/80"
            >
              <a href={`/post/${product.urlId}`} className="relative block aspect-[16/10] bg-gray-950">
                <GameImage
                  src={product.imageUrl}
                  alt={product.title}
                  title={product.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/90 to-transparent p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                    {product.platform}
                  </p>
                </div>
              </a>

              <div className="p-5">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
                  <a
                    href={`/category/${encodeURIComponent(product.category.toLowerCase())}`}
                    className="rounded-full bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-200 dark:hover:bg-red-500/25"
                  >
                    {product.category}
                  </a>
                  <a
                    href={`/search?q=${product.releaseYear}`}
                    className="rounded-full bg-gray-100 px-2 py-1 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
                  >
                    {product.releaseYear}
                  </a>
                </div>

                <a
                  href={`/post/${product.urlId}`}
                  className="mt-4 block min-h-14 text-xl font-black leading-tight text-gray-950 transition hover:text-blue-700 dark:text-white dark:hover:text-blue-300"
                >
                  {product.title}
                </a>

                <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-gray-100 pt-4 dark:border-white/10">
                  <div>
                    <p className="text-2xl font-bold text-gray-950 dark:text-white">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <AddToCartButton product={product} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
