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
  await page.goto("/login");
  await page.getByLabel("Email").fill(customer.email);
  await page.getByLabel("Password").fill(customer.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("/");
}

export async function createAndLoginCustomer(page: Page, request: APIRequestContext) {
  const customer = createTestCustomer();

  await registerCustomer(request, customer);
  await loginCustomer(page, customer);
  return customer;
}

export function createTestCustomer() {
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
