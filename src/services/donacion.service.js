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
