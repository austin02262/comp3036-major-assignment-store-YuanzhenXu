import { gamePosts } from "@/data/gameCatalog";
import type { Post } from "@repo/db/data";

export async function getPublicPosts(): Promise<Post[]> {
  return gamePosts;
}
