import type { StoreProduct } from "@/lib/storeProducts";

export const currentCustomerKey = "gamehub-current-customer";

export type CartItem = StoreProduct & {
  quantity: number;
};

export function setCurrentCartCustomer(customerId: number) {
  // Remember which account owns the active cart in this browser.
  window.localStorage.setItem(currentCustomerKey, String(customerId));
}

export function getCartKey() {
  const customerId = window.localStorage.getItem(currentCustomerKey);
  // Account-scoped keys keep carts separate between different logged-in customers.
  return customerId ? `gamehub-cart:${customerId}` : "gamehub-cart";
}

export function readCart(): CartItem[] {
  try {
    return JSON.parse(window.localStorage.getItem(getCartKey()) || "[]") as CartItem[];
  } catch {
    // Corrupt localStorage should not break checkout; fall back to an empty cart.
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  window.localStorage.setItem(getCartKey(), JSON.stringify(items));
  // The top nav listens for this event to update the cart badge immediately.
  window.dispatchEvent(new Event("gamehub-cart-updated"));
}

export function clearCart() {
  window.localStorage.removeItem(getCartKey());
  window.dispatchEvent(new Event("gamehub-cart-updated"));
}
