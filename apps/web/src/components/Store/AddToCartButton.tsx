"use client";

import { useEffect, useState } from "react";
import type { StoreProduct } from "@/lib/storeProducts";

const cartKey = "gamehub-cart";

type CartItem = StoreProduct & {
  quantity: number;
};

function readCart(): CartItem[] {
  // Reads the browser cart used by the frontend-only prototype.
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(cartKey) || "[]") as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  // Broadcasts a custom event so the navbar cart count updates immediately.
  window.localStorage.setItem(cartKey, JSON.stringify(items));
  window.dispatchEvent(new Event("gamehub-cart-updated"));
}

export function AddToCartButton({ product }: { product: StoreProduct }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timeout = window.setTimeout(() => setMessage(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const addToCart = () => {
    // Adds a new game or increases quantity when it already exists.
    const cart = readCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      writeCart(cart);
      setMessage("Item added to cart");
      return;
    }

    writeCart([...cart, { ...product, quantity: 1 }]);
    setMessage("Item added to cart");
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={addToCart}
        className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-900/20 transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/20 dark:bg-red-600 dark:hover:bg-red-500"
      >
        Add to Cart
      </button>
      {message && (
        <span className="absolute bottom-full right-0 mb-2 w-max rounded-lg bg-gray-950 px-3 py-2 text-xs font-bold text-white shadow-lg">
          {message}
        </span>
      )}
    </div>
  );
}
