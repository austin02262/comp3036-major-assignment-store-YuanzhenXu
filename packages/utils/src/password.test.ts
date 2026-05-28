import { expect, test } from "vitest";

import { hashPassword, verifyPassword } from "./password.js";

test("hashes passwords without storing the plain text", () => {
  // The stored value should be a salted hash, never the original password.
  const password = "secure-password-123";
  const hash = hashPassword(password);

  expect(hash).not.toBe(password);
  expect(hash).toContain(":");
  expect(hash.includes(password)).toBe(false);
});

test("verifies matching passwords and rejects incorrect passwords", () => {
  // Covers successful login, wrong passwords, missing hashes, and malformed hashes.
  const hash = hashPassword("correct-password");

  expect(verifyPassword("correct-password", hash)).toBe(true);
  expect(verifyPassword("wrong-password", hash)).toBe(false);
  expect(verifyPassword("correct-password", undefined)).toBe(false);
  expect(verifyPassword("correct-password", "bad-format")).toBe(false);
});
