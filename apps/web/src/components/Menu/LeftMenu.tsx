import { getPublicPosts } from "@/functions/posts";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";  

export async function LeftMenu() {
  // Shared storefront filters reuse the blog sidebar structure.
  const posts = await getPublicPosts();

  return (
    <div className="space-y-4 text-[var(--text)]">
      <a href="/" className="block rounded-2xl bg-blue-700 p-5 text-white shadow-lg shadow-blue-950/20 dark:bg-blue-600">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-100">
          Filter Console Games
        </p>
        <p className="mt-2 text-2xl font-black tracking-tight">Find Your Next Play</p>
        <p className="mt-2 text-sm leading-6 text-blue-100">
          Narrow the catalogue by genre, release year, or platform.
        </p>
      </a>
      <CategoryList posts={posts} />
      <HistoryList posts={posts} />
      <TagList posts={posts} />
    </div>
  );
}
