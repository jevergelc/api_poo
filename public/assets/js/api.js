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
}
