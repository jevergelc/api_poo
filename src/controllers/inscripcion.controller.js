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

/**
 * GET /inscripciones/:id
 * Devuelve una inscripción por id (solo admin)
 */
async function getById(req, res, next) {
  try {
    const result = await service.getById(req.params.id);
    return ok(res, 200, result);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /inscripciones/:id
 * Actualiza una inscripción (solo admin)
 */
async function update(req, res, next) {
  try {
    const result = await service.update(req.params.id, req.body);
    return ok(res, 200, result);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /inscripciones/:id
 * Elimina una inscripción (solo admin)
 */
async function remove(req, res, next) {
  try {
    const result = await service.remove(req.params.id);
    return ok(res, 200, result);
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, remove };
