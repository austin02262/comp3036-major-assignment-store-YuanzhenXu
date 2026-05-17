import { expect, test } from "./fixtures";

test.describe("CUSTOMER GENRE FILTER", () => {
  test("filters games by genre", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/category/action");

    await expect(page.locator("article")).toHaveCount(3);
    await expect(page.getByText("God of War Ragnarok")).toBeVisible();
    await expect(page.getByText("NINJA GAIDEN 2 Black")).toBeVisible();
    await expect(page.getByText("Marvel's Spider-Man 2")).toBeVisible();
    await expect(page.getByText("Halo Infinite")).not.toBeVisible();
  });
});
