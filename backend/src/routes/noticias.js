const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// --- 1. CREAR NOTICIA (C: Create - Solo Director) ---
// POST /api/noticias
router.post('/', async (req, res) => {
    const { titulo, contenido, publicada } = req.body;
    const noticia = await prisma.noticia.create({ data: { titulo, contenido, publicada } });
    res.status(201).json(noticia);
});

// --- 2. LEER NOTICIAS PÚBLICAS (R: Read - Público) ---
// GET /api/noticias
router.get('/', async (req, res) => {
    // Solo devolvemos las publicadas para el frontend público
    const noticias = await prisma.noticia.findMany({
        where: { publicada: true },
        orderBy: { fechaCreacion: 'desc' }
    });
    res.status(200).json(noticias);
});

// --- 3. ACTUALIZAR NOTICIA (U: Update - Solo Director) ---
// PUT /api/noticias/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, publicada } = req.body;
    const noticia = await prisma.noticia.update({
        where: { id: parseInt(id) },
        data: { titulo, contenido, publicada }
    });
    res.status(200).json(noticia);
});

module.exports = router;