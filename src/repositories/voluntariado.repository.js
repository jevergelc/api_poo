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

  /**
   * Busca una solicitud de voluntariado por su id
   */
  async findById(id) {
    const voluntariados = await this.list();
    return voluntariados.find(item => item.id === id) || null;
  }

  /**
   * Actualiza una solicitud de voluntariado existente
   */
  async update(id, changes) {
    const voluntariados = await this.list();
    const index = voluntariados.findIndex(item => item.id === id);
    if (index === -1) return null;
    voluntariados[index] = { ...voluntariados[index], ...changes, updatedAt: new Date().toISOString() };
    await writeJson(this.filePath, voluntariados);
    return voluntariados[index];
  }

  /**
   * Elimina una solicitud de voluntariado por su id
   */
  async remove(id) {
    const voluntariados = await this.list();
    const voluntariado = voluntariados.find(item => item.id === id);
    if (!voluntariado) return null;
    await writeJson(this.filePath, voluntariados.filter(item => item.id !== id));
    return voluntariado;
  }
}

module.exports = { VoluntariadoRepository };
