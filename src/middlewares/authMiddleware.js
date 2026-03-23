const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Buscamos el token en la cabecera (Header) de la petición
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ error: "Acceso denegado. No hay token." });
    }

    try {
        // 2. Verificamos si el token es válido usando nuestra clave secreta
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Guardamos los datos del usuario (id y role) dentro de 'req'
        req.user = verified;
        
        // 4. ¡Pasa al siguiente paso!
        next(); 
    } catch (error) {
        res.status(401).json({ error: "Token no válido o expirado." });
    }
};

// 5. El Guardia de Roles (Solo para Admins)
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Acceso denegado. Se requiere ser Administrador." });
    }
    next();
};

module.exports = { verifyToken, isAdmin };