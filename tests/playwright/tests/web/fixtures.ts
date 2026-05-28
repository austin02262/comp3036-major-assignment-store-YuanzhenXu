import {
  test as base,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

export * from "@playwright/test";
export async function registerCustomer(
  request: APIRequestContext,
  overrides: Partial<{ username: string; email: string; password: string }> = {},
) {
  // Timestamped customers avoid unique email/username collisions across test retries.
  const timestamp = Date.now();

  return request.post("/api/register", {
    data: {
      username: `customer${timestamp}`,
      email: `customer-${timestamp}@gamehub.test`,
      password: "password123",
      ...overrides,
    },
  });
}

export async function loginCustomer(
  page: Page,
  customer: { email: string; password: string },
) {
  // UI login is used when tests need the browser to receive the HttpOnly cookie.
  await page.goto("/login");
  await page.getByLabel("Email").fill(customer.email);
  await page.getByLabel("Password").fill(customer.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("/");
}

export async function createAndLoginCustomer(page: Page, request: APIRequestContext) {
  // Helper for tests that need a ready-to-use customer session.
  const customer = createTestCustomer();

  await registerCustomer(request, customer);
  await loginCustomer(page, customer);
  return customer;
}

export function createTestCustomer() {
  // Keeps generated users deterministic enough to debug but unique enough for CI.
  const timestamp = Date.now();

  return {
    username: `customer${timestamp}`,
    email: `customer-${timestamp}@gamehub.test`,
    password: "password123",
  };
}

export const test = base.extend<{
  customer: ReturnType<typeof createTestCustomer>;
  page: Page;
}>({
  customer: async ({}, use) => {
    await use(createTestCustomer());
  },
  page: async ({ page, request, customer }, use) => {
    await registerCustomer(request, customer);
    await loginCustomer(page, customer);
    await use(page);
  },
});
