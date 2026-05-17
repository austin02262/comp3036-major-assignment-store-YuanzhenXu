import { expect, test } from "./fixtures";

test.describe("CUSTOMER HOME SCREEN", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test("shows the GameHub storefront and game catalogue", { tag: "@a1" }, async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Your Digital Game Store" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Video Games/ })).toBeVisible();
    await expect(page.locator("article")).toHaveCount(9);
    await expect(page.getByText("God of War Ragnarok")).toBeVisible();
    await expect(page.getByText("Cyberpunk 2077")).toBeVisible();
  });

  test("sorts games by price", { tag: "@a1" }, async ({ page }) => {
    await page.getByLabel("Sort by").selectOption("price-desc");
    await expect(page.locator("article").first()).toContainText("Marvel's Spider-Man 2");

    await page.getByLabel("Sort by").selectOption("price-asc");
    await expect(page.locator("article").first()).toContainText("Halo Infinite");
  });
});
