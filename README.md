# 3.4 Web app para automatización IA

Asistente académico TIC para la práctica del TecNM campus Pachuca. La web usa HTML5, CSS3, Bootstrap 5 y módulos JavaScript. El formulario envía un POST con Fetch a n8n Cloud y muestra la respuesta sin recargar.

## Estructura

- `index.html` contiene el formulario y el panel de respuesta.
- `css/styles.css` define el diseño adaptable.
- `js/config.js` centraliza el Webhook público, el formato de solicitud y los límites.
- `js/validation.js`, `js/api.js`, `js/ui.js` y `js/main.js` manejan validación, comunicación, presentación y eventos.
- `assets/favicon.svg` identifica el sitio en el navegador.

## Uso y publicación

Ejecuta `python -m http.server 8000` desde esta carpeta y abre `http://localhost:8000/`. El Webhook de producción debe estar publicado para responder.

Publica esta carpeta como raíz del repositorio `webapp-automatizacion-ia`. En GitHub, abre **Settings → Pages**, elige **Deploy from a branch**, selecciona **main** y **/(root)** y guarda. Abre el sitio HTTPS y comprueba ambas integraciones.

## Contrato

Se envían `tema`, `nivel`, `pregunta` e `integracion` por POST. Tema permite Inteligencia artificial, Redes, Programación, Bases de datos e IoT. Nivel admite Básico, Intermedio y Avanzado. Pregunta admite hasta 1000 caracteres. Integración usa `nativo` o `http`.

n8n valida y normaliza los datos. La ruta nativa usa el nodo OpenAI y la ruta HTTP consulta la Responses API. En éxito se recibe HTTP 200 con `ok`, `respuesta`, `tema`, `nivel` e `integracion`. Una entrada inválida devuelve HTTP 400 con `ok: false` y `mensaje`. Un fallo del proveedor devuelve HTTP 502.

La web envía JSON. Si el origen publicado encuentra un error en la solicitud OPTIONS, revisa Network y los orígenes permitidos en n8n. Si el Webhook admite el POST simple pero no la prevalidación, cambia `REQUEST_FORMAT` a `form` para enviar los mismos campos con `URLSearchParams`.

La URL del Webhook es pública. CORS controla el acceso desde navegadores y no autentica al usuario. La clave de OpenAI se mantiene en Credentials de n8n. Revisa el consumo durante la evaluación y despublica el Webhook al concluirla.

## Matriz de pruebas

| Caso | Entrada | Resultado esperado | Observado |
| --- | --- | --- | --- |
| Básico | Programación, Básico, ¿Qué es una función?, nativo | Explicación para principiantes | Pendiente en la web |
| Intermedio | Redes, Intermedio, ¿Cómo funciona DNS?, nativo | HTTP 200 y explicación adaptada | HTTP 200 en Webhook de prueba |
| Avanzado | Redes, Avanzado, ¿Cómo valida DNSSEC una respuesta?, http | Explicación técnica | Pendiente en la web |
| Cambio de tema | Bases de datos, Intermedio, ¿Qué es un índice?, nativo | Resultado con el tema elegido | Pendiente en la web |
| Campos vacíos | Enviar el formulario sin completar | Errores junto a los campos | Pendiente en la web |
| Cambio de integración | Redes, Intermedio, ¿Cómo funciona DNS?, http | HTTP 200 con la ruta HTTP | HTTP 200 en Webhook de prueba |
| Integración inválida | Redes, Intermedio, ¿Cómo funciona DNS?, desconocida | HTTP 400 con mensaje | HTTP 400 en Webhook de prueba |
| Falla de red | Consultar con Network en modo Offline | Error visible y datos conservados | Pendiente en la web |
