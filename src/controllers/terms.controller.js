/**
 * terms.controller.js
 * ----------------------------------------
 * Este controller recibe la petición HTTP
 * y se comunica con el service.
 */

const { ok } = require("../utils/response");
const { TermsService } = require("../services/terms.service");

// Creamos una instancia del service
const service = new TermsService();

/**
 * Método POST /terms
 * No recibe datos, solo devuelve los términos
 */
async function getTerms(req, res, next) {
  try {
    // Llamamos al service
    const result = await service.getTerms();

    // Respondemos al cliente
    return ok(res, 200, result);

  } catch (error) {
    // En caso de error lo enviamos al middleware
    next(error);
  }
}

// Exportamos el método
module.exports = {
  getTerms
};