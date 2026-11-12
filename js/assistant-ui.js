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

function renderResponse(text) {
  const elements = text.trim().split(/\r?\n(?=#{1,6}\s)|(?:\r?\n){2,}/).map((block) => {
    const heading = block.match(/^#{1,6}\s+([^\r\n]+)(?:\r?\n([\s\S]+))?$/);
    const content = heading ? [heading[1], heading[2]] : [block];
    return content.filter(Boolean).map((value, index) => {
      const element = document.createElement(heading && index === 0 ? 'h3' : 'p');
      value.split(/(\*\*[^*\n]+\*\*)/).forEach((part, partIndex) => {
        if (partIndex % 2 === 0) {
          element.append(part);
        } else {
          const emphasis = document.createElement('strong');
          emphasis.textContent = part.slice(2, -2);
          element.append(emphasis);
        }
      });
      return element;
    });
  });
  byId('respuesta').replaceChildren(...elements.flat());
}

export function showPanel({ busy = false, error = '', result } = {}) {
  byId('vacio').hidden = Boolean(busy || error || result);
  byId('spinner').hidden = !busy;
  byId('estado').textContent = busy ? 'Generando explicación…' : result ? 'Explicación lista.' : '';
  byId('fallo').hidden = !error;
  byId('error').textContent = error;
  byId('resultado').hidden = !result;

  if (result) {
    byId('resultado-tema').textContent = result.tema;
    byId('resultado-nivel').textContent = result.nivel;
    byId('resultado-integracion').textContent = INTEGRATIONS[result.integracion];
    renderResponse(result.respuesta);
  }
}
