# BiblioApp Backend

API de gestión de biblioteca, usuarios y préstamos de libros desarrollada con NestJS, TypeORM y TypeScript.

## Inicio local

1. Instalación de dependencias:
```bash
npm install
Configuración de variables de entorno:Bashcp .env.example .env
Ejecutar en modo desarrollo:Bashnpm run start:dev
Por defecto la API utiliza SQLite y crea la base de datos en data/biblioapp.sqlite. Queda disponible en http://localhost:3000.Configuración de base de datosLa configuración se lee desde el archivo .env.SQLite (Desarrollo por defecto):Fragmento de códigoDB_TYPE=sqlite
DB_DATABASE=data/biblioapp.sqlite
DB_SYNCHRONIZE=true
DB_LOGGING=false
PostgreSQL:Fragmento de códigoDB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=biblioapp_user
DB_PASSWORD=una_clave_segura
DB_DATABASE=biblioapp
DB_SYNCHRONIZE=true
DB_LOGGING=false
Endpoints de la API1. Libros (/books)MétodoRutaDescripciónPOST/booksRegistra un nuevo libro.GET/booksLista libros activos (admite filtros por título, autor o disponibilidad).GET/books/:idObtiene la información detallada de un libro activo.PUT/books/:idActualiza los datos de un libro.DELETE/books/:idDesactiva un libro sin eliminarlo de la base de datos.Ejemplo de cuerpo para crear un libro (POST /books):JSON{
  "title": "Cien años de soledad",
  "author": "Gabriel García Márquez",
  "pages": 417,
  "genre": "novela"
}
2. Usuarios (/users)MétodoRutaDescripciónPOST/usersRegistra un nuevo usuario en la plataforma.GET/usersLista todos los usuarios registrados.GET/users/:idObtiene la información de un usuario específico.PUT/users/:idActualiza la información del usuario.DELETE/users/:idDesactiva o elimina un usuario.Ejemplo de cuerpo para crear un usuario (POST /users):JSON{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "3001234567"
}
3. Alquileres / Préstamos (/rentals o /loans)MétodoRutaDescripciónPOST/rentalsRegistra el préstamo de un libro a un usuario.GET/rentalsLista los préstamos activos e históricos.GET/rentals/:idConsulta los detalles de un préstamo por ID.PUT/rentals/:id/returnMarca la devolución del libro prestado.Ejemplo de cuerpo para crear un préstamo (POST /rentals):JSON{
  "userId": 1,
  "bookId": 1,
  "dueDate": "2026-11-01"
}
Comandos de verificaciónBashnpm run format   # Formatea el código con Prettier
npm run lint     # Revisa errores de estilo y buenas prácticas
npm run build    # Compila el proyecto en TypeScript