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
    // Publish the reset and seed atomically so readers never observe a partially rebuilt catalogue.
    await db.$transaction(async (tx) => {
      // Delete child records first to satisfy relational foreign keys.
      await tx.purchaseItem.deleteMany();
      await tx.purchase.deleteMany();
      await tx.user.deleteMany();
      await tx.product.deleteMany();
      await tx.category.deleteMany();

      for (const product of products) {
        // Recreate categories while preserving product-category relationships.
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
    }, {
      // Allow enough time for Neon cold starts while keeping the reset atomic.
      maxWait: 10_000,
      timeout: 30_000,
    });
  } finally {
    await db.$disconnect();
  }
});
