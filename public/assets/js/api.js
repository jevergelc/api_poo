/**
 * api.js
 * ============================================================
 * CLIENTE HTTP PARA LA API REST
 * ============================================================
 * Encapsula todas las peticiones fetch hacia /api/v1
 * usando la clase ApiCliente con métodos async/await.
 */
class ApiCliente {
  constructor() {
    this.baseUrl = '/api/v1';
  }

  /**
   * Construye las cabeceras HTTP de la petición.
   * @param {boolean} conApiKey - Si debe incluir el header x-api-key
   * @returns {Object} Cabeceras HTTP
   */
  _cabeceras(conApiKey = false) {
    const cabeceras = { 'Content-Type': 'application/json' };
    if (conApiKey) {
      const apiKey = localStorage.getItem('apiKey');
      if (apiKey) cabeceras['x-api-key'] = apiKey;
    }
    return cabeceras;
  }

  /**
   * Realiza una petición HTTP genérica.
   * @param {string} metodo   - GET | POST | PATCH | DELETE
   * @param {string} ruta     - Ruta relativa al base URL
   * @param {Object} cuerpo   - Cuerpo JSON de la petición (opcional)
   * @param {boolean} conApiKey - Si debe incluir la apiKey en cabeceras
   * @returns {Promise<Object>} Respuesta JSON de la API
   */
  async _peticion(metodo, ruta, cuerpo = null, conApiKey = false) {
    const opciones = {
      method: metodo,
      headers: this._cabeceras(conApiKey),
    };
    if (cuerpo) opciones.body = JSON.stringify(cuerpo);

    const respuesta = await fetch(`${this.baseUrl}${ruta}`, opciones);
    const datos = await respuesta.json();

    if (!respuesta.ok) throw new Error(datos.message || 'Error en la petición');
    return datos;
  }

  /* ============================================================
     AUTENTICACIÓN
  ============================================================ */

  /**
   * Inicia sesión con correo y contraseña.
   * @param {string} correo
   * @param {string} contrasena
   */
  async iniciarSesion(correo, contrasena) {
    return this._peticion('POST', '/auth/login', { email: correo, password: contrasena });
  }

  /**
   * Cierra la sesión activa del usuario autenticado.
   */
  async cerrarSesion() {
    return this._peticion('POST', '/auth/logout', null, true);
  }

  /* ============================================================
     HISTORIAS
  ============================================================ */

  /**
   * Obtiene todas las historias activas.
   */
  async obtenerHistorias() {
    return this._peticion('GET', '/historias');
  }

  /**
   * Crea una nueva historia. Requiere rol admin.
   * @param {Object} datos - { titulo, autor, contenido, imagen }
   */
  async crearHistoria(datos) {
    return this._peticion('POST', '/historias', datos, true);
  }

  /**
   * Actualiza una historia existente. Requiere rol admin.
   * @param {string} id   - ID de la historia a actualizar
   * @param {Object} datos - Campos a modificar
   */
  async actualizarHistoria(id, datos) {
    return this._peticion('PATCH', `/historias/${id}`, datos, true);
  }

  /**
   * Elimina una historia. Requiere rol admin.
   * @param {string} id - ID de la historia a eliminar
   */
  async eliminarHistoria(id) {
    return this._peticion('DELETE', `/historias/${id}`, null, true);
  }

  /* ============================================================
     FORMULARIOS PÚBLICOS
  ============================================================ */

  /**
   * Envía un mensaje de contacto (público).
   * @param {Object} datos - { nombre, correo, telefono, asunto, mensaje }
   */
  async enviarContacto(datos) {
    return this._peticion('POST', '/contacto', datos);
  }

  /**
   * Registra una inscripción o solicitud de atención (público).
   * @param {Object} datos - Incluye campo tipo: 'inscripcion' | 'atencion'
   */
  async crearInscripcion(datos) {
    return this._peticion('POST', '/inscripciones', datos);
  }

  /**
   * Registra una solicitud de voluntariado (público).
   * @param {Object} datos - { nombre, edad, telefono, correo }
   */
  async crearVoluntariado(datos) {
    return this._peticion('POST', '/voluntariados', datos);
  }

  /**
   * Registra una oferta de donación (público).
   * @param {Object} datos - { nombre, telefono, correo, tipo_donacion, ... }
   */
  async crearDonacion(datos) {
    return this._peticion('POST', '/donaciones', datos);
  }

  /* ============================================================
     CONSULTAS DE ADMINISTRADOR
  ============================================================ */

  /**
   * Obtiene todos los mensajes de contacto. Requiere rol admin.
   */
  async listarContactos() {
    return this._peticion('GET', '/contacto', null, true);
  }

  /**
   * Obtiene todas las inscripciones. Requiere rol admin.
   */
  async listarInscripciones() {
    return this._peticion('GET', '/inscripciones', null, true);
  }

  /**
   * Obtiene todas las solicitudes de voluntariado. Requiere rol admin.
   */
  async listarVoluntariados() {
    return this._peticion('GET', '/voluntariados', null, true);
  }

  /**
   * Obtiene todas las donaciones registradas. Requiere rol admin.
   */
  async listarDonaciones() {
    return this._peticion('GET', '/donaciones', null, true);
  }
}
