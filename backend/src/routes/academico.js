const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// --- 1. CRUD de ASIGNATURA ---

// POST /api/academico/asignaturas (C: Crear Asignatura - Solo Director)
router.post('/asignaturas', async (req, res) => {
    const { nombre } = req.body;
    try {
        const asignatura = await prisma.asignatura.create({ data: { nombre } });
        res.status(201).json(asignatura);
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: 'La asignatura ya existe.' });
        res.status(500).json({ error: 'Error al crear la asignatura.' });
    }
});

// GET /api/academico/asignaturas (R: Listar Asignaturas)
router.get('/asignaturas', async (req, res) => {
    const asignaturas = await prisma.asignatura.findMany();
    res.status(200).json(asignaturas);
});

// DELETE /api/academico/asignaturas/:id (D: Eliminar Asignatura - Solo Director)
router.delete('/asignaturas/:id', async (req, res) => {
    try {
        await prisma.asignatura.delete({ where: { id: parseInt(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Asignatura no encontrada.' });
    }
});

// --- 2. CRUD de CURSO (Cursos tienen un profesor asignado) ---

// POST /api/academico/cursos (C: Crear Curso - Solo Director)
router.post('/cursos', async (req, res) => {
    const { nombre, descripcion, profesorId } = req.body;
    try {
        const curso = await prisma.curso.create({
            data: { 
                nombre, 
                descripcion, 
                profesorId: parseInt(profesorId) 
            }
        });
        res.status(201).json(curso);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el curso. (Verifique profesorId).' });
    }
});

// GET /api/academico/cursos (R: Listar Cursos)
router.get('/cursos', async (req, res) => {
    const cursos = await prisma.curso.findMany({
        include: { profesor: { select: { nombre: true, correo: true } } }
    });
    res.status(200).json(cursos);
});

module.exports = router;