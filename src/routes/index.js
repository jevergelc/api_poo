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
 * Controlador de historias
 */
const historias = require("../controllers/historias.controller");

/**
 * Controlador de mensajes de contacto
 */
const contacto = require("../controllers/contacto.controller");

/**
 * Controlador de inscripciones y atención al adulto mayor
 */
const inscripciones = require("../controllers/inscripcion.controller");

/**
 * Controlador de solicitudes de voluntariado
 */
const voluntariados = require("../controllers/voluntariado.controller");

/**
 * Controlador de ofertas de donación
 */
const donaciones = require("../controllers/donacion.controller");

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
   CONTACTO
========================================================= */

/**
 * Enviar mensaje de contacto
 *
 * Acceso: público
 * Método: POST
 * Endpoint: /contacto
 */
router.post("/contacto", contacto.create);

/**
 * Listar mensajes de contacto
 *
 * Acceso: admin
 * Método: GET
 * Endpoint: /contacto
 */
router.get("/contacto", requireApiKey, requireRole("admin"), contacto.list);

/* =========================================================
   INSCRIPCIONES
========================================================= */

/**
 * Registrar inscripción o solicitud de atención
 *
 * Acceso: público
 * Método: POST
 * Endpoint: /inscripciones
 */
router.post("/inscripciones", inscripciones.create);

/**
 * Listar inscripciones
 *
 * Acceso: admin
 * Método: GET
 * Endpoint: /inscripciones
 */
router.get("/inscripciones", requireApiKey, requireRole("admin"), inscripciones.list);

/* =========================================================
   VOLUNTARIADOS
========================================================= */

/**
 * Registrar solicitud de voluntariado
 *
 * Acceso: público
 * Método: POST
 * Endpoint: /voluntariados
 */
router.post("/voluntariados", voluntariados.create);

/**
 * Listar solicitudes de voluntariado
 *
 * Acceso: admin
 * Método: GET
 * Endpoint: /voluntariados
 */
router.get("/voluntariados", requireApiKey, requireRole("admin"), voluntariados.list);

/* =========================================================
   DONACIONES
========================================================= */

/**
 * Registrar oferta de donación
 *
 * Acceso: público
 * Método: POST
 * Endpoint: /donaciones
 */
router.post("/donaciones", donaciones.create);

/**
 * Listar donaciones registradas
 *
 * Acceso: admin
 * Método: GET
 * Endpoint: /donaciones
 */
router.get("/donaciones", requireApiKey, requireRole("admin"), donaciones.list);

/* =========================================================
   EXPORTACIÓN DEL ROUTER
========================================================= */

/**
 * Exporta todas las rutas
 * para ser usadas en app.js
 */
module.exports = router;