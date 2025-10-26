const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// --- 1. CREAR ESTUDIANTE (C: Create) ---
// POST /api/estudiantes (Solo Director)
router.post('/', async (req, res) => {
    const { nombre, padreId, cursoId } = req.body;

    try {
        const estudiante = await prisma.estudiante.create({
            data: {
                nombre,
                padreId: parseInt(padreId), // El ID del padre debe existir
                cursoId: parseInt(cursoId), // El ID del curso debe existir
            }
        });
        res.status(201).json(estudiante);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el estudiante. (Verifique IDs).' });
    }
});

// --- 2. LEER ESTUDIANTES POR PADRE (R: Read - Padre) ---
// GET /api/estudiantes/padre/:padreId
router.get('/padre/:padreId', async (req, res) => {
    const { padreId } = req.params;
    // Nota: Aquí se aplicaría la protección para que solo el padre vea a sus hijos
    const hijos = await prisma.estudiante.findMany({
        where: { padreId: parseInt(padreId) },
        include: { curso: true }
    });
    res.status(200).json(hijos);
});

// --- 3. ELIMINAR ESTUDIANTE (D: Delete - Solo Director) ---
// DELETE /api/estudiantes/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.estudiante.delete({ where: { id: parseInt(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Estudiante no encontrado.' });
    }
});

module.exports = router;