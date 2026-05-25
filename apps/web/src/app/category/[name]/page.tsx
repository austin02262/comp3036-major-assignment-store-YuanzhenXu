import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicGames } from "@/functions/games";

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);
  const products = await getPublicGames();

  // Filters games by genre from the sidebar links.
  const filteredProducts = products.filter(
    product => product.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
