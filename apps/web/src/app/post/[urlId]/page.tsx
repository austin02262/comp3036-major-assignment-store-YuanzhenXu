import { client } from "@repo/db/client";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";

function getRequestIp(forwardedFor: string | null, realIp: string | null) {
  // Use IP as a lightweight identifier so one visitor can only like a post once at a time.
  return forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const requestHeaders = await headers();
  const userIP = getRequestIp(
    requestHeaders.get("x-forwarded-for"),
    requestHeaders.get("x-real-ip"),
  );

  // Public post pages now read from Prisma, which lets us respect the active flag from admin.
  const existingPost = await client.db.post.findUnique({
    where: {
      urlId,
    },
  });

  if (!existingPost || !existingPost.active) {
    return notFound();
  }

  // Increment views when the page is opened so the displayed counter reflects real traffic.
  const post = await client.db.post.update({
    where: {
      id: existingPost.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  // Load total likes and whether this visitor already liked the post before rendering the button.
  const [likes, currentLike] = await Promise.all([
    client.db.like.count({
      where: {
        postId: post.id,
      },
    }),
    client.db.like.findUnique({
      where: {
        postId_userIP: {
          postId: post.id,
          userIP,
        },
      },
    }),
  ]);


  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <BlogDetail post={post} likes={likes} liked={Boolean(currentLike)} />
      </div>
    </AppLayout>
  );
}
