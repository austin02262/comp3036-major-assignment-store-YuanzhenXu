import { client } from "./client.js";
import { products, purchases, users } from "./data.js";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

function hashPassword(password: string) {
  // Seeded demo users use the same PBKDF2 format as customer registration.
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100_000, 32, "sha256").toString("hex");

  return `${salt}:${hash}`;
}

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

    for (const user of users) {
      // Seed passwords use the same salted hash flow as customer registration.
      await tx.user.create({
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          passwordHash: hashPassword(user.password),
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          postcode: user.postcode,
        },
      });
    }

    for (const purchase of purchases) {
      const items = purchase.items.map((item) => {
        const product = products.find((entry) => entry.id === item.productId);

        if (!product) {
          throw new Error(`Missing seeded product ${item.productId}`);
        }

        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          productTitle: product.title,
          productImageUrl: product.imageUrl,
        };
      });

      // Orders store product snapshots so history remains readable after catalogue edits.
      await tx.purchase.create({
        data: {
          id: purchase.id,
          userId: purchase.userId,
          createdAt: purchase.createdAt,
          total: items.reduce(
            (total, item) => total + item.unitPrice * item.quantity,
            0,
          ),
          items: { create: items },
        },
      });
    }
  }, {
    // Neon may need more than Prisma's 5-second default during CI cold starts.
    maxWait: 10_000,
    timeout: 30_000,
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  // Allows `pnpm db:seed` to run this file directly after TypeScript build.
  seed()
    .then(() => {
      console.log("Seeded GameHub products, customers, and purchases");
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
