import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/utils/userAuth";

export async function POST() {
  await clearCustomerSession();
  return NextResponse.json({ ok: true });
}
