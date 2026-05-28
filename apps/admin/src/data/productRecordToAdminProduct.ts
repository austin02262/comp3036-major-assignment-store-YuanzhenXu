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

function parseGalleryImages(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) return [];

  if (trimmedValue.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmedValue);
      return Array.isArray(parsed)
        ? parsed.filter((image): image is string => typeof image === "string")
        : [];
    } catch {
      return [];
    }
  }

  return trimmedValue
    .match(/data:image\/[^;]+;base64,[^,]+(?=,data:image\/|$)|[^,]+/g)
    ?.map((image) => image.trim())
    .filter(Boolean) || [];
}

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
    galleryImages: parseGalleryImages(product.galleryImages),
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
