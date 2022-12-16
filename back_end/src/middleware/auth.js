import jwt from 'jsonwebtoken';

const validateToken = (req, res, next) => {
    try {
        let authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401);
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (error) {
        // throw new Error(error.message);
        if (error.message === 'jwt expired') {
            return res.status(403).json({ message: error.message, error: true })
        }
        // return res.status(500).json({ message: error.message, error: true })
        // next();
    }
}

export default validateToken;