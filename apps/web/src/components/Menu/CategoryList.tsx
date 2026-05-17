import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({ posts }: { posts: Post[] }) {
  // Genre links filter the storefront by game category.
  const items = categories(posts);
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-950/80">
      <h3 className="mb-4 border-b border-gray-200 pb-3 text-sm font-black uppercase tracking-wide text-gray-950 dark:border-white/10 dark:text-white">
        Genres
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name}>
            <SummaryItem
              count={item.count}
              name={item.name}
              title={`Category / ${item.name}`}
              isSelected={false}
              link={`/category/${encodeURIComponent(item.name.toLowerCase())}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
