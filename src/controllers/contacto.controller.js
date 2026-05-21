/**
 * contacto.controller.js
 * --------------------------------------------------
 * Recibe las peticiones HTTP del formulario de
 * contacto y se comunica con el service.
 */

const { ok } = require("../utils/response");
const { ContactoService } = require("../services/contacto.service");

const service = new ContactoService();

/**
 * GET /contacto
 * Devuelve todos los mensajes (solo admin)
 */
async function list(req, res, next) {
  try {
    const result = await service.list();
    return ok(res, 200, result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /contacto
 * Registra un nuevo mensaje de contacto
 */
async function create(req, res, next) {
  try {
    const result = await service.create(req.body);
    return ok(res, 201, result);
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create };
