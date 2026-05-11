import type { Post } from "@repo/db/data";
import { BlogList } from "./Blog/List"; 

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  // ✅ 只显示 active 的文章
  const activePosts = posts.filter(post => post.active);
  
  return (
    <main className={className}>
      <BlogList posts={activePosts} />
    </main>
  );
}