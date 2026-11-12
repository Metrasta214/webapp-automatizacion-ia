import { INTEGRATIONS, MAX_QUESTION_LENGTH } from './config.js';

const topics = ['Inteligencia artificial', 'Redes', 'Programación', 'Bases de datos', 'IoT'];
const levels = ['Básico', 'Intermedio', 'Avanzado'];

export function validate(form) {
  const raw = Object.fromEntries(new FormData(form));
  const values = Object.fromEntries(
    ['tema', 'nivel', 'pregunta', 'integracion'].map((key) => [key, (raw[key] ?? '').trim()]),
  );
  const errors = {};

  if (!topics.includes(values.tema)) errors.tema = 'Selecciona un tema válido.';
  if (!levels.includes(values.nivel)) errors.nivel = 'Selecciona un nivel válido.';
  if (!values.pregunta) errors.pregunta = 'Escribe una pregunta.';
  if ((raw.pregunta?.length ?? 0) > MAX_QUESTION_LENGTH) {
    errors.pregunta = `Usa un máximo de ${MAX_QUESTION_LENGTH} caracteres.`;
  }
  if (!Object.hasOwn(INTEGRATIONS, values.integracion)) {
    errors.integracion = 'Selecciona una integración válida.';
  }

  return { values, errors };
}
