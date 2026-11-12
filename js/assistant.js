import { askAssistant } from './api.js';
import { showFieldError, showPanel, updateCounter } from './assistant-ui.js';
import { validate } from './validation.js';

const form = document.getElementById('consulta');
const fields = document.getElementById('campos');
const names = ['pregunta', 'tema', 'nivel', 'integracion'];
const question = form.elements.pregunta;
const responseTitle = document.getElementById('respuesta-title');
const retry = document.getElementById('reintentar');

const suggestion = document.getElementById('suggestion');
const panel = document.getElementById('response-panel');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');
const historyKey = 'tic-chat-history';
const examples = [
  ['Redes', '¿Cómo funciona DNS?'],
  ['Inteligencia artificial', '¿Cómo aprende un modelo de IA?'],
  ['Programación', '¿Para qué sirve una función?'],
  ['Bases de datos', '¿Qué es una clave primaria?'],
  ['IoT', '¿Cómo se conecta un sensor a Internet?'],
];
let exampleIndex = Math.floor(Math.random() * examples.length);
let history = [];
try {
  const saved = JSON.parse(localStorage.getItem(historyKey) ?? '[]');
  if (Array.isArray(saved)) history = saved.filter((entry) => entry?.values && entry?.result);
} catch {
  // The assistant still works when browser storage is unavailable.
}

function renderHistory() {
  historyEmpty.hidden = history.length > 0;
  historyList.replaceChildren(...history.map(({ values, result }) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-example text-start';
    button.textContent = values.pregunta;
    button.addEventListener('click', () => {
      if (fields.disabled) return;
      names.forEach((name) => {
        form.elements[name].value = values[name];
        showFieldError(name);
      });
      updateCounter();
      panel.hidden = false;
      showPanel({ result });
      responseTitle.focus();
    });
    item.append(button);
    return item;
  }));
}

function updateSuggestion() {
  suggestion.textContent = examples[exampleIndex][1];
}

renderHistory();
updateSuggestion();
setInterval(() => {
  if (document.getElementById('vacio').hidden || document.activeElement === suggestion || suggestion.matches(':hover')) return;
  suggestion.classList.add('is-changing');
  setTimeout(() => {
    if (document.activeElement !== suggestion && !suggestion.matches(':hover')) {
      exampleIndex = (exampleIndex + 1 + Math.floor(Math.random() * (examples.length - 1))) % examples.length;
      updateSuggestion();
    }
    suggestion.classList.remove('is-changing');
  }, 200);
}, 5000);

suggestion.addEventListener('click', () => {
  const [tema, pregunta] = examples[exampleIndex];
  question.value = pregunta;
  form.elements.tema.value = tema;
  showFieldError('pregunta');
  showFieldError('tema');
  updateCounter();
  question.focus();
});

form.addEventListener('input', ({ target }) => {
  if (target.name === 'pregunta') updateCounter();
  if (target.getAttribute('aria-invalid') === 'true') {
    showFieldError(target.name, validate(form).errors[target.name]);
  }
});

form.addEventListener('reset', (event) => {
  if (fields.disabled) {
    event.preventDefault();
    return;
  }
  names.forEach((name) => showFieldError(name));
  panel.hidden = true;
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
  panel.hidden = false;
  showPanel({ busy: true });
  try {
    const result = await askAssistant(values);
    showPanel({ result });
    history = [{ values, result }, ...history].slice(0, 20);
    try {
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch {
      // Keep the history available for this visit.
    }
    renderHistory();
    if (document.activeElement === document.body) responseTitle.focus();
  } catch (error) {
    showPanel({ error: error.message });
    if (document.activeElement === document.body) retry.focus();
  } finally {
    fields.disabled = false;
  }
});
