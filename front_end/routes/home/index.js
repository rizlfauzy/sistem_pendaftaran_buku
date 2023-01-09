import home from "../../controllers/home";

const router = require("express").Router();

export default router
  .get("/", home.index)
  .get("/profil", home.index)
  .get("/login", home.index)
  .get("/register", home.index)
  .get("/logout", home.index)
  // .get(home.index)