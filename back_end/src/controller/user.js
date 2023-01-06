import sequelize from "../database";
import { encrypt, decrypt } from "../utils/encrypt_crypto";
import { beforeCreate,validatePassword } from "../utils/encrypt";
import utils from "../utils/utils";
import fs from "fs";
import moment from 'moment';
moment.locale('id')
const { APP_URL } = process.env;

const user = {};

user.profil = async (req, res) => {
  try {
    const [result_select_user] = await sequelize.query(`select id,name,email,username,photo from users where email = '${req.user.login_user}' or username = '${req.user.login_user}'`);
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

user.update_photo = async (req, res) => {
  try {
    if (!req.file) throw new Error("Gagal upload photo !");
    const { path, originalname } = req.file;
    if (!utils.isFormat(originalname, "jpg", "png", "jpeg")) {
      fs.unlinkSync(path);
      return res.status(400).json({ message: "Ekstensi file tidak didukung", error: true });
    }
    const [result_select_user] = await sequelize.query(`select id,photo from users where email = '${req.user.login_user}' or username = '${req.user.login_user}'`);
    if (result_select_user.length < 1) {
      fs.unlinkSync(path)
      return res.status(404).json({ message: "User tidak ditemukan", error: true });
    }
    const { id } = result_select_user[0];
    fs.renameSync(path, `public/img/${originalname}`);
    await sequelize.query(`update users set photo = '${originalname}',updated_at = CURRENT_TIMESTAMP where id = ${id}`);
    return res.status(200).json({ message: "Foto berhasil diubah", error: false });
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
};

user.update_profil = async (req, res) => {
  try {
    const { id:enc_id,edit_name,edit_username,edit_email,submitter } = req.body;
    const id = decrypt(enc_id.replace(/ /g, "+"));
    if (submitter === "btn_submit_name" && edit_name) {
      await sequelize.query(`UPDATE users SET name = "${edit_name}",updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`);
      res.status(200).json({message:"Nama berhasil diubah", error: false})
    } else if (submitter === "btn_submit_username" && edit_username) {
      const [duplicated_username] = await sequelize.query(`SELECT username FROM users WHERE id <> "${id}" AND username = "${edit_username}"`)
      if (duplicated_username.length > 0) return res.status(400).json({message:"Nama Pengguna sudah pernah terdaftar", error:true})
      await sequelize.query(`UPDATE users SET username = "${edit_username}", updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`);
      res.status(200).json({ message: "Nama Pengguna berhasil diubah", error: false });
    } else if (submitter === "btn_submit_email" && edit_email) {
      const [duplicated_email] = await sequelize.query(`SELECT email FROM users WHERE id <> "${id}" AND email = "${edit_email}"`)
      if (duplicated_email.length > 0) return res.status(400).json({ message: "Email sudah pernah terdaftar", error: true });
      await sequelize.query(`UPDATE users SET email = "${edit_email}", updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`);
      res.status(200).json({ message: "Email berhasil diubah", error: false });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
}

user.update_pass = async (req, res) => {
  try {
    const { id: enc_id, pass_new, pass_now } = req.body;
    const id = decrypt(enc_id.replace(/ /g, "+"));
    const [select_password] = await sequelize.query(`SELECT password FROM users WHERE id = "${id}"`);
    if (!pass_now) return res.status(400).json({ message: "Password Sekarang belum diisi",error:true });
    if (pass_now.length < 8) return res.status(400).json({ message: "Password Sekarang minimal 8 karakter", error:true});
    if (!pass_new)return res.status(400).json({ message: "Password Baru belum diisi",error:true });
    if (pass_new.length < 8) return res.status(400).json({ message: "Password Baru minimal 8 karakter", error: true });
    if (pass_new === pass_now) return res.status(400).json({ message: "Password Sekarang dan Password Baru sama",error:true });
    if (!validatePassword(pass_now, select_password[0].password)) throw new Error("Password Sekarang salah");
    await sequelize.query(`UPDATE users SET password = "${beforeCreate(pass_new)}",updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`);
    return res.status(200).json({message:"Password berhasil diubah",error:false})
  } catch (e) {
    return res.status(500).json({message:e.message,error:true})
  }
}

export default user;
