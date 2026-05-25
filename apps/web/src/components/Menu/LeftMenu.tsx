import { getPublicGames } from "@/functions/games";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";  

export async function LeftMenu() {
  // Shared storefront filters for genre, release year, and platform.
  const products = await getPublicGames();

  return (
    <div className="space-y-4 text-[var(--text)]">
      <a href="/" className="block rounded-2xl bg-blue-700 p-5 text-white shadow-lg shadow-blue-950/20 dark:bg-blue-600">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-100">
          Filter Console Games
        </p>
        <p className="mt-2 text-2xl font-black tracking-tight">Find Your Next Play</p>
      </a>
      <CategoryList products={products} />
      <HistoryList products={products} />
      <TagList products={products} />
    </div>
  );
}
