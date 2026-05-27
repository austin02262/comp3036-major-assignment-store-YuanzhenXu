import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { client } from "@repo/db/client";
import { hashPassword } from "@/utils/userAuth";

type RegisterPayload = {
  username?: string;
  email?: string;
  password?: string;
};

function clean(value?: string) {
  return value?.trim() || "";
}

function usernameTaken() {
  return NextResponse.json(
    { error: "This username is already taken." },
    { status: 409 },
  );
}

function uniqueConflict(error: unknown, field: string) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;

  const target = error.meta?.target;
  return (
    error.code === "P2002" &&
    (Array.isArray(target)
      ? target.includes(field)
      : String(target || "").includes(field))
  );
}

export async function POST(request: Request) {
  const payload = (await request.json()) as RegisterPayload;
  const username = clean(payload.username);
  const email = clean(payload.email).toLowerCase();
  const password = payload.password || "";

  if (!username || !email || password.length < 6) {
    return NextResponse.json(
      { error: "Username, email, and a 6 character password are required." },
      { status: 400 },
    );
  }

  if (username.includes("@")) {
    return NextResponse.json(
      { error: "Username cannot contain @." },
      { status: 400 },
    );
  }

  const existingEmail = await client.db.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json(
      { error: "An account already exists for this email." },
      { status: 409 },
    );
  }

  const existingUsername = await client.db.user.findFirst({
    where: { OR: [{ username }, { firstName: username }] },
  });
  if (existingUsername) return usernameTaken();

  try {
    const user = await client.db.user.create({
      data: {
        username,
        email,
        passwordHash: hashPassword(password),
        firstName: username,
        lastName: "",
        phone: "",
        address: "",
        postcode: "",
      },
      select: { id: true, username: true, email: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (uniqueConflict(error, "username")) return usernameTaken();

    if (uniqueConflict(error, "email")) {
      return NextResponse.json(
        { error: "An account already exists for this email." },
        { status: 409 },
      );
    }

    throw error;
  }
}
