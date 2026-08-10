import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { analyzeSkinAndSave } from '@/server/orchestrators/skin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const sessionId = await getSessionId(request);
    const imageBytes = Buffer.from(await file.arrayBuffer());

    // Stream progress via SSE
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(`data: ${JSON.stringify({ status: 'uploading' })}\n\n`);

          const result = await analyzeSkinAndSave(sessionId, imageBytes);

          controller.enqueue(`data: ${JSON.stringify({ ...result, status: 'complete' })}\n\n`);
          controller.close();
        } catch (err) {
          controller.enqueue(
            `data: ${JSON.stringify({ status: 'error', message: String(err) })}\n\n`
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
