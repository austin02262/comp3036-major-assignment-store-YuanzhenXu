import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { SummaryItem } from "./SummaryItem";

export function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const tagItems = tags(posts);

  if (tagItems.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-950/80">
      <h3 className="mb-4 border-b border-gray-200 pb-3 text-sm font-black uppercase tracking-wide text-gray-950 dark:border-white/10 dark:text-white">Platforms</h3>
      <ul className="space-y-2">
        {tagItems.map((item) => {
          // ✅ 转换成小写，空格变连字符
          const tagSlug = item.name.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <li key={item.name}>
              <SummaryItem
                name={item.name}
                title={`Tag / ${item.name}`}
                count={item.count}
                isSelected={selectedTag === item.name}
                link={`/tags/${encodeURIComponent(tagSlug)}`}  // ✅ 改成 /tags/
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
