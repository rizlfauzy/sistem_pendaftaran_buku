import { Router } from "express";
import controller from "../controller";
import validateToken from "../middleware/auth";
// import controller from '../controller';
// const validateToken = require('../middleware/auth');

export default Router()
    .get('/', validateToken, (req, res) => {
        res.status(200).json({message: 'Success'});
    })