const express = require('express');
const router = express.Router();

// AGREGA ESTO: updateProduct y deleteProduct a la lista
const { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/products', getAllProducts);
router.post('/products', verifyToken, isAdmin, createProduct);

// Ahora estas líneas sí funcionarán porque las funciones ya están "definidas" arriba
router.put('/products/:id', verifyToken, isAdmin, updateProduct);
router.delete('/products/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;