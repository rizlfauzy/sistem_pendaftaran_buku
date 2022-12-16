import { Router } from "express";
// import { validateToken } from "../middleware/auth";
import AuthRoute from './auth';
import UserRoute from './user';
import BookRoute from './book';

export default Router()
    .use('/auth', AuthRoute)
    .use('/user', UserRoute)
    .use('/book', BookRoute)
    .use((req, res) => {
        res.status(404).json({ message: 'Not found', error: true });
    })