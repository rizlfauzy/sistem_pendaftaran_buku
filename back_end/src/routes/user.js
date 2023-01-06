import { Router } from "express";
import controller from "../controller";
import validateToken from "../middleware/auth";
import multer from "multer";
const upload = multer({ dest: "./public" });

export default Router()
    .get('/', validateToken, controller.user.profil)
    .put('/photo', validateToken, upload.single('photo'), controller.user.update_photo)
    .put('/', validateToken, controller.user.update_profil)
    .put("/password",validateToken,controller.user.update_pass)
