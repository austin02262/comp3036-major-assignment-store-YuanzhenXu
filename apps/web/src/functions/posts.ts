import { gamePosts } from "@/data/gameCatalog";
import type { Post } from "@repo/db/data";

export async function getPublicPosts(): Promise<Post[]> {
  // Returns the temporary game catalogue through the old blog data function.
  return gamePosts;
}
