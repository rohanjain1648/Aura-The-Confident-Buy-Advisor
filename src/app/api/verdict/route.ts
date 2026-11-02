import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { computeVerdictAndVto } from '@/server/orchestrators/verdict';
import { describeYouCamError } from '@/server/youcam/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { productId: string };
    const sessionId = await getSessionId(request);

    const result = await computeVerdictAndVto(sessionId, body.productId);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: describeYouCamError(err) }, { status: 500 });
  }
}
