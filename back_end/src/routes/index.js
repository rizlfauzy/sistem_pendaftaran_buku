import { Router } from "express";
// import { validateToken } from "../middleware/auth";
import AuthRoute from './auth';
import UserRoute from './user';
import BookRoute from './book';

require('dotenv').config();
const {PREFIX_ROUTE} = process.env;

export default Router()
    .use(`${PREFIX_ROUTE}auth`, AuthRoute)
    .use(`${PREFIX_ROUTE}user`, UserRoute)
    .use(`${PREFIX_ROUTE}book`, BookRoute)
    .use((req, res) => {
        res.status(404).json({ message: 'Not found',error:true });
    })