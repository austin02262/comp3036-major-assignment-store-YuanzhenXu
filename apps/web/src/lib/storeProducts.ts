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
  active?: boolean;
};

export type ProductRecord = {
  id: number;
  urlId: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  galleryImages: string;
  platform: string;
  platforms: string;
  price: number;
  stock: number;
  releaseDate: Date;
  active: boolean;
  category: {
    name: string;
  };
};

// Central price formatter for all storefront UI.
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);
}

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

export function productRecordToStoreProduct(product: ProductRecord): StoreProduct {
  const releaseDate = new Date(product.releaseDate);

  return {
    id: product.id,
    urlId: product.urlId,
    title: product.title,
    description: product.description,
    content: product.content,
    imageUrl: product.imageUrl,
    screenshots: parseGalleryImages(product.galleryImages),
    category: product.category.name,
    platform: product.platform,
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
