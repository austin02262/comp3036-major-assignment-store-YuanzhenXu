import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({ posts }: { posts: Post[] }) {
  const items = categories(posts);
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name}>
            <SummaryItem
              count={item.count}
              name={item.name}
              title={`Category / ${item.name}`}
              isSelected={false}
              link={`/category/${encodeURIComponent(item.name.toLowerCase())}`}  // ✅ 改成小写
            />
          </li>
        ))}
      </ul>
    </div>
  );
}