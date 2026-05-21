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

  /**
   * Busca una donación por su id
   */
  async findById(id) {
    const donaciones = await this.list();
    return donaciones.find(item => item.id === id) || null;
  }

  /**
   * Actualiza una donación existente
   */
  async update(id, changes) {
    const donaciones = await this.list();
    const index = donaciones.findIndex(item => item.id === id);
    if (index === -1) return null;
    donaciones[index] = { ...donaciones[index], ...changes, updatedAt: new Date().toISOString() };
    await writeJson(this.filePath, donaciones);
    return donaciones[index];
  }

  /**
   * Elimina una donación por su id
   */
  async remove(id) {
    const donaciones = await this.list();
    const donacion = donaciones.find(item => item.id === id);
    if (!donacion) return null;
    await writeJson(this.filePath, donaciones.filter(item => item.id !== id));
    return donacion;
  }
}

module.exports = { DonacionRepository };
