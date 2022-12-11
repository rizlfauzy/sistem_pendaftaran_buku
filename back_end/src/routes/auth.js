import { Router } from "express";
import controller from '../controller';
import multer from "multer";
const upload = multer({ dest: './public' });

export default Router()
    .post('/login', controller.auth.login, controller.auth.generateToken)
    .post('/register', upload.single('photo'), controller.auth.register)