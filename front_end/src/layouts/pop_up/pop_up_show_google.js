import React from 'react'

import { addClass,removeClass } from '../../helpers/formatting/class_name_modifier';

export default function PopUpGoogle({ref_pop_up,list_books,on_click_row_tbody,new_class = ""}) {
  return (
    <div className={[new_class, "pop_up content_table_pop_up on_hidden"].join(" ")} ref={ref_pop_up}>
      <div className="pop_up_header">
        <div className="pop_up_title">Hasil Pencarian</div>
        <div className="pop_up_close">
          <button
            type="button"
            className="btn btn_reset"
            onClick={() => {
              const pop_up = ref_pop_up.current;
              addClass(pop_up, "on_hidden");
              removeClass(pop_up, "on_pop");
            }}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>
      <div className="pop_up_table">
        <div className="table_container table_pop !max-h-[30vh]">
          <table className="table w-full">
            <thead className="pop_up_thead bg-light-green border-b dark:border-slate-700 border-white">
              <tr>
                <th scope="col" className="th_thead">
                  No
                </th>
                <th scope="col" className="th_thead">
                  Judul
                </th>
                <th scope="col" className="th_thead">
                  Penulis
                </th>
                <th scope="col" className="th_thead">
                  Tahun
                </th>
                <th scope="col" className="th_thead">
                  Gambar
                </th>
              </tr>
            </thead>
            <tbody className="pop_up_tbody">
              {!list_books ? (
                <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                  <td colSpan="6" className="td_tbody !text-center">
                    Loading ...
                  </td>
                </tr>
              ) : list_books.length < 1 ? (
                <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                  <td colSpan="6" className="td_tbody !text-center">
                    Buku tidak bisa ditemukan
                  </td>
                </tr>
              ) : (
                list_books.map((book, index) => {
                  const screen_width = window.innerWidth;
                  const { imageLinks, title, publishedDate, authors, description, webReaderLink, listPrice, retailPrice } = book;
                  const book_thumbnail = imageLinks ? imageLinks.thumbnail.replace(/(https|http)/i, "https") : "https://via.placeholder.com/128x193";
                  const book_small_thumbnail = imageLinks ? imageLinks.smallThumbnail.replace(/(https|http)/i, "https") : "https://via.placeholder.com/100x150";
                  const book_image = screen_width > 768 ? book_thumbnail : book_small_thumbnail;
                  const book_title_tall = title.length > 20 ? title.substring(0, 20) + "..." : title;
                  const book_title_short = title.length > 10 ? title.substring(0, 10) + "..." : title;
                  const book_title = screen_width > 768 ? book_title_tall : book_title_short;
                  const book_year = publishedDate ? publishedDate.substring(0, 4) : "Tahun tidak diketahui";
                  const book_author_tall = authors ? authors.join(", ") : "Penulis tidak diketahui";
                  const book_author = book_author_tall.length > 4 ? book_author_tall.substring(0, 4) + "..." : book_author_tall;
                  const book_description = description || "Deskripsi tidak diketahui";
                  const book_list_price = listPrice ? listPrice.amount : "-";
                  const book_retail_price = retailPrice ? retailPrice.amount : "-";
                  const currency = listPrice ? listPrice.currencyCode : "IDR";
                  return (
                    <tr key={book.id} className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer" onClick={on_click_row_tbody.bind(this)}>
                      <td className="td_tbody" width="5%">
                        {index + 1}
                      </td>
                      <td className="td_tbody" width="25%">
                        {book_title}
                        <input type="hidden" name="apply_title" value={title} />
                      </td>
                      <td className="td_tbody" width="15%">
                        {book_author}
                        <input type="hidden" name="apply_author" value={book_author_tall} />
                      </td>
                      <td className="td_tbody" width="15%">
                        {book_year}
                        <input type="hidden" name="apply_year" value={book_year === "Tahun tidak diketahui" ? "" : book_year} />
                      </td>
                      <td className="td_tbody" width="30%">
                        <input type="hidden" name="apply_description" value={book_description} />
                        <input type="hidden" name="apply_web_reader_link" value={webReaderLink} />
                        <input type="hidden" name="apply_image" value={book_image} />
                        <input type="hidden" name="apply_list_price" value={book_list_price} />
                        <input type="hidden" name="apply_retail_price" value={book_retail_price} />
                        <input type="hidden" name="apply_currency" value={currency} />
                        <div className="pop_up_content_image">
                          <img src={book_image} alt={book_title} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
