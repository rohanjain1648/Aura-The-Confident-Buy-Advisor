import { describe, it, expect, vi, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { runAdvisor } from '@/server/advisor/agent';
import { POST } from '@/app/api/advisor/route';
import { analyzeSkinAndSave } from '@/server/orchestrators/skin';
import { getOrCreateSession } from '@/server/repos/session';
import { prisma } from '@/lib/db';
import type { LlmRequest, LlmResponse, LlmToolCall } from '@/server/llm/types';

const answer = (content: string): LlmResponse => ({
  provider: 'groq', model: 'test', content, toolCalls: [], finishReason: 'stop',
});
const callTool = (name: string, args: Record<string, unknown> = {}): LlmResponse => ({
  provider: 'groq', model: 'test', content: null, finishReason: 'tool_calls',
  toolCalls: [{ id: `call-${name}`, name, arguments: args } satisfies LlmToolCall],
});

/** Plays back model turns in order and records each request it received. */
function scripted(...turns: LlmResponse[]) {
  const requests: LlmRequest[] = [];
  let i = 0;
  const chatFn = vi.fn(async (req: LlmRequest) => {
    requests.push(structuredClone(req));
    return turns[Math.min(i++, turns.length - 1)];
  });
  return { chatFn, requests };
}

const toolResults = (req: LlmRequest) =>
  req.messages.filter((m) => m.role === 'tool').map((m) => JSON.parse(m.content ?? '{}'));

let sessionId: string;
let apparelId: string;
let beautyId: string;

beforeAll(async () => {
  process.env.YOUCAM_MODE = 'fixture';
  sessionId = `test-advisor-${Date.now()}`;
  await getOrCreateSession(sessionId);
  await analyzeSkinAndSave(sessionId, Buffer.from('fake-image'));
  apparelId = (await prisma.product.findFirstOrThrow({ where: { category: 'apparel' } })).id;
  beautyId = (await prisma.product.findFirstOrThrow({ where: { category: 'beauty' } })).id;
});

describe('runAdvisor tool loop', () => {
  it('feeds the real passport back to the model before it answers', async () => {
    const { chatFn, requests } = scripted(callTool('get_skin_passport'), answer('You have a warm undertone.'));
    const r = await runAdvisor({ sessionId, message: 'What is my undertone?' }, { chatFn });

    expect(r.reply).toBe('You have a warm undertone.');
    expect(r.toolsUsed).toEqual(['get_skin_passport']);
    expect(r.fallback).toBe(false);
    expect(r.provider).toBe('groq');
    expect(toolResults(requests[1])[0]).toMatchObject({ undertone: 'warm', topConcern: 'redness' });
  });

  it('returns computed verdict scores for a product', async () => {
    const { chatFn, requests } = scripted(callTool('get_verdict', { product_id: apparelId }), answer('ok'));
    await runAdvisor({ sessionId, message: 'Why this verdict?' }, { chatFn });

    const verdict = toolResults(requests[1])[0];
    expect(verdict.tier).toMatch(/buy|maybe|skip/);
    expect(typeof verdict.score).toBe('number');
    expect(verdict.reasons.length).toBeGreaterThan(0);
  });

  it('lists the catalog ranked by verdict score, filtered by category', async () => {
    const { chatFn, requests } = scripted(callTool('list_products', { category: 'beauty' }), answer('ok'));
    await runAdvisor({ sessionId, message: 'Beauty picks?' }, { chatFn });

    const { products } = toolResults(requests[1])[0];
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p: { category: string }) => p.category === 'beauty')).toBe(true);
    const scores = products.map((p: { score: number }) => p.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('strips markdown the chat panel cannot render', async () => {
    const { chatFn } = scripted(answer('Start with **Clarity Serum** today.'));
    const r = await runAdvisor({ sessionId, message: 'x' }, { chatFn });
    expect(r.reply).toBe('Start with Clarity Serum today.');
  });

  it('tells the model about the product being viewed', async () => {
    const { chatFn, requests } = scripted(answer('ok'));
    await runAdvisor({ sessionId, message: 'Is this good?', productId: apparelId }, { chatFn });
    expect(requests[0].messages[0].content).toContain(apparelId);
  });

  it('keeps prior conversation turns in order', async () => {
    const { chatFn, requests } = scripted(answer('ok'));
    await runAdvisor({
      sessionId,
      message: 'And this one?',
      history: [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello' }],
    }, { chatFn });
    expect(requests[0].messages.slice(1).map((m) => m.content)).toEqual(['Hi', 'Hello', 'And this one?']);
  });
});

describe('runAdvisor try-on tool', () => {
  it('surfaces the try-on image to the UI rather than relying on the model', async () => {
    const { chatFn, requests } = scripted(callTool('virtual_try_on', { product_id: apparelId }), answer('Here it is.'));
    const r = await runAdvisor({ sessionId, message: 'Try this on me' }, { chatFn });

    expect(r.tryOnImageUrl).toBeTruthy();
    expect(toolResults(requests[1])[0].status).toBe('ready');
  });

  it('runs at most one try-on per message, since each one spends API units', async () => {
    const { chatFn, requests } = scripted(
      callTool('virtual_try_on', { product_id: apparelId }),
      callTool('virtual_try_on', { product_id: apparelId }),
      answer('done'),
    );
    await runAdvisor({ sessionId, message: 'Try this on me' }, { chatFn });
    expect(toolResults(requests[2])[1].error).toMatch(/one try-on/i);
  });

  it('refuses try-on for beauty products', async () => {
    const { chatFn, requests } = scripted(callTool('virtual_try_on', { product_id: beautyId }), answer('ok'));
    const r = await runAdvisor({ sessionId, message: 'Try this' }, { chatFn });
    expect(toolResults(requests[1])[0].error).toMatch(/apparel/i);
    expect(r.tryOnImageUrl).toBeUndefined();
  });
});

describe('runAdvisor resilience', () => {
  it('reports tool problems to the model so it can recover', async () => {
    const { chatFn, requests } = scripted(callTool('get_verdict', { product_id: 'nope' }), answer('ok'));
    await runAdvisor({ sessionId, message: 'x' }, { chatFn });
    expect(toolResults(requests[1])[0].error).toMatch(/not found/i);
  });

  it('rejects tools that do not exist', async () => {
    const { chatFn, requests } = scripted(callTool('delete_everything'), answer('ok'));
    await runAdvisor({ sessionId, message: 'x' }, { chatFn });
    expect(toolResults(requests[1])[0].error).toMatch(/unknown tool/i);
  });

  it('tells a shopper with no passport to take a selfie', async () => {
    const empty = `test-advisor-empty-${Date.now()}`;
    const { chatFn, requests } = scripted(callTool('get_skin_passport'), answer('Take a selfie first.'));
    await runAdvisor({ sessionId: empty, message: 'What suits me?' }, { chatFn });
    expect(toolResults(requests[1])[0].error).toMatch(/selfie/i);
  });

  it('answers from real verdict data when the LLM is unavailable, and says so', async () => {
    const chatFn = vi.fn(async () => { throw new Error('All LLM providers failed'); });
    const r = await runAdvisor({ sessionId, message: 'Why?', productId: apparelId }, { chatFn });
    expect(r.fallback).toBe(true);
    expect(r.reply).toMatch(/undertone/i);
  });

  it('gives top picks in the fallback when no product is in view', async () => {
    const chatFn = vi.fn(async () => { throw new Error('down'); });
    const r = await runAdvisor({ sessionId, message: 'What should I buy?' }, { chatFn });
    expect(r.fallback).toBe(true);
    const names = await prisma.product.findMany({ select: { name: true } });
    expect(names.some((n) => r.reply.includes(n.name))).toBe(true);
  });

  it('points to the selfie step in the fallback when there is no passport', async () => {
    const chatFn = vi.fn(async () => { throw new Error('down'); });
    const r = await runAdvisor({ sessionId: `test-advisor-none-${Date.now()}`, message: 'Hi' }, { chatFn });
    expect(r.reply).toMatch(/selfie/i);
  });

  it('stops a model that never stops calling tools', async () => {
    const chatFn = vi.fn(async () => callTool('get_skin_passport'));
    const r = await runAdvisor({ sessionId, message: 'loop' }, { chatFn });
    expect(chatFn.mock.calls.length).toBeLessThanOrEqual(6);
    expect(r.fallback).toBe(true);
    expect(r.reply.length).toBeGreaterThan(0);
  });
});

describe('POST /api/advisor', () => {
  const post = (body: unknown) =>
    POST(new NextRequest('http://localhost/api/advisor', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { cookie: `aura-session-id=${sessionId}` },
    }));

  it('rejects an empty message', async () => {
    expect((await post({ message: '   ' })).status).toBe(400);
  });

  it('rejects an oversized message', async () => {
    expect((await post({ message: 'x'.repeat(1001) })).status).toBe(400);
  });
});
