// 1. Carga de Variables de Entorno (Debe ser la primera línea)
require('dotenv').config(); 

// 2. Importaciones
const { PrismaClient } = require('@prisma/client');
// 🔑 Importa la configuración de la aplicación Express
const app = require('./src/app.js'); 

// 3. Inicialización Global
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// 4. Lógica de Conexión de Prisma
/**
 * Prueba la conexión con la base de datos (Supabase) usando Prisma Client.
 * Detiene la aplicación si la conexión falla.
 */
async function probarConexionDB() {
    try {
        await prisma.$connect(); 
        console.log("------------------------------------------");
        console.log("✅ Prisma se conectó a Supabase con éxito.");
        console.log("------------------------------------------");
    } catch (error) {
        console.error("------------------------------------------");
        console.error("❌ ERROR CRÍTICO: No se pudo conectar a la base de datos.");
        console.error("Detalle:", error.message);
        console.log("------------------------------------------");
        // Detiene el proceso si la base de datos no está disponible.
        process.exit(1); 
    }
}

// 5. Arranque: Prueba la DB y luego inicia Express
probarConexionDB()
    .then(() => {
        // La aplicación Express (app) escucha en el puerto definido
        app.listen(PORT, () => {
            console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error("Fallo al iniciar el servidor:", error);
    });