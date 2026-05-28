import type { StoreProduct } from "@/lib/storeProducts";

export const currentCustomerKey = "gamehub-current-customer";

export type CartItem = StoreProduct & {
  quantity: number;
};

export function setCurrentCartCustomer(customerId: number) {
  window.localStorage.setItem(currentCustomerKey, String(customerId));
}

export function getCartKey() {
  const customerId = window.localStorage.getItem(currentCustomerKey);
  return customerId ? `gamehub-cart:${customerId}` : "gamehub-cart";
}

export function readCart(): CartItem[] {
  try {
    return JSON.parse(window.localStorage.getItem(getCartKey()) || "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  window.localStorage.setItem(getCartKey(), JSON.stringify(items));
  window.dispatchEvent(new Event("gamehub-cart-updated"));
}

export function clearCart() {
  window.localStorage.removeItem(getCartKey());
  window.dispatchEvent(new Event("gamehub-cart-updated"));
}
