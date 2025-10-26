const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// --- 1. ENVIAR MENSAJE (C: Create) ---
// POST /api/mensajes
router.post('/', async (req, res) => {
    // Los IDs de remitente y destinatario deben ser IDs de Usuario válidos
    const { contenido, remitenteId, destinatarioId } = req.body; 
    
    try {
        const nuevoMensaje = await prisma.mensaje.create({
            data: {
                contenido,
                remitenteId: parseInt(remitenteId),
                destinatarioId: parseInt(destinatarioId),
            }
        });
        res.status(201).json(nuevoMensaje);
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar el mensaje.', detalles: error.message });
    }
});

// --- 2. LEER CONVERSACIÓN (R: Read) ---
// GET /api/mensajes/usuario/:usuarioId/conversacion/:otroUsuarioId
// Obtiene todos los mensajes entre dos usuarios
router.get('/usuario/:usuarioId/conversacion/:otroUsuarioId', async (req, res) => {
    const { usuarioId, otroUsuarioId } = req.params;
    const uId = parseInt(usuarioId);
    const oId = parseInt(otroUsuarioId);

    try {
        const mensajes = await prisma.mensaje.findMany({
            where: {
                OR: [
                    // Mensajes enviados POR usuarioId A otroUsuarioId
                    { remitenteId: uId, destinatarioId: oId },
                    // Mensajes enviados POR otroUsuarioId A usuarioId
                    { remitenteId: oId, destinatarioId: uId },
                ],
            },
            orderBy: { fechaCreacion: 'asc' }, // Ordenar por fecha para ver el historial
        });
        res.status(200).json(mensajes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la conversación.', detalles: error.message });
    }
});

// --- 2.1 LEER TODOS LOS MENSAJES (R: Read) ---
router.get('/', async (req, res) => {
    // ⚠️ Nota: Esta ruta debe estar fuertemente protegida por JWT/Roles para el DIRECTOR.
    try {
        const mensajes = await prisma.mensaje.findMany({
            // Incluye remitente/destinatario para contexto
            include: { remitente: { select: { nombre: true } }, destinatario: { select: { nombre: true } } },
            orderBy: { fechaCreacion: 'desc' }, 
            take: 50 // Limitar para evitar sobrecarga
        });
        res.status(200).json(mensajes);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar todos los mensajes.' });
    }
});

// --- 3. ELIMINAR MENSAJE (D: Delete) ---
// DELETE /api/mensajes/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.mensaje.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Mensaje no encontrado.' });
    }
});

// Nota: La actualización (PUT) de mensajes es rara, por lo general solo se eliminan.

module.exports = router;