import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { analyzeSkinAndSave } from '@/server/orchestrators/skin';
import { describeYouCamError, YouCamError } from '@/server/youcam/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const person = formData.get('person') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const sessionId = await getSessionId(request);
    const imageBytes = Buffer.from(await file.arrayBuffer());
    const personBytes = person ? Buffer.from(await person.arrayBuffer()) : undefined;

    // Stream progress via SSE
    const encoder = new TextEncoder();
    const send = (controller: ReadableStreamDefaultController, payload: object) =>
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

    const stream = new ReadableStream({
      async start(controller) {
        try {
          send(controller, { status: 'uploading' });

          const result = await analyzeSkinAndSave(sessionId, imageBytes, {
            personBytes,
            contentType: file.type || undefined,
          });

          send(controller, { ...result, status: 'complete' });
        } catch (err) {
          send(controller, {
            status: 'error',
            message: describeYouCamError(err),
            code: err instanceof YouCamError ? err.code : undefined,
          });
        } finally {
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
