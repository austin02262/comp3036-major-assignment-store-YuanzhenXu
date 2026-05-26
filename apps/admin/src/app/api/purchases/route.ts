import { NextResponse } from "next/server";

import { client } from "@repo/db/client";
import { requireAdmin } from "../../../utils/apiAuth";

export async function GET() {
  // Admin-only endpoint for reviewing all customer purchase records.
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  // Admin purchase history includes the customer and each purchased product.
  const purchases = await client.db.purchase.findMany({
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
