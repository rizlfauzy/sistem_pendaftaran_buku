import { Router } from "express";
// import { validateToken } from "../middleware/auth";
import AuthRoute from './auth';
import UserRoute from './user';

export default Router()
    .use('/auth', AuthRoute)
    .use('/user', UserRoute)
    .use((req, res, next) => {
        res.status(404).json({ message: 'Not found' });
    })