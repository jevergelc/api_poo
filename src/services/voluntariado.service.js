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
