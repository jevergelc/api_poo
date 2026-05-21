/**
 * contacto.service.js
 * --------------------------------------------------
 * Lógica de negocio para el formulario de contacto.
 * Valida los datos y delega al repository.
 */

const crypto = require("crypto");
const { HttpError } = require("../utils/httpError");
const { ContactoRepository } = require("../repositories/contacto.repository");

class ContactoService {
  constructor() {
    this.repo = new ContactoRepository();
  }

  /**
   * Obtiene todos los mensajes de contacto
   */
  async list() {
    return await this.repo.list();
  }

  /**
   * Valida y registra un nuevo mensaje de contacto
   */
  async create(dto) {
    const nombre  = String(dto.nombre  || "").trim();
    const correo  = String(dto.correo  || "").trim();
    const mensaje = String(dto.mensaje || "").trim();

    if (!nombre || !correo || !mensaje) {
      throw new HttpError(422, "VALIDATION_ERROR", "nombre, correo y mensaje son obligatorios");
    }

    const nuevo = {
      id:        crypto.randomUUID(),
      nombre,
      correo,
      telefono:  String(dto.telefono || "").trim(),
      asunto:    String(dto.asunto   || "").trim(),
      mensaje,
      createdAt: new Date().toISOString()
    };

    return await this.repo.create(nuevo);
  }
}

module.exports = { ContactoService };
