import { getPublicPosts } from "@/functions/posts";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";  

export async function LeftMenu() {
  const posts = await getPublicPosts();

  return (
    <div className="p-4 space-y-6 bg-[var(--background)] text-[var(--text)]">
      <CategoryList posts={posts} />
      <HistoryList posts={posts} />
      <TagList posts={posts} />  {/* left menu only has three parts: Category/history/Tag */}
    </div>
  );
}
