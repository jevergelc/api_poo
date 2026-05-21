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
    this._inyectarModalLogin();
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

    if (user.role === 'admin' && !window.location.pathname.endsWith('admin.html')) {
      window.location.href = 'admin.html';
    }

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
   * Devuelve true si la página actual es el panel de administración.
   */
  _enPanelAdmin() {
    return window.location.pathname.endsWith('admin.html');
  }

  /**
   * Agrega el ítem de sesión al final del menú de navegación.
   */
  _inyectarBotonSesion() {
    const menu = document.getElementById('navMenu');
    if (!menu) return;

    const item = document.createElement('li');
    item.className = 'nav-item nav-item--sesion';
    item.id        = 'itemSesion';
    const cta = menu.querySelector('.nav-item--cta');
    if (cta) menu.insertBefore(item, cta);
    else     menu.appendChild(item);

    this._actualizarBotonSesion();
  }

  /**
   * Actualiza el contenido del botón según el estado actual de la sesión.
   * Admin en páginas públicas: solo muestra "Salir" (sin link al panel).
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
    document.addEventListener('click', (e) => {
      const id = e.target.closest('[id]')?.id || e.target.id;
      if (id === 'loginCerrar' || id === 'btnCancelarLogin') this._cerrarModalLogin();
      if (e.target.id === 'loginModal') this._cerrarModalLogin();
    });

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
   * Crea e inyecta el HTML del modal de login si aún no existe en el DOM.
   */
  _inyectarModalLogin() {
    if (document.getElementById('loginModal')) return;
    const modal = document.createElement('div');
    modal.id        = 'loginModal';
    modal.className = 'modal-overlay';
    modal.setAttribute('style',       'display:none;');
    modal.setAttribute('role',        'dialog');
    modal.setAttribute('aria-modal',  'true');
    modal.setAttribute('aria-labelledby', 'loginTitulo');
    modal.innerHTML = `
      <div class="modal-caja">
        <button class="modal-cerrar" id="loginCerrar" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-encabezado">
          <i class="fa-solid fa-lock"></i>
          <h2 id="loginTitulo">Iniciar Sesión</h2>
          <p>Ingresa con tu cuenta de administrador</p>
        </div>
        <form id="loginForm" novalidate>
          <div class="modal-campo">
            <label for="loginCorreo">Correo electrónico</label>
            <input id="loginCorreo" type="email" placeholder="admin@mail.com" required />
          </div>
          <div class="modal-campo">
            <label for="loginContrasena">Contraseña</label>
            <input id="loginContrasena" type="password" placeholder="••••••••" required />
          </div>
          <p class="modal-estado" id="loginEstado"></p>
          <div class="modal-acciones">
            <button type="submit" class="modal-btn-principal">
              <i class="fa-solid fa-right-to-bracket"></i> Ingresar
            </button>
            <button type="button" id="btnCancelarLogin" class="modal-btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(modal);
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
