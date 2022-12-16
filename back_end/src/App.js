import express from "express";
import AppRoute from "./routes";
import sequelize from "./database";

require('dotenv').config();
const session = require('express-session');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 1000 * 60 * 30 }
}));
app.use(cors())
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully');
}).catch(e => {
    console.error(e);
})
app.use(AppRoute);
app.listen(process.env.APP_PORT, () => {
    console.log(`${process.env.APP_NAME} listening on port ${process.env.APP_PORT} and running on ${process.env.APP_URL}`);
});