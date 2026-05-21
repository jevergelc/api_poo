/**
 * voluntariado.service.js
 * --------------------------------------------------
 * Lógica de negocio para solicitudes de voluntariado.
 * Valida los datos y delega al repository.
 */

const crypto = require("crypto");
const { HttpError } = require("../utils/httpError");
const { VoluntariadoRepository } = require("../repositories/voluntariado.repository");

class VoluntariadoService {
  constructor() {
    this.repo = new VoluntariadoRepository();
  }

  /**
   * Obtiene todas las solicitudes de voluntariado
   */
  async list() {
    return await this.repo.list();
  }

  /**
   * Busca una solicitud de voluntariado por id
   */
  async getById(id) {
    const voluntariado = await this.repo.findById(id);
    if (!voluntariado) {
      throw new HttpError(404, "NOT_FOUND", "Solicitud de voluntariado no encontrada");
    }
    return voluntariado;
  }

  /**
   * Actualiza los datos de una solicitud de voluntariado existente
   */
  async update(id, dto) {
    const current = await this.repo.findById(id);
    if (!current) {
      throw new HttpError(404, "NOT_FOUND", "Solicitud de voluntariado no encontrada");
    }
    const changes = {};
    if (dto.nombre   !== undefined) changes.nombre   = String(dto.nombre).trim();
    if (dto.edad     !== undefined) changes.edad     = String(dto.edad).trim();
    if (dto.telefono !== undefined) changes.telefono = String(dto.telefono).trim();
    if (dto.correo   !== undefined) changes.correo   = String(dto.correo).trim();
    return await this.repo.update(id, changes);
  }

  /**
   * Elimina una solicitud de voluntariado
   */
  async remove(id) {
    const deleted = await this.repo.remove(id);
    if (!deleted) {
      throw new HttpError(404, "NOT_FOUND", "Solicitud de voluntariado no encontrada");
    }
    return { message: "Solicitud de voluntariado eliminada correctamente" };
  }

  /**
   * Valida y registra una nueva solicitud de voluntariado
   */
  async create(dto) {
    const nombre   = String(dto.nombre   || "").trim();
    const telefono = String(dto.telefono || "").trim();
    const correo   = String(dto.correo   || "").trim();

    if (!nombre || !telefono) {
      throw new HttpError(422, "VALIDATION_ERROR", "nombre y telefono son obligatorios");
    }

    const nuevo = {
      id:        crypto.randomUUID(),
      nombre,
      edad:      String(dto.edad  || "").trim(),
      telefono,
      correo,
      createdAt: new Date().toISOString()
    };

    return await this.repo.create(nuevo);
  }
}

module.exports = { VoluntariadoService };
