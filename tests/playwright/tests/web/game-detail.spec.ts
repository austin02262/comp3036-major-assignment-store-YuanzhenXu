import { expect, test } from "./fixtures";

test.describe("CUSTOMER GAME DETAIL", () => {
  test("shows product detail and opens gameplay gallery", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/post/god-of-war-ragnarok");

    await expect(page.getByRole("heading", { name: "God of War Ragnarok" })).toBeVisible();
    await expect(page.getByText("About This Game")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Gameplay Gallery" })).toBeVisible();

    await page.getByRole("button", { name: /God of War Ragnarok gameplay image/ }).first().click();
    await expect(page.getByRole("dialog", { name: /God of War Ragnarok enlarged gameplay image/ })).toBeVisible();
    await page.getByLabel("Next gameplay image").click();
    await page.getByLabel("Previous gameplay image").click();
    await page.getByLabel("Close enlarged image").click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
