"use client";

import { useEffect, useState } from "react";
import { formatPrice, type StoreProduct } from "@/lib/storeProducts";
import { readCart, saveCart } from "@/utils/cartStorage";

type PurchaseItem = StoreProduct & {
  quantity: number;
};

type Purchase = {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  total: number;
  createdAt: string;
  items: PurchaseItem[];
};

type ApiPurchase = {
  id: string;
  total: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: {
    quantity: number;
    unitPrice: number;
    product: {
      id: number;
      urlId: string;
      title: string;
      description: string;
      content: string;
      imageUrl: string;
      galleryImages: string;
      platform: string;
      platforms: string;
      price: number;
      stock: number;
      releaseDate: string;
      active: boolean;
      category: { name: string };
    };
  }[];
};

function apiPurchaseToPurchase(purchase: ApiPurchase): Purchase {
  return {
    id: purchase.id,
    customerName: `${purchase.user.firstName} ${purchase.user.lastName}`.trim(),
    email: purchase.user.email,
    phone: purchase.user.phone,
    address: purchase.user.address,
    total: purchase.total,
    createdAt: purchase.createdAt,
    items: purchase.items.map(({ quantity, unitPrice, product }) => {
      const releaseDate = new Date(product.releaseDate);

      return {
        id: product.id,
        urlId: product.urlId,
        title: product.title,
        description: product.description,
        content: product.content,
        imageUrl: product.imageUrl,
        screenshots: product.galleryImages
          .split(",")
          .map((image) => image.trim())
          .filter(Boolean),
        category: product.category.name,
        platform: product.platform,
        platforms: product.platforms
          .split(",")
          .map((platform) => platform.trim())
          .filter(Boolean),
        price: unitPrice,
        stock: product.stock,
        releaseDate: releaseDate.toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        releaseYear: releaseDate.getFullYear(),
        active: product.active,
        quantity,
      };
    }),
  };
}

function addPurchaseToCart(items: PurchaseItem[]) {
  // Lets customers quickly repurchase a previous order.
  const cart = readCart();

  for (const item of items) {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
  }

  saveCart(cart);
}

export function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/purchases")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Purchase history could not be loaded.");
        }

        return response.json() as Promise<ApiPurchase[]>;
      })
      .then((records) => setPurchases(records.map(apiPurchaseToPurchase)))
      .catch(() => setPurchases([]));
  }, []);

  const deletePurchase = (purchaseId: string) => {
    const nextPurchases = purchases.filter((purchase) => purchase.id !== purchaseId);
    setPurchases(nextPurchases);
    setMessage("Purchase record deleted.");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-950">Purchase History</h1>

      {message && (
        <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm font-bold text-green-700">
          {message}
        </p>
      )}

      {purchases.length === 0 ? (
        <div className="mt-8 rounded-lg bg-white p-8 text-center shadow-md">
          <p className="text-lg font-semibold text-gray-950">
            No purchases have been made yet.
          </p>
          <a
            href="/"
            className="mt-4 inline-flex rounded-md bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
          >
            Browse Games
          </a>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {purchases.map((purchase) => (
            <article key={purchase.id} className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-950">{purchase.id}</h2>
                  <p className="text-sm text-gray-600">
                    {purchase.customerName} / {purchase.email}
                  </p>
                  {purchase.phone && (
                    <p className="text-sm text-gray-600">Phone: {purchase.phone}</p>
                  )}
                  {purchase.address && (
                    <p className="text-sm text-gray-600">Address: {purchase.address}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(purchase.createdAt).toLocaleString("en-AU")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-950">
                    {formatPrice(purchase.total)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      addPurchaseToCart(purchase.items);
                      setMessage("Previous purchase added to cart.");
                    }}
                    className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
                  >
                    Buy Again
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePurchase(purchase.id)}
                    className="ml-2 mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
                {purchase.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                    <span className="font-semibold text-gray-800">
                      {item.title} x {item.quantity}
                    </span>
                    <span className="text-gray-700">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
