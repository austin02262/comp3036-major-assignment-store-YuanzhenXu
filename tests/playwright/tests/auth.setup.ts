import { test as setup } from "@playwright/test";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { products } from "../../../packages/db/src/data";

setup("reset database and seed products", async () => {
  if (!fs.existsSync(".auth")) {
    fs.mkdirSync(".auth");
  }

  const db = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

  try {
    await db.purchaseItem.deleteMany();
    await db.purchase.deleteMany();
    await db.user.deleteMany();
    await db.product.deleteMany();
    await db.category.deleteMany();

    for (const product of products) {
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
