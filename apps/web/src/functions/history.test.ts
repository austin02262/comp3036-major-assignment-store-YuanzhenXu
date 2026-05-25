import { expect, test } from "vitest";
import { history } from "./history";

test("returns empty array if no release years are provided", async () => {
  expect(history([])).toEqual([]);
});

test("returns sorted counts by release year", async () => {
  expect(
    history([
      { releaseYear: 2022, active: true },
      { releaseYear: 2022, active: true },
      { releaseYear: 2020, active: true },
      { releaseYear: 2024, active: true },
      { releaseYear: 2012, active: false },
    ]),
  ).toEqual([
    { year: 2024, count: 1 },
    { year: 2022, count: 2 },
    { year: 2020, count: 1 },
  ]);
});
