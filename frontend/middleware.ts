import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We use client-side authentication (localStorage) via Supabase-JS.
  // The server cannot see localStorage, so server-side redirects here will always fail.
  // We handle route protection directly inside the page components (e.g., profile/page.tsx).
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
  ],
};
