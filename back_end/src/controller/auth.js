import fs from 'fs';
import { beforeCreate, validatePassword } from './user';
import utils from '../utils/utils';

const jwt = require('jsonwebtoken');
const sequelize = require('../database');

var auth = {};

auth.generateToken =async (req, res) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let session = req.session;
        let data = {
            email: req.body.email
        }
        const token = jwt.sign(data, jwtSecretKey, { expiresIn: '30m' });
        session.token = token;
        const [result_select_user_id] = await sequelize.default.query(`select id from users where email LIKE '%${req.body.email}%'`)
        await sequelize.default.query(`insert into login_session (jwt_token,is_valid,user_id) values ('${token}',1,'${result_select_user_id[0].id}')`)
        res.status(200).json({ message: 'Token berhasil digenerate', error: false, token });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
}

auth.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const [data] = await sequelize.default.query(`SELECT email, password FROM users where email LIKE '%${email}%'`);
        if (data.length < 1) throw new Error('Email belum terdaftar !');
        if (!validatePassword(password, data[0].password)) throw new Error('Password salah !');
        next();
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }

}

auth.register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!req.file) throw new Error('Gagal upload photo !');
        const { path, originalname } = req.file;
        if (utils.isFormat(originalname, 'jpg', 'png', 'jpeg')) throw new Error('Format file tidak sesuai !');
        fs.renameSync(path, `public/img/${originalname}`);
        if (!username) throw new Error('Username harus diinput');
        if (!email) throw new Error('Email harus diinput');
        if (!password) throw new Error('Password harus diinput');
        const [emailDb] = await sequelize.default.query(`SELECT email FROM users where email LIKE '%${email}%'`);
        if (emailDb.length > 0) throw new Error('Email sudah digunakan');
        if (password.length < 8) throw new Error('Password harus lebih dari 8 karakter');
        await sequelize.default.query(`INSERT INTO users (username, email, password, photo) values ('${username}', '${email}', '${beforeCreate(password)}', '${originalname}')`)
        // await sequelize.default.query(`INSERT INTO users (username, email, password) values ('${username}', '${email}', '${beforeCreate(password)}')`)
        res.status(200).json({ message: 'User berhasil dibuat', error: false });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
}

auth.logout = async (req, res) => {
    try {
        let sess = req.session;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401);
        const [result_select_from_login_session] = await sequelize.default.query(`select * from login_session where jwt_token = '${token}'`);
        if (result_select_from_login_session.length < 1) return res.status(403).json({ message: 'Token not found', error: true })
        if (result_select_from_login_session[0].is_valid == 0) return res.status(403).json({ message: 'Token expired', error: true })
        await sequelize.default.query(`update login_session set is_valid = 0 where jwt_token = '${token}'`)
        sess.destroy();
        return res.status(200).json({ message: 'Logout berhasil', error: false })
    } catch (error) {
        return res.status(500).json({ message: error.message, error: true })
    }
}

export default auth;