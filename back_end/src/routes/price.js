import { Router } from "express";
import controller from "../controller";
import validateToken from "../middleware/auth";

export default Router()
  .get("/currency", validateToken, controller.price.get_currency)
  .get("/exchange",validateToken,controller.price.calculate_currency)
