import fs from 'fs';
import path from 'path';
const ENV_PATH = path.resolve(process.cwd(), '.env');
export const DEFAULT_MODEL = 'gpt-4o-mini';
export function loadEnv() {
    if (!fs.existsSync(ENV_PATH)) {
        return Object.fromEntries(Object.entries(process.env).filter(([, value]) => value !== undefined));
    }
    return Object.fromEntries(fs.readFileSync(ENV_PATH, 'utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => line.split('=', 2).map((part) => part.trim())));
}
export function getApiKey(env = loadEnv()) {
    const key = env.OPENROUTER_API_KEY;
    if (!key) {
        throw new Error('Missing OPENROUTER_API_KEY. Set it in .env or the environment.');
    }
    return key;
}
export function getModel(env = loadEnv()) {
    return env.OPENROUTER_MODEL || DEFAULT_MODEL;
}
export function createChatPayload(message, model = getModel()) {
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
