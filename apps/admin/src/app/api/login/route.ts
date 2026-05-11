import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { env } from '@repo/env/admin';


export async function POST(request: Request) {
  // Extract form data from the request
  const formData = await request.formData();
  const password = formData.get('password');
  
  // Keep this legacy route aligned with /api/auth so it does not create a weaker login path.
  if (password !== env.PASSWORD) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const token = jwt.sign({ role: 'admin' }, env.JWT_SECRET, {
    expiresIn: '15m',
  });
  
  // Password correct: set authentication cookie
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,                    // Cookie inaccessible to client-side JavaScript
    sameSite: 'lax',
    maxAge: 60 * 15,
    path: '/',                         // Available across the entire site
  });
  
  // Redirect to home page - will show admin dashboard
  return NextResponse.redirect(new URL('/', request.url));
}
