import { NextResponse } from "next/server";

import { client, resetClient } from "@repo/db/client";
import { getCurrentCustomer } from "@/utils/userAuth";

type PurchasePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  postcode?: string;
  items?: { productId?: number; quantity?: number }[];
};

function clean(value?: string) {
  // Trims optional form values before server-side validation.
  return value?.trim() || "";
}

function isTransientDatabaseError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes("terminating connection due to administrator command") ||
    message.includes("Server has closed the connection") ||
    message.includes("Can't reach database server") ||
    message.includes("Connection terminated")
  );
}

async function runWithDatabaseRetry<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (!isTransientDatabaseError(error)) {
      throw error;
    }

    await resetClient();
    return operation();
  }
}

export async function GET() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Customers only see purchases made from their own account.
  const purchases = await client.db.purchase.findMany({
    where: { userId: customer.id },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(purchases);
}

export async function POST(request: Request) {
  // Checkout receives cart items and turns them into persisted purchase records.
  const customer = await getCurrentCustomer();

  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as PurchasePayload;
  const items = (payload.items || [])
    .map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity || 1),
    }))
    .filter((item) => Number.isFinite(item.productId) && item.quantity > 0);

  const firstName = clean(payload.firstName);
  const lastName = clean(payload.lastName);
  const email = clean(payload.email);
  const phone = clean(payload.phone);
  const address = clean(payload.address);
  const postcode = clean(payload.postcode);

  if (!firstName || !lastName || !email || !phone || !address || !postcode) {
    return NextResponse.json(
      { error: "Customer and delivery details are required" },
      { status: 400 },
    );
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const productIds = items.map((item) => item.productId);
  // Only active products can be purchased from the storefront.
  const products = await client.db.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "One or more products are unavailable" },
      { status: 400 },
    );
  }

  const total = items.reduce((sum, item) => {
    // The server recalculates totals instead of trusting the browser.
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const purchase = await runWithDatabaseRetry(() =>
    client.db.$transaction(async (db) => {
      // The checkout endpoint stores the order against the logged-in customer.
      const user = await db.user.update({
        where: { id: customer.id },
        data: { firstName, lastName, phone, address, postcode },
      });

      return db.purchase.create({
        data: {
          id: `GH-${Date.now()}`,
          total,
          userId: user.id,
          items: {
            create: items.map((item) => {
              const product = products.find((entry) => entry.id === item.productId);

              if (!product) {
                throw new Error("Product not found");
              }

              return {
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
                productTitle: product.title,
                productImageUrl: product.imageUrl,
              };
            }),
          },
        },
        include: {
          user: true,
          items: true,
        },
      });
    }),
  );

  return NextResponse.json(purchase, { status: 201 });
}
