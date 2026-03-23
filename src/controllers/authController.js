const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO DE USUARIO (Este bloque está perfecto)
const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "El usuario o email ya existen" });
    }
};

// LOGIN DE USUARIO (Ajustado)
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscamos al usuario por su email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const user = rows[0];

        // 2. Comparamos la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

        // 3. ¡AHORA SÍ! Creamos el token después de validar que es el usuario correcto
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        // 4. Enviamos la respuesta con el token incluido
        res.json({ 
            message: "Bienvenido", 
            user: { id: user.id, username: user.username, role: user.role }, 
            token: token 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };