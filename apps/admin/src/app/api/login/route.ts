import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { env } from "@repo/env/admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password");

  if (password !== env.PASSWORD) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });

  return NextResponse.redirect(new URL("/", request.url));
}
