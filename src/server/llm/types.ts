export type LlmRole = 'system' | 'user' | 'assistant' | 'tool';

export interface LlmToolCall {
  id: string;
  name: string;
  /** Parsed JSON arguments; `{}` if the model emitted none or invalid JSON. */
  arguments: Record<string, unknown>;
}

export interface LlmMessage {
  role: LlmRole;
  content: string | null;
  /** Set on assistant messages that request tool calls. */
  toolCalls?: LlmToolCall[];
  /** Set on `tool` messages answering a tool call. */
  toolCallId?: string;
}

export interface LlmToolDef {
  name: string;
  description: string;
  /** JSON Schema for the tool's arguments. */
  parameters: Record<string, unknown>;
}

export interface LlmRequest {
  messages: LlmMessage[];
  tools?: LlmToolDef[];
  temperature?: number;
  maxTokens?: number;
}

export interface LlmResponse {
  provider: 'groq' | 'openai';
  model: string;
  content: string | null;
  toolCalls: LlmToolCall[];
  finishReason: string | null;
}
