import React, { useState, useCallback, useLayoutEffect, useRef } from "react";

import TableSearch from "./table/table_search";
import PopUpGoogle from "../pop_up/pop_up_show_google";

import useAsync from "../../helpers/hooks/useAsync";
import useSession from "../../helpers/hooks/useSession";

import { addClass, removeClass } from "../../helpers/formatting/class_name_modifier";
import get_data from "../../helpers/fetch/get_data";

export default function InsertSearch({ ref_form_insert_book, ref_is_read, ref_pop_up, user_id, set_alert, set_is_add, is_add, set_is_edit, is_edit, is_delete, set_is_delete }) {
  const ref_input_search = useRef(null);
  const ref_input_title = useRef(null);
  const ref_input_author = useRef(null);
  const ref_input_year = useRef(null);
  const ref_input_description = useRef(null);
  const ref_input_web_reader_link = useRef(null);
  const ref_input_image = useRef(null);
  const ref_input_list_price = useRef(null);
  const ref_input_retail_price = useRef(null);
  const ref_input_currency = useRef(null);
  const ref_card_insert_search = useRef(null);

  const { run } = useAsync();
  const { session } = useSession();

  const [is_read, set_is_read] = useState(false);
  const [rak_buku, set_rak_buku] = useState("Rak Buku");
  const [table_search, set_table_search] = useState({
    show: false,
    search: null,
  });
  const [list_books, set_list_books] = useState(null);

  const on_change_is_read = useCallback(
    (e) => {
      e.preventDefault();
      set_is_read(!is_read);
    },
    [is_read]
  );

  const on_input_input_search = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const input_search = ref_input_search.current;

        const { value } = input_search;
        if (value.length < 1) {
          set_table_search({
            show: false,
            search: null,
          });
          return;
        }
        set_table_search({
          show: true,
          search: value,
        });
      } catch (e) {
        if (e.message.toLowerCase().includes("failed to fetch")) e.message = "koneksi gagal, sepertinya Anda sedang offline !!!";
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [set_alert, set_table_search]
  );

  const on_input_search_google = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const input_title = ref_input_title.current;
        const input_author = ref_input_author.current;
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

        const { error: error_google, message: message_google, data: list_books } = await run(get_data({ url: `/book/google/?title=${value_title}&author=${value_author}`, token: session }));
        if (error_google) throw new Error(message_google);
        set_list_books(list_books);
      } catch (e) {
        if (e.message.toLowerCase().includes("failed to fetch")) e.message = "koneksi gagal, sepertinya Anda sedang offline !!!";
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [set_alert, run, session, ref_pop_up]
  );

  const on_click_row_tbody = useCallback(
    (e) => {
      e.preventDefault();

      const pop_up = ref_pop_up.current;
      addClass(pop_up, "on_hidden");
      removeClass(pop_up, "on_pop");
      const row_body = e.currentTarget;
      const input_title = ref_input_title.current;
      const input_author = ref_input_author.current;
      const input_year = ref_input_year.current;
      const input_description = ref_input_description.current;
      const input_web_reader_link = ref_input_web_reader_link.current;
      const input_image = ref_input_image.current;
      const input_list_price = ref_input_list_price.current;
      const input_retail_price = ref_input_retail_price.current;
      const input_currency = ref_input_currency.current;

      const apply_title = row_body.querySelector("input[name='apply_title']");
      const apply_author = row_body.querySelector("input[name='apply_author']");
      const apply_year = row_body.querySelector("input[name='apply_year']");
      const apply_description = row_body.querySelector("input[name='apply_description']");
      const apply_web_reader_link = row_body.querySelector("input[name='apply_web_reader_link']");
      const apply_image = row_body.querySelector("input[name='apply_image']");
      const apply_list_price = row_body.querySelector("input[name='apply_list_price']");
      const apply_retail_price = row_body.querySelector("input[name='apply_retail_price']");
      const currency = row_body.querySelector("input[name='apply_currency']")

      input_title.value = apply_title.value;
      input_author.value = apply_author.value;
      input_year.value = apply_year.value;
      input_description.value = apply_description.value;
      input_web_reader_link.value = apply_web_reader_link.value;
      input_image.value = apply_image.value;
      input_list_price.value = apply_list_price.value;
      input_retail_price.value = apply_retail_price.value;
      input_currency.value = currency.value
    },
    [ref_pop_up]
  );

  useLayoutEffect(() => {
    const input_is_read = ref_is_read.current;
    const input_search = ref_input_search.current;
    const input_title = ref_input_title.current;
    const input_author = ref_input_author.current;

    input_is_read.addEventListener("change", on_change_is_read);
    input_search.addEventListener("input", on_input_input_search);
    input_title.addEventListener("input", on_input_search_google);
    input_author.addEventListener("input", on_input_search_google);

    is_read ? set_rak_buku("Buku sudah dibaca") : set_rak_buku("Buku belum dibaca");

    return () => {
      input_is_read.removeEventListener("change", on_change_is_read);
      input_search.removeEventListener("input", on_input_input_search);
      input_title.removeEventListener("input", on_input_search_google);
      input_author.removeEventListener("input", on_input_search_google);
    };
  }, [on_change_is_read, on_input_input_search, on_input_search_google, is_read, ref_is_read]);

  return (
    <div className="full_card card card_login flex flex-wrap bg-white dark:bg-slate-700 gs_trigger gs_trigger_from_down" ref={ref_card_insert_search}>
      <div className="lg:w-1/2 w-full px-5 gs_trigger gs_trigger_from_left" id="register_book">
        <div className="card_header">
          <div className="flex">
            <div className="card_greeting dark:text-white">Daftarkan Buku</div>
          </div>
          <div className="card_introduction text-dark">Masukkan buku yang ingin dibaca</div>
        </div>
        <div className="card_body">
          <form action="#" method="post" ref={ref_form_insert_book} className="pop_up_wrapper">
            <PopUpGoogle ref_pop_up={ref_pop_up} list_books={list_books} on_click_row_tbody={on_click_row_tbody} />
            <input type="hidden" name="book_id" value={user_id} />
            <input type="text" className="hidden" name="book_description" ref={ref_input_description} />
            <input type="text" className="hidden" name="book_web_reader_link" ref={ref_input_web_reader_link} />
            <input type="text" className="hidden" name="book_image" ref={ref_input_image} />
            <input type="text" className="hidden" name="book_list_price" ref={ref_input_list_price} />
            <input type="text" className="hidden" name="book_retail_price" ref={ref_input_retail_price} />
            <input type="text" className="hidden" name="book_currency" ref={ref_input_currency} />
            <div className="mb-3 flex items-center">
              <div className="input_group">
                <input type="text" className="form_control" name="book_title" id="book_title" placeholder=" " ref={ref_input_title} />
                <label htmlFor="book_title" className="place_label">
                  Judul buku
                </label>
              </div>
            </div>
            <div className="mb-3 flex items-center">
              <div className="input_group">
                <input type="text" className="form_control" name="book_author" id="book_author" placeholder=" " ref={ref_input_author} />
                <label htmlFor="book_author" className="place_label">
                  Penulis Buku
                </label>
              </div>
            </div>
            <div className="mb-3 flex items-center">
              <div className="input_group">
                <input type="text" className="form_control" name="book_year" id="book_year" placeholder=" " ref={ref_input_year} />
                <label htmlFor="book_year" className="place_label">
                  Tahun Buku
                </label>
              </div>
            </div>
            <div className="mb-3 flex items-center">
              <div className="flex">
                <span className="mr-2 text-sm text-slate-500 dark:text-primary">Belum</span>
                <input type="checkbox" className="hidden" id="is_read" ref={ref_is_read} defaultChecked={is_read} />
                <label htmlFor="is_read">
                  <div className="flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-500 p-1">
                    <div className="toggle-circle h-4 w-4 rounded-full bg-white transition duration-300 ease-in-out"></div>
                  </div>
                </label>
                <span className="ml-2 text-sm text-slate-500 dark:text-primary">Sudah</span>
                <span className="ml-4 text-sm text-light-green">Baca</span>
              </div>
            </div>
            <div className="mb-3 flex items-center">
              <button type="submit" className="btn btn_primary md:w-[75%] md:mx-auto w-full">
                {rak_buku}
              </button>
            </div>
            <div className="mb-3 flex items-center">
              <button type="reset" className="btn btn_reset md:w-[75%] md:mx-auto w-full">
                Ulang
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="lg:w-1/2 w-full px-5 lg:mt-0 mt-10 gs_trigger gs_trigger_from_right" id="searching_book">
        <div className="card_header">
          <div className="flex">
            <div className="card_greeting dark:text-white">Mau Cari Buku Apa ?</div>
          </div>
          <div className="card_introduction text-dark">Cari buku yang ada didaftar di sini yuk !!!</div>
        </div>
        <div className="card_body">
          <form action="#" method="post">
            <div className="mb-3 flex items-center">
              <div className="input_group">
                <input type="text" className="form_control" name="book_search" id="book_search" placeholder=" " ref={ref_input_search} />
                <label htmlFor="book_search" className="place_label">
                  Cari buku
                </label>
                <button
                  type="button"
                  className="card_btn_pass"
                  onClick={(e) => {
                    e.preventDefault();
                    const input_search = ref_input_search.current;
                    input_search.value = "";
                    set_table_search({
                      show: false,
                      search: null,
                    });
                  }}
                >
                  <i className="bi bi-x dark:text-white"></i>
                </button>
              </div>
            </div>
          </form>
          {table_search.show && <TableSearch search={table_search.search} set_alert={set_alert} set_is_add={set_is_add} is_add={is_add} set_is_edit={set_is_edit} is_edit={is_edit} set_is_delete={set_is_delete} is_delete={is_delete} />}
        </div>
      </div>
    </div>
  );
}
