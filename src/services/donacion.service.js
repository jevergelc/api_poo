/**
 * donacion.service.js
 * --------------------------------------------------
 * Lógica de negocio para ofertas de donación.
 * Valida los datos y delega al repository.
 */

const crypto = require("crypto");
const { HttpError } = require("../utils/httpError");
const { DonacionRepository } = require("../repositories/donacion.repository");

class DonacionService {
  constructor() {
    this.repo = new DonacionRepository();
  }

  /**
   * Obtiene todas las donaciones registradas
   */
  async list() {
    return await this.repo.list();
  }

  /**
   * Busca una donación por id
   */
  async getById(id) {
    const donacion = await this.repo.findById(id);
    if (!donacion) {
      throw new HttpError(404, "NOT_FOUND", "Donación no encontrada");
    }
    return donacion;
  }

  /**
   * Actualiza los datos de una donación existente
   */
  async update(id, dto) {
    const current = await this.repo.findById(id);
    if (!current) {
      throw new HttpError(404, "NOT_FOUND", "Donación no encontrada");
    }
    const changes = {};
    if (dto.nombre              !== undefined) changes.nombre              = String(dto.nombre).trim();
    if (dto.telefono            !== undefined) changes.telefono            = String(dto.telefono).trim();
    if (dto.correo              !== undefined) changes.correo              = String(dto.correo).trim();
    if (dto.tipo_donacion       !== undefined) changes.tipo_donacion       = String(dto.tipo_donacion).trim();
    if (dto.descripcion_especie !== undefined) changes.descripcion_especie = String(dto.descripcion_especie).trim();
    if (dto.monto               !== undefined) changes.monto               = String(dto.monto).trim();
    return await this.repo.update(id, changes);
  }

  /**
   * Elimina una donación
   */
  async remove(id) {
    const deleted = await this.repo.remove(id);
    if (!deleted) {
      throw new HttpError(404, "NOT_FOUND", "Donación no encontrada");
    }
    return { message: "Donación eliminada correctamente" };
  }

  /**
   * Valida y registra una nueva oferta de donación
   */
  async create(dto) {
    const nombre = String(dto.nombre || "").trim();
    const tipo   = String(dto.tipo_donacion || "").trim();

    if (!nombre || !tipo) {
      throw new HttpError(422, "VALIDATION_ERROR", "nombre y tipo_donacion son obligatorios");
    }

    const nueva = {
      id:                crypto.randomUUID(),
      nombre,
      telefono:          String(dto.telefono          || "").trim(),
      correo:            String(dto.correo            || "").trim(),
      tipo_donacion:     tipo,
      descripcion_especie: String(dto.descripcion_especie || "").trim(),
      monto:             String(dto.monto             || "").trim(),
      createdAt:         new Date().toISOString()
    };

    return await this.repo.create(nueva);
  }
}

module.exports = { DonacionService };
