/**
 * routes/index.js
 * =========================================================
 * ARCHIVO ÚNICO DE RUTAS PRINCIPALES DE LA API
 * =========================================================
 *
 * Este archivo centraliza todas las rutas del proyecto:
 *
 * ✅ Verificación de estado
 * ✅ Autenticación
 * ✅ Productos
 * ✅ Carrito
 * ✅ Órdenes
 * ✅ Términos y condiciones
 * ✅ Historias
 *
 * También incluye:
 * ✅ Middlewares de seguridad
 * ✅ Roles
 * ✅ API Key
 *
 * Estructura recomendada:
 *
 * project/
 * ├── routes/
 * │   └── index.js   <-- ESTE ARCHIVO
 * ├── controllers/
 * ├── middlewares/
 * └── app.js
 *
 * =========================================================
 */

const express = require("express");
const router = express.Router();

/* =========================================================
   IMPORTACIÓN DE MIDDLEWARES
========================================================= */

/**
 * Middleware para validar API KEY
 * Protege las rutas privadas
 */
const { requireApiKey } = require("../middlewares/apiKey.middleware");

/**
 * Middleware para validar roles
 * Ejemplo:
 * requireRole("admin")
 * requireRole("client")
 */
const { requireRole } = require("../middlewares/role.middleware");

/* =========================================================
   IMPORTACIÓN DE CONTROLADORES
========================================================= */

/**
 * Controlador de autenticación
 */
const auth = require("../controllers/auth.controller");

/**
 * Controlador de productos
 */
const products = require("../controllers/products.controller");

/**
 * Controlador del carrito
 */
const cart = require("../controllers/cart.controller");

/**
 * Controlador de órdenes/pagos
 */
const orders = require("../controllers/orders.controller");

/**
 * Controlador de términos y condiciones
 */
const terms = require("../controllers/terms.controller");

/**
 * Controlador de historias
 */
const historias = require("../controllers/historias.controller");

/* =========================================================
   VERIFICACIÓN DE ESTADO
========================================================= */

/**
 * Ruta para verificar si la API está funcionando
 *
 * Método: GET
 * Endpoint: /estado
 */
router.get("/estado", (req, res) => {
  res.json({
    ok: true,
    data: {
      status: "ok",
    },
  });
});

/* =========================================================
   AUTENTICACIÓN (PÚBLICO)
========================================================= */

/**
 * Registrar usuario
 *
 * Método: POST
 * Endpoint: /auth/register
 */
router.post("/auth/register", auth.register);

/**
 * Login usuario
 *
 * Método: POST
 * Endpoint: /auth/login
 */
router.post("/auth/login", auth.login);

/**
 * Obtener términos y condiciones
 *
 * Método: POST
 * Endpoint: /terms
 */
router.post("/terms", terms.getTerms);

/* =========================================================
   AUTENTICACIÓN (PROTEGIDO)
========================================================= */

/**
 * Logout usuario
 *
 * Requiere:
 * - API KEY válida
 *
 * Método: POST
 * Endpoint: /auth/logout
 */
router.post(
  "/auth/logout",
  requireApiKey,
  auth.logout
);

/* =========================================================
   PRODUCTOS
========================================================= */

/**
 * Obtener listado de productos
 *
 * Acceso:
 * - client
 * - admin
 *
 * Requiere:
 * - API KEY
 *
 * Método: GET
 * Endpoint: /products
 */
router.get(
  "/products",
  requireApiKey,
  products.list
);

/**
 * Obtener producto por ID
 *
 * Acceso:
 * - client
 * - admin
 *
 * Requiere:
 * - API KEY
 *
 * Método: GET
 * Endpoint: /products/:id
 */
router.get(
  "/products/:id",
  requireApiKey,
  products.getById
);

/**
 * Crear producto
 *
 * Acceso:
 * - admin
 *
 * Requiere:
 * - API KEY
 * - ROLE ADMIN
 *
 * Método: POST
 * Endpoint: /products
 */
router.post(
  "/products",
  requireApiKey,
  requireRole("admin"),
  products.create
);

