import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  // Reset likes before posts to avoid foreign-key issues when reseeding the database.
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();

  for (const post of posts) {
    // Move the original mock data into Prisma so the app can use the same starter content from the DB.
    await client.db.post.create({
      data: {
        id: post.id,
        urlId: post.urlId,
        title: post.title,
        content: post.content,
        description: post.description,
        imageUrl: post.imageUrl,
        category: post.category,
        tags: post.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .join(","),
        date: post.date,
        views: post.views,
        active: post.active,
      },
    });

    for (let i = 0; i < post.likes; i += 1) {
      // Pre-create like rows so seeded posts also start with realistic like counts.
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
}
