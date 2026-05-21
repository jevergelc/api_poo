/**
 * contacto.repository.js
 * --------------------------------------------------
 * Acceso a datos del formulario de contacto.
 * Lee y escribe el archivo contactos.json.
 */

const path = require("path");
const { readJson, writeJson } = require("../utils/fileDb");

class ContactoRepository {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/contactos.json");
  }

  /**
   * Obtiene todos los mensajes de contacto
   */
  async list() {
    return await readJson(this.filePath);
  }

  /**
   * Guarda un nuevo mensaje de contacto
   */
  async create(contacto) {
    const contactos = await this.list();
    contactos.push(contacto);
    await writeJson(this.filePath, contactos);
    return contacto;
  }
}

module.exports = { ContactoRepository };
