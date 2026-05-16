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

function slugify(title: string) { // convert titile to a clean url
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePayload(payload: ProductPayload) {
//It cleans and normalizes all form input before saving to the database.
  return {
    title: payload.title?.trim() || "",
    description: payload.description?.trim() || "",
    content: payload.content?.trim() || "",
    imageUrl: payload.imageUrl?.trim() || "",
    tags: payload.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .join(",") || "",
    category: payload.category?.trim() || "React",
  };
}

//The previous step prepares and cleans the data, 
// and this part stores the processed data into the database.
export async function POST(request: Request) {
  const payload = (await request.json()) as ProductPayload;
  const data = normalizePayload(payload);

  const createdProduct = await client.db.post.create({
    data: {
      ...data, // the data user created
      urlId: slugify(data.title), //change title to url
      active: true, // set article active
    },
    select: {
      id: true,
      urlId: true,
      title: true,
    },
  });

  return NextResponse.json(createdProduct);
}
