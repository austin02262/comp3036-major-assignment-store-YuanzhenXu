import { expect, test, type Page } from "./fixtures";

async function addHaloToCart(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page
    .locator("article")
    .filter({ hasText: "Halo Infinite" })
    .getByRole("button", { name: "Add to Cart" })
    .click();
}

async function openCheckout(page: Page) {
  // Reuse the complete cart-to-checkout journey for success and validation cases.
  await addHaloToCart(page);
  await page.getByRole("button", { name: "Cart (1)" }).click();
  await page.getByRole("link", { name: "CHECKOUT NOW" }).click();
  await expect(page.getByRole("heading", { name: "Cart and Checkout" })).toBeVisible();
}

async function fillCheckoutDetails(page: Page, cardNumber: string) {
  await page.getByLabel("First name").fill("Yuanzhen");
  await page.getByLabel("Last name").fill("Xu");
  await page.getByLabel("Email").fill("yuanzhen@example.com");
  await page.getByLabel("Phone number").fill("0400000000");
  await page.getByLabel("Mock card number").fill(cardNumber);
  await page.getByLabel("Address line 1").fill("1 GameHub Street");
  await page.getByLabel("Address line 2").fill("Apartment 2");
  await page.getByLabel("City").fill("Sydney");
  await page.getByLabel("State").fill("NSW");
  await page.getByLabel("Postcode").fill("2000");
}

test.describe("CUSTOMER CHECKOUT", () => {
  test("completes a mock payment", { tag: "@a1" }, async ({ page }) => {
    await openCheckout(page);
    await fillCheckoutDetails(page, "4242424242424242");
    await page.getByRole("button", { name: /Pay/ }).click();

    await expect(page).toHaveURL(/\/checkout\/success\?order=GH-/);
    await expect(page.getByText("Purchase complete")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Thanks for your order" })).toBeVisible();
  });

  test("rejects an invalid mock card number", { tag: "@a1" }, async ({ page }) => {
    await openCheckout(page);
    await fillCheckoutDetails(page, "4242");
    await page.getByRole("button", { name: /Pay/ }).click();

    await expect(page.getByText("Please enter a valid 16-digit card number.")).toBeVisible();
    await expect(page).toHaveURL("/checkout");
  });
});
