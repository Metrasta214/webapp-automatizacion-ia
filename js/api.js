import { INTEGRATIONS, REQUEST_FORMAT, REQUEST_TIMEOUT_MS, WEBHOOK_URL } from './config.js';

const statusMessages = {
  400: 'Revisa los datos de la consulta.',
  401: 'El servicio requiere autorización. Revisa la configuración del Webhook.',
  403: 'El servicio rechazó el acceso. Revisa la configuración del Webhook.',
  404: 'El Webhook de producción no está disponible.',
  429: 'Se alcanzó el límite de consultas. Espera antes de reintentar.',
};

export async function askAssistant(values) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const useForm = REQUEST_FORMAT === 'form';

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: useForm ? undefined : { 'Content-Type': 'application/json' },
      body: useForm ? new URLSearchParams(values) : JSON.stringify(values),
      signal: controller.signal,
    });

    const successful = response.ok;
    let data;
    try {
      data = await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw error;
      if (successful) throw new Error('El Webhook devolvió una respuesta que no es JSON.');
    }

    if (!successful || data?.ok === false) {
      const fallback = statusMessages[response.status] ?? 'El servicio no pudo responder. Intenta nuevamente.';
      const publicMessage = data?.ok === false && typeof data.mensaje === 'string' && data.mensaje.trim();
      throw new Error(publicMessage || fallback);
    }

    if (data?.ok !== true || typeof data.respuesta !== 'string' || !data.respuesta.trim()
      || typeof data.tema !== 'string' || typeof data.nivel !== 'string'
      || typeof data.integracion !== 'string' || !Object.hasOwn(INTEGRATIONS, data.integracion)) {
      throw new Error('El Webhook devolvió una respuesta con un formato inesperado.');
    }

    return data;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('La consulta tardó demasiado. Puedes volver a enviarla.');
    }
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con n8n. Revisa la conexión y la configuración CORS del Webhook.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
