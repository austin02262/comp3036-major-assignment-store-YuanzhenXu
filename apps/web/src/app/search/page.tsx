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
  const products = await getPublicGames();

  const query = q?.trim().toLowerCase() || "";

  const filteredProducts = products.filter((product) => {
    // Search matches exact title words, release year, genre, or platform.
    if (!query) return true;

    const titleWords = product.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
    const titleMatch = titleWords.includes(query);
    const releaseYearMatch = product.releaseYear.toString() === query;
    const categoryMatch = product.category.toLowerCase() === query;
    const platformMatch = product.platforms.some(
      (platform) => platform.trim().toLowerCase() === query,
    );

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

    
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
