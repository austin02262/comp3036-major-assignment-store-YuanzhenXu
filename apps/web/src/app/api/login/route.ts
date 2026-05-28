import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { setCustomerSession, verifyPassword } from "@/utils/userAuth";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginPayload;
  // Customer logins use email only; usernames stay display-facing.
  const email = payload.email?.trim().toLowerCase() || "";
  const password = payload.password || "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await client.db.user.findUnique({ where: { email } });

  // Seeded checkout users may exist without passwords, so they cannot login until registered.
  if (!user?.passwordHash) {
    return NextResponse.json(
      { error: "This account has not been registered." },
      { status: 404 },
    );
  }

  // Password comparison is delegated to the shared hashing utility.
  if (!verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  // The browser receives only an HttpOnly session cookie, not the password hash.
  await setCustomerSession(user.id);

  return NextResponse.json({
    id: user.id,
    username: user.username || user.firstName,
    email: user.email,
  });
}
