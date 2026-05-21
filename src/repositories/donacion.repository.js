/**
 * donacion.repository.js
 * --------------------------------------------------
 * Acceso a datos de ofertas de donación.
 * Lee y escribe el archivo donaciones.json.
 */

const path = require("path");
const { readJson, writeJson } = require("../utils/fileDb");

class DonacionRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/donaciones.json");
  }

  /**
   * Obtiene todas las donaciones registradas
   */
  async list() {
    return await readJson(this.filePath);
  }

  /**
   * Guarda una nueva oferta de donación
   */
  async create(donacion) {
    const donaciones = await this.list();
    donaciones.push(donacion);
    await writeJson(this.filePath, donaciones);
    return donacion;
  }
}

module.exports = { DonacionRepository };
