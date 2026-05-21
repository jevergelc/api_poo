# API Fundación Renacer Vida Feliz

API REST construida con Node.js + Express usando Programación Orientada a Objetos (POO).

## Cómo iniciar el proyecto

```bash
npm install
npm run dev
```

El servidor corre en: `http://localhost:3000`

El frontend (HTML) se sirve automáticamente en esa misma URL.

---

## Estructura del proyecto

```
api_poo/
├── public/              ← Frontend (HTML + CSS + imágenes)
│   ├── index.html
│   ├── historia.html
│   ├── historias.html
│   ├── actividades.html
│   ├── ayudanos.html
│   ├── participa.html
│   └── assets/
│       ├── css/
│       ├── images/
│       └── galeria/
├── data/                ← Base de datos en archivos JSON
│   ├── users.json
│   ├── sessions.json
│   ├── products.json
│   ├── carts.json
│   ├── orders.json
│   ├── terms.json
│   └── historias.json
├── src/                 ← Backend (API REST)
│   ├── server.js        ← Punto de entrada
│   ├── app.js           ← Configuración de Express
│   ├── routes/          ← Definición de endpoints
│   ├── controllers/     ← Reciben petición y respuesta HTTP
│   ├── services/        ← Lógica de negocio
│   ├── repositories/    ← Acceso a los archivos JSON
│   ├── middlewares/     ← Seguridad: apiKey y roles
│   └── utils/           ← Utilidades compartidas
└── package.json
```

---

## Arquitectura en capas

```
Ruta → Controlador → Servicio → Repositorio → JSON
```

---

## Endpoints disponibles

Base URL: `/api/v1`

### Autenticación (público)
| Método | Ruta             | Descripción           |
|--------|------------------|-----------------------|
| POST   | /auth/register   | Registrar usuario     |
| POST   | /auth/login      | Iniciar sesión        |
| POST   | /auth/logout     | Cerrar sesión (apiKey)|

### Productos (requiere apiKey)
| Método | Ruta             | Acceso  | Descripción             |
|--------|------------------|---------|-------------------------|
| GET    | /products        | todos   | Listar productos        |
| GET    | /products/:id    | todos   | Obtener producto por ID |
| POST   | /products        | admin   | Crear producto          |
| PATCH  | /products/:id    | admin   | Actualizar producto     |
| DELETE | /products/:id    | admin   | Eliminar producto       |

### Carrito (requiere apiKey + rol cliente)
| Método | Ruta                    | Descripción               |
|--------|-------------------------|---------------------------|
| GET    | /cart                   | Ver carrito               |
| POST   | /cart/items             | Agregar producto           |
| DELETE | /cart/items/:productId  | Eliminar ítem             |
| DELETE | /cart/clear             | Vaciar carrito            |

### Órdenes (requiere apiKey + rol cliente)
| Método | Ruta         | Descripción              |
|--------|--------------|--------------------------|
| POST   | /orders/pay  | Realizar pago            |
| GET    | /orders/my   | Ver mis órdenes          |

### Historias
| Método | Ruta              | Acceso | Descripción          |
|--------|-------------------|--------|----------------------|
| GET    | /historias        | público| Listar historias     |
| GET    | /historias/:id    | público| Obtener por ID       |
| POST   | /historias        | admin  | Crear historia       |
| PATCH  | /historias/:id    | admin  | Actualizar historia  |
| DELETE | /historias/:id    | admin  | Eliminar historia    |

### Términos y condiciones
| Método | Ruta    | Acceso  | Descripción          |
|--------|---------|---------|----------------------|
| POST   | /terms  | público | Obtener términos      |

### Verificación de estado
| Método | Ruta     | Descripción              |
|--------|----------|--------------------------|
| GET    | /estado  | Verificar si la API corre|

---

## Seguridad

- **apiKey:** se envía en el header `x-api-key` al hacer login.
- **Roles:** `admin` puede gestionar productos e historias. `cliente` puede usar el carrito y órdenes.

## Usuarios de prueba

| Email            | Contraseña | Rol     |
|------------------|------------|---------|
| admin@mail.com   | 12345      | admin   |
| carlos@mail.com  | 12345      | cliente |
