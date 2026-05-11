/**
 * historias.service.js
 * --------------------------------------------------
 * Este archivo contiene la lógica del sistema.
 * Se encarga de obtener y validar la información
 * de historias antes de enviarla o guardarla.
 */

const crypto = require("crypto");
const { HttpError } = require("../utils/httpError");
const { HistoriasRepository } = require("../repositories/historias.repository");

class HistoriasService {
  constructor() {
    // Creamos una instancia del repository
    this.historiasRepo = new HistoriasRepository();
  }

  /**
   * Método list
   * Obtiene todas las historias
   */
  async list() {
    const historias = await this.historiasRepo.list();
    return historias;
  }

  /**
   * Método getById
   * Busca una historia por id
   */
  async getById(id) {
    const historia = await this.historiasRepo.findById(id);

    if (!historia) {
      throw new HttpError(404, "NOT_FOUND", "Historia no encontrada");
    }

    return historia;
  }

  /**
   * Método create
   * Valida y registra una nueva historia
   */
  async create(dto) {
    const titulo = String(dto.titulo || "").trim();
    const autor = String(dto.autor || "").trim();
    const contenido = String(dto.contenido || "").trim();
    const imagen = String(dto.imagen || "").trim();

    if (!titulo || !autor || !contenido) {
      throw new HttpError(
        422,
        "VALIDATION_ERROR",
        "titulo, autor y contenido son obligatorios"
      );
    }

    const nuevaHistoria = {
      id: crypto.randomUUID(),
      titulo,
      autor,
      contenido,
      imagen,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: null
    };

    const result = await this.historiasRepo.create(nuevaHistoria);

    return result;
  }

  /**
   * Método update
   * Actualiza los datos de una historia existente
   */
  async update(id, dto) {
    const current = await this.historiasRepo.findById(id);

    if (!current) {
      throw new HttpError(404, "NOT_FOUND", "Historia no encontrada");
    }

    const changes = {};

    if (dto.titulo !== undefined) {
      changes.titulo = String(dto.titulo).trim();
    }

    if (dto.autor !== undefined) {
      changes.autor = String(dto.autor).trim();
    }

    if (dto.contenido !== undefined) {
      changes.contenido = String(dto.contenido).trim();
    }

    if (dto.imagen !== undefined) {
      changes.imagen = String(dto.imagen).trim();
    }

    if (dto.active !== undefined) {
      changes.active = Boolean(dto.active);
    }

    const result = await this.historiasRepo.update(id, changes);

    return result;
  }

  /**
   * Método remove
   * Elimina una historia del sistema
   */
  async remove(id) {
    const deleted = await this.historiasRepo.remove(id);

    if (!deleted) {
      throw new HttpError(404, "NOT_FOUND", "Historia no encontrada");
    }

    return {
      message: "Historia eliminada correctamente"
    };
  }
}

module.exports = { HistoriasService };