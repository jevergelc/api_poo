/**
 * terms.service.js
 * ----------------------------------------
 * Este archivo contiene la lógica del sistema.
 * Se encarga de obtener los términos desde el repository
 * y decidir qué devolver al cliente.
 */

const { TermsRepository } = require("../repositories/terms.repository");

class TermsService {

  constructor() {
    // Creamos una instancia del repository
    this.termsRepo = new TermsRepository();
  }

  /**
   * Método principal
   * Obtiene los términos y devuelve el mensaje
   */
  async getTerms() {
    // Obtener datos desde el repository
    const data = await this.termsRepo.getTerms();

    // Retornar solo el mensaje
    return data.message;
  }
}

module.exports = { TermsService };