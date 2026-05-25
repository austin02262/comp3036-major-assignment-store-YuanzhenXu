import type { StoreProduct } from "@/lib/storeProducts";
import { GameStorefront } from "./Store/GameStorefront";

export function Main({
  products,
  className,
}: {
  products: StoreProduct[];
  className?: string;
}) {
  // Only active games appear on the customer storefront.
  const activeProducts = products.filter((product) => product.active !== false);

  return (
    <main className={className}>
      <GameStorefront products={activeProducts} />
    </main>
  );
}
