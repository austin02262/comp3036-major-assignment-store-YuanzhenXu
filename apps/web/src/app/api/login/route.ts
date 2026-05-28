import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { setCustomerSession, verifyPassword } from "@/utils/userAuth";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginPayload;
  const email = payload.email?.trim().toLowerCase() || "";
  const password = payload.password || "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await client.db.user.findUnique({ where: { email } });

  if (!user?.passwordHash) {
    return NextResponse.json(
      { error: "This account has not been registered." },
      { status: 404 },
    );
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  await setCustomerSession(user.id);

  return NextResponse.json({
    id: user.id,
    username: user.username || user.firstName,
    email: user.email,
  });
}
