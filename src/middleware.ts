import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSession } from '@/server/repos/session';

export async function getSessionId(request: NextRequest | { cookies: { get: (name: string) => { value: string } | undefined } }): Promise<string> {
  // The middleware only sets the cookie, so the DB row may not exist yet.
  const id = request.cookies.get('aura-session-id')?.value
    ?? `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await getOrCreateSession(id);
  return id;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Extract or generate session ID
  const sessionId = request.cookies.get('aura-session-id')?.value || `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Attach to response cookies (httpOnly, secure in production, 30 days)
  response.cookies.set('aura-session-id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
