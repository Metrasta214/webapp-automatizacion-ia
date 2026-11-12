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

function appendInline(element, text) {
  for (const part of text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/)) {
    const marker = part.startsWith('**') && part.endsWith('**') && part.length > 4 ? 2
      : part.startsWith('*') && part.endsWith('*') && part.length > 2 ? 1 : 0;
    if (!marker) {
      element.append(part);
      continue;
    }
    const emphasis = document.createElement(marker === 2 ? 'strong' : 'em');
    emphasis.textContent = part.slice(marker, -marker);
    element.append(emphasis);
  }
}

function renderResponse(text) {
  const content = document.createDocumentFragment();
  let paragraph;
  let list;
  let listTag;

  for (const line of text.trim().split(/\r?\n/)) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const item = line.match(/^\s*(?:(\d+)[.)]|[-*+])\s+(.+)$/);
    if (!line.trim() || heading || item) paragraph = null;
    if (!item) list = null;
    if (!line.trim()) continue;

    if (heading) {
      const element = document.createElement('h' + Math.min(heading[1].length + 2, 6));
      appendInline(element, heading[2]);
      content.append(element);
    } else if (item) {
      const tag = item[1] ? 'ol' : 'ul';
      if (!list || listTag !== tag) {
        list = document.createElement(tag);
        listTag = tag;
        if (item[1]) list.start = Number(item[1]);
        content.append(list);
      }
      const element = document.createElement('li');
      appendInline(element, item[2]);
      list.append(element);
    } else {
      if (!paragraph) {
        paragraph = document.createElement('p');
        content.append(paragraph);
      } else {
        paragraph.append('\n');
      }
      appendInline(paragraph, line);
    }
  }

  byId('respuesta').replaceChildren(content);
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
