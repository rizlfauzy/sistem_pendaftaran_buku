import fs from 'fs';
import { beforeCreate, validatePassword } from '../utils/encrypt';
import utils from '../utils/utils';

const jwt = require('jsonwebtoken');
const sequelize = require('../database');

var auth = {};

auth.generateToken =async (req, res) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let session = req.session;
        let data = {
            login_user: req.body.login_user
        }
        const token = jwt.sign(data, jwtSecretKey, { expiresIn: '30m' });
        session.token = token;
        const [result_select_user_id] = await sequelize.default.query(`select id from users where email = '${req.body.login_user}' or username = '${req.body.login_user}'`);
        await sequelize.default.query(`insert into login_session (jwt_token,is_valid,user_id) values ('${token}',1,'${result_select_user_id[0].id}')`)
        res.status(200).json({ message: 'Token berhasil digenerate', error: false, token });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
}

auth.login = async (req, res, next) => {
    const { login_user, password } = req.body;
    try {
        const [data] = await sequelize.default.query(`SELECT email, password FROM users where email = '${login_user}' or username = '${login_user}'`);
        if (data.length < 1) throw new Error('Username / Email belum terdaftar !');
        if (!validatePassword(password, data[0].password)) throw new Error('Password salah !');
        next();
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }

}

auth.register = async (req, res) => {
    const { name,username, email, password } = req.body;
    try {
        if (!req.file) throw new Error('Gagal upload photo !');
        const { path, originalname } = req.file;
        if (!utils.isFormat(originalname, 'jpg', 'png', 'jpeg')) throw new Error("Ekstensi file tidak didukung");
        fs.renameSync(path, `public/img/${originalname}`);
        if (!name) throw new Error('Nama harus diinput');
        if (!username) throw new Error('Nama Pengguna harus diinput');
        if (!email) throw new Error('Email harus diinput');
        if (!password) throw new Error('Password harus diinput');
        const [emailDb] = await sequelize.default.query(`SELECT email FROM users where email LIKE '%${email}%'`);
        const [select_username] = await sequelize.default.query(`SELECT username FROM users where username = '${username}'`);
        if (emailDb.length > 0) throw new Error('Email sudah digunakan');
        if (select_username.length > 0) throw new Error('Nama Pengguna sudah digunakan');
        if (password.length < 8) throw new Error('Password harus lebih dari 8 karakter');
        await sequelize.default.query(`INSERT INTO users (name, username, email, password, photo) values ('${name}','${username}', '${email}', '${beforeCreate(password)}', '${originalname}')`)
        res.status(200).json({ message: 'Pengguna berhasil dibuat', error: false });
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