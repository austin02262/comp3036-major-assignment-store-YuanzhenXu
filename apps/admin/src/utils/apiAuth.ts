import { NextResponse } from "next/server";

import { isLoggedIn } from "./auth";

export async function requireAdmin() {
  // Shared API guard keeps admin-only routes consistent.
  if (await isLoggedIn()) {
    return undefined;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
