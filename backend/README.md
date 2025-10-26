# HappyFace - Backend API

📝 Resumen del Proyecto

Este proyecto es la API backend para la plataforma "HappyFace". Construida con **Express.js**, **Prisma** y conectada a **PostgreSQL** (por ejemplo Supabase), se encarga de:

- Gestionar usuarios (Director, Profesor, Padre)
- Guardar contraseñas de forma segura con `bcrypt`
- Operaciones CRUD para calificaciones, mensajes, noticias, pagos, cursos, etc.
- Conectar con la base de datos indicada por `DATABASE_URL` en `.env`

---
## Estructura del Proyecto
```
backend/
│
├── node_modules/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── routes/
│   │   ├── academico.js
│   │   ├── calificacion.js
│   │   ├── estudiante.js
│   │   ├── mensaje.js
│   │   ├── noticias.js
│   │   ├── pagos.js
│   │   └── usuarios.js
│   │
│   └── app.js                # Configuración principal de Express
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```
---

## ⚙️ Tecnologías Utilizadas

- **Node.js** (v18+)
- **Express.js** (framework backend)
- **Prisma ORM** (acceso a base de datos)
- **PostgreSQL** (base de datos relacional)
- **Supabase** (infraestructura en la nube)
- **dotenv** (manejo de variables de entorno)
- **nodemon** (recarga automática en desarrollo)

---

## Cómo instalar y ejecutar (PowerShell)

1) Clona el repositorio y entra en la carpeta `backend` (ajusta la URL si tu repo es otro):

```bash
git clone https://github.com/JAHN77/happyface.git
cd happyface/backend
```

2) Instala dependencias:

```bash
npm install
```

3) Crea `.env` en `backend/`:

```bash
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.[TU_PROYECTO_ID]:[TU_CONTRASENA]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.[TU_PROYECTO_ID]:[TU_CONTRASENA]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

Nota: en caso de ser necesaria pedirla y se enviara de forma independiente
```

Prisma leerá `DATABASE_URL` desde `.env` por defecto.

4) Genera el cliente de Prisma:

```bash
npx prisma generate
```

Si necesitas forzar la carga de `.env` con `dotenv-cli`:

```bash
npm install -D dotenv-cli
npx dotenv -e .env -- npx prisma generate
```

5) Arranca el servidor:

```bash
npm run dev   # si tienes nodemon
# o:
node server.js
```

La consola debería indicar que el servidor está corriendo (p. ej. http://localhost:4000) y que Prisma se conectó.


## Autor
### Juan Andres Henriquez
Proyecto académico - Ingeniería de Sistemas


