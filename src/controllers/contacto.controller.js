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

/**
 * GET /contacto/:id
 * Devuelve un mensaje de contacto por id (solo admin)
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
 * PATCH /contacto/:id
 * Actualiza un mensaje de contacto (solo admin)
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
 * DELETE /contacto/:id
 * Elimina un mensaje de contacto (solo admin)
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
