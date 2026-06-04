import axios from 'axios';
import { getApiKey, createChatPayload, getModel, OPENROUTER_ENDPOINT } from './openrouter.js';

const OPENROUTER_API_KEY = getApiKey();
const body = createChatPayload(
  'Write a short welcome message for a developer using OpenRouter.',
  getModel()
);

async function run(): Promise<void> {
  try {
    const response = await axios.post(OPENROUTER_ENDPOINT, body, {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('OpenRouter response:', JSON.stringify(response.data, null, 2));
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
