const express = require('express');
const { PrismaClient, Rol } = require('@prisma/client');
const bcrypt = require('bcrypt');
const router = express.Router();

const prisma = new PrismaClient();
const SALT_ROUNDS = 10; 

// --- 1. CREAR USUARIO (C: Create) ---
// POST /backend/usuarios
router.post('/', async (req, res) => {
    const { correo, contrasena, nombre, rol } = req.body; 

    if (!correo || !contrasena || !nombre || !rol) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    try {
        const contrasenaHasheada = await bcrypt.hash(contrasena, SALT_ROUNDS);
        
        const nuevoUsuario = await prisma.usuario.create({
            data: { 
                correo, 
                contrasena: contrasenaHasheada, 
                nombre, 
                rol: Rol[rol.toUpperCase()] // Asigna el rol basado en el enum
            },
            select: { id: true, correo: true, nombre: true, rol: true }
        });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'El correo ya está registrado.' });
        }
        res.status(500).json({ error: 'Error interno al crear usuario.', detalles: error.message });
    }
});

// --- 2. LEER USUARIOS (R: Read) ---
// GET /backend/usuarios
router.get('/', async (req, res) => {
    // Nota: Aquí se aplicaría la protección por Rol.
    try {
        const usuarios = await prisma.usuario.findMany({
            select: { id: true, correo: true, nombre: true, rol: true }
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar usuarios.' });
    }
});

// --- 3. ACTUALIZAR USUARIO (U: Update) ---
// PUT /backend/usuarios/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, rol } = req.body; 
    try {
        const usuarioActualizado = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: { 
                nombre, 
                rol: rol ? Rol[rol.toUpperCase()] : undefined 
            },
            select: { id: true, correo: true, nombre: true, rol: true }
        });
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(404).json({ error: 'Usuario no encontrado o datos inválidos.' });
    }
});

// --- 4. ELIMINAR USUARIO (D: Delete) ---
// DELETE /backend/usuarios/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.usuario.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Usuario no encontrado.' });
    }
});

module.exports = router;