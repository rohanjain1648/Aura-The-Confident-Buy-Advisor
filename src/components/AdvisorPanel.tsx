'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  toolsUsed?: string[];
  tryOnImageUrl?: string;
  fallback?: boolean;
}

const TOOL_LABELS: Record<string, string> = {
  get_skin_passport: 'Skin Passport',
  list_products: 'Catalog',
  get_verdict: 'Verdict engine',
  virtual_try_on: 'YouCam try-on',
};

export default function AdvisorPanel({
  productId,
  suggestions,
}: {
  productId?: string;
  suggestions: string[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { role: 'user', content: message }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, productId, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'The advisor could not answer.');
      setMessages((m) => [...m, {
        role: 'assistant',
        content: data.reply,
        toolsUsed: data.toolsUsed,
        tryOnImageUrl: data.tryOnImageUrl,
        fallback: data.fallback,
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <section aria-label="Aura Advisor" className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold">Ask Aura</h2>
      <p className="text-sm text-gray-600 mb-3">Answers come from your Skin Passport and live verdict scores.</p>

      {messages.length > 0 && (
        <ul className="space-y-3 mb-3" aria-live="polite">
          {messages.map((m, i) => (
            <li key={i} className={m.role === 'user' ? 'text-right' : ''}>
              <p className={`inline-block rounded-lg px-3 py-2 text-left whitespace-pre-wrap ${
                m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
              }`}>
                {m.content}
              </p>
              {m.tryOnImageUrl && (
                <img src={m.tryOnImageUrl} alt="Your virtual try-on" className="mt-2 w-full max-w-sm rounded-lg" />
              )}
              {m.fallback && (
                <p className="mt-1 text-xs text-gray-500">AI advisor unavailable. This is a basic answer from your verdict scores.</p>
              )}
              {!!m.toolsUsed?.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Checked: {m.toolsUsed.map((t) => TOOL_LABELS[t] ?? t).join(', ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="text-sm text-gray-600 mb-3">Checking your passport and scores...</p>}
      {error && <p role="alert" className="text-sm text-red-600 mb-3">{error}</p>}

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={loading}
              className="rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          placeholder="Ask about fit, colour, or what to buy"
          aria-label="Ask Aura"
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2"
        />
        <Button type="submit" disabled={loading || !input.trim()}>Ask</Button>
      </form>
    </section>
  );
}
