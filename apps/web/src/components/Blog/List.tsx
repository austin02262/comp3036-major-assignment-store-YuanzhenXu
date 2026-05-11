import type { Post } from "@repo/db/data";

function cleanTitle(title: string): string {
  return title.replace(/[!,]/g, '').replace(/\s+/g, ' ').trim();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <div className="text-center py-12 bg-gray-50 rounded-lg">0 Posts</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          data-test-id={`blog-post-${post.id}`}
          className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row">
            {post.imageUrl && (
              <div className="md:w-1/3 h-48 md:h-auto bg-gray-100">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 flex-1">
              <a
                href={`/post/${post.urlId}`}
                className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {cleanTitle(post.title)}
              </a>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
                <time>{formatDate(post.date)}</time> • <span>{post.category}</span> •{" "}
                <span>{post.views} views</span> • <span>{post.likes} likes</span>
              </div>

              <p className="mt-3 text-gray-600 line-clamp-3">
                {post.description.replace(cleanTitle(post.title), "").trim()}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.split(",").map((tag) => {
                  const tagSlug = tag.trim().toLowerCase().replace(/\s+/g, '-');
                  return (
                    <a
                      key={tag}
                      href={`/tags/${tagSlug}`}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                    >
                      #{tag.trim()}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}