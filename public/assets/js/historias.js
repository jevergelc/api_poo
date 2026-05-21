/**
 * historias.js
 * ============================================================
 * GESTOR DE HISTORIAS
 * ============================================================
 * Carga las historias desde la API y, si el usuario es admin,
 * habilita las opciones de crear, editar y eliminar.
 */
class GestorHistorias {
  /**
   * @param {ApiCliente}          apiCliente    - Instancia del cliente HTTP
   * @param {GestorAutenticacion} autenticacion - Instancia del gestor de sesión
   */
  constructor(apiCliente, autenticacion) {
    this.api            = apiCliente;
    this.auth           = autenticacion;
    this.historiaActual = null; // ID de la historia en edición (null = crear)
    this._escucharModales();
  }

  /* ============================================================
     CARGA INICIAL
  ============================================================ */

  /**
   * Carga todas las historias desde la API y las renderiza en el grid.
   */
  async cargarHistorias() {
    const grid = document.getElementById('historiasGrid');
    grid.innerHTML = `
      <div class="hist-estado hist-estado--cargando">
        <i class="fa-solid fa-spinner fa-spin"></i> Cargando historias...
      </div>`;

    try {
      const respuesta = await this.api.obtenerHistorias();
      const historias = respuesta.data;

      if (!historias.length) {
        grid.innerHTML = `
          <div class="hist-estado">
            <i class="fa-solid fa-book-open"></i> No hay historias disponibles.
          </div>`;
        return;
      }

      grid.innerHTML = historias.map(h => this._plantillaTarjeta(h)).join('');
      this._escucharTarjetas();
      this._animarTarjetas();
    } catch (err) {
      grid.innerHTML = `
        <div class="hist-estado hist-estado--error">
          <i class="fa-solid fa-triangle-exclamation"></i> Error al cargar historias: ${err.message}
        </div>`;
    }

    this._actualizarBarraAdmin();
  }

  /* ============================================================
     RENDERIZADO DE TARJETAS
  ============================================================ */

  /**
   * Genera el HTML de una tarjeta de historia.
   * @param {Object} historia - Datos de la historia
   * @returns {string} HTML de la tarjeta
   */
  _plantillaTarjeta(historia) {
    const botonesAdmin = this.auth.esAdmin() ? `
      <div class="hist-card__admin">
        <button class="hist-card__btn hist-card__btn--editar" data-id="${historia.id}">
          <i class="fa-solid fa-pen"></i> Editar
        </button>
        <button class="hist-card__btn hist-card__btn--eliminar" data-id="${historia.id}">
          <i class="fa-solid fa-trash"></i> Eliminar
        </button>
      </div>` : '';

    const fecha = historia.createdAt
      ? new Date(historia.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
      : '';

    return `
      <article class="historia-card" data-id="${historia.id}">
        <div class="historia-card__photo">
          <img src="${historia.imagen}" alt="${historia.titulo}" loading="lazy" />
          <div class="historia-card__photo-overlay">
            <h3 class="historia-card__name">${historia.titulo}</h3>
            <span class="historia-card__age">
              <i class="fa-solid fa-pen-nib"></i> ${historia.autor}
            </span>
          </div>
        </div>
        <div class="historia-card__body">
          <p class="historia-card__text">${historia.contenido}</p>
        </div>
        <div class="historia-card__consejo">
          <p class="historia-card__consejo-label">
            <i class="fa-solid fa-calendar-days"></i> ${fecha}
          </p>
          ${botonesAdmin}
        </div>
      </article>`;
  }

  /**
   * Vincula eventos de editar/eliminar en las tarjetas renderizadas.
   */
  _escucharTarjetas() {
    document.querySelectorAll('.hist-card__btn--editar').forEach(btn => {
      btn.addEventListener('click', () => this._abrirModalEditar(btn.dataset.id));
    });
    document.querySelectorAll('.hist-card__btn--eliminar').forEach(btn => {
      btn.addEventListener('click', () => this._pedirConfirmacionEliminar(btn.dataset.id));
    });
  }

  /**
   * Aplica la animación de entrada a las tarjetas recién renderizadas.
   */
  _animarTarjetas() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const tarjeta = entry.target;
          const demora = (Array.from(tarjeta.parentElement.children).indexOf(tarjeta) % 3) * 120;
          setTimeout(() => tarjeta.classList.add('hc-visible'), demora);
          observer.unobserve(tarjeta);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.historia-card').forEach(c => observer.observe(c));
  }

  /**
   * Muestra u oculta la barra de controles de administrador.
   */
  _actualizarBarraAdmin() {
    const barra = document.getElementById('barraAdmin');
    if (barra) barra.style.display = this.auth.esAdmin() ? 'flex' : 'none';
  }

  /* ============================================================
     CREAR HISTORIA
  ============================================================ */

  /**
   * Abre el modal en modo creación (sin historia preseleccionada).
   */
  abrirModalCrear() {
    this.historiaActual = null;
    this._limpiarFormularioHistoria();
    document.getElementById('historiaModalTitulo').textContent = 'Nueva Historia';
    this._abrirModalHistoria();
  }

