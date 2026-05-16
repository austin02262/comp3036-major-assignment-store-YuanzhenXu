import type { Post } from "@repo/db/data";
import { gameCatalog } from "@/data/gameCatalog";

export type StoreProduct = {
  id: number;
  urlId: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  screenshots: string[];
  category: string;
  platform: string;
  platforms: string[];
  price: number;
  stock: number;
  releaseDate: string;
  releaseYear: number;
};

const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch"];

export function cleanProductTitle(title: string): string {
  return title.replace(/[!,]/g, "").replace(/\s+/g, " ").trim();
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);
}

export function postToProduct(post: Post): StoreProduct {
  const existingProduct = gameCatalog.find((game) => game.id === post.id);

  if (existingProduct) {
    return existingProduct;
  }

  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    id: post.id,
    urlId: post.urlId,
    title: cleanProductTitle(post.title),
    description: post.description,
    content: post.content,
    imageUrl: post.imageUrl,
    screenshots: [post.imageUrl],
    category: post.category,
    platform: tags[0] ?? platforms[post.id % platforms.length] ?? "PC",
    platforms: tags.length > 0 ? tags : [platforms[post.id % platforms.length] ?? "PC"],
    price: 29.95 + post.id * 10,
    stock: post.active ? 8 + post.id * 3 : 0,
    releaseDate: post.date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    releaseYear: post.date.getFullYear(),
  };
}
