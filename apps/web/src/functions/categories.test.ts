import { expect, test } from "vitest";
import { categories } from "./categories";

test("returns empty array of categories if no products are provided", async () => {
  expect(categories([])).toEqual([]);
});

test("returns categories with count", async () => {
  expect(
    categories([
      { category: "B", active: true },
      { category: "A", active: true },
      { category: "D", active: true },
      {
        category: "D",
        active: false,
      },
      {
        category: "D",
        active: true,
      },
    ]),
  ).toEqual([
    { name: "A", count: 1 },
    { name: "B", count: 1 },
    { name: "D", count: 2 },
  ]);
});
