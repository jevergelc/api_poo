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

/**
 * GET /voluntariados/:id
 * Devuelve una solicitud de voluntariado por id (solo admin)
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
 * PATCH /voluntariados/:id
 * Actualiza una solicitud de voluntariado (solo admin)
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
 * DELETE /voluntariados/:id
 * Elimina una solicitud de voluntariado (solo admin)
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
