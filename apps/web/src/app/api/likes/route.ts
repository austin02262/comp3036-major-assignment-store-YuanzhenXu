import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { client } from "@repo/db/client";

function getRequestIp(forwardedFor: string | null, realIp: string | null) {
  return forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";
} // get the user ip

async function getPostId(request: Request) {
  // The client only sends the post id, and the server get the postid and change it into number.
  const body = (await request.json()) as { postId?: number };
  return Number(body.postId);
}

export async function POST(request: Request) {
  const postId = await getPostId(request);

  if (Number.isNaN(postId)) { // if the postid is invalid then back 400
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const requestHeaders = await headers();
  const userIP = getRequestIp(
    requestHeaders.get("x-forwarded-for"),
    requestHeaders.get("x-real-ip"),  //pick the ip from the headers
  );

  const existingLike = await client.db.like.findUnique({ // check if this post liked or not by using "unique" postid/userip
    where: {
      postId_userIP: {
        postId,
        userIP,
      },
    },
  });

  if (!existingLike) {
    // Create a like only if this IP has not liked the same post yet.
    await client.db.like.create({
      data: {
        postId,
        userIP,
      },
    });
  }

  const likes = await client.db.like.count({ // count how many like for this post now
    where: {
      postId,
    },
  });

  return NextResponse.json({ likes, liked: true }); // return the like number to frontend
}

export async function DELETE(request: Request) {
  const postId = await getPostId(request);

  if (Number.isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const requestHeaders = await headers();
  const userIP = getRequestIp(
    requestHeaders.get("x-forwarded-for"),
    requestHeaders.get("x-real-ip"),
  );

  await client.db.like.deleteMany({
    // deleteMany is safe here because the unique pair is postId + userIP.
    where: {
      postId,
      userIP,
    },
  });

  const likes = await client.db.like.count({
    where: {
      postId,
    },
  });

  return NextResponse.json({ likes, liked: false });
}
