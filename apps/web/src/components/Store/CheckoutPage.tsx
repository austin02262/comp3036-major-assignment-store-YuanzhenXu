"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GameImage } from "@/components/Store/GameImage";
import { formatPrice, type StoreProduct } from "@/lib/storeProducts";

const cartKey = "gamehub-cart";
const purchasesKey = "gamehub-purchases";

type CartItem = StoreProduct & {
  quantity: number;
};

type Purchase = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  createdAt: string;
  items: CartItem[];
};

function readCart(): CartItem[] {
  // Loads selected products for the combined cart and checkout page.
  try {
    return JSON.parse(window.localStorage.getItem(cartKey) || "[]") as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  // Saves cart edits made directly on the checkout page.
  window.localStorage.setItem(cartKey, JSON.stringify(items));
  window.dispatchEvent(new Event("gamehub-cart-updated"));
}

function readPurchases(): Purchase[] {
  // Purchase history is mocked in the browser until backend orders are added.
  try {
    return JSON.parse(window.localStorage.getItem(purchasesKey) || "[]") as Purchase[];
  } catch {
    return [];
  }
}

export function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(readCart());
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const updateQuantity = (id: number, quantity: number) => {
    const nextItems = items
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    setItems(nextItems);
    saveCart(nextItems);
  };

  const removeItem = (id: number) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
    saveCart(nextItems);
  };

  const completePurchase = (event: React.FormEvent) => {
    // Creates a mock order, clears the cart, and sends the user to success.
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !postcode.trim() ||
      !cardNumber.trim()
    ) {
      setError("Please complete all customer, delivery, and payment fields.");
      return;
    }

    const purchase: Purchase = {
      id: `GH-${Date.now()}`,
      customerName: `${firstName} ${lastName}`,
      email,
      phone,
      address: `${address}, ${postcode}`,
      total,
      createdAt: new Date().toISOString(),
      items,
    };

    window.localStorage.setItem(
      purchasesKey,
      JSON.stringify([purchase, ...readPurchases()]),
    );
    window.localStorage.removeItem(cartKey);
    window.dispatchEvent(new Event("gamehub-cart-updated"));
    router.push(`/checkout/success?order=${purchase.id}`);
  };

  return (
    <div>
      <section className="rounded-2xl bg-blue-700 px-6 py-8 text-white shadow-xl shadow-blue-950/20">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-100">
          Secure mock checkout
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Cart and Checkout
        </h1>
        <p className="mt-3 max-w-2xl text-blue-50">
          Review your selected games, enter customer details, and complete a
          simulated payment in one page.
        </p>
        <a
          href="/"
          className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-50"
        >
          Back to Shopping
        </a>
      </section>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-gray-950/80">
          <p className="text-xl font-bold text-gray-950 dark:text-white">
            Your cart is empty.
          </p>
          <a
            href="/"
            className="mt-5 inline-flex rounded-lg bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800"
          >
            Browse Games
          </a>
        </div>
      ) : (
        <form onSubmit={completePurchase} className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-950/80">
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                Shopping Cart
              </h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-4 rounded-xl border border-gray-200 p-4 dark:border-white/10 sm:grid-cols-[130px_1fr_auto]"
                  >
                    <GameImage
                      src={item.imageUrl}
                      alt={item.title}
                      title={item.title}
                      className="aspect-video w-full rounded-lg object-cover sm:w-32"
                    />
                    <div>
                      <h3 className="font-bold text-gray-950 dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {item.category} / {item.platform}
                      </p>
                      <p className="mt-2 font-bold text-gray-950 dark:text-white">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Qty
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(item.id, Number(event.target.value))
                          }
                          className="ml-2 w-16 rounded-lg border border-gray-300 px-2 py-1 dark:border-white/10 dark:bg-gray-900"
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
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-950/80">
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                Customer and Delivery Details
              </h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field label="First name" value={firstName} onChange={setFirstName} />
                <Field label="Last name" value={lastName} onChange={setLastName} />
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <Field label="Phone number" value={phone} onChange={setPhone} />
                <Field
                  label="Mock card number"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={setCardNumber}
                />
                <div className="md:col-span-2">
                  <label htmlFor="address" className="font-semibold text-gray-900 dark:text-white">
                    Delivery address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <Field label="Postcode" value={postcode} onChange={setPostcode} />
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-950/80">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
              Order Summary
            </h2>
            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.title} x {item.quantity}
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between border-t border-gray-200 pt-5 text-xl font-black dark:border-white/10">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {error && (
              <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-red-700 px-4 py-3 font-bold text-white hover:bg-red-800"
            >
              Pay {formatPrice(total)}
            </button>
          </aside>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  // Small shared field component keeps checkout form markup consistent.
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={id} className="font-semibold text-gray-900 dark:text-white">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
      />
    </div>
  );
}
