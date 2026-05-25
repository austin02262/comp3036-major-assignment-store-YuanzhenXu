import { expect, test } from "./fixtures";

test.describe("CUSTOMER PURCHASE HISTORY", () => {
  test("shows purchases and lets the customer buy again", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.clear();
      window.localStorage.setItem(
        "gamehub-purchases",
        JSON.stringify([
          {
            id: "GH-E2E",
            customerName: "Yuanzhen Xu",
            email: "yuanzhen@example.com",
            phone: "0400000000",
            address: "1 GameHub Street, Apartment 2, Sydney, NSW, 2000",
            total: 59.95,
            createdAt: new Date().toISOString(),
            items: [
              {
                id: 102,
                urlId: "halo-infinite",
                title: "Halo Infinite",
                description: "Test item",
                content: "Test item",
                imageUrl: "/games/halo_header.jpg",
                category: "FPS",
                platform: "Xbox",
                platforms: ["Xbox"],
                price: 59.95,
                stock: 18,
                releaseDate: "8 December 2021",
                releaseYear: 2021,
                quantity: 1,
              },
            ],
          },
        ]),
      );
    });

    await page.goto("/purchases");
    await expect(page.getByRole("heading", { name: "Purchase History" })).toBeVisible();
    await expect(page.getByText("GH-E2E")).toBeVisible();
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
    await expect(page.getByText("GH-E2E")).toBeHidden();
  });

  test("rejects incomplete checkout requests", { tag: "@a3" }, async ({ request }) => {
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

  test("stores checkout purchases and exposes them to admin history", { tag: "@a3" }, async ({ request }) => {
    const email = `api-customer-${Date.now()}@gamehub.test`;

    const purchaseResponse = await request.post("/api/purchases", {
      data: {
        firstName: "Api",
        lastName: "Customer",
        email,
        phone: "0400000000",
        address: "1 Backend Test Street",
        postcode: "2000",
        items: [{ productId: 102, quantity: 2 }],
      },
    });

    expect(purchaseResponse.status(), await purchaseResponse.text()).toBe(201);
    const purchase = await purchaseResponse.json();
    expect(purchase.id).toMatch(/^GH-/);
    expect(purchase.user.email).toBe(email);
    expect(purchase.items).toHaveLength(1);
    expect(purchase.total).toBeGreaterThan(0);

    const customerHistoryResponse = await request.get("/api/purchases");
    expect(customerHistoryResponse.ok(), await customerHistoryResponse.text()).toBeTruthy();
    const customerPurchases = await customerHistoryResponse.json();
    expect(
      customerPurchases.some((entry: { id: string; user?: { email?: string } }) => (
        entry.id === purchase.id && entry.user?.email === email
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
        entry.id === purchase.id && entry.user?.email === email
      )),
    ).toBeTruthy();
  });
});
