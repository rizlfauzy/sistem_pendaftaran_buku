const bcrypt = require('bcrypt');

export const beforeCreate = (password) => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt)
}

export const validatePassword = (password, checkPassword) => {
    return bcrypt.compareSync(password, checkPassword)
}