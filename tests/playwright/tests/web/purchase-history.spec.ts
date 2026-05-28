import { expect, registerCustomer, test, type APIRequestContext } from "./fixtures";

async function createApiCustomerSession(request: APIRequestContext) {
  const timestamp = Date.now();
  const customer = {
    username: `api${timestamp}`,
    email: `api-${timestamp}@gamehub.test`,
    password: "password123",
  };

  await registerCustomer(request, customer);
  const loginResponse = await request.post("/api/login", {
    data: { email: customer.email, password: customer.password },
  });
  expect(loginResponse.ok(), await loginResponse.text()).toBeTruthy();

  return customer;
}

test.describe("CUSTOMER PURCHASE HISTORY", () => {
  test("shows purchases and lets the customer buy again", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page
      .locator("article")
      .filter({ hasText: "Halo Infinite" })
      .getByRole("button", { name: "Add to Cart" })
      .click();

    await page.getByRole("button", { name: "Cart (1)" }).click();
    await page.getByRole("link", { name: "CHECKOUT NOW" }).click();
    await page.getByLabel("First name").fill("Yuanzhen");
    await page.getByLabel("Last name").fill("Xu");
    await page.getByLabel("Email").fill("yuanzhen@example.com");
    await page.getByLabel("Phone number").fill("0400000000");
    await page.getByLabel("Mock card number").fill("4242424242424242");
    await page.getByLabel("Address line 1").fill("1 GameHub Street");
    await page.getByLabel("Address line 2").fill("Apartment 2");
    await page.getByLabel("City").fill("Sydney");
    await page.getByLabel("State").fill("NSW");
    await page.getByLabel("Postcode").fill("2000");
    await page.getByRole("button", { name: /Pay/ }).click();
    await expect(page).toHaveURL(/\/checkout\/success\?order=GH-/);
    const orderId = new URL(page.url()).searchParams.get("order");
    expect(orderId).toBeTruthy();

    await page.goto("/purchases");
    await expect(page.getByRole("heading", { name: "Purchase History" })).toBeVisible();
    await expect(page.getByText(orderId!)).toBeVisible();
    await expect(page.getByText("Phone: 0400000000")).toBeVisible();
    await expect(
      page.getByText("Address: 1 GameHub Street, Apartment 2, Sydney, NSW, 2000"),
    ).toBeVisible();
    await expect(page.getByText("Halo Infinite x 1")).toBeVisible();

    await page.getByRole("button", { name: "Buy Again" }).click();
    await expect(page.getByText("Previous purchase added to cart.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cart (1)" })).toBeVisible();

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Purchase record deleted.")).toBeVisible();
    await expect(page.getByText(orderId!)).toBeHidden();
  });

  test("rejects incomplete checkout requests", { tag: "@a3" }, async ({ request }) => {
    await createApiCustomerSession(request);

    const response = await request.post("/api/purchases", {
      data: {
        firstName: "Api",
        lastName: "Customer",
        email: "missing-address@gamehub.test",
        items: [{ productId: 102, quantity: 1 }],
      },
    });

    expect(response.status()).toBe(400);
  });

  test("stores checkout purchases for the logged-in customer and exposes them to admin history", { tag: "@a3" }, async ({ request }) => {
    const customer = await createApiCustomerSession(request);

    const purchaseResponse = await request.post("/api/purchases", {
      data: {
        firstName: "Api",
        lastName: "Customer",
        email: "checkout-form-email@gamehub.test",
        phone: "0400000000",
        address: "1 Backend Test Street",
        postcode: "2000",
        items: [{ productId: 102, quantity: 2 }],
      },
    });

    expect(purchaseResponse.status(), await purchaseResponse.text()).toBe(201);
    const purchase = await purchaseResponse.json();
    expect(purchase.id).toMatch(/^GH-/);
    expect(purchase.user.email).toBe(customer.email);
    expect(purchase.items).toHaveLength(1);
    expect(purchase.total).toBeGreaterThan(0);

    const customerHistoryResponse = await request.get("/api/purchases");
    expect(customerHistoryResponse.ok(), await customerHistoryResponse.text()).toBeTruthy();
    const customerPurchases = await customerHistoryResponse.json();
    expect(
      customerPurchases.some((entry: { id: string; user?: { email?: string } }) => (
        entry.id === purchase.id && entry.user?.email === customer.email
      )),
    ).toBeTruthy();

    const loginResponse = await request.post("http://localhost:3002/api/auth", {
      data: { password: "123" },
    });
    expect(loginResponse.ok(), await loginResponse.text()).toBeTruthy();

    const adminHistoryResponse = await request.get("http://localhost:3002/api/purchases");
    expect(adminHistoryResponse.ok(), await adminHistoryResponse.text()).toBeTruthy();
    const adminPurchases = await adminHistoryResponse.json();
    expect(
      adminPurchases.some((entry: { id: string; user?: { email?: string } }) => (
        entry.id === purchase.id && entry.user?.email === customer.email
      )),
    ).toBeTruthy();
  });

  test("does not expose another customer purchase history", { tag: "@a3" }, async ({ request }) => {
    const firstCustomer = await createApiCustomerSession(request);
    const purchaseResponse = await request.post("/api/purchases", {
      data: {
        firstName: "First",
        lastName: "Customer",
        email: firstCustomer.email,
        phone: "0400000000",
        address: "1 Private Order Street",
        postcode: "2000",
        items: [{ productId: 102, quantity: 1 }],
      },
    });
    expect(purchaseResponse.status(), await purchaseResponse.text()).toBe(201);
    const purchase = await purchaseResponse.json();

    await createApiCustomerSession(request);
    const secondHistoryResponse = await request.get("/api/purchases");
    expect(secondHistoryResponse.ok(), await secondHistoryResponse.text()).toBeTruthy();
    const secondPurchases = await secondHistoryResponse.json();
    expect(
      secondPurchases.some((entry: { id: string }) => entry.id === purchase.id),
    ).toBeFalsy();
  });
});
