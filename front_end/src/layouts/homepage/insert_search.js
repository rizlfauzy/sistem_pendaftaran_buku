import React, { useState, useCallback, useLayoutEffect, useRef } from "react";

import TableSearch from "./table/table_search";

export default function InsertSearch({ ref_form_insert_book, ref_is_read, user_id, set_alert,set_is_add,is_add, set_is_edit, is_edit, is_delete, set_is_delete }) {
  const ref_input_search = useRef(null);

  const [is_read, set_is_read] = useState(false);
  const [rak_buku, set_rak_buku] = useState("Rak Buku");
  const [table_search, set_table_search] = useState({
    show: false,
    search: null,
  });

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
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [set_alert, set_table_search]
  );

  useLayoutEffect(() => {
    const input_is_read = ref_is_read.current;
    const input_search = ref_input_search.current;

    input_is_read.addEventListener("change", on_change_is_read);
    input_search.addEventListener("input", on_input_input_search);

    is_read ? set_rak_buku("Buku sudah dibaca") : set_rak_buku("Buku belum dibaca");

    return () => {
      input_is_read.removeEventListener("change", on_change_is_read);
      input_search.removeEventListener("input", on_input_input_search);
    };
  }, [on_change_is_read, on_input_input_search, is_read, ref_is_read]);

  return (
    <div className="full_card card card_login flex flex-wrap bg-white dark:bg-slate-700">
      <div className="lg:w-1/2 w-full px-5">
        <div className="card_header">
          <div className="flex">
            <div className="card_greeting dark:text-white">Input Buku</div>
          </div>
          <div className="card_introduction text-dark">Masukkan buku yang ingin dibaca</div>
        </div>
        <div className="card_body">
          <form action="#" method="post" ref={ref_form_insert_book}>
            <input type="hidden" name="book_id" value={user_id} />
            <div className="mb-3 flex items-center">
              <div className="input_group">
                <input type="text" className="form_control" name="book_title" id="book_title" placeholder=" " />
                <label htmlFor="book_title" className="place_label">
                  Judul buku
                </label>
              </div>
            </div>
            <div className="mb-3 flex items-center">
              <div className="input_group">
                <input type="text" className="form_control" name="book_author" id="book_author" placeholder=" " />
                <label htmlFor="book_author" className="place_label">
                  Penulis Buku
                </label>
              </div>
            </div>
            <div className="mb-3 flex items-center">
              <div className="input_group">
                <input type="text" className="form_control" name="book_year" id="book_year" placeholder=" " />
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
              <button type="submit" className="btn btn_primary w-full">
                {rak_buku}
              </button>
            </div>
            <div className="mb-3 flex items-center">
              <button type="reset" className="btn btn_reset w-full">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="lg:w-1/2 w-full px-5 lg:mt-0 mt-10">
        <div className="card_header">
          <div className="flex">
            <div className="card_greeting dark:text-white">Cari Buku</div>
          </div>
          <div className="card_introduction text-dark">Cari buku yang ingin dibaca</div>
        </div>
        <div className="card_body">
          <form action="#" method="post">
            <div className="mb-3 flex items-center">
              <div className="input_group">
                <input type="text" className="form_control" name="book_search" id="book_search" placeholder=" " ref={ref_input_search} />
                <label htmlFor="book_search" className="place_label">
                  Cari buku
                </label>
                <button type="button" className="card_btn_pass">
                  <i className="bi bi-search"></i>
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
