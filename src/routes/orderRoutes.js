const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');

// --- RUTA POST (Crear orden después del pago) ---
router.post('/', verifyToken, async (req, res) => {
    // Ahora recibimos 'status' desde el frontend (Success.jsx)
    const { total, items, status } = req.body;
    const userId = req.user.id; // Obtenemos el ID directamente del token verificado

    try {
        await db.query('START TRANSACTION');

        // 1. Insertar en 'orders' con el estado que venga del pago (ej: 'approved')
        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, `total`, status) VALUES (?, ?, ?)',
            [userId, total, status || 'pendiente']
        );

        const orderId = orderResult.insertId;

        // 2. Insertar en 'order_items' respetando todas las columnas de tu DB
        for (const item of items) {
            const itemTotal = item.price * item.quantity;
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price, price) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price, itemTotal]
            );
        }

        await db.query('COMMIT');
        res.status(201).json({ message: "Orden procesada con éxito", orderId });

    } catch (error) {
        if (db) await db.query('ROLLBACK');
        console.error("ERROR POST ORDERS:", error.message);
        res.status(500).json({ error: "Error al registrar la compra" });
    }
});

// --- RUTA GET (Ver mis pedidos - Sin cambios, ya estaba muy bien) ---
router.get('/my-orders', verifyToken, async (req, res) => {
    const userId = req.user.id; 

    try {
        const query = `
          SELECT 
            o.id AS orderId, 
            o.total, 
            o.status,
            o.created_at AS date,
            p.name AS productName, 
            oi.quantity, 
            oi.unit_price AS price
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          JOIN products p ON oi.product_id = p.id
          WHERE o.user_id = ?
          ORDER BY o.created_at DESC
        `;

        const [rows] = await db.query(query, [userId]);

        const ordersMap = {};
        rows.forEach(row => {
            if (!ordersMap[row.orderId]) {
                ordersMap[row.orderId] = {
                    id: row.orderId,
                    total: row.total,
                    status: row.status,
                    date: row.date,
                    items: []
                };
            }
            ordersMap[row.orderId].items.push({
                name: row.productName,
                quantity: row.quantity,
                price: row.price
            });
        });

        res.json(Object.values(ordersMap));

    } catch (error) {
        console.error("ERROR AL OBTENER PEDIDOS:", error.message);
        res.status(500).json({ error: "No se pudieron cargar los pedidos" });
    }
});

module.exports = router;