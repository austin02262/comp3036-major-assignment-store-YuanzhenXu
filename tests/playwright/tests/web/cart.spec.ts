import {
  createTestCustomer,
  expect,
  loginCustomer,
  registerCustomer,
  test,
} from "./fixtures";

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

  test("keeps the account cart after logout and login", { tag: "@a1" }, async ({ page, customer }) => {
    const haloCard = page.locator("article").filter({ hasText: "Halo Infinite" });

    await haloCard.getByRole("button", { name: "Add to Cart" }).click();
    await haloCard.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByRole("button", { name: "Cart (2)" })).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/login");

    await loginCustomer(page, customer);
    await expect(page.getByRole("button", { name: "Cart (2)" })).toBeVisible();

    await page.getByRole("button", { name: "Cart (2)" }).click();
    await expect(page.getByRole("heading", { name: "Halo Infinite" })).toBeVisible();
    await expect(page.getByLabel("Qty")).toHaveValue("2");
  });

  test("keeps carts separate between customer accounts", { tag: "@a1" }, async ({ page, request, customer }) => {
    await page
      .locator("article")
      .filter({ hasText: "Halo Infinite" })
      .getByRole("button", { name: "Add to Cart" })
      .click();
    await expect(page.getByRole("button", { name: "Cart (1)" })).toBeVisible();

    const secondCustomer = createTestCustomer();
    await registerCustomer(request, secondCustomer);
    await page.getByRole("button", { name: "Logout" }).click();
    await loginCustomer(page, secondCustomer);

    await expect(page.getByRole("button", { name: "Cart (0)" })).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
    await loginCustomer(page, customer);
    await expect(page.getByRole("button", { name: "Cart (1)" })).toBeVisible();
  });
});
