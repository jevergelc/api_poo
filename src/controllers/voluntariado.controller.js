/**
 * voluntariado.controller.js
 * --------------------------------------------------
 * Recibe las peticiones HTTP del formulario de
 * voluntariado y se comunica con el service.
 */

const { ok } = require("../utils/response");
const { VoluntariadoService } = require("../services/voluntariado.service");

const service = new VoluntariadoService();

/**
 * GET /voluntariados
 * Devuelve todas las solicitudes (solo admin)
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
 * POST /voluntariados
 * Registra una nueva solicitud de voluntariado
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
