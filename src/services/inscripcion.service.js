/**
 * inscripcion.service.js
 * --------------------------------------------------
 * Lógica de negocio para los formularios de
 * inscripción y solicitud de atención al adulto mayor.
 * Valida los datos y delega al repository.
 */

const crypto = require("crypto");
const { HttpError } = require("../utils/httpError");
const { InscripcionRepository } = require("../repositories/inscripcion.repository");

class InscripcionService {
  constructor() {
    this.repo = new InscripcionRepository();
  }

  /**
   * Obtiene todas las inscripciones
   */
  async list() {
    return await this.repo.list();
  }

  /**
   * Valida y registra una nueva inscripción.
   * El campo tipo indica si es 'inscripcion' o 'atencion'.
   */
  async create(dto) {
    const tipo = String(dto.tipo || "inscripcion").trim();

    if (tipo === "inscripcion") {
      const nombre = String(dto.nombre || "").trim();
      const telefono = String(dto.telefono || "").trim();

      if (!nombre || !telefono) {
        throw new HttpError(422, "VALIDATION_ERROR", "nombre y telefono son obligatorios");
      }

      const nueva = {
        id:          crypto.randomUUID(),
        tipo,
        nombre,
        documento:   String(dto.documento   || "").trim(),
        nacimiento:  String(dto.nacimiento  || "").trim(),
        genero:      String(dto.genero      || "").trim(),
        telefono,
        correo:      String(dto.correo      || "").trim(),
        direccion:   String(dto.direccion   || "").trim(),
        programas:   Array.isArray(dto.programas) ? dto.programas : [],
        salud:       String(dto.salud       || "").trim(),
        acompanante: String(dto.acompanante || "").trim(),
        createdAt:   new Date().toISOString()
      };

      return await this.repo.create(nueva);
    }

    if (tipo === "atencion") {
      const nombre_mayor = String(dto.nombre_mayor || "").trim();
      const cuidador     = String(dto.cuidador     || "").trim();
      const telefono     = String(dto.telefono     || "").trim();

      if (!nombre_mayor || !cuidador || !telefono) {
        throw new HttpError(422, "VALIDATION_ERROR", "nombre_mayor, cuidador y telefono son obligatorios");
      }

      const nueva = {
        id:             crypto.randomUUID(),
        tipo,
        nombre_mayor,
        edad:           String(dto.edad            || "").trim(),
        documento_mayor:String(dto.documento_mayor || "").trim(),
        genero_mayor:   String(dto.genero_mayor    || "").trim(),
        movilidad:      String(dto.movilidad       || "").trim(),
        direccion:      String(dto.direccion       || "").trim(),
        salud:          String(dto.salud           || "").trim(),
        cuidador,
        parentesco:     String(dto.parentesco      || "").trim(),
        telefono,
        correo:         String(dto.correo          || "").trim(),
        atencion_tipo:  Array.isArray(dto.atencion_tipo) ? dto.atencion_tipo : [],
        observaciones:  String(dto.observaciones   || "").trim(),
        createdAt:      new Date().toISOString()
      };

      return await this.repo.create(nueva);
    }

    throw new HttpError(422, "VALIDATION_ERROR", "tipo debe ser 'inscripcion' o 'atencion'");
  }
}

module.exports = { InscripcionService };
