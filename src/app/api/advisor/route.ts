import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { runAdvisor, type AdvisorTurn } from '@/server/advisor/agent';
import { describeYouCamError } from '@/server/youcam/client';

const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_TURNS = 8;

function cleanHistory(raw: unknown): AdvisorTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is AdvisorTurn =>
      (t?.role === 'user' || t?.role === 'assistant') && typeof t?.content === 'string')
    .slice(-MAX_HISTORY_TURNS)
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_MESSAGE_CHARS) }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { message?: unknown; productId?: unknown; history?: unknown };
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message || message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json(
        { error: `Message must be between 1 and ${MAX_MESSAGE_CHARS} characters.` },
        { status: 400 },
      );
    }

    const result = await runAdvisor({
      sessionId: await getSessionId(request),
      message,
      productId: typeof body.productId === 'string' ? body.productId : undefined,
      history: cleanHistory(body.history),
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: describeYouCamError(err) }, { status: 500 });
  }
}
