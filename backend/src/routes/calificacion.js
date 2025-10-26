const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// --- 1. CREAR CALIFICACIÓN (C: Create) ---
// POST /api/calificaciones
router.post('/', async (req, res) => {
    // Asumimos que el profesor proporciona los IDs de estudiante y asignatura
    const { estudianteId, asignaturaId, puntaje, observaciones } = req.body; 

    try {
        const calificacion = await prisma.calificacion.create({
            data: {
                estudianteId: parseInt(estudianteId),
                asignaturaId: parseInt(asignaturaId),
                puntaje: parseFloat(puntaje),
                observaciones, // Campo de texto para la observación
            }
        });
        res.status(201).json(calificacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la calificación.', detalles: error.message });
    }
});

// --- 2. LEER BOLETÍN POR ESTUDIANTE (R: Read) ---
// GET /api/calificaciones/estudiante/:estudianteId
router.get('/estudiante/:estudianteId', async (req, res) => {
    const { estudianteId } = req.params;
    
    try {
        const calificaciones = await prisma.calificacion.findMany({
            where: { estudianteId: parseInt(estudianteId) },
            include: { 
                asignatura: { select: { nombre: true } } // Muestra el nombre de la asignatura
            }
        });

        // Lógica: Cálculo del Promedio
        const totalPuntaje = calificaciones.reduce((sum, c) => sum + c.puntaje, 0);
        const promedio = calificaciones.length > 0 ? (totalPuntaje / calificaciones.length).toFixed(2) : 0;
        
        res.status(200).json({ calificaciones, promedio });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener boletín.', detalles: error.message });
    }
});

// --- 3. ACTUALIZAR CALIFICACIÓN (U: Update) ---
// PUT /api/calificaciones/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { puntaje, observaciones } = req.body;
    try {
        const calificacionActualizada = await prisma.calificacion.update({
            where: { id: parseInt(id) },
            data: { 
                puntaje: puntaje ? parseFloat(puntaje) : undefined, 
                observaciones 
            },
        });
        res.status(200).json(calificacionActualizada);
    } catch (error) {
        res.status(404).json({ error: 'Calificación no encontrada.' });
    }
});

// --- 4. ELIMINAR CALIFICACIÓN (D: Delete) ---
// DELETE /api/calificaciones/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.calificacion.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Calificación no encontrada.' });
    }
});

module.exports = router;