import { getApiKey, createChatPayload, getModel, OPENROUTER_ENDPOINT } from './openrouter.js';
const OPENROUTER_API_KEY = getApiKey();
const body = createChatPayload('Write a short welcome message for a developer using OpenRouter.', getModel());
async function run() {
    const response = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter request failed:', response.status, errorText);
        process.exit(1);
    }
    const payload = await response.json();
    console.log('OpenRouter response:', JSON.stringify(payload, null, 2));
}
run().catch((error) => {
    console.error('Request error:', error);
    process.exit(1);
});
