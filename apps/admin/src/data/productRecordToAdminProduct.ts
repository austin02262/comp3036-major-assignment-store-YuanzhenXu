import type { AdminProduct } from "./adminProducts";

type ProductRecord = {
  id: number;
  urlId: string;
  title: string;
  description: string;
  imageUrl: string;
  galleryImages: string;
  platforms: string;
  price: number;
  stock: number;
  releaseDate: Date;
  active: boolean;
  category: {
    name: string;
  };
};

export function productRecordToAdminProduct(
  product: ProductRecord,
): AdminProduct {
  const releaseDate = new Date(product.releaseDate);

  return {
    id: product.id,
    urlId: product.urlId,
    title: product.title,
    description: product.description,
    imageUrl: product.imageUrl,
    galleryImages: product.galleryImages
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean),
    category: product.category.name,
    platforms: product.platforms
      .split(",")
      .map((platform) => platform.trim())
      .filter(Boolean),
    price: product.price,
    stock: product.stock,
    releaseDate: releaseDate.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    releaseYear: releaseDate.getFullYear(),
    active: product.active,
  };
}
