import { expect, test } from "@playwright/test";

test.describe("CUSTOMER AUTHENTICATION", () => {
  test("redirects unauthenticated customers to login", { tag: "@a1" }, async ({ page }) => {
    // Storefront pages are protected, so anonymous visitors land on the login form.
    await page.goto("/");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  test("registers a customer and then logs in", { tag: "@a1" }, async ({ page }) => {
    // Unique credentials keep this flow repeatable across local and CI databases.
    const timestamp = Date.now();
    const username = `austin${timestamp}`;
    const email = `austin-${timestamp}@gamehub.test`;

    await page.goto("/register");
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page).toHaveURL("/login");

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText(`Hi, ${username}`)).toBeVisible();
  });

  test("shows a clear message when the account is not registered", { tag: "@a1" }, async ({ page }) => {
    // Users get a helpful message instead of a generic authentication failure.
    await page.goto("/login");
    await page.getByLabel("Email").fill(`missing-${Date.now()}@gamehub.test`);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("This account has not been registered.")).toBeVisible();
  });

  test("rejects duplicate usernames, duplicate emails, and usernames containing at signs", { tag: "@a1" }, async ({ page }) => {
    // One test covers the three registration rules that protect account identity.
    const timestamp = Date.now();
    const username = `duplicate${timestamp}`;
    const email = `duplicate-${timestamp}@gamehub.test`;

    await page.goto("/register");
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page).toHaveURL("/login");

    await page.goto("/register");
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Email").fill(`duplicate-other-${timestamp}@gamehub.test`);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText("This username is already taken.")).toBeVisible();

    await page.goto("/register");
    await page.getByLabel("Username").fill(`other${timestamp}`);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText("An account already exists for this email.")).toBeVisible();

    await page.goto("/register");
    await page.getByLabel("Username").fill("bad@username");
    await page.getByLabel("Email").fill(`bad-${timestamp}@gamehub.test`);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText("Username cannot contain @.")).toBeVisible();
  });
});
