/**
 * voluntariado.repository.js
 * --------------------------------------------------
 * Acceso a datos de solicitudes de voluntariado.
 * Lee y escribe el archivo voluntariados.json.
 */

const path = require("path");
const { readJson, writeJson } = require("../utils/fileDb");

class VoluntariadoRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/voluntariados.json");
  }

  /**
   * Obtiene todas las solicitudes de voluntariado
   */
  async list() {
    return await readJson(this.filePath);
  }

  /**
   * Guarda una nueva solicitud de voluntariado
   */
  async create(voluntariado) {
    const voluntariados = await this.list();
    voluntariados.push(voluntariado);
    await writeJson(this.filePath, voluntariados);
    return voluntariado;
  }
}

module.exports = { VoluntariadoRepository };