/**
 * Actualizar producto
 *
 * Acceso:
 * - admin
 *
 * Método: PATCH
 * Endpoint: /products/:id
 */
router.patch(
  "/products/:id",
  requireApiKey,
  requireRole("admin"),
  products.update
);

/**
 * Eliminar producto
 *
 * Acceso:
 * - admin
 *
 * Método: DELETE
 * Endpoint: /products/:id
 */
router.delete(
  "/products/:id",
  requireApiKey,
  requireRole("admin"),
  products.remove
);

/* =========================================================
   CARRITO DE COMPRAS
========================================================= */

/**
 * Agregar producto al carrito
 *
 * Acceso:
 * - client
 *
 * Método: POST
 * Endpoint: /cart/items
 */
router.post(
  "/cart/items",
  requireApiKey,
  requireRole("client"),
  cart.addItem
);

/**
 * Obtener carrito actual
 *
 * Acceso:
 * - client
 *
 * Método: GET
 * Endpoint: /cart
 */
router.get(
  "/cart",
  requireApiKey,
  requireRole("client"),
  cart.getCart
);

/**
 * Eliminar item del carrito
 *
 * Acceso:
 * - client
 *
 * Método: DELETE
 * Endpoint: /cart/items/:productId
 */
router.delete(
  "/cart/items/:productId",
  requireApiKey,
  requireRole("client"),
  cart.removeItem
);

/**
 * Vaciar carrito completo
 *
 * Acceso:
 * - client
 *
 * Método: DELETE
 * Endpoint: /cart/clear
 */
router.delete(
  "/cart/clear",
  requireApiKey,
  requireRole("client"),
  cart.clearCart
);

/* =========================================================
   ÓRDENES Y PAGOS
========================================================= */

/**
 * Realizar pago
 *
 * Acceso:
 * - client
 *
 * Método: POST
 * Endpoint: /orders/pay
 */
router.post(
  "/orders/pay",
  requireApiKey,
  requireRole("client"),
  orders.pay
);

/**
 * Obtener órdenes del usuario
 *
 * Acceso:
 * - client
 *
 * Método: GET
 * Endpoint: /orders/my
 */
router.get(
  "/orders/my",
  requireApiKey,
  requireRole("client"),
  orders.myOrders
);

/* =========================================================
   HISTORIAS
========================================================= */

/**
 * =======================================================
 * RUTAS PÚBLICAS DE HISTORIAS
 * =======================================================
 */

/**
 * Obtener todas las historias
 *
 * Método: GET
 * Endpoint: /historias
 */
router.get(
  "/historias",
  historias.list
);

/**
 * Obtener historia por ID
 *
 * Método: GET
 * Endpoint: /historias/:id
 */
router.get(
  "/historias/:id",
  historias.getById
);

/**
 * =======================================================
 * RUTAS ADMINISTRATIVAS DE HISTORIAS
 * =======================================================
 *
 * Estas rutas normalmente deberían estar protegidas
 * por:
 *
 * - requireApiKey
 * - requireRole("admin")
 *
 * Ya las dejo implementadas correctamente.
 */

/**
 * Crear historia
 *
 * Acceso:
 * - admin
 *
 * Método: POST
 * Endpoint: /historias
 */
router.post(
  "/historias",
  requireApiKey,
  requireRole("admin"),
  historias.create
);

/**
 * Actualizar historia
 *
 * Acceso:
 * - admin
 *
 * Método: PATCH
 * Endpoint: /historias/:id
 */
router.patch(
  "/historias/:id",
  requireApiKey,
  requireRole("admin"),
  historias.update
);

/**
 * Eliminar historia
 *
 * Acceso:
 * - admin
 *
 * Método: DELETE
 * Endpoint: /historias/:id
 */
router.delete(
  "/historias/:id",
  requireApiKey,
  requireRole("admin"),
  historias.remove
);

/* =========================================================
   EXPORTACIÓN DEL ROUTER
========================================================= */

/**
 * Exporta todas las rutas
 * para ser usadas en app.js
 */
module.exports = router;