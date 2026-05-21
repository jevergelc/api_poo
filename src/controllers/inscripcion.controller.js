/**
 * inscripcion.controller.js
 * --------------------------------------------------
 * Recibe las peticiones HTTP de los formularios
 * de inscripción y atención al adulto mayor.
 */

const { ok } = require("../utils/response");
const { InscripcionService } = require("../services/inscripcion.service");

const service = new InscripcionService();

/**
 * GET /inscripciones
 * Devuelve todas las inscripciones (solo admin)
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
 * POST /inscripciones
 * Registra una nueva inscripción o solicitud de atención
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
