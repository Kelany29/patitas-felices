const db = require('../config/db');

// 1. Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Crear un nuevo producto (Se agregó image_url)
const createProduct = async (req, res) => {
    // Agregamos image_url a la extracción de datos
    const { name, description, price, stock, category_id, image_url } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({ 
            error: "Faltan campos obligatorios: nombre, precio o categoría" 
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, category_id, image_url] // Enviamos 6 valores ahora
        );
        res.status(201).json({ id: result.insertId, message: "Producto creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. EDITAR UN PRODUCTO (Se agregó image_url)
const updateProduct = async (req, res) => {
    const { id } = req.params; 
    const { name, description, price, stock, category_id, image_url } = req.body;

    try {
        // Actualizamos también la columna image_url
        const [result] = await db.query(
            'UPDATE products SET name=?, description=?, price=?, stock=?, category_id=?, image_url=? WHERE id=?',
            [name, description, price, stock, category_id, image_url, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. BORRAR UN PRODUCTO
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };
