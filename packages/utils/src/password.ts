import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const iterations = 100_000;
const keyLength = 32;
const digest = "sha256";

function safeEqual(left: string, right: string) {
  // timingSafeEqual avoids leaking password information through comparison timing.
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function hashPassword(password: string) {
  // A new salt for every password means identical passwords do not share hashes.
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString(
    "hex",
  );

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) return false;

  // Stored hashes use "salt:hash" so verification can recompute the same PBKDF2 result.
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const candidate = pbkdf2Sync(
    password,
    salt,
    iterations,
    keyLength,
    digest,
  ).toString("hex");

  return safeEqual(candidate, hash);
}
