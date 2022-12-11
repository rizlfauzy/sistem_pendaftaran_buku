require('dotenv').config();
const { Sequelize } = require('sequelize');

const {DB_NAME, DB_HOST, DB_PASSWORD, DB_USER} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
})

sequelize.sync();

export default sequelize;