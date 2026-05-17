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

test.describe("CUSTOMER CHECKOUT", () => {
  test("completes a mock payment", { tag: "@a1" }, async ({ page }) => {
    await addHaloToCart(page);

    await page.getByRole("button", { name: "Cart (1)" }).click();
    await page.getByRole("link", { name: "CHECKOUT NOW" }).click();

    await expect(page.getByRole("heading", { name: "Cart and Checkout" })).toBeVisible();
    await page.getByLabel("First name").fill("Yuanzhen");
    await page.getByLabel("Last name").fill("Xu");
    await page.getByLabel("Email").fill("yuanzhen@example.com");
    await page.getByLabel("Phone number").fill("0400000000");
    await page.getByLabel("Mock card number").fill("4242 4242 4242 4242");
    await page.getByLabel("Delivery address").fill("1 GameHub Street");
    await page.getByLabel("Postcode").fill("2000");
    await page.getByRole("button", { name: /Pay/ }).click();

    await expect(page).toHaveURL(/\/checkout\/success\?order=GH-/);
    await expect(page.getByText("Purchase complete")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Thanks for your order" })).toBeVisible();
  });
});
