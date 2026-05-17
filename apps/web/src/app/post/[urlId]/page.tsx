import { findGameByUrlId, gamePosts } from "@/data/gameCatalog";
import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  // Loads both the full game record and the legacy Post adapter.
  const game = findGameByUrlId(urlId);
  const post = gamePosts.find((item) => item.urlId === urlId);

  if (!game || !post) {
    return notFound();
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <BlogDetail post={post} likes={0} liked={false} />
      </div>
    </AppLayout>
  );
}
