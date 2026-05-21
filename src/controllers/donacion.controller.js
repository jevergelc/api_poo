/**
 * donacion.controller.js
 * --------------------------------------------------
 * Recibe las peticiones HTTP del formulario de
 * donaciones y se comunica con el service.
 */

const { ok } = require("../utils/response");
const { DonacionService } = require("../services/donacion.service");

const service = new DonacionService();

/**
 * GET /donaciones
 * Devuelve todas las donaciones registradas (solo admin)
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
 * POST /donaciones
 * Registra una nueva oferta de donación
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
