import { expect, test, type Page } from "./fixtures";

async function login(page: Page) {
  await page.goto("/");
  await page.getByLabel("Password", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();
}

function productCards(page: Page) {
  return page.locator('section[aria-label="Product management"] article');
}

test.describe("ADMIN PRODUCT DASHBOARD", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test("shows product dashboard and products", { tag: "@a2" }, async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Product Admin Dashboard" })).toBeVisible();
    await expect(page.getByText("Total products")).toBeVisible();
    await expect(productCards(page)).toHaveCount(9);
    await expect(page.getByText("God of War Ragnarok")).toBeVisible();
  });

  test("filters products by search, platform, genre, and status", { tag: "@a2" }, async ({ page }) => {
    await page.getByLabel("Search products").fill("Halo");
    await expect(productCards(page)).toHaveCount(1);
    await expect(page.getByText("Halo Infinite")).toBeVisible();

    await page.getByLabel("Search products").clear();
    await page.getByLabel("Platform").selectOption("Xbox");
    await expect(productCards(page)).toHaveCount(5);

    await page.getByLabel("Platform").selectOption("all");
    await page.getByLabel("Genre").selectOption("RPG");
    await expect(productCards(page)).toHaveCount(2);

    await page.getByLabel("Genre").selectOption("all");
    await productCards(page).filter({ hasText: "God of War Ragnarok" }).getByRole("button", { name: "Available" }).click();
    await page.getByLabel("Product status").selectOption("inactive");
    await expect(productCards(page)).toHaveCount(1);
    await expect(productCards(page).filter({ hasText: "God of War Ragnarok" })).toBeVisible();
  });

  test("sorts products by price and release year", { tag: "@a2" }, async ({ page }) => {
    await page.getByLabel("Sort by").selectOption("price-desc");
    await expect(productCards(page).first()).toContainText("Marvel's Spider-Man 2");

    await page.getByLabel("Sort by").selectOption("year-desc");
    await expect(productCards(page).first()).toContainText(/Yakuza Kiwami 3|Forza Horizon 6/);
  });
});
