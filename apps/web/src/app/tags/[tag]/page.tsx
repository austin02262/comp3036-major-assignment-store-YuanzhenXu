import { notFound } from "next/navigation";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPublicGames } from "@/functions/games";

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const products = await getPublicGames();

  const filteredProducts = products.filter((product) => {
    // Platform names are slugged so URLs stay readable.
    const tags = product.platforms
      .map((value) => value.trim().toLowerCase().replace(/\s+/g, "-"));

    return tags.includes(tag.toLowerCase());
  });

  if (filteredProducts.length === 0) notFound();

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
