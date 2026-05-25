import { gameCatalog } from "@/data/gameCatalog";
import { client } from "@repo/db/client";
import {
  productRecordToStoreProduct,
  type ProductRecord,
  type StoreProduct,
} from "@/lib/storeProducts";

export async function getPublicGames(): Promise<StoreProduct[]> {
  try {
    const products = await client.db.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { id: "asc" },
    });

    if (products.length > 0) {
      return products.map((product) =>
        productRecordToStoreProduct(product as ProductRecord),
      );
    }
  } catch {
    // Local fallback keeps the frontend demo available before the database is seeded.
  }

  return gameCatalog;
}

export async function getPublicGameByUrlId(
  urlId: string,
): Promise<StoreProduct | undefined> {
  try {
    const product = await client.db.product.findUnique({
      where: { urlId },
      include: { category: true },
    });

    if (product?.active) {
      return productRecordToStoreProduct(product as ProductRecord);
    }
  } catch {
    // Fall back to the static catalogue when the database is not ready.
  }

  return gameCatalog.find((game) => game.urlId === urlId);
}
