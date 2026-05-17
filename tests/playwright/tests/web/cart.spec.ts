import { expect, test } from "./fixtures";

test.describe("CUSTOMER CART", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test("adds a game to cart and updates the cart preview", { tag: "@a1" }, async ({ page }) => {
    const haloCard = page.locator("article").filter({ hasText: "Halo Infinite" });

    await haloCard.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByText("Item added to cart")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cart (1)" })).toBeVisible();

    await page.getByRole("button", { name: "Cart (1)" }).click();
    await expect(page.getByRole("dialog", { name: "Cart preview" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Halo Infinite" })).toBeVisible();
    await expect(page.getByLabel("Qty")).toHaveValue("1");

    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("Oh no!")).toBeVisible();
  });
});
