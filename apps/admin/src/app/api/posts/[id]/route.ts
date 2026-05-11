import { NextResponse } from "next/server";

import { client } from "@repo/db/client";

type PostPayload = { // the data get from form
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

function normalizePayload(payload: PostPayload) { // get rid of the space etc
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
  const postId = Number(id);

  if (Number.isNaN(postId)) { // if id is not number then return 400
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  // This endpoint is only for toggling visibility, so it reads the current value and flips it.
  const existingPost = await client.db.post.findUnique({
    where: {
      id: postId,  // get the postid from the database
    },
  });

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const updatedPost = await client.db.post.update({
    where: {
      id: postId,
    },
    data: {
      active: !existingPost.active, // change the active -deactive
    },
    select: {
      id: true,
      active: true,
    },
  });

  return NextResponse.json(updatedPost); //return the updated result
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const payload = (await request.json()) as PostPayload;
  // Reuse the same normalization logic as create so edit and create behave consistently.
  const data = normalizePayload(payload);

  const updatedPost = await client.db.post.update({
    where: {
      id: postId,
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

  return NextResponse.json(updatedPost);
}
