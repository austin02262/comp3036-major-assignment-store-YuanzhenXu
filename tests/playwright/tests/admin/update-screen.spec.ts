import { expect, test } from "./fixtures";

test.describe("ADMIN UPDATE SCREEN", () => {
  test("rejects product updates before admin login", { tag: "@a3" }, async ({ request }) => {
    const response = await request.post("/api/products", {
      data: {
        title: "Unauthorized Game",
        description: "This should not be created.",
        imageUrl: "/games/forza_header.jpg",
        category: "Racing",
        platform: "Xbox",
        platforms: ["Xbox"],
        price: 49.95,
        stock: 5,
        releaseDate: "2026-08-20",
      },
    });

    expect(response.status()).toBe(401);
  });

  test("creates, updates, toggles, and hides a game through the product API", { tag: "@a3" }, async ({ request }) => {
    const loginResponse = await request.post("/api/auth", {
      data: { password: "123" },
    });
    expect(loginResponse.ok()).toBeTruthy();

    const uniqueTitle = `API Test Racer ${Date.now()}`;

    const createResponse = await request.post("/api/products", {
      data: {
        title: uniqueTitle,
        description: "A backend E2E product created through the API.",
        content: "API managed game content.",
        imageUrl: "/games/forza_header.jpg",
        galleryImages: ["/games/forza1.jpg", "/games/forza2.jpg"],
        category: "Racing",
        platform: "Xbox",
        platforms: ["Xbox"],
        price: 49.95,
        stock: 5,
        releaseDate: "2026-08-20",
        active: true,
      },
    });

    expect(createResponse.status(), await createResponse.text()).toBe(201);
    const createdProduct = await createResponse.json();
    expect(createdProduct.title).toBe(uniqueTitle);
    expect(createdProduct.category.name).toBe("Racing");

    const updateResponse = await request.put(`/api/products/${createdProduct.id}`, {
      data: {
        title: uniqueTitle,
        description: "Updated through backend E2E.",
        content: "Updated API content.",
        imageUrl: "/games/forza_header.jpg",
        galleryImages: ["/games/forza1.jpg"],
        category: "Racing",
        platform: "Xbox",
        platforms: ["Xbox"],
        price: 54.95,
        stock: 6,
        releaseDate: "2026-08-21",
        active: true,
      },
    });

    expect(updateResponse.ok(), await updateResponse.text()).toBeTruthy();
    const updatedProduct = await updateResponse.json();
    expect(updatedProduct.description).toBe("Updated through backend E2E.");
    expect(updatedProduct.price).toBe(54.95);

    const toggleResponse = await request.patch(`/api/products/${createdProduct.id}`);
    expect(toggleResponse.ok(), await toggleResponse.text()).toBeTruthy();
    const toggledProduct = await toggleResponse.json();
    expect(toggledProduct.active).toBe(false);

    const deleteResponse = await request.delete(`/api/products/${createdProduct.id}`);
    expect(deleteResponse.ok(), await deleteResponse.text()).toBeTruthy();
  });
});
