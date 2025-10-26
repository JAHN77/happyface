const express = require('express');
const { PrismaClient, EstadoPago } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// --- 1. REGISTRAR PAGO (C: Create - Padre / Webhook de Pasarela) ---
// POST /api/pagos
router.post('/', async (req, res) => {
    // Asumimos que los datos vienen de la pasarela o del formulario del Padre
    const { monto, concepto, padreId, referencia_transaccion, estado } = req.body;

    try {
        const nuevoPago = await prisma.pago.create({
            data: {
                monto: parseFloat(monto),
                concepto,
                padreId: parseInt(padreId),
                referencia_transaccion,
                estado: EstadoPago[estado.toUpperCase()] || EstadoPago.PENDIENTE // Asigna estado
            }
        });
        res.status(201).json(nuevoPago);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el pago.' });
    }
});

// --- 2. LEER PAGOS POR PADRE (R: Read - Padre) ---
// GET /api/pagos/padre/:padreId
router.get('/padre/:padreId', async (req, res) => {
    const { padreId } = req.params;
    const pagos = await prisma.pago.findMany({
        where: { padreId: parseInt(padreId) },
        orderBy: { fecha: 'desc' }
    });
    res.status(200).json(pagos);
});

// --- 3. ELIMINAR PAGO (D: Delete - Solo Director) ---
// DELETE /api/pagos/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.pago.delete({ where: { id: parseInt(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Pago no encontrado.' });
    }
});

module.exports = router;