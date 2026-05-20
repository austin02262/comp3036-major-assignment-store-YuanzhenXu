import { gamePosts } from "@/data/gameCatalog";
import type { Post } from "@repo/db/data";

export async function getPublicGames(): Promise<Post[]> {
  // Returns the temporary game catalogue through the shared storefront data function.
  return gamePosts;
}
