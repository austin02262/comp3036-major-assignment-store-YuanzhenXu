"use client";

import { useEffect, useMemo, useState } from "react";
import { GameImage } from "@/components/Store/GameImage";
import { formatPrice, type StoreProduct } from "@/lib/storeProducts";
import { readCart, saveCart } from "@/utils/cartStorage";

type CartItem = StoreProduct & {
  quantity: number;
};

export function CartPreview({ cartCount }: { cartCount: number }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const updateItems = () => setItems(readCart());

    updateItems();
    window.addEventListener("storage", updateItems);
    window.addEventListener("gamehub-cart-updated", updateItems);

    return () => {
      window.removeEventListener("storage", updateItems);
      window.removeEventListener("gamehub-cart-updated", updateItems);
    };
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const updateQuantity = (id: number, quantity: number) => {
    // Quantity 0 is treated as removing the item.
    const nextItems = items
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    setItems(nextItems);
    saveCart(nextItems);
  };

  const removeItem = (id: number) => {
    // Removes one product from the cart preview.
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
    saveCart(nextItems);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-950 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
      >
        Cart ({cartCount})
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-gray-950/70 px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-label="Cart preview"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex max-h-[86vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 text-gray-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close cart preview"
              className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-950"
              onClick={() => setOpen(false)}
            >
              x
            </button>

            {items.length === 0 ? (
              <div className="mt-8 rounded-lg border border-gray-200 bg-gray-100 px-8 py-10 text-center text-xl">
                <strong>Oh no!</strong> currently your cart is empty.
              </div>
            ) : (
              <>
                <div className="max-h-[520px] space-y-4 overflow-y-auto pr-3">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="grid gap-4 border border-gray-200 p-4 sm:grid-cols-[90px_1fr_auto]"
                    >
                      <GameImage
                        src={item.imageUrl}
                        alt={item.title}
                        title={item.title}
                        className="aspect-[4/3] w-full rounded-md object-cover sm:w-20"
                      />
                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.platform}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <label className="text-sm font-semibold">
                            Qty
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(event) =>
                                updateQuantity(item.id, Number(event.target.value))
                              }
                              className="ml-2 w-16 rounded border border-gray-300 px-2 py-1"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-sm font-bold text-red-700 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="text-lg font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="mt-6 shrink-0 border-t border-gray-200 pt-5">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total amount</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="mt-6 grid gap-3">
                    <a
                      href="/checkout"
                      className="rounded-lg bg-blue-700 px-4 py-3 text-center text-lg font-bold text-white hover:bg-blue-800"
                    >
                      CHECKOUT NOW
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
