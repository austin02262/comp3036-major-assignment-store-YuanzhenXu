import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { client } from "@repo/db/client";
import { verifyPassword } from "@repo/utils/password";

const cookieName = "customer_session";

// Re-export shared password helpers so auth routes import from one local module.
export { hashPassword, verifyPassword } from "@repo/utils/password";

function getJwtSecret() {
  // Local fallback keeps development easy; production uses Vercel's JWT_SECRET.
  return process.env.JWT_SECRET || "local-customer-secret";
}

export async function setCustomerSession(userId: number) {
  const cookieStore = await cookies();
  const token = jwt.sign({ userId, role: "customer" }, getJwtSecret(), {
    expiresIn: "7d",
  });

  // HttpOnly prevents scripts from reading the customer session token.
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return undefined;
  }

  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, getJwtSecret());
  } catch {
    // Expired or tampered JWTs simply behave as logged-out sessions.
    return undefined;
  }

  const userId =
    typeof payload === "object" && typeof payload.userId === "number"
      ? payload.userId
      : undefined;

  if (!userId) return undefined;

  // Returning a limited user shape avoids leaking password hashes to callers.
  return client.db.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, firstName: true, email: true },
  });
}

export async function requireCustomer() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    // Protected storefront pages send unauthenticated users to login.
    redirect("/login");
  }

  return customer;
}
