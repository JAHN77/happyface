const express = require('express');
const app = express();

// --- Importación de Rutas (desde src/routes) ---
// La ruta es relativa a app.js, por eso es './routes/...'
const rutasUsuario = require('./routes/usuarios.js');
const rutasCalificacion = require('./routes/calificacion.js');
const rutasMensaje = require('./routes/mensaje.js');
const rutasAcademico = require('./routes/academico.js'); 
const rutasEstudiante = require('./routes/estudiante'); 
const rutasNoticia = require('./routes/noticias.js'); 
const rutasPago = require('./routes/pagos.js'); 
// const rutasAutenticacion = require('./routes/autenticacion.js');

// --- Middlewares Globales ---

// 1. Permite a Express leer cuerpos de petición JSON
app.use(express.json()); 

// 2. Configuración de CORS para permitir que el frontend (React) se conecte
// ⚠️ Nota: '*' permite todas las conexiones. Esto debe ser restringido en producción.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// --- Montar Rutas ---
// 🔑 Aquí se define el prefijo "/api/"
app.use('/api/usuarios', rutasUsuario);
app.use('/api/calificaciones', rutasCalificacion);
app.use('/api/mensajes', rutasMensaje);
app.use('/api/academico', rutasAcademico);
app.use('/api/estudiantes', rutasEstudiante);
app.use('/api/noticias', rutasNoticia);
app.use('/api/pagos', rutasPago);

// Exportar la instancia de la aplicación para que server.js la inicie
module.exports = app;