# 3.4 Web app para automatización IA

Asistente académico TIC para la práctica del TecNM campus Pachuca. La web usa HTML5, CSS3, Bootstrap 5 y módulos JavaScript. El formulario envía un POST con Fetch a n8n Cloud y muestra la respuesta sin recargar.

## Estructura

- `index.html` contiene el formulario y el panel de respuesta.
- `css/styles.css` define el diseño adaptable.
- `js/config.js` centraliza el Webhook público, el formato de solicitud y los límites.
- `js/validation.js`, `js/api.js`, `js/ui.js` y `js/main.js` manejan validación, comunicación, presentación y eventos.
- `assets/favicon.svg` identifica el sitio en el navegador.

## Uso y publicación

Aplicación publicada en [GitHub Pages](https://metrasta214.github.io/webapp-automatizacion-ia/). El módulo de configuración apunta al [Webhook de producción](https://alvaro214.app.n8n.cloud/webhook/webapp-automatizacion-ia).

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
| Básico | Redes, Básico, ¿Cómo funciona DNS?, nativo | Explicación para principiantes | Respuesta visible con nivel Básico en GitHub Pages |
| Intermedio | Bases de datos, Intermedio, ¿Cómo funciona un índice en una base de datos?, nativo | Explicación adaptada | Respuesta visible con nivel Intermedio en GitHub Pages |
| Avanzado | Redes, Avanzado, ¿Cómo valida DNSSEC una respuesta?, http | Explicación técnica | Respuesta visible sobre DNSSEC con nivel Avanzado en GitHub Pages |
| Cambio de tema | Cambiar de Redes a Bases de datos | Resultado con el tema elegido | GitHub Pages mostró Bases de datos en la respuesta |
| Campos vacíos | Enviar el formulario sin completar | Errores junto a los campos y foco en el primero | Verificado en GitHub Pages |
| Cambio de integración | Redes, Básico, ¿Cómo funciona DNS?, http | Respuesta por la ruta HTTP | GitHub Pages mostró HTTP Request / Responses API |
| Integración inválida | Redes, Intermedio, ¿Cómo funciona DNS?, desconocida | HTTP 400 con mensaje | HTTP 400 en Webhook de prueba |
| Falla de red | Simular un rechazo de Fetch en el cliente HTTP | Mensaje de conexión | Verificado en prueba local del módulo |
| Webhook inactivo | Redes, Básico, ¿Cómo funciona DNS?, nativo | Mensaje de conexión y formulario disponible para reintentar | Mensaje visible en GitHub Pages |
| Ancho móvil | Abrir el sitio a 375 px | Formulario y respuesta apilados, sin desplazamiento horizontal | Verificado en GitHub Pages |
