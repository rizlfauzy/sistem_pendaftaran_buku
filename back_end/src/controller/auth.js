const path = require('path');
import fs from 'fs';
import { beforeCreate } from './user';
var jwt = require('jsonwebtoken');
const sequelize = require('../database');
var auth = {};

auth.generateToken = (req, res) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            email: req.body.email
        }

        const token = jwt.sign(data, jwtSecretKey, { expiresIn: '30m' });
        res.status(200).json({ message: 'Token berhasil digenerate', error: false, token });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
}

auth.login = (req, res, next) => {

}

const isFormat = (originalName, ...ext) => {
    return ext.some((format) => path.extname(originalName).toLowerCase().includes(format));
}

auth.register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!req.file) throw new Error('Gagal upload photo !');
        const { path, originalname } = req.file;
        if (!isFormat(originalname, 'jpg', 'png', 'jpeg')) throw new Error('Format file tidak sesuai !');
        fs.renameSync(path, `public/img/${originalname}`);
        if (!username) throw new Error('Username harus diinput');
        if (!email) throw new Error('Email harus diinput');
        if (!password) throw new Error('Password harus diinput');
        const [emailDb] = await sequelize.default.query(`SELECT email FROM users where email LIKE '%${email}%'`);
        if (emailDb.length > 1) throw new Error('Email sudah digunakan');
        if (password.length < 8) throw new Error('Password harus lebih dari 8 karakter');
        await sequelize.default.query(`INSERT INTO users (username, email, password, photo) values ('${username}', '${email}', '${beforeCreate(password)}', '${originalname}')`)
        res.status(200).json({ message: 'User berhasil dibuat', error: false });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }

    // password minimal 8
    // check to database if email is exist
    // format email
}

export default auth;