UniEats — TP Final Programación Web 2025 (UCEMA)

UniEats digitaliza el pedido del buffet universitario para ahorrar tiempo en los recreos.
El/la estudiante arma su pedido, elige método de “pago” (simulado), define hora de retiro y evita la fila.
El staff ve los pedidos y actualiza su estado (pendiente → en preparación → listo).

Objetivo del proyecto

Aplicar HTML/CSS/JS (Vue por CDN) + Python/Flask con persistencia simple en JSON para construir una aplicación web completa (frontend + backend + API propia) que resuelva una problemática de negocios digitales: colas y falta de trazabilidad en el buffet de UCEMA.


Navegación (Frontend)

Páginas visibles:

- inicio.html (login/registro simulado + validaciones y mensajes)

- menu.html (categorías, filtro/búsqueda, agregar al carrito)

- carrito.html (totales, selección de pago simulado)

- retiro.html (selección de hora de retiro)

- mi-pedido.html (seguimiento de estado y repetir pedido)

- staff.html (CRUD de productos + tablero de pedidos con cambio de estado)

El carrito se guarda en localStorage y las acciones relevantes invocan endpoints del backend con fetch + async/await.
Login y pagos son simulados (para fines académicos).


Arquitectura

Frontend (HTML + CSS + JS + Vue por CDN)

- Interfaz alumno/a y staff.

- Render con Vue (sin build tools) + manejo de errores visible para el usuario.

- Carrito en localStorage.

APP (capa intermedia)

- Contratos JSON entre front y back.

- Respuesta uniforme: { ok, data, error }.

- Normaliza IDs/campos/estados.

Backend (Flask)

API REST en /api/* (+ endpoints de sesión simulada).

- Persistencia en data/data.json.

- Validación básica, CORS habilitado, generación de IDs y timestamps.


Productos

- GET /api/productos → lista (adm. ?categoria=bebidas)

- GET /api/productos/<id> → uno

- POST /api/productos → alta (JSON: nombre, precio, categoria, stock, activo)

- PUT /api/productos/<id> → actualización parcial

- DELETE /api/productos/<id> → baja


Pedidos

- GET /api/pedidos → lista (adm. ?estado=pendiente)

- GET /api/pedidos/<id> → uno

- POST /api/pedidos → alta (items, metodo_pago, hora_retiro)

- PUT /api/pedidos/<id> → cambio de estado (pendiente→en_preparacion→listo)


Usuarios (si se usa)

GET /api/usuarios | POST /api/usuarios


Flujo principal (Alumno)

Menú → agregar al carrito → método de pago simulado → elegir hora de retiro → confirmar → Mi pedido (seguimiento de estado)

Flujo Staff

CRUD de productos → tablero de pedidos → cambiar estado (pendiente → en preparación → listo)


Para correr: backend `python3 app.py` (http://localhost:4000) y frontend `python3 -m http.server 5500` (abrir http://localhost:5500/inicio.html).
