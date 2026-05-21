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

  /**
   * Busca un mensaje de contacto por su id
   */
  async findById(id) {
    const contactos = await this.list();
    return contactos.find(item => item.id === id) || null;
  }

  /**
   * Actualiza un mensaje de contacto existente
   */
  async update(id, changes) {
    const contactos = await this.list();
    const index = contactos.findIndex(item => item.id === id);
    if (index === -1) return null;
    contactos[index] = { ...contactos[index], ...changes, updatedAt: new Date().toISOString() };
    await writeJson(this.filePath, contactos);
    return contactos[index];
  }

  /**
   * Elimina un mensaje de contacto por su id
   */
  async remove(id) {
    const contactos = await this.list();
    const contacto = contactos.find(item => item.id === id);
    if (!contacto) return null;
    await writeJson(this.filePath, contactos.filter(item => item.id !== id));
    return contacto;
  }
}

module.exports = { ContactoRepository };
