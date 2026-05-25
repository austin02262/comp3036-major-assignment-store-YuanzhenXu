import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicGames } from "@/functions/games";

export default async function ReleaseYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  const products = await getPublicGames();

  // Shows only games released in the selected year.
  const filteredProducts = products.filter(
    (product) => product.releaseYear === yearNum,
  );

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
