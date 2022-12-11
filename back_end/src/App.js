import express from "express";
import AppRoute from "./routes";
import sequelize from "./database";

const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 3000;
dotenv.config();

// route

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
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
app.listen(process.env.APP_HOST, () => {
    console.log(`${process.env.APP_NAME} listening on port ${port} and running on ${process.env.APP_URL}`);
});