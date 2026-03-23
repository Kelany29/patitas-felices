const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');


require('dotenv').config();
app.use(cors()); 
app.use(express.json()); 
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);



app.get('/', (req, res) => {
    res.send('Backend de Patitas Felices V2 - Operativo 🐾');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});