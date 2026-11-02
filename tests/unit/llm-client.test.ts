import { describe, it, expect, vi } from 'vitest';
import { chat, resolveProviders } from '@/server/llm/client';
import type { ServerEnv } from '@/lib/env';

const baseEnv: ServerEnv = {
  YOUCAM_MODE: 'fixture',
  YOUCAM_BASE_URL: 'https://x',
  DATABASE_URL: 'file:./dev.db',
  LLM_PROVIDER: 'groq',
  GROQ_API_KEY: 'gsk_test',
  GROQ_MODEL: 'llama-3.3-70b-versatile',
  GROQ_BASE_URL: 'https://api.groq.com/openai/v1',
  OPENAI_API_KEY: 'sk_test',
  OPENAI_MODEL: 'gpt-4o-mini',
  OPENAI_BASE_URL: 'https://api.openai.com/v1',
};

const ok = (message: object) =>
  new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message }] }), { status: 200 });

describe('resolveProviders', () => {
  it('orders by LLM_PROVIDER and skips providers without keys', () => {
    expect(resolveProviders(baseEnv).map((p) => p.name)).toEqual(['groq', 'openai']);
    expect(resolveProviders({ ...baseEnv, LLM_PROVIDER: 'openai' }).map((p) => p.name)).toEqual(['openai', 'groq']);
    expect(resolveProviders({ ...baseEnv, OPENAI_API_KEY: undefined }).map((p) => p.name)).toEqual(['groq']);
  });
});

describe('chat', () => {
  it('calls the preferred provider with bearer auth', async () => {
    const fetchFn = vi.fn().mockResolvedValue(ok({ content: 'hi' }));
    const r = await chat({ messages: [{ role: 'user', content: 'yo' }] }, { env: baseEnv, fetchFn });
    expect(r).toMatchObject({ provider: 'groq', content: 'hi', toolCalls: [] });
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect(init.headers.Authorization).toBe('Bearer gsk_test');
  });

  it('falls back to the other provider when the first fails', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response('rate limited', { status: 429 }))
      .mockResolvedValueOnce(ok({ content: 'from openai' }));
    const r = await chat({ messages: [{ role: 'user', content: 'yo' }] }, { env: baseEnv, fetchFn });
    expect(r.provider).toBe('openai');
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('parses tool calls and serialises tools', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      ok({
        content: null,
        tool_calls: [{ id: 'c1', function: { name: 'get_passport', arguments: '{"a":1}' } }],
      }),
    );
    const r = await chat(
      {
        messages: [{ role: 'user', content: 'yo' }],
        tools: [{ name: 'get_passport', description: 'd', parameters: { type: 'object' } }],
      },
      { env: baseEnv, fetchFn },
    );
    expect(r.toolCalls).toEqual([{ id: 'c1', name: 'get_passport', arguments: { a: 1 } }]);
    const body = JSON.parse(fetchFn.mock.calls[0][1].body);
    expect(body.tools[0].function.name).toBe('get_passport');
  });

  it('throws when no provider is configured, and does not leak keys when all fail', async () => {
    await expect(
      chat({ messages: [] }, { env: { ...baseEnv, GROQ_API_KEY: undefined, OPENAI_API_KEY: undefined } }),
    ).rejects.toThrow(/No LLM provider configured/);
    const fetchFn = vi.fn().mockResolvedValue(new Response('boom', { status: 500 }));
    const err = await chat({ messages: [] }, { env: baseEnv, fetchFn }).then(
      () => new Error('unexpected success'),
      (e: Error) => e,
    );
    expect(err.message).toMatch(/All LLM providers failed/);
    expect(err.message).not.toMatch(/gsk_test|sk_test/);
  });
});
