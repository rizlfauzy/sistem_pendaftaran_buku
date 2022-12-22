import { Router } from "express";
import controller from "../controller";
import validateToken from "../middleware/auth";

export default Router()
  .get('/', validateToken, controller.book.getAllBooks)
  .get('/id', validateToken, controller.book.getBookById)
  .get('/search', validateToken, controller.book.searchBook)
  .post('/', validateToken, controller.book.insertBook)
  .put('/', validateToken, controller.book.updateBookIsRead)
  .put("/id", validateToken, controller.book.updateBook)
  .delete("/", validateToken, controller.book.deleteBook)
  .get("/google", controller.book.getBookByGoogle);