/**
 * historias.controller.js
 * --------------------------------------------------
 * Este controller recibe la petición HTTP
 * y se comunica con el service.
 */

const { ok } = require("../utils/response");
const { HistoriasService } = require("../services/historias.service");

// Creamos una instancia del service
const service = new HistoriasService();

/**
 * Método GET /historias
 * Devuelve la lista de historias
 */
async function list(req, res, next) {
  try {
    // Llamamos al service
    const result = await service.list();

    // Respondemos al cliente
    return ok(res, 200, result);
  } catch (error) {
    // En caso de error lo enviamos al middleware
    next(error);
  }
}

/**
 * Método GET /historias/:id
 * Devuelve una historia por id
 */
async function getById(req, res, next) {
  try {
    // Llamamos al service
    const result = await service.getById(req.params.id);

    // Respondemos al cliente
    return ok(res, 200, result);
  } catch (error) {
    // En caso de error lo enviamos al middleware
    next(error);
  }
}

/**
 * Método POST /historias
 * Crea una nueva historia
 */
async function create(req, res, next) {
  try {
    // Llamamos al service con los datos del body
    const result = await service.create(req.body);

    // Respondemos al cliente
    return ok(res, 201, result);
  } catch (error) {
    // En caso de error lo enviamos al middleware
    next(error);
  }
}

/**
 * Método PATCH /historias/:id
 * Actualiza una historia existente
 */
async function update(req, res, next) {
  try {
    // Llamamos al service con id y body
    const result = await service.update(req.params.id, req.body);

    // Respondemos al cliente
    return ok(res, 200, result);
  } catch (error) {
    // En caso de error lo enviamos al middleware
    next(error);
  }
}

/**
 * Método DELETE /historias/:id
 * Elimina una historia
 */
async function remove(req, res, next) {
  try {
    // Llamamos al service para eliminar
    const result = await service.remove(req.params.id);

    // Respondemos al cliente
    return ok(res, 200, result);
  } catch (error) {
    // En caso de error lo enviamos al middleware
    next(error);
  }
}

// Exportamos los métodos
module.exports = {
  list,
  getById,
  create,
  update,
  remove
};