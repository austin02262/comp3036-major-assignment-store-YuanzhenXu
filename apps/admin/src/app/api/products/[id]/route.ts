import { NextResponse } from "next/server";

import { client } from "@repo/db/client";

type ProductPayload = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
  category?: string;
};

function slugify(title: string) { // change title to URL
  return title
    .toLowerCase()
    .trim() // get rid of the space
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePayload(payload: ProductPayload) {
  return {
    title: payload.title?.trim() || "",
    description: payload.description?.trim() || "",
    content: payload.content?.trim() || "",
    imageUrl: payload.imageUrl?.trim() || "",
    tags: payload.tags
      ?.split(",")  // separate by comma
      .map((tag) => tag.trim())
      .filter(Boolean)
      .join(",") || "",
    category: payload.category?.trim() || "React", // if no category then choose default :react
  };
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // take the urlid out and change into number
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  // This endpoint is only for toggling visibility, so it reads the current value and flips it.
  const existingProduct = await client.db.post.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const updatedProduct = await client.db.post.update({
    where: {
      id: productId,
    },
    data: {
      active: !existingProduct.active,
    },
    select: {
      id: true,
      active: true,
    },
  });

  return NextResponse.json(updatedProduct);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const payload = (await request.json()) as ProductPayload;
  // Reuse the same normalization logic as create so edit and create behave consistently.
  const data = normalizePayload(payload);

  const updatedProduct = await client.db.post.update({
    where: {
      id: productId,
    },
    data: {
      ...data,
      // Rebuild the slug when the title changes so the public URL stays aligned with the latest title.
      urlId: slugify(data.title),
    },
    select: {
      id: true,
      urlId: true,
      title: true,
    },
  });

  return NextResponse.json(updatedProduct);
}
