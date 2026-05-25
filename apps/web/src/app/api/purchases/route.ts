import { NextResponse } from "next/server";

import { client } from "@repo/db/client";

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
  return value?.trim() || "";
}

export async function GET() {
  const purchases = await client.db.purchase.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(purchases);
}

export async function POST(request: Request) {
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
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const purchase = await client.db.$transaction(async (db) => {
    // The checkout endpoint stores customer, order, and item rows together.
    const user = await db.user.upsert({
      where: { email },
      update: { firstName, lastName, phone, address, postcode },
      create: { email, firstName, lastName, phone, address, postcode },
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
  });

  return NextResponse.json(purchase, { status: 201 });
}
