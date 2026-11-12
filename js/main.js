import { askAssistant } from './api.js';
import { showFieldError, showPanel, updateCounter } from './ui.js';
import { validate } from './validation.js';

const form = document.getElementById('consulta');
const fields = document.getElementById('campos');
const names = ['tema', 'nivel', 'pregunta', 'integracion'];

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
    form.elements.tema.focus();
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (fields.disabled) return;

  const { values, errors } = validate(form);
  names.forEach((name) => showFieldError(name, errors[name]));
  const firstInvalid = Object.keys(errors)[0];
  if (firstInvalid) {
    form.elements[firstInvalid].focus();
    return;
  }

  fields.disabled = true;
  showPanel({ busy: true });
  try {
    showPanel({ result: await askAssistant(values) });
  } catch (error) {
    showPanel({ error: error.message });
  } finally {
    fields.disabled = false;
  }
});
