import { expect, registerCustomer, test } from "./fixtures";

test.describe("CUSTOMER AUTH API", () => {
  test("rejects invalid and duplicate customer registrations", { tag: "@a3" }, async ({ request }) => {
    // API-level checks prove validation works even without the React form.
    const timestamp = Date.now();
    const username = `apiuser${timestamp}`;
    const email = `api-user-${timestamp}@gamehub.test`;

    const created = await registerCustomer(request, { username, email });
    expect(created.status(), await created.text()).toBe(201);

    const duplicateUsername = await registerCustomer(request, {
      username,
      email: `api-user-other-${timestamp}@gamehub.test`,
    });
    expect(duplicateUsername.status()).toBe(409);
    await expect(await duplicateUsername.json()).toMatchObject({
      error: "This username is already taken.",
    });

    const duplicateEmail = await registerCustomer(request, {
      username: `apiuserother${timestamp}`,
      email,
    });
    expect(duplicateEmail.status()).toBe(409);
    await expect(await duplicateEmail.json()).toMatchObject({
      error: "An account already exists for this email.",
    });

    const invalidUsername = await registerCustomer(request, {
      username: "bad@username",
      email: `bad-user-${timestamp}@gamehub.test`,
    });
    expect(invalidUsername.status()).toBe(400);
    await expect(await invalidUsername.json()).toMatchObject({
      error: "Username cannot contain @.",
    });
  });

  test("rejects purchase history requests before customer login", { tag: "@a3" }, async ({ request }) => {
    // Purchase history is account data, so anonymous API calls must be rejected.
    const response = await request.get("/api/purchases");

    expect(response.status()).toBe(401);
  });
});
