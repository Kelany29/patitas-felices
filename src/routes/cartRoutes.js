const express = require('express');
const router = express.Router();
const { addToCart, getCart } = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

// El carrito SIEMPRE requiere estar logueado, pero NO necesita ser Admin
router.post('/cart', verifyToken, addToCart);
router.get('/cart', verifyToken, getCart);

module.exports = router;