type Mode = 'live' | 'fixture';
export type LlmProviderName = 'groq' | 'openai';
export interface ServerEnv {
  YOUCAM_MODE: Mode;
  YOUCAM_API_KEY?: string;
  YOUCAM_BASE_URL: string;
  DATABASE_URL: string;
  /** Preferred LLM provider; the other one is used as fallback when its key is set. */
  LLM_PROVIDER: LlmProviderName;
  GROQ_API_KEY?: string;
  GROQ_MODEL: string;
  GROQ_BASE_URL: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL: string;
  OPENAI_BASE_URL: string;
}
export function getServerEnv(): ServerEnv {
  const mode = (process.env.YOUCAM_MODE ?? 'fixture') as Mode;
  const llmProvider = (process.env.LLM_PROVIDER ?? 'groq') as LlmProviderName;
  if (llmProvider !== 'groq' && llmProvider !== 'openai') {
    throw new Error(`LLM_PROVIDER must be 'groq' or 'openai', got '${llmProvider}'`);
  }
  const env: ServerEnv = {
    YOUCAM_MODE: mode,
    YOUCAM_API_KEY: process.env.YOUCAM_API_KEY || undefined,
    YOUCAM_BASE_URL: process.env.YOUCAM_BASE_URL ?? 'https://yce-api-01.perfectcorp.com',
    DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db',
    LLM_PROVIDER: llmProvider,
    GROQ_API_KEY: process.env.GROQ_API_KEY || undefined,
    GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    GROQ_BASE_URL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || undefined,
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  };
  if (mode === 'live' && !env.YOUCAM_API_KEY) {
    throw new Error('YOUCAM_API_KEY is required when YOUCAM_MODE=live');
  }
  return env;
}
