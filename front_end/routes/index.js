import home from "./home";

const router = require("express").Router();

require("dotenv").config();
const { PREFIX_ROUTE } = process.env;

export default router
  .use(PREFIX_ROUTE, home)
  // .use(home)