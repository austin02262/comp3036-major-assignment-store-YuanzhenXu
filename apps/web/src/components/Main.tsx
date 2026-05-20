import type { Post } from "@repo/db/data";
import { GameStorefront } from "./Store/GameStorefront";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  // Only active games appear on the customer storefront.
  const activePosts = posts.filter((post) => post.active);

  return (
    <main className={className}>
      <GameStorefront posts={activePosts} />
    </main>
  );
}
