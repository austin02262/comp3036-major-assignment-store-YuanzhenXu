import { client } from "./client.js";
import { products } from "./data.js";
import { fileURLToPath } from "node:url";

export async function seed() {
  // Publish the reset and seed atomically so applications never read a partial catalogue.
  await client.db.$transaction(async (tx) => {
    // Reset dependent tables first so repeated seeds start from a clean database.
    await tx.purchaseItem.deleteMany();
    await tx.purchase.deleteMany();
    await tx.user.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();

    for (const product of products) {
      // Each product is linked to a reusable category row.
      const category = await tx.category.upsert({
        where: { name: product.category },
        update: {},
        create: { name: product.category },
      });

      await tx.product.create({
        data: {
          id: product.id,
          urlId: product.urlId,
          title: product.title,
          description: product.description,
          content: product.content,
          imageUrl: product.imageUrl,
          galleryImages: product.galleryImages.join(","),
          platform: product.platform,
          platforms: product.platforms.join(","),
          price: product.price,
          stock: product.stock,
          releaseDate: product.releaseDate,
          active: product.active,
          categoryId: category.id,
        },
      });
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  // Allows `pnpm db:seed` to run this file directly after TypeScript build.
  seed()
    .then(() => {
      console.log("Seeded GameHub products");
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
