import express from "express";
import cors from "cors";
import router from "./routes";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
const app = express();
const http = require("http").createServer(app);
require("dotenv").config();
const { PORT, URL,PREFIX_ROUTE } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser("secret"));
app.use(PREFIX_ROUTE, express.static(path.join(__dirname, "build")));

const cookieTime = 1000 * 60 * 30;
app.use(
  session({
    cookie: { maxAge: cookieTime * 4 * 24 },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(router);

http.listen(PORT, () => console.log(`Aplikasi berjalan di ${URL}`));