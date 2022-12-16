import { Router } from "express";
import controller from "../controller";
import validateToken from "../middleware/auth";

export default Router()
    .get('/', validateToken, controller.user.profil)