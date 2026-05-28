import { test as setup } from "@playwright/test";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { products } from "../../../packages/db/src/data";

setup("reset database and seed products", async () => {
  // Playwright starts from a known database so E2E tests are repeatable in CI.
  if (!fs.existsSync(".auth")) {
    fs.mkdirSync(".auth");
  }

  const db = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

  try {
    // Delete child records first to satisfy relational foreign keys.
    await db.purchaseItem.deleteMany();
    await db.purchase.deleteMany();
    await db.user.deleteMany();
    await db.product.deleteMany();
    await db.category.deleteMany();

    for (const product of products) {
      // Recreate categories while preserving product-category relationships.
      const category = await db.category.upsert({
        where: { name: product.category },
        update: {},
        create: { name: product.category },
      });

      await db.product.create({
        data: {
          id: product.id,
          urlId: product.urlId,
          title: product.title,
          description: product.description,
          content: product.content,
          imageUrl: product.imageUrl,
          // Seed data uses comma-separated URLs; admin uploads are stored as JSON later.
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
  } finally {
    await db.$disconnect();
  }
});
