import type { Post } from "@repo/db/data";
import { BlogList } from "./Blog/List";

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
      <BlogList posts={activePosts} />
    </main>
  );
}
