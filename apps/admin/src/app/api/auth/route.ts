import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@repo/env/admin";
import { verifyPassword } from "@repo/utils/password";

function isJsonRequest(request: Request) {
  // One route supports the login form and programmatic requests by checking the content type.
  const contentType = request.headers.get("content-type") || "";
  return contentType.includes("application/json");
}

async function readPassword(request: Request) {
  if (isJsonRequest(request)) { //if JSON ,then get the keyword from "body"
    const body = (await request.json()) as { password?: string };
    return body.password;
  }

  const formData = await request.formData(); //if form , then get the keyword from "formData"
  const password = formData.get("password");

  return typeof password === "string" ? password : undefined;
}

function isValidAdminPassword(password?: string) {
  if (!password) return false;

  if (env.PASSWORD_HASH) {
    return verifyPassword(password, env.PASSWORD_HASH);
  }

  return password === env.PASSWORD;
}

export async function POST(request: Request) {
  const password = await readPassword(request); // read the password

  if (!isValidAdminPassword(password)) { // check the website
    if (!isJsonRequest(request)) {
      return NextResponse.redirect(new URL("/", request.url)); // return the user to the login page
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 }); // show error message
  }

  // Store login state in a signed JWT cookie so server components can verify admin access later.
  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
    expiresIn: "15m",  // for security reason , set the cookie for 15 mins
  });

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  if (!isJsonRequest(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  // Logging out is handled by deleting the auth cookie from the browser.
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  return NextResponse.json({ ok: true });
}
