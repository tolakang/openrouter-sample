import axios from 'axios';
import readline from 'readline';
import { loadEnv, getApiKey, getModel, createChatPayload, OPENROUTER_ENDPOINT } from './openrouter.js';

const env = loadEnv();
const OPENROUTER_API_KEY = getApiKey(env);
const model = getModel(env);
let message = process.argv.slice(2).join(' ').trim();

if (!message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  message = await new Promise<string>((resolve) => {
    rl.question('Enter a prompt for OpenRouter: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

if (!message) {
  console.error('No prompt provided. Use `node openrouter-cli.ts "Your prompt"` or enter text when prompted.');
  process.exit(1);
}

const body = createChatPayload(message, model);

async function run(): Promise<void> {
  try {
    const response = await axios.post(OPENROUTER_ENDPOINT, body, {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('OpenRouter response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('OpenRouter request failed:', error.response.status, error.response.data);
    } else {
      console.error('Request error:', error instanceof Error ? error.message : error);
    }
    process.exit(1);
  }
}

run();
