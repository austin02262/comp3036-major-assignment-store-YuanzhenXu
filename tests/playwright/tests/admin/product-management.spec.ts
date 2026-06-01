import { expect, test, type Page } from "./fixtures";

async function login(page: Page) {
  await page.goto("/");
  await page.getByLabel("Password", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();
}

function productCards(page: Page) {
  // Narrows queries to the dashboard product cards instead of unrelated page text.
  return page.locator('section[aria-label="Product management"] article');
}

async function waitForProductForm(page: Page) {
  // SSR can paint the form before React attaches input handlers in local dev mode.
  await expect(page.locator("form")).toHaveAttribute("data-hydrated", "true");
}

// Tiny in-memory PNG lets upload tests run without committing binary fixtures.
const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

test.describe("ADMIN PRODUCT MANAGEMENT", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test("creates a new game in the frontend admin prototype", { tag: "@a2" }, async ({ page }) => {
    // Unique titles avoid urlId collisions when CI retries against the same database.
    const title = `Test Drive Galaxy ${Date.now()}`;

    await page.getByRole("link", { name: "Add New Game" }).click();
    await expect(page).toHaveURL("/products/create");
    await expect(page.getByRole("heading", { name: "Add New Game" })).toBeVisible();
    await waitForProductForm(page);

    await page.getByLabel("Game name").fill(title);
    await page.getByLabel("Genre").selectOption("Racing");
    await page.getByLabel("Xbox").check();
    await page.getByLabel("Price").fill("69.95");
    await page.getByLabel("Release date").fill("2026-07-15");
    await page.getByLabel("Header image").fill("/games/forza_header.jpg");
    await page.getByLabel("Store description").fill("A test racing game for the admin E2E flow.");
    const [createResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/products") &&
          response.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Create Game" }).click(),
    ]);
    expect(createResponse.ok(), await createResponse.text()).toBeTruthy();

    await expect(page).toHaveURL("/?saved=1");
    await expect(page.getByText(title)).toBeVisible();
  });

  test("uploads gallery images and keeps them visible after saving", { tag: "@a2" }, async ({ page }) => {
    const title = `Gallery Upload Racer ${Date.now()}`;

    await page.getByRole("link", { name: "Add New Game" }).click();
    await expect(page.getByRole("heading", { name: "Add New Game" })).toBeVisible();
    await waitForProductForm(page);

    await page.getByLabel("Game name").fill(title);
    await page.getByLabel("Genre").selectOption("Racing");
    await page.getByLabel("Xbox").check();
    await page.getByLabel("Price").fill("49.95");
    await page.getByLabel("Release date").fill("2026-08-20");
    await page.getByLabel("Header image").fill("/games/forza_header.jpg");
    await page.getByLabel("Store description").fill("Gallery upload regression test.");

    await page.locator('input[type="file"]').nth(1).setInputFiles({
      name: "gallery-preview.png",
      mimeType: "image/png",
      buffer: tinyPng,
    });

    const galleryPreview = page.getByRole("img", { name: "Gallery preview 1" });
    await expect(galleryPreview).toBeVisible();
    // naturalWidth proves the preview image loaded, not just that an <img> tag exists.
    await expect(galleryPreview).toHaveJSProperty("naturalWidth", 1);

    const [createResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/products") &&
          response.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Create Game" }).click(),
    ]);
    expect(createResponse.ok(), await createResponse.text()).toBeTruthy();
    await expect(page).toHaveURL("/?saved=1");

    await productCards(page)
      .filter({ hasText: title })
      .getByRole("link", { name: "Edit product" })
      .click();

    await expect(page.getByRole("heading", { name: "Edit Game" })).toBeVisible();
    const savedGalleryPreview = page.getByRole("img", { name: "Gallery preview 1" });
    await expect(savedGalleryPreview).toBeVisible();
    await expect(savedGalleryPreview).toHaveJSProperty("naturalWidth", 1);
  });

  test("edits an existing game", { tag: "@a2" }, async ({ page }) => {
    await page
      .locator('section[aria-label="Product management"] article')
      .filter({ hasText: "Halo Infinite" })
      .getByRole("link", { name: "Edit product" })
      .click();

    await expect(page).toHaveURL("/product/halo-infinite");
    await expect(page.getByRole("heading", { name: "Edit Game" })).toBeVisible();
    await waitForProductForm(page);
    await expect(page.getByLabel("Price")).toHaveValue("59.95");

    await page.getByLabel("Price").fill("69.95");
    await expect(page.getByLabel("Price")).toHaveValue("69.95");
    await page.getByLabel("Store description").fill("Updated Halo product description.");
    const [updateResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/api/products/") &&
          response.request().method() === "PUT",
      ),
      page.getByRole("button", { name: "Save Game" }).click(),
    ]);
    expect(updateResponse.ok(), await updateResponse.text()).toBeTruthy();

    // Returning to the dashboard can trigger a local dev compilation after PUT succeeds.
    await expect(page).toHaveURL("/?saved=1", { timeout: 15_000 });
    await page.reload();
    const haloCard = productCards(page).filter({ hasText: "Halo Infinite" });
    await expect(haloCard).toContainText("Updated Halo product description.");
  });

  test("changes product status to out of stock", { tag: "@a2" }, async ({ page }) => {
    const godCard = productCards(page).filter({ hasText: "God of War Ragnarok" });

    await expect(godCard).toBeVisible();

    const availableButton = godCard.getByRole("button", { name: "Available" });
    if ((await availableButton.count()) > 0) {
      await availableButton.click();
      await expect(page.getByText("God of War Ragnarok is now out of stock.")).toBeVisible();
    }

    await expect(godCard.getByRole("button", { name: "Out of Stock" })).toBeVisible();
  });
});
