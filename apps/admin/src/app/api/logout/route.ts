import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  // Logging out clears the admin session cookie and returns to the login screen.
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  redirect("/");
}
