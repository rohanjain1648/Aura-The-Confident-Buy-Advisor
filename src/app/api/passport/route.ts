import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { getPassport } from '@/server/repos/passport';

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionId(request);
    const passport = await getPassport(sessionId);

    return NextResponse.json({ passport });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
