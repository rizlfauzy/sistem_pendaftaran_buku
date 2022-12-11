import jwt from 'jsonwebtoken';

const validateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401);
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (error) {
        if (error.message === 'jwt expired') {
            return res.status(403).json({ message: error.message, error: true })
        }
        res.status(500).json({ message: error.message, error: true })
    }
}

const refreshToken = (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

export default validateToken;