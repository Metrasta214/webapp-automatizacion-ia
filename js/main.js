import { askAssistant } from './api.js';
import { showFieldError, showPanel, updateCounter } from './ui.js?v=3';
import { validate } from './validation.js';

const form = document.getElementById('consulta');
const fields = document.getElementById('campos');
const names = ['pregunta', 'tema', 'nivel', 'integracion'];
const question = form.elements.pregunta;
const responseTitle = document.getElementById('respuesta-title');
const retry = document.getElementById('reintentar');

document.querySelectorAll('[data-example]').forEach((button) => {
  button.addEventListener('click', () => {
    question.value = button.textContent.trim();
    if (!form.elements.tema.value) form.elements.tema.value = 'Redes';
    showFieldError('pregunta');
    showFieldError('tema');
    updateCounter();
    question.focus();
    question.setSelectionRange(question.value.length, question.value.length);
  });
});

form.addEventListener('input', ({ target }) => {
  if (target.name === 'pregunta') updateCounter();
  if (target.getAttribute('aria-invalid') === 'true') {
    showFieldError(target.name, validate(form).errors[target.name]);
  }
});

form.addEventListener('reset', () => {
  names.forEach((name) => showFieldError(name));
  showPanel();
  queueMicrotask(() => {
    updateCounter();
    question.focus();
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (fields.disabled) return;

  const { values, errors } = validate(form);
  names.forEach((name) => showFieldError(name, errors[name]));
  const firstInvalid = names.find((name) => errors[name]);
  if (firstInvalid) {
    form.elements[firstInvalid].focus();
    return;
  }

  fields.disabled = true;
  showPanel({ busy: true });
  try {
    showPanel({ result: await askAssistant(values) });
    if (document.activeElement === document.body) responseTitle.focus();
  } catch (error) {
    showPanel({ error: error.message });
    if (document.activeElement === document.body) retry.focus();
  } finally {
    fields.disabled = false;
  }
});
