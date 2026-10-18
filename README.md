# BiblioApp Backend

API de gestión de biblioteca, usuarios y préstamos de libros desarrollada con NestJS, TypeORM y TypeScript.

## Inicio local

1. Instalación de dependencias:
```bash
npm install
```

2. Configuración de variables de entorno:
```bash
cp .env.example .env
```

3. Ejecutar en modo desarrollo:
```bash
npm run start:dev
```

Por defecto la API utiliza SQLite y crea la base de datos en `data/biblioapp.sqlite`. Queda disponible en `http://localhost:3000`.

---

## Configuración de base de datos

La configuración se lee desde el archivo `.env`.

### SQLite (Desarrollo por defecto):
```env
DB_TYPE=sqlite
DB_DATABASE=data/biblioapp.sqlite
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

### PostgreSQL:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=biblioapp
DB_PASSWORD=una_clave_segura
DB_DATABASE=biblioapp
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

---

## Endpoints de la API

### 1. Libros (`/books`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **POST** | `/books` | Registra un nuevo libro. |
| **GET** | `/books` | Lista libros activos (admite filtros por título, autor o disponibilidad). |
| **GET** | `/books/:id` | Obtiene la información detallada de un libro activo. |
| **PUT** | `/books/:id` | Actualiza los datos de un libro. |
| **DELETE** | `/books/:id` | Desactiva un libro sin eliminarlo de la base de datos. |

Ejemplo de cuerpo para crear un libro (`POST /books`):
```json
{
  "title": "Cien años de soledad",
  "author": "Gabriel García Márquez",
  "pages": 417,
  "genre": "novela"
}
```

---

### 2. Usuarios (`/users`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **POST** | `/users` | Registra un nuevo usuario en la plataforma. |
| **GET** | `/users` | Lista todos los usuarios registrados. |
| **GET** | `/users/:id` | Obtiene la información de un usuario específico. |
| **PUT** | `/users/:id` | Actualiza la información del usuario. |
| **DELETE** | `/users/:id` | Desactiva o elimina un usuario. |

Ejemplo de cuerpo para crear un usuario (`POST /users`):
```json
{
  "id": "1234567890",
  "name": "Carlos Tello",
  "email": "carlos@ejemplo.com",
  "age": 30,
  "phone": "+573101234567"
}
```

---

### 3. Préstamos (`/loans`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **POST** | `/loans` | Presta un libro a un usuario. |
| **GET** | `/loans` | Lista préstamos (filtra por `userId`, `bookId`, `status`). |
| **GET** | `/loans/:id` | Obtiene un préstamo específico. |
| **PUT** | `/loans/:id/return` | Registra la devolución del libro. |

Ejemplo de cuerpo para crear un préstamo (`POST /loans`):
```json
{
  "userId": "1234567890",
  "bookId": "uuid-del-libro"
}
```

---

## Comandos de verificación

```bash
npm run format   # Formatea el código con Prettier
npm run lint     # Revisa errores de estilo y buenas prácticas
npm run build    # Compila el proyecto en TypeScript
```