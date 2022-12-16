import express from "express";
import AppRoute from "./routes";
import sequelize from "./database";

require('dotenv').config();
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const http = require('http').createServer(app);
const port = 5000;

// route

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secret"));
app.use(session({
    cookie: { maxAge: 1000 * 60 * 30 },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(cors())
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully');
}).catch(e => {
    console.error(e);
})
app.use(AppRoute);
http.listen(process.env.APP_HOST, () => {
    console.log(`${process.env.APP_NAME} listening on port ${port} and running on ${process.env.APP_URL}`);
});