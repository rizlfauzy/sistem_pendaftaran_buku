import sequelize from "../database";
import { encrypt, decrypt } from "../utils/encrypt_crypto";
import axios from "axios";

require("dotenv").config();
const {GOOGLE_SECRET_KEY} = process.env;

const book = {};

book.getAllBooks = async (req, res) => {
  try {
    const { id:enc_id } = req.query;
    if (!enc_id) return res.status(400).json({ message: "ID tidak boleh kosong", error: true });
    const id = decrypt(enc_id.replace(/ /g, "+"));
    const [result_select_book] = await sequelize.query(`select id,title,author,year,is_completed,user_id from books where user_id = '${id}'`);
    const arr_result_select_book = result_select_book.map((item) => {
      const str_book = JSON.stringify(item);
      const obj_book = JSON.parse(str_book);
      obj_book.id = encrypt(item.id.toString());
      obj_book.user_id = encrypt(item.user_id.toString());
      return obj_book;
    })
    return res.status(200).json({ message: "Buku berhasil didapatkan", error: false, data: arr_result_select_book });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

book.getBookById = async (req, res) => {
  try {
    const { id: enc_id } = req.query;
    if (!enc_id) return res.status(400).json({ message: "ID buku tidak boleh kosong", error: true });
    const id = decrypt(enc_id.replace(/ /g, "+"));
    const [result_select_book] = await sequelize.query(`select id,title,author,year,thumbnail,description,link_read,list_price,retail_price,currency,is_completed from books where id = '${id}' limit 1`);
    const str_book = JSON.stringify(result_select_book[0]);
    const obj_book = JSON.parse(str_book);
    obj_book.id = encrypt(result_select_book[0].id.toString());
    return res.status(200).json({ message: "Buku berhasil didapatkan", error: false, data: obj_book });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

book.insertBook = async (req, res) => {
  try {
    const {
      book_title: title,
      book_author: author,
      book_year: year,
      is_completed,
      book_image: thumbnail,
      book_description: description,
      book_web_reader_link: link_read,
      book_list_price: list_price,
      book_retail_price: retail_price,
      book_currency: currency,
      book_id: enc_user_id,
    } = req.body;
    if (!title) return res.status(400).json({ message: "Judul tidak boleh kosong", error: true });
    if (!author) return res.status(400).json({ message: "Penulis tidak boleh kosong", error: true });
    if (!year) return res.status(400).json({ message: "Tahun tidak boleh kosong", error: true });
    if (!thumbnail) return res.status(400).json({ message: "Thumbnail tidak boleh kosong", error: true });
    if (!description) return res.status(400).json({ message: "Deskripsi tidak boleh kosong", error: true });
    if(!link_read) return res.status(400).json({ message: "Link untuk membaca tidak boleh kosong", error: true });
    if (!list_price) return res.status(400).json({ message: "Harga awal tidak boleh kosong", error: true });
    if (!retail_price) return res.status(400).json({ message: "Harga setelah diskon tidak boleh kosong", error: true });
    if (!currency) return res.status(400).json({ message: "Kode Mata Uang tidak boleh kosong", error: true });
    if (!is_completed) return res.status(400).json({ message: "Status tidak boleh kosong", error: true });
    if (!enc_user_id) return res.status(400).json({ message: "User ID tidak boleh kosong", error: true });
    const user_id = decrypt(enc_user_id.replace(/ /g, "+"));
    const [result_select_book] = await sequelize.query(`select * from books where title = '${title.replace(/'/g, "''")}' and author = '${author.replace(/'/g, "''")}' and user_id = '${user_id}'`);
    if (result_select_book.length > 0) return res.status(400).json({ message: "Buku sudah ada", error: true });
    const [result_insert_book] = await sequelize.query(`insert into books (title,author,year,thumbnail,description,link_read,list_price,retail_price,currency,is_completed,user_id) values ('${title.replace(/'/g, "''")}','${author.replace(/'/g, "''")}','${year}','${thumbnail}','${description.replace(/'/g, "''")}','${link_read}','${list_price}','${retail_price}','${currency}','${is_completed}','${user_id}')`);
    return res.status(200).json({ message: "Buku berhasil ditambahkan", error: false, data: result_insert_book });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
}

book.searchBook = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) return res.status(400).json({ message: "Kata kunci tidak boleh kosong", error: true });
    const [result_search_book] = await sequelize.query(`select id,title,author,year,is_completed from books where title like '%${search}%' or author like '%${search}%'`);
    const arr_search_book = result_search_book.map(item => {
      const str_book = JSON.stringify(item);
      const obj_book = JSON.parse(str_book);
      obj_book.id = encrypt(item.id.toString());
      return obj_book;
    })
    return res.status(200).json({ message: "Buku berhasil didapatkan", error: false, data: arr_search_book });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
 }

book.updateBookIsRead = async (req, res) => {
  try {
    const { id:enc_id,is_completed } = req.body;
    if (!enc_id) return res.status(400).json({ message: "ID tidak boleh kosong", error: true });
    const is_completed_real = is_completed === true ? 1 : 0;
    const id = decrypt(enc_id.replace(/ /g, "+"));
    const [result_update_book] = await sequelize.query(`update books set is_completed = '${is_completed_real}',updated_at = CURRENT_TIMESTAMP where id = '${id}'`);
    const message = is_completed_real === 1 ? "Buku sudah dibaca" : "Buku belum dibaca";
    return res.status(200).json({ message, error: false, data: result_update_book });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
}

book.updateBook = async (req, res) => {
  try {
    const {
      book_title_modal: title,
      book_author_modal: author,
      book_year_modal: year,
      book_id_modal: enc_id,
      book_description_modal: description,
      book_web_reader_link_modal: link_read,
      book_image_modal: thumbnail,
      book_list_price_modal: list_price,
      book_retail_price_modal: retail_price,
      book_currency_modal: currency,
      is_completed,
    } = req.body;
    if (!title) return res.status(400).json({ message: "Judul tidak boleh kosong", error: true });
    if (!author) return res.status(400).json({ message: "Penulis tidak boleh kosong", error: true });
    if (!year) return res.status(400).json({ message: "Tahun tidak boleh kosong", error: true });
    if (!thumbnail) return res.status(400).json({ message: "Thumbnail tidak boleh kosong", error: true });
    if (!description) return res.status(400).json({ message: "Deskripsi tidak boleh kosong", error: true });
    if (!link_read) return res.status(400).json({ message: "Link untuk membaca tidak boleh kosong", error: true });
    if (!list_price) return res.status(400).json({ message: "Harga awal tidak boleh kosong", error: true });
    if (!retail_price) return res.status(400).json({ message: "Harga setelah diskon tidak boleh kosong", error: true });
    if (!currency) return res.status(400).json({ message: "Kode Mata Uang tidak boleh kosong", error: true });
    if (!enc_id) return res.status(400).json({ message: "ID tidak boleh kosong", error: true });
    const id = decrypt(enc_id.replace(/ /g, "+"));
    const [result_select_book] = await sequelize.query(`select * from books where title = '${title.replace(/'/g, "''")}' and author = '${author.replace(/'/g, "''")}' and id != '${id}'`);
    if (result_select_book.length > 0) return res.status(400).json({ message: "Buku sudah ada", error: true });
    const [result_update_book] = await sequelize.query(`update books set title = '${title.replace(/'/g,"''")}',author = '${author.replace(/'/g,"''")}',year = '${year}',description = '${description.replace(/'/g,"''")}', link_read = '${link_read}',thumbnail = '${thumbnail}',list_price = '${list_price}',retail_price = '${retail_price}',currency = '${currency}',is_completed='${is_completed}',updated_at = CURRENT_TIMESTAMP where id = '${id}'`);
    return res.status(200).json({ message: "Buku berhasil diubah", error: false, data: result_update_book });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
}

book.deleteBook = async (req, res) => {
  try {
    const { id:enc_id } = req.body;
    if (!enc_id) return res.status(400).json({ message: "ID tidak boleh kosong", error: true });
    const id = decrypt(enc_id.replace(/ /g, "+"));
    const [result_delete_book] = await sequelize.query(`delete from books where id = '${id}'`);
    return res.status(200).json({ message: "Buku berhasil dihapus", error: false, data: result_delete_book });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
}

book.getBookByGoogle =async (req, res) => {
  try {
    const { title, author } = req.query;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=${GOOGLE_SECRET_KEY}`;
    const {data} = await axios({
      url,
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    const { items } = data;
    const arr_items = items ? items.map(item => {
      const { id, volumeInfo, accessInfo, saleInfo } = item;
      const { title, authors, publishedDate, publisher, description, imageLinks } = volumeInfo;
      const { webReaderLink } = accessInfo;
      const { listPrice, retailPrice } = saleInfo;
      const obj_item = {
        id,
        title,
        authors,
        publisher,
        publishedDate,
        description,
        imageLinks,
        webReaderLink,
        listPrice,
        retailPrice
      }
      return obj_item;
    }).filter((item, i, self) => i === self.findIndex(t=>t.id === item.id)) : [];
    return res.status(200).json({ message: "Buku berhasil didapatkan", error: false, data: arr_items });
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
}

export default book;