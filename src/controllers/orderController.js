const db = require('../config/db');

exports.createOrder = async (req, res) => {
    // 1. Ajustamos a 'user_id' para ser consistentes con tu DB
    const { user_id, total, items } = req.body; 

    try {
        await db.query('START TRANSACTION');

        // 2. Insertamos la Orden principal
        // En tu DB la columna es 'user_id' y 'total'
        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
            [user_id, total, 'paid'] // Cambiamos a 'paid' si viene de un pago exitoso
        );
        const orderId = orderResult.insertId;

        // 3. Insertamos en order_items (Optimizado)
        // Tu tabla tiene: order_id, product_id, quantity, unit_price, price
        const itemsQueries = items.map(item => {
            const unitPrice = item.price; // El precio unitario
            const totalPrice = item.price * item.quantity; // El precio total de ese renglón

            return db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price, price) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.id, item.quantity, unitPrice, totalPrice]
            );
        });
        
        await Promise.all(itemsQueries);

        await db.query('COMMIT');
        res.status(201).json({ message: "Venta registrada con éxito", orderId });

    } catch (error) {
        await db.query('ROLLBACK');
        console.error("Error en createOrder:", error);
        res.status(500).json({ error: error.message });
    }
};