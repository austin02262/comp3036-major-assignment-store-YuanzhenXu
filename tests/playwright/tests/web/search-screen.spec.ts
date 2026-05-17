import { expect, test } from "./fixtures";

test.describe("CUSTOMER SEARCH", () => {
  test("searches games by title", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Search games").fill("halo");

    await expect(page).toHaveURL(/\/search\?q=halo/);
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.getByText("Halo Infinite")).toBeVisible();
    await expect(page.getByText("God of War Ragnarok")).not.toBeVisible();
  });

  test("searches games by release year", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/search?q=2026");

    await expect(page.locator("article")).toHaveCount(2);
    await expect(page.getByText("Forza Horizon 6")).toBeVisible();
    await expect(page.getByText("Yakuza Kiwami 3 & Dark Ties")).toBeVisible();
  });

  test("shows an empty state for no results", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/search?q=not-a-game");

    await expect(page.locator("article")).toHaveCount(0);
    await expect(page.getByText("0 Games")).toBeVisible();
  });
});
