import { NextResponse } from "next/server";

import { client } from "@repo/db/client";
import { requireAdmin } from "../../../../utils/apiAuth";

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
  // Keeps the public product URL aligned with the game title.
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
  // Shared update parser so create and edit accept the same JSON shape.
  const platforms = toList(payload.platforms);
  const releaseDate = payload.releaseDate
    ? new Date(`${payload.releaseDate}T00:00:00`)
    : undefined;

  return {
    title: payload.title?.trim(),
    description: payload.description?.trim(),
    content: payload.content?.trim() || payload.description?.trim(),
    imageUrl: payload.imageUrl?.trim(),
    galleryImages: serializeGalleryImages(payload.galleryImages),
    category: payload.category?.trim(),
    platform: payload.platform?.trim() || platforms.join(", "),
    platforms: platforms.join(","),
    price: payload.price === undefined ? undefined : Number(payload.price),
    stock: payload.stock === undefined ? undefined : Number(payload.stock),
    releaseDate,
    active: payload.active,
  };
}

function parseProductId(id: string) {
  // Route params arrive as strings, so the API validates them before database use.
  const productId = Number(id);
  return Number.isNaN(productId) ? undefined : productId;
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // PATCH is used by the admin dashboard to toggle storefront availability.
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const productId = parseProductId(id);

  if (!productId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const existingProduct = await client.db.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const updatedProduct = await client.db.product.update({
    where: { id: productId },
    data: { active: !existingProduct.active },
    select: { id: true, active: true },
  });

  return NextResponse.json(updatedProduct);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // PUT updates editable product fields from the admin edit form.
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const productId = parseProductId(id);

  if (!productId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const payload = (await request.json()) as ProductPayload;
  const data = normalizePayload(payload);
  const category = data.category || "Action";

  const existingProduct = await client.db.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (
    (data.price !== undefined &&
      (!Number.isFinite(data.price) || data.price <= 0)) ||
    (data.stock !== undefined && !Number.isFinite(data.stock)) ||
    (data.releaseDate !== undefined && Number.isNaN(data.releaseDate.getTime()))
  ) {
    return NextResponse.json(
      { error: "Price, stock, or release date is invalid" },
      { status: 400 },
    );
  }

  const updatedProduct = await client.db.product.update({
    where: { id: productId },
    data: {
      ...(data.title ? { title: data.title, urlId: slugify(data.title) } : {}),
      ...(data.description ? { description: data.description } : {}),
      ...(data.content ? { content: data.content } : {}),
      ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
      ...(data.galleryImages ? { galleryImages: data.galleryImages } : {}),
      ...(data.platform ? { platform: data.platform } : {}),
      ...(data.platforms ? { platforms: data.platforms } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.stock !== undefined ? { stock: data.stock } : {}),
      ...(data.releaseDate ? { releaseDate: data.releaseDate } : {}),
      ...(data.active !== undefined ? { active: data.active } : {}),
      category: {
        // Genre changes are linked through the Category relation.
        connectOrCreate: {
          where: { name: category },
          create: { name: category },
        },
      },
    },
    include: { category: true },
  });

  return NextResponse.json(updatedProduct);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // DELETE soft-hides a product so purchase records can still reference it.
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const productId = parseProductId(id);

  if (!productId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const existingProduct = await client.db.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await client.db.product.update({
    where: { id: productId },
    data: { active: false },
  });

  return NextResponse.json({ ok: true });
}
