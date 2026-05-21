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

  /**
   * Busca una inscripción por su id
   */
  async findById(id) {
    const inscripciones = await this.list();
    return inscripciones.find(item => item.id === id) || null;
  }

  /**
   * Actualiza una inscripción existente
   */
  async update(id, changes) {
    const inscripciones = await this.list();
    const index = inscripciones.findIndex(item => item.id === id);
    if (index === -1) return null;
    inscripciones[index] = { ...inscripciones[index], ...changes, updatedAt: new Date().toISOString() };
    await writeJson(this.filePath, inscripciones);
    return inscripciones[index];
  }

  /**
   * Elimina una inscripción por su id
   */
  async remove(id) {
    const inscripciones = await this.list();
    const inscripcion = inscripciones.find(item => item.id === id);
    if (!inscripcion) return null;
    await writeJson(this.filePath, inscripciones.filter(item => item.id !== id));
    return inscripcion;
  }
}

module.exports = { InscripcionRepository };
