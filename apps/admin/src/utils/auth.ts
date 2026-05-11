import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin"

import { cookies } from "next/headers";
export async function isLoggedIn() {
  const userCookies = await cookies();

  

  // ASSIGNMENT 3
  // check that auth_token cookie exists and is valid
  const token = userCookies.get("auth_token")?.value;
  // Missing token means the user is definitely not logged in, so we can fail fast.
  if (!token) {
    return false;
  }

  try {
    // Invalid or expired JWTs throw here, so catching keeps the app from crashing on bad cookies.
    return Boolean(jwt.verify(token, env.JWT_SECRET || ""));
  } catch {
    return false;
  }
}
