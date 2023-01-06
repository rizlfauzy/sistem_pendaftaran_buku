import React, { useEffect, useRef, useLayoutEffect, useCallback, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

import useAsync from "../../helpers/hooks/useAsync";
import useSession from "../../helpers/hooks/useSession";

import post_data from "../../helpers/fetch/post_data_with_token";
import get_data from "../../helpers/fetch/get_data";

import { addClass, removeClass } from "../../helpers/formatting/class_name_modifier";
import { isNumeric } from "../../helpers/formatting/validation";

import LoadingModalEdit from "../loading/loading_modal_edit";
import PopUpGoogle from "../pop_up/pop_up_show_google";

const { REACT_APP_PREFIX } = process.env;

export default function ModalEditBook({ set_modal_edit, book_id, set_alert, set_is_edit }) {
  const location = useLocation();

  const ref_form_edit = useRef(null);
  const ref_is_read = useRef(null);
  const ref_pop_up = useRef(null);

  const [list_books, set_list_books] = useState(null);

  const { data, run, isLoading } = useAsync();
  const { run: run_update_data } = useAsync();
  const { run: run_google } = useAsync();
  const { session, clear_session_data } = useSession();

  const on_input_search_google = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const input_title = document.querySelector("input[name='book_title_modal']");
        const input_author = document.querySelector("input[name='book_author_modal']");
        const pop_up = ref_pop_up.current;

        const value_title = input_title.value;
        const value_author = input_author.value;

        if (value_title.length < 1 && value_author.length < 1) {
          addClass(pop_up, "on_hidden");
          removeClass(pop_up, "on_pop");
          return;
        }
        addClass(pop_up, "on_pop");
        removeClass(pop_up, "on_hidden");

        const { error: error_google, message: message_google, data: list_books } = await run_google(get_data({ url: `/book/google/?title=${value_title}&author=${value_author}`, token: session }));
        if (error_google) throw new Error(message_google);
        set_list_books(list_books);
      } catch (e) {
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [set_alert, run_google, session]
  );

  const on_click_row_tbody = useCallback((e) => {
    e.preventDefault();

    const pop_up = ref_pop_up.current;
    addClass(pop_up, "on_hidden");
    removeClass(pop_up, "on_pop");
    const row_body = e.currentTarget;
    const input_title = document.querySelector("input[name='book_title_modal']");
    const input_author = document.querySelector("input[name='book_author_modal']");
    const input_year = document.querySelector("input[name='book_year_modal']");
    const input_description = document.querySelector("input[name='book_description_modal']");
    const input_web_reader_link = document.querySelector("input[name='book_web_reader_link_modal']");
    const input_image = document.querySelector("input[name='book_image_modal']");
    const input_list_price = document.querySelector("input[name='book_list_price_modal']");
    const input_retail_price = document.querySelector("input[name='book_retail_price_modal']");
    const input_currency = document.querySelector("input[name='book_currency_modal']")

    const apply_title = row_body.querySelector("input[name='apply_title']");
    const apply_author = row_body.querySelector("input[name='apply_author']");
    const apply_year = row_body.querySelector("input[name='apply_year']");
    const apply_description = row_body.querySelector("input[name='apply_description']");
    const apply_web_reader_link = row_body.querySelector("input[name='apply_web_reader_link']");
    const apply_image = row_body.querySelector("input[name='apply_image']");
    const apply_list_price = row_body.querySelector("input[name='apply_list_price']");
    const apply_retail_price = row_body.querySelector("input[name='apply_retail_price']");
    const currency = row_body.querySelector("input[name='apply_currency']");

    input_title.value = apply_title.value;
    input_author.value = apply_author.value;
    input_year.value = apply_year.value;
    input_description.value = apply_description.value;
    input_web_reader_link.value = apply_web_reader_link.value;
    input_image.value = apply_image.value;
    input_list_price.value = apply_list_price.value;
    input_retail_price.value = apply_retail_price.value;
    input_currency.value = currency.value;
  }, []);

  const on_submit_edit_book = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const input_is_read = ref_is_read.current;
        const form_data = new FormData(ref_form_edit.current);
        const data_edit = Object.fromEntries(form_data);
        data_edit.is_completed = input_is_read.checked ? 1 : 0;
        const { book_id_modal, book_title_modal, book_author_modal, book_year_modal } = data_edit;
        if (!book_id_modal) throw new Error("Buku tidak ditemukan");
        if (!book_title_modal) throw new Error("Judul buku tidak boleh kosong");
        if (!book_author_modal) throw new Error("Penulis buku tidak boleh kosong");
        if (!book_year_modal) throw new Error("Tahun buku tidak boleh kosong");
        data_edit.book_description_modal = data_edit.book_description_modal || "Deskripsi tidak diketahui";
        data_edit.book_web_reader_link_modal = data_edit.book_web_reader_link_modal || "Link tidak diketahui";
        data_edit.book_image_modal = data_edit.book_image_modal || "https://via.placeholder.com/128x193";
        data_edit.book_list_price_modal = data_edit.book_list_price_modal || "-";
        data_edit.book_retail_price_modal = data_edit.book_retail_price_modal || "-";
        data_edit.book_currency_modal = data_edit.book_currency_modal || "IDR";
        if (!isNumeric(book_year_modal)) throw new Error("Pastikan tahun berupa angka");
        if (parseInt(book_year_modal) < 1900) throw new Error("Tahun buku tidak boleh kurang dari 1900");
        if (parseInt(book_year_modal) > new Date().getFullYear()) throw new Error("Tahun buku tidak boleh lebih dari tahun sekarang");
        const { error: error_edit_book, message: message_edit_book } = await run_update_data(post_data({ url: `/book/id`, method: "PUT", token: session, data: data_edit }));
        if (error_edit_book) throw new Error(message_edit_book);
        set_alert({ type: "success", message: message_edit_book });
        set_modal_edit({ show: false, book_id: null });
        set_is_edit(true);
      } catch (e) {
        if (e.message.toLowerCase().includes("failed to fetch")) e.message = "koneksi gagal, sepertinya Anda sedang offline !!!";
        set_alert({ type: "error", message: e.message });
      }
    },
    [set_alert, session, run_update_data, set_is_edit, set_modal_edit]
  );

  useLayoutEffect(() => {
    run(get_data({ url: `/book/id/?id=${book_id}`, token: session }));
  }, [book_id, run, session]);

  useEffect(() => {
    const form_edit = ref_form_edit.current;
    form_edit.addEventListener("submit", on_submit_edit_book);

    return () => {
      form_edit.removeEventListener("submit", on_submit_edit_book);
    };
  }, [on_submit_edit_book]);

  return (
    <div
      className="modal_box"
      id="modal_edit_book"
      onClick={(e) => {
        e.target.id === "modal_edit_book" && set_modal_edit({ show: false, book_id: null });
      }}
    >
      <span
        className="modal_close"
        title="Close Modal"
        onClick={set_modal_edit.bind(this, {
          show: false,
          book_id: null,
        })}
      >
        x
      </span>
      <div className="modal_content">
        <div className="modal_container">
          <div className="modal_header mb-3">Edit Buku</div>
          <hr className="border-b-2 border-light-green mb-3" />
          <div className="modal_body">
            <form action="#" method="POST" ref={ref_form_edit} className="pop_up_wrapper">
              {isLoading ? (
                <LoadingModalEdit />
              ) : data?.data ? (
                <>
                  <PopUpGoogle ref_pop_up={ref_pop_up} list_books={list_books} on_click_row_tbody={on_click_row_tbody} />
                  <input type="hidden" name="book_id_modal" defaultValue={data.data.id} />
                  <input type="text" className="hidden" name="book_description_modal" defaultValue={data.data.description} />
                  <input type="text" className="hidden" name="book_web_reader_link_modal" defaultValue={data.data.link_read} />
                  <input type="text" className="hidden" name="book_image_modal" defaultValue={data.data.thumbnail} />
                  <input type="text" className="hidden" name="book_list_price_modal" defaultValue={data.data.list_price} />
                  <input type="text" className="hidden" name="book_retail_price_modal" defaultValue={data.data.retail_price} />
                  <input type="text" className="hidden" name="book_currency_modal" defaultValue={data.data.currency} />
                  <div className="mb-3">
                    <div className="input_group">
                      <input type="text" className="form_control" name="book_title_modal" id="book_title_modal" placeholder=" " defaultValue={data.data.title} onInput={on_input_search_google} />
                      <label htmlFor="book_title_modal" className="place_label">
                        Judul Buku
                      </label>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="input_group">
                      <input type="text" className="form_control" name="book_author_modal" id="book_author_modal" placeholder=" " defaultValue={data.data.author} onInput={on_input_search_google} />
                      <label htmlFor="book_author_modal" className="place_label">
                        Penulis Buku
                      </label>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="input_group">
                      <input type="text" className="form_control" name="book_year_modal" id="book_year_modal" placeholder=" " defaultValue={data.data.year} />
                      <label htmlFor="book_year_modal" className="place_label">
                        Tahun Terbit
                      </label>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex">
                      <span className="mr-2 text-sm text-slate-500 dark:text-primary">Belum</span>
                      <input type="checkbox" className="hidden" id="is_read_modal" defaultChecked={data.data.is_completed === 1 ? true : false} ref={ref_is_read} />
                      <label htmlFor="is_read_modal">
                        <div className="flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-500 p-1">
                          <div className="toggle-circle h-4 w-4 rounded-full bg-white transition duration-300 ease-in-out"></div>
                        </div>
                      </label>
                      <span className="ml-2 text-sm text-slate-500 dark:text-primary">Sudah</span>
                      <span className="ml-4 text-sm text-light-green">Baca</span>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <button type="submit" className="btn btn_primary w-full">
                      Edit Buku
                    </button>
                  </div>
                </>
              ) : session ? (
                clear_session_data()
              ) : (
                <Navigate to={`${REACT_APP_PREFIX}login`} replace state={{ from: location }} />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
