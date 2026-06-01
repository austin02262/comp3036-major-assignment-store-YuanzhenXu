import { expect, test, type APIRequestContext, type Page } from "./fixtures";

async function login(page: Page) {
  await page.goto("/");
  await page.getByLabel("Password", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();
}

function productCards(page: Page) {
  return page.locator('section[aria-label="Product management"] article');
}

async function createStorefrontPurchase(request: APIRequestContext) {
  // Seed a real customer order through the storefront before checking the admin view.
  const timestamp = Date.now();
  const customer = {
    username: `adminorder${timestamp}`,
    email: `admin-order-${timestamp}@gamehub.test`,
    password: "password123",
  };

  const registerResponse = await request.post("http://localhost:3001/api/register", {
    data: customer,
  });
  expect(registerResponse.status(), await registerResponse.text()).toBe(201);

  const loginResponse = await request.post("http://localhost:3001/api/login", {
    data: { email: customer.email, password: customer.password },
  });
  expect(loginResponse.ok(), await loginResponse.text()).toBeTruthy();

  const purchaseResponse = await request.post("http://localhost:3001/api/purchases", {
    data: {
      firstName: "Dashboard",
      lastName: "Customer",
      email: customer.email,
      phone: "0400000000",
      address: "1 Admin UI Test Street",
      postcode: "2000",
      items: [{ productId: 102, quantity: 2 }],
    },
  });
  expect(purchaseResponse.status(), await purchaseResponse.text()).toBe(201);

  return {
    customer,
    purchase: (await purchaseResponse.json()) as { id: string },
  };
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
    await expect(productCards(page).getByRole("heading", { name: "Halo Infinite" })).toBeVisible();

    await page.getByLabel("Search products").clear();
    await page.getByLabel("Platform").selectOption("Xbox");
    await expect(productCards(page)).toHaveCount(5);

    await page.getByLabel("Platform").selectOption("all");
    await page.getByLabel("Genre").selectOption("RPG");
    await expect(productCards(page)).toHaveCount(2);

    await page.getByLabel("Genre").selectOption("all");
    const godOfWarCard = productCards(page).filter({ hasText: "God of War Ragnarok" });
    const statusButton = godOfWarCard.getByRole("button", { name: /Available|Out of Stock/ });
    if ((await statusButton.textContent()) === "Available") {
      await statusButton.click();
    }
    await page.getByLabel("Product status").selectOption("inactive");
    await expect(godOfWarCard).toBeVisible();
  });

  test("sorts products by price and release year", { tag: "@a2" }, async ({ page }) => {
    await page.getByLabel("Sort by").selectOption("price-desc");
    await expect(productCards(page).first()).toContainText("Marvel's Spider-Man 2");

    await page.getByLabel("Sort by").selectOption("year-desc");
    await expect(productCards(page).first()).toContainText("2026");
  });

  test("shows customer purchase records in the admin dashboard", { tag: "@a2" }, async ({ page, request }) => {
    // Create a real storefront order, then confirm the admin-facing UI renders it.
    const { customer, purchase } = await createStorefrontPurchase(request);

    await page.reload();
    const orderCard = page
      .locator('section[aria-label="Recent purchases"] article')
      .filter({ hasText: purchase.id });

    await expect(orderCard).toBeVisible();
    await expect(orderCard).toContainText(customer.email);
    await expect(orderCard).toContainText("Halo Infinite x 2");
  });
});
