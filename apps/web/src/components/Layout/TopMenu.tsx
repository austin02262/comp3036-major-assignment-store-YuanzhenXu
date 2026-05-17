"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartPreview } from "@/components/Store/CartPreview";
import ThemeSwitch from "@/components/Themes/ThemeSwitcher";

const cartKey = "gamehub-cart";

function getCartCount() {
  // Calculates total quantity, not just unique products.
  if (typeof window === "undefined") return 0;

  try {
    const items = JSON.parse(window.localStorage.getItem(cartKey) || "[]") as {
      quantity?: number;
    }[];
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  } catch {
    return 0;
  }
}

export function TopMenu({ query = "" }: { query?: string }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Updates the cart badge after add/remove actions in other components.
    const updateCount = () => setCartCount(getCartCount());

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("gamehub-cart-updated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("gamehub-cart-updated", updateCount);
    };
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Routes search text into the existing search page.
    const search = event.target.value;
    router.push(`/search?q=${search}`);
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-blue-900 bg-blue-700 text-white shadow-sm dark:border-blue-950 dark:bg-blue-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm text-blue-700 shadow-lg shadow-blue-950/20">
            GH
          </span>
          <span>GameHub</span>
        </a>

        <form
          action="#"
          method="GET"
          className="min-w-56 flex-1 max-w-lg"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="store-search" className="sr-only">
            Search games
          </label>
          <div className="relative">
            <input
              id="store-search"
              type="text"
              name="search"
              placeholder="Search games"
              defaultValue={query}
              onChange={handleSearch}
              className="w-full rounded-lg border border-blue-500 bg-white/95 px-4 py-2.5 pr-10 text-gray-900 shadow-sm outline-none transition focus:border-white focus:ring-4 focus:ring-white/20"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <a
            href="/purchases"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Purchases
          </a>
          <CartPreview cartCount={cartCount} />
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
