export const WEBHOOK_URL = 'https://alvaro214.app.n8n.cloud/webhook/webapp-automatizacion-ia';
export const REQUEST_TIMEOUT_MS = 55000;
export const MAX_QUESTION_LENGTH = 1000;

// Use 'form' only if the deployed Webhook cannot answer the JSON preflight.
export const REQUEST_FORMAT = 'json';

export const INTEGRATIONS = {
  nativo: 'Nodo OpenAI',
  http: 'HTTP Request / Responses API',
};
