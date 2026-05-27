import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const iterations = 100_000;
const keyLength = 32;
const digest = "sha256";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString(
    "hex",
  );

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) return false;

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
