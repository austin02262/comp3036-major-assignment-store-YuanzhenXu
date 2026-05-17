import { expect, test } from "./fixtures";

test.describe("CUSTOMER RELEASE YEAR FILTER", () => {
  test("filters games by release year", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/history/2026");

    await expect(page.locator("article")).toHaveCount(2);
    await expect(page.getByText("Forza Horizon 6")).toBeVisible();
    await expect(page.getByText("Yakuza Kiwami 3 & Dark Ties")).toBeVisible();
  });
});
