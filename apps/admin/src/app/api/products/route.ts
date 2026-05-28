import { NextResponse } from "next/server";

import { client } from "@repo/db/client";
import { requireAdmin } from "../../../utils/apiAuth";

type ProductPayload = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  galleryImages?: string[] | string;
  category?: string;
  platform?: string;
  platforms?: string[] | string;
  price?: number | string;
  stock?: number | string;
  releaseDate?: string;
  active?: boolean;
};

function slugify(title: string) {
  // Creates a clean public URL id from a game title.
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toList(value?: string[] | string) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeGalleryImages(value?: string[] | string) {
  return JSON.stringify(toList(value));
}

function normalizePayload(payload: ProductPayload) {
  // Normalizes admin form input into the Product database shape.
  const platforms = toList(payload.platforms);
  const releaseDate = payload.releaseDate
    ? new Date(`${payload.releaseDate}T00:00:00`)
    : new Date();

  return {
    title: payload.title?.trim() || "",
    description: payload.description?.trim() || "",
    content: payload.content?.trim() || payload.description?.trim() || "",
    imageUrl: payload.imageUrl?.trim() || "",
    galleryImages: serializeGalleryImages(payload.galleryImages),
    category: payload.category?.trim() || "Action",
    platform: payload.platform?.trim() || platforms.join(", ") || "PlayStation",
    platforms: platforms.length > 0 ? platforms.join(",") : "PlayStation",
    price: Number(payload.price || 0),
    stock: Number(payload.stock || 0),
    releaseDate,
    active: payload.active ?? true,
  };
}

export async function GET() {
  // Admin dashboard reads the full product catalogue, including hidden products.
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const products = await client.db.product.findMany({
    include: { category: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  // Creates a new product record from the admin "Add Game" form.
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = (await request.json()) as ProductPayload;
  const data = normalizePayload(payload);

  if (
    !data.title ||
    !data.description ||
    !data.imageUrl ||
    !Number.isFinite(data.price) ||
    data.price <= 0 ||
    Number.isNaN(data.releaseDate.getTime())
  ) {
    return NextResponse.json(
      { error: "Title, description, image, price, and release date are required" },
      { status: 400 },
    );
  }

  const createdProduct = await client.db.product.create({
    data: {
      urlId: slugify(data.title),
      title: data.title,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      galleryImages: data.galleryImages,
      platform: data.platform,
      platforms: data.platforms,
      price: data.price,
      stock: data.stock,
      releaseDate: data.releaseDate,
      active: data.active,
      category: {
        // Reuses an existing genre row or creates it for new product categories.
        connectOrCreate: {
          where: { name: data.category },
          create: { name: data.category },
        },
      },
    },
    include: { category: true },
  });

  return NextResponse.json(createdProduct, { status: 201 });
}
