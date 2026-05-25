import { AppLayout } from "@/components/Layout/AppLayout";
import { GameDetail } from "@/components/Store/GameDetail";
import { getPublicGameByUrlId } from "@/functions/games";
import { notFound } from "next/navigation";

export default async function GamePage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  // Loads the product from the database, with static catalogue fallback.
  const product = await getPublicGameByUrlId(urlId);

  if (!product) {
    return notFound();
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <GameDetail product={product} />
      </div>
    </AppLayout>
  );
}
