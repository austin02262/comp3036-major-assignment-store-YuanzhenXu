"use client";

import { CheckoutPage } from "@/components/Store/CheckoutPage";

export function CartPage() {
  // Cart and checkout are intentionally combined for a simpler customer flow.
  return <CheckoutPage />;
}
