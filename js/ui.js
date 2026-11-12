import { INTEGRATIONS, MAX_QUESTION_LENGTH } from './config.js';

const byId = (id) => document.getElementById(id);

export function showFieldError(name, message = '') {
  const field = byId(name);
  field.classList.toggle('is-invalid', Boolean(message));
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
  byId(`${name}-error`).textContent = message;
}

export function updateCounter() {
  byId('contador').textContent = `${byId('pregunta').value.length} / ${MAX_QUESTION_LENGTH} caracteres`;
}

export function showPanel({ busy = false, error = '', result } = {}) {
  byId('vacio').hidden = Boolean(busy || error || result);
  byId('spinner').hidden = !busy;
  byId('estado').textContent = busy ? 'Consultando el asistente...' : result ? 'Respuesta recibida.' : '';
  byId('error').textContent = error;
  byId('error').hidden = !error;
  byId('resultado').hidden = !result;

  if (result) {
    byId('resultado-tema').textContent = result.tema;
    byId('resultado-nivel').textContent = result.nivel;
    byId('resultado-integracion').textContent = INTEGRATIONS[result.integracion];
    byId('respuesta').textContent = result.respuesta;
  }
}
