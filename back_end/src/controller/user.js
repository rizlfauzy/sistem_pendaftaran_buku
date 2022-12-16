const bcrypt = require("bcrypt");
const sequelize = require("../database");

var user = {};

export const beforeCreate = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export const validatePassword = (password, checkPassword) => {
  return bcrypt.compareSync(password, checkPassword);
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