  /* ============================================================
     EDITAR HISTORIA
  ============================================================ */

  /**
   * Carga los datos de la historia en el modal para su edición.
   * @param {string} id - ID de la historia a editar
   */
  async _abrirModalEditar(id) {
    try {
      const respuesta = await this.api.obtenerHistorias();
      const historia  = respuesta.data.find(h => h.id === id);
      if (!historia) return;

      this.historiaActual = id;
      document.getElementById('historiaModalTitulo').textContent = 'Editar Historia';
      document.getElementById('campTitulo').value    = historia.titulo;
      document.getElementById('campAutor').value     = historia.autor;
      document.getElementById('campContenido').value = historia.contenido;
      document.getElementById('campImagen').value    = historia.imagen;
      this._abrirModalHistoria();
    } catch (err) {
      alert(`Error al cargar la historia: ${err.message}`);
    }
  }

  /* ============================================================
     ELIMINAR HISTORIA
  ============================================================ */

  /**
   * Guarda el ID y abre el modal de confirmación de eliminación.
   * @param {string} id - ID de la historia a eliminar
   */
  _pedirConfirmacionEliminar(id) {
    this.historiaActual = id;
    const modal = document.getElementById('eliminarModal');
    if (!modal) return;
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('abierto'));
  }

  /**
   * Ejecuta la eliminación tras la confirmación del usuario.
   */
  async _ejecutarEliminar() {
    try {
      await this.api.eliminarHistoria(this.historiaActual);
      this._cerrarModalEliminar();
      await this.cargarHistorias();
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  }

  /* ============================================================
     GUARDAR (CREAR O ACTUALIZAR)
  ============================================================ */

  /**
   * Recoge el formulario y envía los datos a la API.
   * Si historiaActual está definido, actualiza; si no, crea.
   */
  async guardarHistoria() {
    const datos = {
      titulo:    document.getElementById('campTitulo').value.trim(),
      autor:     document.getElementById('campAutor').value.trim(),
      contenido: document.getElementById('campContenido').value.trim(),
      imagen:    document.getElementById('campImagen').value.trim(),
    };

    const estado = document.getElementById('historiaModalEstado');
    estado.textContent = '';
    estado.className   = 'modal-estado';

    try {
      if (this.historiaActual) {
        await this.api.actualizarHistoria(this.historiaActual, datos);
      } else {
        await this.api.crearHistoria(datos);
      }
      this._cerrarModalHistoria();
      await this.cargarHistorias();
    } catch (err) {
      estado.textContent = `⚠ ${err.message}`;
      estado.className   = 'modal-estado modal-estado--error';
    }
  }

  /* ============================================================
     CONTROL DE MODALES
  ============================================================ */

  /**
   * Vincula todos los eventos de apertura/cierre de modales.
   */
  _escucharModales() {
    document.addEventListener('click', (e) => {
      const id = e.target.closest('[id]')?.id || e.target.id;

      if (id === 'btnNuevaHistoria')      this.abrirModalCrear();
      if (id === 'btnGuardarHistoria')    this.guardarHistoria();
      if (id === 'btnCancelarHistoria')   this._cerrarModalHistoria();
      if (id === 'historiaCerrar')        this._cerrarModalHistoria();
      if (id === 'btnConfirmarEliminar')  this._ejecutarEliminar();
      if (id === 'btnCancelarEliminar')   this._cerrarModalEliminar();
      if (id === 'eliminarCerrar')        this._cerrarModalEliminar();
      if (id === 'loginCerrar')           this._cerrarModalLogin();

      /* Cierre al hacer clic en el fondo del overlay */
      if (e.target.id === 'historiaModal') this._cerrarModalHistoria();
      if (e.target.id === 'eliminarModal') this._cerrarModalEliminar();
      if (e.target.id === 'loginModal')    this._cerrarModalLogin();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      this._cerrarModalHistoria();
      this._cerrarModalEliminar();
      this._cerrarModalLogin();
    });
  }

  _abrirModalHistoria() {
    const modal = document.getElementById('historiaModal');
    if (!modal) return;
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('abierto'));
  }

  _cerrarModalHistoria() {
    const modal = document.getElementById('historiaModal');
    if (!modal) return;
    modal.classList.remove('abierto');
    setTimeout(() => (modal.style.display = 'none'), 280);
  }

  _cerrarModalEliminar() {
    const modal = document.getElementById('eliminarModal');
    if (!modal) return;
    modal.classList.remove('abierto');
    setTimeout(() => (modal.style.display = 'none'), 280);
  }

  _cerrarModalLogin() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.classList.remove('abierto');
    setTimeout(() => (modal.style.display = 'none'), 280);
  }

  _limpiarFormularioHistoria() {
    ['campTitulo', 'campAutor', 'campContenido', 'campImagen'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('historiaModalEstado').textContent = '';
  }
}
