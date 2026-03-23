const db = require('../config/db');

// 1. Agregar productos al carrito
const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id; // Obtenido del token por el guardia (authMiddleware)

    try {
        // Verificamos si el producto ya está en el carrito para solo sumar la cantidad
        const [exists] = await db.query(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );

        if (exists.length > 0) {
            await db.query(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity || 1, user_id, product_id]
            );
        } else {
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [user_id, product_id, quantity || 1]
            );
        }
        res.json({ message: "Producto añadido al carrito correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Ver el carrito de un usuario
const getCart = async (req, res) => {
    const user_id = req.user.id;
    try {
        // Hacemos un JOIN para traer el nombre y precio del producto también
        const [items] = await db.query(
            `SELECT cart.id, products.name, products.price, cart.quantity 
             FROM cart 
             JOIN products ON cart.product_id = products.id 
             WHERE cart.user_id = ?`,
            [user_id]
        );
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addToCart, getCart };