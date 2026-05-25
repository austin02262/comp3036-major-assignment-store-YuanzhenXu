import { expect, test } from "vitest";
import { tags } from "./tags";

test("returns empty array if no products are provided", async () => {
  expect(tags([])).toEqual([]);
});

test("returns platform counts", async () => {
  expect(
    tags([
      { platforms: ["Xbox", "PlayStation"], active: true },
      { platforms: ["Xbox", "Nintendo Switch"], active: true },
      { platforms: ["Nintendo Switch"], active: true },
      { platforms: ["PlayStation"], active: false },
    ]),
  ).toEqual([
    { name: "Xbox", count: 2 },
    { name: "PlayStation", count: 1 },
    { name: "Nintendo Switch", count: 2 },
  ]);
});
