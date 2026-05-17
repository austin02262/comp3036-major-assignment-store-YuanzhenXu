import { expect, test, type Page } from "./fixtures";

async function login(page: Page) {
  await page.goto("/");
  await page.getByLabel("Password", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();
}

function productCards(page: Page) {
  return page.locator('section[aria-label="Product management"] article');
}

test.describe("ADMIN PRODUCT MANAGEMENT", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test("creates a new game in the frontend admin prototype", { tag: "@a2" }, async ({ page }) => {
    await page.getByRole("link", { name: "Add New Game" }).click();
    await expect(page).toHaveURL("/products/create");
    await expect(page.getByRole("heading", { name: "Add New Game" })).toBeVisible();

    await page.getByLabel("Game name").fill("Test Drive Galaxy");
    await page.getByLabel("Genre").selectOption("Racing");
    await page.getByLabel("Xbox").check();
    await page.getByLabel("Price").fill("69.95");
    await page.getByLabel("Release date").fill("2026-07-15");
    await page.getByLabel("Header image").fill("/games/forza_header.jpg");
    await page.getByLabel("Store description").fill("A test racing game for the admin E2E flow.");
    await page.getByRole("button", { name: "Create Game" }).click();

    await expect(page).toHaveURL("/?saved=1");
    await expect(page.getByText("Test Drive Galaxy")).toBeVisible();
  });

  test("edits an existing game", { tag: "@a2" }, async ({ page }) => {
    await page
      .locator('section[aria-label="Product management"] article')
      .filter({ hasText: "Halo Infinite" })
      .getByRole("link", { name: "Edit product" })
      .click();

    await expect(page).toHaveURL("/product/halo-infinite");
    await expect(page.getByRole("heading", { name: "Edit Game" })).toBeVisible();
    await expect(page.getByLabel("Price")).toHaveValue("59.95");

    await page.getByLabel("Price").fill("69.95");
    await page.getByLabel("Store description").fill("Updated Halo product description.");
    await page.getByRole("button", { name: "Save Game" }).click();

    await expect(page).toHaveURL("/?saved=1");
    await page.reload();
    const haloCard = productCards(page).filter({ hasText: "Halo Infinite" });
    await expect(haloCard).toContainText("$69.95");
    await expect(haloCard).toContainText("Updated Halo product description.");
  });

  test("changes product status to out of stock", { tag: "@a2" }, async ({ page }) => {
    const godCard = productCards(page).filter({ hasText: "God of War Ragnarok" });

    await godCard.getByRole("button", { name: "Available" }).click();
    await expect(page.getByText("God of War Ragnarok is now out of stock.")).toBeVisible();
    await expect(godCard.getByRole("button", { name: "Out of Stock" })).toBeVisible();
  });
});
