# OpenRouter Sample Integration

[![CI](https://github.com/tolakang/openrouter-sample/actions/workflows/ci.yml/badge.svg)](https://github.com/tolakang/openrouter-sample/actions/workflows/ci.yml)

This workspace contains a minimal Node.js example for calling the OpenRouter API.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `OPENROUTER_API_KEY` in `.env`.
3. Run with Node 18+:

```bash
npm install
npm start
```

Or run the axios example:

```bash
npm run start:axios
```

Or run the CLI prompt version:

```bash
npm run start:cli "Tell me a short developer welcome message"
```

Or interactively:

```bash
npm run start:cli
```

## Local OpenRouter HTTP API

You can run a local API server that accepts POST requests at `/chat`.

```bash
npm run serve:openrouter
```

Or the TypeScript version:

```bash
npm run serve:openrouter:ts
```

Then send a request like:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from the local OpenRouter API"}'
```

The server also exposes a health endpoint:

```bash
curl http://localhost:3000/health
```

## TypeScript support

You can also run the TypeScript versions directly with `ts-node`:

```bash
npm run start:ts
npm run start:axios:ts
npm run start:cli:ts "Write a short OpenRouter welcome message"
```

To type-check the TypeScript files:

```bash
npm run build:ts
```

## What it does

- Reads `OPENROUTER_API_KEY` from `.env` or the environment.
- Sends a chat completion request to `https://api.openrouter.ai/v1/chat/completions`.
- Prints the JSON response.

## Notes

- `openrouter-client.js` uses built-in `fetch` available in Node 18 and later.
- `openrouter-axios.js` uses `axios` and is configured in `package.json`.
- If you need a different model, set `OPENROUTER_MODEL` in `.env` or the environment, or update `DEFAULT_MODEL` in `openrouter.js`.

## Reusable helper

The shared helper in `openrouter.js` provides:

- `loadEnv()` for `.env` fallback loading
- `getApiKey()` for API key validation
- `createChatPayload(message)` to build request payloads
- `OPENROUTER_ENDPOINT` for the OpenRouter API URL
