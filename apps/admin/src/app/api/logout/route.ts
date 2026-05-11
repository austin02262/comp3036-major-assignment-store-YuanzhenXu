// apps/admin/src/app/api/logout/route.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export async function GET() {
  // Access cookie store on the server
  const cookieStore = await cookies();
  
  // Remove the authentication cookie
  // next time user need to login first
  cookieStore.delete('auth_token');
  
  // Redirect to home page - will show login screen since cookie is gone
  redirect('/');
}