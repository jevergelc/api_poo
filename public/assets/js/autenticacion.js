/**
 * autenticacion.js
 * ============================================================
 * GESTOR DE SESIÓN DE USUARIO
 * ============================================================
 * Maneja login/logout y inyecta el botón de sesión
 * en la barra de navegación de forma dinámica.
 */
class GestorAutenticacion {
  /**
   * @param {ApiCliente} apiCliente       - Instancia del cliente HTTP
   * @param {Function}   alCambiarSesion  - Callback al cambiar estado de sesión
   */
  constructor(apiCliente, alCambiarSesion = null) {
    this.api            = apiCliente;
    this.alCambiarSesion = alCambiarSesion;
    this._inyectarBotonSesion();
    this._escucharFormularioLogin();
  }

  /* ============================================================
     ESTADO DE SESIÓN
  ============================================================ */

  /**
   * Indica si hay una sesión activa en localStorage.
   * @returns {boolean}
   */
  estaAutenticado() {
    return !!localStorage.getItem('apiKey');
  }

  /**
   * Indica si el usuario autenticado tiene rol admin.
   * @returns {boolean}
   */
  esAdmin() {
    return localStorage.getItem('rol') === 'admin';
  }

  /**
   * Devuelve el nombre del usuario autenticado.
   * @returns {string|null}
   */
  obtenerNombre() {
    return localStorage.getItem('nombre');
  }

  /* ============================================================
     INICIO Y CIERRE DE SESIÓN
  ============================================================ */

  /**
   * Envía las credenciales a la API y guarda la sesión en localStorage.
   * @param {string} correo
   * @param {string} contrasena
   */
  async iniciarSesion(correo, contrasena) {
    const respuesta       = await this.api.iniciarSesion(correo, contrasena);
    const { apiKey, user } = respuesta.data;

    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('rol',    user.role);
    localStorage.setItem('nombre', user.name);

    this._actualizarBotonSesion();
    if (this.alCambiarSesion) this.alCambiarSesion();
    return respuesta;
  }

  /**
   * Llama a la API para cerrar sesión y limpia el localStorage.
   */
  async cerrarSesion() {
    try {
      await this.api.cerrarSesion();
    } catch (_) {
      /* Continúa aunque la API falle: limpiar sesión local de todas formas */
    }
    localStorage.removeItem('apiKey');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');

    this._actualizarBotonSesion();
    if (this.alCambiarSesion) this.alCambiarSesion();
  }

  /* ============================================================
     INYECCIÓN DINÁMICA EN EL NAVBAR
  ============================================================ */

  /**
   * Agrega el ítem de sesión al final del menú de navegación.
   */
  _inyectarBotonSesion() {
    const menu = document.getElementById('navMenu');
    if (!menu) return;

    const item = document.createElement('li');
    item.className = 'nav-item nav-item--sesion';
    item.id        = 'itemSesion';
    menu.appendChild(item);

    this._actualizarBotonSesion();
  }

  /**
   * Actualiza el contenido del botón según el estado actual de la sesión.
   */
  _actualizarBotonSesion() {
    const item = document.getElementById('itemSesion');
    if (!item) return;

    if (this.estaAutenticado()) {
      const nombre = this.obtenerNombre() || 'Admin';
      item.innerHTML = `
        <a href="#" id="btnCerrarSesion" class="nav-sesion-salir">
          <i class="fa-solid fa-right-from-bracket"></i> Salir (${nombre})
        </a>`;
      document.getElementById('btnCerrarSesion')
        .addEventListener('click', async (e) => {
          e.preventDefault();
          await this.cerrarSesion();
        });
    } else {
      item.innerHTML = `
        <a href="#" id="btnAbrirLogin" class="nav-sesion-entrar">
          <i class="fa-solid fa-right-to-bracket"></i> Ingresar
        </a>`;
      document.getElementById('btnAbrirLogin')
        .addEventListener('click', (e) => {
          e.preventDefault();
          this._abrirModalLogin();
        });
    }
  }

  /* ============================================================
     MODAL DE INICIO DE SESIÓN
  ============================================================ */

  /**
   * Escucha el envío del formulario de login dentro del modal.
   */
  _escucharFormularioLogin() {
    document.addEventListener('submit', async (e) => {
      if (e.target.id !== 'loginForm') return;
      e.preventDefault();

      const correo    = document.getElementById('loginCorreo').value.trim();
      const contrasena = document.getElementById('loginContrasena').value;
      const estado    = document.getElementById('loginEstado');

      estado.textContent = '';
      estado.className   = 'modal-estado';

      try {
        await this.iniciarSesion(correo, contrasena);
        this._cerrarModalLogin();
      } catch (err) {
        estado.textContent = `⚠ ${err.message}`;
        estado.className   = 'modal-estado modal-estado--error';
      }
    });
  }

  /**
   * Abre el modal de inicio de sesión.
   */
  _abrirModalLogin() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('abierto'));
  }

  /**
   * Cierra el modal de inicio de sesión.
   */
  _cerrarModalLogin() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.classList.remove('abierto');
    setTimeout(() => (modal.style.display = 'none'), 280);
  }
}
