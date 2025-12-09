# 🚀 Backend API – User, Category, and Ticket Management

This project is a **API RESTful professional**, developed with **NestJS** and designed to manage Users, Categories, and Tickets under a secure system based on JWT and Roles.  
It includes robust validations, modular architecture, automatic documentation with Swagger, and deployment via Docker.

---

# 🧩 General Features

- 🔐 Authentication based on **JWT**
- 🛂 AAuthorization by **Roles** (Admin / User)
- 🧑‍💼 Gestión completa de usuarios y categorías (solo Admin)
- 🎫 Sistema de tickets con cambio de estado
- 🧪 Pruebas unitarias con Jest (mínimo 40% cobertura)
- 🐳 Despliegue con Docker y Docker Compose
- 📘 Documentación con Swagger
- 🧼 Principios SOLID + Arquitectura Modular

---

# 👤 Roles del Sistema

| Rol        | Descripción | Permisos |
|------------|-------------|----------|
| **admin**  | Administrador del sistema | CRUD de usuarios, CRUD de categorías, CRUD de tickets |
| **user**   | Usuario estándar | Crear tickets, ver los suyos, cambiar estado limitado |

El rol se asigna al momento de crear un usuario o mediante el modelo en base de datos.

---

# 🔐 Seguridad y Acceso

La API utiliza:

- **JWT Strategy**  
- **Guards:**  
  - `JwtAuthGuard` → Protege rutas privadas  
  - `RolesGuard` → Valida rol del usuario  
  - `AdminGuard` → Acceso exclusivo para administradores  

Tokens se envían en el header:
`Authorization: Bearer <token>`

Este backend sigue convenciones profesionales para asegurar alta calidad y mantenibilidad del código:

### ✔ Inyección de dependencias
Todos los módulos internamente desacoplados mediante DI nativo de NestJS.

### ✔ Principios SOLID
La lógica de negocio se organiza respetando:
- **S**ingle Responsibility  
- **O**pen/Closed  
- **L**iskov Substitution  
- **I**nterface Segregation  
- **D**ependency Inversion  

Esto permite una API flexible, reutilizable y fácil de escalar.

### ✔ Arquitectura Modular
La estructura del proyecto está organizada por dominios:
```
src/
├── auth/
├── users/
├── categories/
├── tickets/
├── common/
│ ├── exceptions/
│ ├── filters/
│ ├── guards/
│ └── dtos/
└── main.ts
```

---

# 📚 Documentación con Swagger

Al iniciar el proyecto, la documentación está disponible en:

📄 **http://localhost:3000/docs**

Incluye:
- Endpoints organizados por módulos  
- DTOs  
- Roles requeridos  
- Ejemplos de request/response  

---

# 🧭 Endpoints del Sistema

## 🔐 Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | `/auth/login`   | Inicia sesión y devuelve JWT |
| POST   | `/auth/register` | Registra un nuevo usuario |

---

## 👤 Users (Solo Admin)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/users`           | Obtener todos los usuarios |
| GET    | `/users/:id`       | Obtener usuario por ID |
| POST   | `/users`           | Crear usuario |
| PUT    | `/users/:id`       | Actualizar usuario |
| DELETE | `/users/:id`       | Eliminar usuario |

**Requiere rol:** `admin`

---

## 🏷 Categories (Solo Admin)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/categories`        | Listar categorías |
| GET    | `/categories/:id`    | Obtener categoría |
| POST   | `/categories`        | Crear categoría |
| PUT    | `/categories/:id`    | Actualizar categoría |
| DELETE | `/categories/:id`    | Eliminar categoría |

**Requiere rol:** `admin`

---

## 🎫 Tickets
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/tickets`            | Listar tickets (Admin ve todos, User solo los suyos) |
| GET    | `/tickets/:id`        | Ver un ticket |
| POST   | `/tickets`            | Crear ticket |
| PATCH  | `/tickets/:id/status` | Cambiar estado del ticket |
| DELETE | `/tickets/:id`        | Eliminar ticket (Admin) |

**Roles:**  
- `admin`: CRUD total  
- `user`: CRUD limitado (solo propios)

---

# 🐳 Docker: Cómo ejecutar el proyecto

📌 **Levantar la API y la base de datos**

```bash
📌 Modo background
docker compose up --build -d
```

```bash
📌 Ver logs
docker compose logs -f

docker compose up --build 
```
---

# 📦 Entrar al Contenedor y Ejecutar Comandos

Para entrar al contenedor NestJS:

```bash
docker exec -it <nombre_del_contenedor> bash
```
---

# 🛠 Instalación Manual sin Docker
```bash
git clone https://github.com/HectorDaniel-00/techHelpDesk-API.git
cd techHelpDesk-API
cd api
npm install
npm run start:dev
```