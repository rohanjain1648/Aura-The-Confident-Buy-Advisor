import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { saveLook } from '@/server/repos/look';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { productId: string; vtoImageUrl: string };
    const sessionId = await getSessionId(request);

    const result = await saveLook(sessionId, body.productId, body.vtoImageUrl);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
