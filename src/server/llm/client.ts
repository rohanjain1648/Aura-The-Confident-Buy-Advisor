import { getServerEnv, type LlmProviderName, type ServerEnv } from '@/lib/env';
import type { LlmMessage, LlmRequest, LlmResponse, LlmToolCall } from './types';

type FetchFn = typeof fetch;

interface ProviderConfig {
  name: LlmProviderName;
  apiKey: string;
  model: string;
  baseUrl: string;
}

/** Providers that have a key configured, preferred one first. */
export function resolveProviders(env: ServerEnv = getServerEnv()): ProviderConfig[] {
  const all: Record<LlmProviderName, ProviderConfig | null> = {
    groq: env.GROQ_API_KEY
      ? { name: 'groq', apiKey: env.GROQ_API_KEY, model: env.GROQ_MODEL, baseUrl: env.GROQ_BASE_URL }
      : null,
    openai: env.OPENAI_API_KEY
      ? { name: 'openai', apiKey: env.OPENAI_API_KEY, model: env.OPENAI_MODEL, baseUrl: env.OPENAI_BASE_URL }
      : null,
  };
  const order: LlmProviderName[] = env.LLM_PROVIDER === 'groq' ? ['groq', 'openai'] : ['openai', 'groq'];
  return order.map((n) => all[n]).filter((p): p is ProviderConfig => p !== null);
}

function toWireMessage(m: LlmMessage) {
  if (m.role === 'tool') {
    return { role: 'tool', tool_call_id: m.toolCallId, content: m.content ?? '' };
  }
  if (m.role === 'assistant' && m.toolCalls?.length) {
    return {
      role: 'assistant',
      content: m.content,
      tool_calls: m.toolCalls.map((c) => ({
        id: c.id,
        type: 'function',
        function: { name: c.name, arguments: JSON.stringify(c.arguments) },
      })),
    };
  }
  return { role: m.role, content: m.content ?? '' };
}

function parseArgs(raw: unknown): Record<string, unknown> {
  if (typeof raw !== 'string' || raw === '') return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function callProvider(p: ProviderConfig, req: LlmRequest, fetchFn: FetchFn): Promise<LlmResponse> {
  const body: Record<string, unknown> = {
    model: p.model,
    messages: req.messages.map(toWireMessage),
    temperature: req.temperature ?? 0.3,
  };
  if (req.maxTokens) body.max_tokens = req.maxTokens;
  if (req.tools?.length) {
    body.tools = req.tools.map((t) => ({
      type: 'function',
      function: { name: t.name, description: t.description, parameters: t.parameters },
    }));
    body.tool_choice = 'auto';
  }

  const res = await fetchFn(`${p.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.apiKey}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // Never include the request (it carries the key) in the error.
    throw new Error(`${p.name} LLM request failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    choices?: Array<{
      finish_reason?: string | null;
      message?: {
        content?: string | null;
        tool_calls?: Array<{ id: string; function: { name: string; arguments?: string } }>;
      };
    }>;
  };
  const choice = json.choices?.[0];
  if (!choice?.message) throw new Error(`${p.name} LLM returned no choices`);
  const toolCalls: LlmToolCall[] = (choice.message.tool_calls ?? []).map((c) => ({
    id: c.id,
    name: c.function.name,
    arguments: parseArgs(c.function.arguments),
  }));
  return {
    provider: p.name,
    model: p.model,
    content: choice.message.content ?? null,
    toolCalls,
    finishReason: choice.finish_reason ?? null,
  };
}

/**
 * Chat completion against the preferred provider (LLM_PROVIDER), falling back
 * to the other configured provider on any failure. Server-only.
 */
export async function chat(
  req: LlmRequest,
  opts: { env?: ServerEnv; fetchFn?: FetchFn } = {},
): Promise<LlmResponse> {
  const providers = resolveProviders(opts.env);
  if (providers.length === 0) {
    throw new Error('No LLM provider configured: set GROQ_API_KEY and/or OPENAI_API_KEY');
  }
  const fetchFn = opts.fetchFn ?? fetch;
  const errors: string[] = [];
  for (const p of providers) {
    try {
      return await callProvider(p, req, fetchFn);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }
  throw new Error(`All LLM providers failed: ${errors.join(' | ')}`);
}
