// app/search/page.tsx
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicPosts } from "@/functions/posts";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  
  const { q } = await searchParams;
  const posts = await getPublicPosts();

  // Normalize the query: convert to lowercase for case-insensitive matching
  const query = q?.toLowerCase() || "";

  // Filter posts based on title, description, or tags
  const filteredPosts = posts.filter(post => {
    // Check if the title contains the search query
    const titleMatch = post.title.toLowerCase().includes(query);

    // Check if the description contains the search query
    const descMatch = post.description?.toLowerCase().includes(query);

    // Check if any tag contains the search query
    // Example: "React, NextJS" → ["React", "NextJS"]
    const tagsMatch = post.tags
      .split(',')
      .some(tag => tag.trim().toLowerCase().includes(query));

    // A post matches if ANY of the fields match
    return titleMatch || descMatch || tagsMatch;
  });

  return (
    <AppLayout query={query}>
      
      <div className="mb-4">
        {query && (
          <p className="text-gray-600">
            Showing results for: "{query}"
          </p>
        )}
      </div>

    
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
