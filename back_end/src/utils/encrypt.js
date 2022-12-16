const bcrypt = require("bcrypt");
const path = require("path");

export const beforeCreate = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export const validatePassword = (password, checkPassword) => {
  return bcrypt.compareSync(password, checkPassword);
};

export const isFormat = (originalName, ...ext) => {
  return ext.some((format) => path.extname(originalName).toLowerCase().includes(format));
};
