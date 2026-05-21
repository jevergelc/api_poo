/**
 * inscripcion.repository.js
 * --------------------------------------------------
 * Acceso a datos de inscripciones y solicitudes
 * de atención al adulto mayor.
 * Lee y escribe el archivo inscripciones.json.
 */

const path = require("path");
const { readJson, writeJson } = require("../utils/fileDb");

class InscripcionRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/inscripciones.json");
  }

  /**
   * Obtiene todas las inscripciones
   */
  async list() {
    return await readJson(this.filePath);
  }

  /**
   * Guarda una nueva inscripción
   */
  async create(inscripcion) {
    const inscripciones = await this.list();
    inscripciones.push(inscripcion);
    await writeJson(this.filePath, inscripciones);
    return inscripcion;
  }
}

module.exports = { InscripcionRepository };
