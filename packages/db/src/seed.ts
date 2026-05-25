import { client } from "./client.js";
import { products } from "./data.js";
import { fileURLToPath } from "node:url";

export async function seed() {
  await client.db.purchaseItem.deleteMany();
  await client.db.purchase.deleteMany();
  await client.db.user.deleteMany();
  await client.db.product.deleteMany();
  await client.db.category.deleteMany();

  for (const product of products) {
    const category = await client.db.category.upsert({
      where: { name: product.category },
      update: {},
      create: { name: product.category },
    });

    await client.db.product.create({
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
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seed()
    .then(() => {
      console.log("Seeded GameHub products");
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
