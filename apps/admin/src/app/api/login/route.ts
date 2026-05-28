import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { env } from "@repo/env/admin";
import { verifyPassword } from "@repo/utils/password";

function isValidAdminPassword(password: FormDataEntryValue | null) {
  if (typeof password !== "string") return false;

  if (env.PASSWORD_HASH) {
    return verifyPassword(password, env.PASSWORD_HASH);
  }

  return password === env.PASSWORD;
}

export async function POST(request: Request) {
  // Admin login keeps the original password flow but stores access in a secure cookie.
  const formData = await request.formData();
  const password = formData.get("password");

  if (!isValidAdminPassword(password)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // HttpOnly prevents client-side JavaScript from reading the admin token.
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });

  return NextResponse.redirect(new URL("/", request.url));
}
