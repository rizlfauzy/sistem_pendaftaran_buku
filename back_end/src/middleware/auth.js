import jwt from 'jsonwebtoken';
import sequelize from '../database';

const validateToken =async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Token not found', error: true });
        const [result_select_from_login_session] = await sequelize.query(`select * from login_session where jwt_token = '${token}'`);
        if (result_select_from_login_session.length < 1) return res.status(403).json({ message: 'Token not found', error: true })
        if (result_select_from_login_session[0].is_valid == 0) return res.status(403).json({ message: 'Token expired', error: true })
        const decoded_data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded_data;
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