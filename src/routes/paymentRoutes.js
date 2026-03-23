const express = require('express');
const router = express.Router();
const { createPreference } = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Solo usuarios logueados pueden generar un link de pago
router.post('/create-preference', verifyToken, createPreference);
// Este endpoint NO lleva verifyToken porque lo llama Mercado Pago, no el usuario
router.post('/webhook', (req, res) => {
    const payment = req.query;
    console.log("Notificación de pago recibida:", payment);
    
    // Aquí es donde luego programaremos la lógica para actualizar la DB
    res.sendStatus(200); // Siempre responder 200 para que MP sepa que recibiste el aviso
});

module.exports = router;