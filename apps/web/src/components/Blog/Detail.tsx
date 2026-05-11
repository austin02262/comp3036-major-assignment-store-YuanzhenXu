import { marked } from "marked";

import { LikeButton } from "./LikeButton";

type BlogDetailPost = {
  id: number;
  urlId: string;
  title: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  tags: string;
  content: string;
};

function cleanTitle(title: string): string {
  return title.replace(/[!,]/g, "").replace(/\s+/g, " ").trim();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BlogDetail({
  post,
  likes,
  liked,
}: {
  post: BlogDetailPost;
  likes: number;
  liked: boolean;
}) {
  // Convert markdown stored in the database into HTML for the blog detail view.
  const renderedMarkdown = marked.parse(post.content) as string;

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="overflow-hidden rounded-xl bg-white shadow-md"
    >
      {post.imageUrl && (
        <div className="h-64 bg-gray-100 md:h-96">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-6 md:p-8">
        <a
          href={`/post/${post.urlId}`}
          className="block text-3xl font-bold text-gray-900 transition-colors hover:text-blue-600 md:text-4xl"
        >
          {cleanTitle(post.title)}
        </a>

        <div className="mt-2 mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <time>{formatDate(post.date)}</time> •
          <span>{post.category}</span> •
          <span>{post.views} views</span>
        </div>

        <div className="mb-6">
          {/* Like state is passed in from the server so the first render already matches the database. */}
          <LikeButton postId={post.id} initialLikes={likes} initialLiked={liked} />
        </div>

        <div
          data-test-id="content-markdown"
          className="prose prose-lg max-w-none"
          // We inject parsed markdown here so the saved post content renders with formatting.
          dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
        />

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.split(",").map((tag) => {
            const tagSlug = tag.trim().toLowerCase().replace(/\s+/g, "-");
            return (
              <a
                key={tag}
                href={`/tags/${tagSlug}`}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
              >
                #{tag.trim()}
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
}
