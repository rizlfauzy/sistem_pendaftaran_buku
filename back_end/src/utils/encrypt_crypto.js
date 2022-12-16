const crypto = require("crypto-js");
require("dotenv").config();

const { CRYPTO_SECRET_KEY } = process.env;

export const encrypt = (text) => crypto.AES.encrypt(text, CRYPTO_SECRET_KEY).toString();

export const decrypt = (hash) => {
  const bytes = crypto.AES.decrypt(hash, CRYPTO_SECRET_KEY);
  return bytes.toString(crypto.enc.Utf8);
};