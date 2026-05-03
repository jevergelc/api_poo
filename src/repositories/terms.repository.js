/**
 * terms.repository.js
 * ----------------------------------------
 * Este archivo se encarga de acceder a los datos.
 * En este caso, lee un archivo JSON desde la carpeta data.
 */

const path = require("path");
const { readJson } = require("../utils/fileDb");

class TermsRepository {

  constructor() {
    // Ruta al archivo JSON donde están los términos
    this.filePath = path.join(__dirname, "../../data/terms.json");
  }

  /**
   * Método principal
   * Lee el archivo terms.json y devuelve su contenido
   */
  async getTerms() {
    // Leer el archivo JSON
    const data = await readJson(this.filePath);

    return data;
  }
}

module.exports = { TermsRepository };