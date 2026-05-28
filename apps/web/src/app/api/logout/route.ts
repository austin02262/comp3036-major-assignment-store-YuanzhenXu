import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/utils/userAuth";

export async function POST() {
  // Logging out is a server route because the session cookie is HttpOnly.
  await clearCustomerSession();
  return NextResponse.json({ ok: true });
}
