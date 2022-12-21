import sequelize from "../database";
import { encrypt } from "../utils/encrypt_crypto";
const {APP_URL} = process.env;

const sequelize = require("../database");

var user = {};

user.profil = async (req, res) => {
  try {
    const [result_select_user] = await sequelize.query(`select id,email,username,photo from users where email = '${req.user.email}'`);
    const str_user = JSON.stringify(result_select_user[0]);
    const obj_user = JSON.parse(str_user);
    obj_user.photo = `${APP_URL}/img/${obj_user.photo}`;
    obj_user.id = encrypt(obj_user.id.toString());
    if (result_select_user.length < 1) return res.status(404).json({ message: "User tidak ditemukan", error: true });
    return res.status(200).json({ message: "User berhasil didapatkan", error: false, data: obj_user });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

user.getAll = async (req, res) => {
  // console.error('error: ', err.stack);
  try {
    const [user] = await sequelize.default.query(`SELECT * FROM users`);
    res.status(200).json({
      message: 'Success get all user',
      error: false,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true
    })
  }
}

user.getOne = async (req, res) => {
  try {
    const [user] = await sequelize.default.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
    res.status(200).json({
      message: 'Success get user',
      error: false,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true
    })
  }
}

export default user;