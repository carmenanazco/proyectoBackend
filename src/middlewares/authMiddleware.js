import jwt from 'jsonwebtoken';
import { configObject } from '../config/index.js'



export const authMiddleware = (req, res, next) => {
    const PRIVATE_KEY = configObject.privateKey
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No autorizado: Token no encontrado' });
    }

    try {
        const decoded = jwt.verify(token, 'PRIVATE_KEY'); // ⚠️ Usá tu clave real
        req.user = decoded; // Esto tendrá el payload del JWT (ej: id, email)
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido' });
    }
};

