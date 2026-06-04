import { createServer } from 'http';
import { getApiKey, createChatPayload, getModel, OPENROUTER_ENDPOINT, loadEnv } from './openrouter.js';

const env = loadEnv();
const OPENROUTER_API_KEY = getApiKey(env);
const PORT = Number(env.OPENROUTER_PORT || 3000);

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

async function handleChat(req, res) {
  try {
    const payload = await parseJsonBody(req);
    const message = payload.message;
    const model = payload.model || getModel(env);

    if (!message) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing required field `message` in request body.' }));
      return;
    }

    const body = createChatPayload(message, model);
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    res.writeHead(response.ok ? 200 : response.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
  }
}

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/chat') {
    return handleChat(req, res);
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`OpenRouter local API server running on http://localhost:${PORT}`);
  console.log('POST /chat with JSON { message, model? } to send OpenRouter requests');
});
