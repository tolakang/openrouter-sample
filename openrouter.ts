import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(process.cwd(), '.env');
export const DEFAULT_MODEL = 'gpt-4o-mini';

export function loadEnv(): Record<string, string> {
  if (!fs.existsSync(ENV_PATH)) {
    return Object.fromEntries(
      Object.entries(process.env).filter(([, value]) => value !== undefined)
    ) as Record<string, string>;
  }

  return Object.fromEntries(
    fs.readFileSync(ENV_PATH, 'utf8')
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.split('=', 2).map((part) => part.trim()))
  ) as Record<string, string>;
}

export function getApiKey(env: Record<string, string> = loadEnv()): string {
  const key = env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error('Missing OPENROUTER_API_KEY. Set it in .env or the environment.');
  }
  return key;
}

export function getModel(env: Record<string, string> = loadEnv()): string {
  return env.OPENROUTER_MODEL || DEFAULT_MODEL;
}

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterPayload {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens: number;
}

export function createChatPayload(message: string, model: string = getModel()): OpenRouterPayload {
  return {
    model,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message }
    ],
    max_tokens: 200
  };
}

export const OPENROUTER_ENDPOINT = 'https://api.openrouter.ai/v1/chat/completions';
