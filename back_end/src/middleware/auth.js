import jwt from 'jsonwebtoken';
const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === undefined) return res.status(401);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        console.log('error : ', err);
        if (err) return res.status(403);
        next();
    });
}

export default validateToken;