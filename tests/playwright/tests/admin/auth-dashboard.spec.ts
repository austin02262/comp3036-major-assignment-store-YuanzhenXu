import { expect, test, type Page } from "./fixtures";

async function login(page: Page) {
  await page.goto("/");
  await page.getByLabel("Password", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();
}

test.describe("ADMIN AUTH AND DASHBOARD", () => {
  test("shows login screen", { tag: "@a2" }, async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("GameHub Admin")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sign in to manage products" })).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  });

  test("logs in and logs out", { tag: "@a2" }, async ({ page }) => {
    await login(page);

    await expect(page.getByRole("heading", { name: "Product Admin Dashboard" })).toBeVisible();
    await expect(page.getByText("Logout")).toBeVisible();

    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === "auth_token")).toBeDefined();

    await page.getByText("Logout").click();
    await expect(page.getByRole("heading", { name: "Sign in to manage products" })).toBeVisible();
  });
});
