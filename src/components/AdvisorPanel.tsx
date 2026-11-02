'use client';

import { useState, type FormEvent } from 'react';
import { Sparkles, Send, Bot, CheckCircle2, AlertCircle } from 'lucide-react';

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
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.reply,
          toolsUsed: data.toolsUsed,
          tryOnImageUrl: data.tryOnImageUrl,
          fallback: data.fallback,
        },
      ]);
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
    <section
      aria-label="Aura Advisor"
      className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-7 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-neutral-950 flex items-center gap-2">
              <span>Ask Aura</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-neutral-500 font-normal">
              Autonomous advisor grounded in your Skin Passport
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          LLM TOOL AGENT
        </span>
      </div>

      {/* Suggestion Chips */}
      {suggestions.length > 0 && messages.length === 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
            Suggested Queries:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => send(s)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-50 hover:bg-purple-50 text-neutral-700 hover:text-purple-700 border border-neutral-200 hover:border-purple-200 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Feed */}
      {messages.length > 0 && (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                  m.role === 'user'
                    ? 'bg-neutral-950 text-white rounded-tr-none'
                    : 'bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-tl-none font-normal'
                }`}
              >
                {m.content}
              </div>

              {m.tryOnImageUrl && (
                <div className="mt-2.5 rounded-2xl overflow-hidden border border-neutral-200 shadow-md max-w-sm">
                  <img src={m.tryOnImageUrl} alt="Your virtual try-on" className="w-full object-cover" />
                </div>
              )}

              {m.fallback && (
                <div className="mt-1 text-[11px] font-mono text-neutral-400">
                  AI advisor fallback mode active.
                </div>
              )}

              {!!m.toolsUsed?.length && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono text-neutral-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Checked: {m.toolsUsed.map((t) => TOOL_LABELS[t] ?? t).join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-700 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
          <span>Consulting Skin Passport and running YouCam tools...</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={onSubmit} className="flex gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about shades, undertones, or recommendation verdicts..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 disabled:opacity-40 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-xs"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </section>
  );
}
