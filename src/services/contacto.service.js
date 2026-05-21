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
   * Busca un mensaje de contacto por id
   */
  async getById(id) {
    const contacto = await this.repo.findById(id);
    if (!contacto) {
      throw new HttpError(404, "NOT_FOUND", "Mensaje de contacto no encontrado");
    }
    return contacto;
  }

  /**
   * Actualiza los datos de un mensaje de contacto existente
   */
  async update(id, dto) {
    const current = await this.repo.findById(id);
    if (!current) {
      throw new HttpError(404, "NOT_FOUND", "Mensaje de contacto no encontrado");
    }
    const changes = {};
    if (dto.nombre  !== undefined) changes.nombre  = String(dto.nombre).trim();
    if (dto.correo  !== undefined) changes.correo  = String(dto.correo).trim();
    if (dto.telefono !== undefined) changes.telefono = String(dto.telefono).trim();
    if (dto.asunto  !== undefined) changes.asunto  = String(dto.asunto).trim();
    if (dto.mensaje !== undefined) changes.mensaje = String(dto.mensaje).trim();
    return await this.repo.update(id, changes);
  }

  /**
   * Elimina un mensaje de contacto
   */
  async remove(id) {
    const deleted = await this.repo.remove(id);
    if (!deleted) {
      throw new HttpError(404, "NOT_FOUND", "Mensaje de contacto no encontrado");
    }
    return { message: "Mensaje de contacto eliminado correctamente" };
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
