// app/search/page.tsx
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicGames } from "@/functions/games";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  
  const { q } = await searchParams;
  const posts = await getPublicGames();

  const query = q?.trim().toLowerCase() || "";

  const filteredPosts = posts.filter(post => {
    // Search matches exact title words, release year, genre, or platform.
    if (!query) return true;

    const titleWords = post.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
    const titleMatch = titleWords.includes(query);
    const releaseYearMatch = post.date.getFullYear().toString() === query;
    const categoryMatch = post.category.toLowerCase() === query;
    const platformMatch = post.tags
      .split(",")
      .some((tag) => tag.trim().toLowerCase() === query);

    return titleMatch || releaseYearMatch || categoryMatch || platformMatch;
  });

  return (
    <AppLayout query={query}>
      
      <div className="mb-4">
        {query && (
          <p className="text-gray-600">
            Showing games for: "{query}"
          </p>
        )}
      </div>

    
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
