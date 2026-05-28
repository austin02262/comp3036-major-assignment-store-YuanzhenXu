import { test as base } from "@playwright/test";

export * from "@playwright/test";
// Admin tests currently only need the base Playwright fixtures.
export const test = base;
