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
    await expect(page.getByText("Halo Infinite x 1")).toBeVisible();

    await page.getByRole("button", { name: "Buy Again" }).click();
    await expect(page.getByText("Previous purchase added to cart.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cart (1)" })).toBeVisible();
  });
});
