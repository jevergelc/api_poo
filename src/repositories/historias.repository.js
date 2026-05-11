/**
 * historias.repository.js
 * --------------------------------------------------
 * Este archivo se encarga de acceder a los datos.
 * En este caso, lee y escribe un archivo JSON
 * desde la carpeta data.
 */

const path = require("path");
const { readJson, writeJson } = require("../utils/fileDb");

class HistoriasRepository {
  constructor() {
    // Ruta al archivo JSON donde se guardan las historias
    this.filePath = path.join(__dirname, "../../data/historias.json");
  }

  /**
   * Método list
   * Obtiene todas las historias guardadas
   */
  async list() {
    const data = await readJson(this.filePath);
    return data;
  }

  /**
   * Método findById
   * Busca una historia por su id
   */
  async findById(id) {
    const historias = await this.list();
    return historias.find(item => item.id === id) || null;
  }

  /**
   * Método create
   * Guarda una nueva historia en el archivo JSON
   */
  async create(historia) {
    const historias = await this.list();
    historias.push(historia);

    await writeJson(this.filePath, historias);

    return historia;
  }

  /**
   * Método update
   * Actualiza una historia existente
   */
  async update(id, changes) {
    const historias = await this.list();

    const index = historias.findIndex(item => item.id === id);

    if (index === -1) {
      return null;
    }

    historias[index] = {
      ...historias[index],
      ...changes,
      updatedAt: new Date().toISOString()
    };

    await writeJson(this.filePath, historias);

    return historias[index];
  }

  /**
   * Método remove
   * Elimina una historia por su id
   */
  async remove(id) {
    const historias = await this.list();

    const historia = historias.find(item => item.id === id);

    if (!historia) {
      return null;
    }

    const nuevasHistorias = historias.filter(item => item.id !== id);

    await writeJson(this.filePath, nuevasHistorias);

    return historia;
  }
}

module.exports = { HistoriasRepository };