import { expect, test } from "./fixtures";

test.describe("CUSTOMER PLATFORM FILTER", () => {
  test("filters games by platform", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/tags/xbox");

    await expect(page.locator("article")).toHaveCount(5);
    await expect(page.getByText("Halo Infinite")).toBeVisible();
    await expect(page.getByText("Forza Horizon 6")).toBeVisible();
    await expect(page.getByText("Mario Kart 8 Deluxe")).not.toBeVisible();
  });
});
