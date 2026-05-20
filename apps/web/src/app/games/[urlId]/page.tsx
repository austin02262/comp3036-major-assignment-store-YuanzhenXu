import { findGameByUrlId, gamePosts } from "@/data/gameCatalog";
import { AppLayout } from "@/components/Layout/AppLayout";
import { GameDetail } from "@/components/Store/GameDetail";
import { notFound } from "next/navigation";

export default async function GamePage({
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
        <GameDetail post={post} />
      </div>
    </AppLayout>
  );
}
