import { test } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = 3001;
const SERVER_URL = `http://127.0.0.1:${PORT}`;

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      if (text.includes('OpenRouter local API server running')) {
        resolve();
      }
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== null && code !== 0) {
        reject(new Error(`Server exited with code ${code}`));
      }
    });
  });
}

function requestHealth() {
  return new Promise((resolve, reject) => {
    http.get(`${SERVER_URL}/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

test('local OpenRouter server responds to /health', async (t) => {
  const child = spawn('node', ['openrouter-server.js'], {
    env: {
      ...process.env,
      OPENROUTER_API_KEY: 'testkey',
      OPENROUTER_PORT: String(PORT)
    },
    stdio: ['ignore', 'pipe', 'inherit']
  });

  await waitForServer(child);
  const result = await requestHealth();
  assert.strictEqual(result.statusCode, 200);
  assert.ok(result.body.includes('"status":"ok"'));

  child.kill();
});
