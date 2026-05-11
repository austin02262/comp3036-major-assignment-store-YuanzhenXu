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
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
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