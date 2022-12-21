import React, { useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { useLocation, Navigate } from "react-router-dom";

import useAsync from "../../helpers/hooks/useAsync";
import useSession from "../../helpers/hooks/useSession";

import post_data from "../../helpers/fetch/post_data_with_token";
import get_data from "../../helpers/fetch/get_data";

import LoadingModalEdit from "../loading/loading_modal_edit";

const { REACT_APP_PREFIX } = process.env;

export default function ModalEditBook({ set_modal_edit, book_id, set_alert,set_is_edit }) {
  const location = useLocation();

  const ref_form_edit = useRef(null);
  const ref_is_read = useRef(null);

  const { data, run, isLoading } = useAsync();
  const { run: run_update_data } = useAsync();
  const { session, clear_session_data } = useSession();

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
        if (parseInt(book_year_modal) < 1900) throw new Error("Tahun buku tidak boleh kurang dari 1900")
        if (parseInt(book_year_modal) > new Date().getFullYear()) throw new Error("Tahun buku tidak boleh lebih dari tahun sekarang")
        const { error: error_edit_book, message: message_edit_book } = await run_update_data(post_data({ url: `/book/id`, method: "PUT", token: session, data: data_edit }));
        if (error_edit_book) throw new Error(message_edit_book);
        set_alert({ type: "success", message: message_edit_book });
        set_modal_edit({ show: false, book_id: null });
        set_is_edit(true);
      } catch (e) {
        set_alert({ type: "error", message: e.message });
      }
    },
    [set_alert, session, run_update_data,set_is_edit,set_modal_edit]
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
            <form action="#" method="POST" ref={ref_form_edit}>
              {isLoading ? (
                <LoadingModalEdit />
              ) : data?.data ? (
                <>
                  <input type="hidden" name="book_id_modal" defaultValue={data.data.id} />
                  <div className="mb-3">
                    <input type="text" className="form_control" name="book_title_modal" id="book_title_modal" placeholder="Judul Buku" defaultValue={data.data.title} />
                  </div>
                  <div className="mb-3 flex items-center">
                    <input type="text" className="form_control" name="book_author_modal" id="book_author_modal" placeholder="Penulis Buku" defaultValue={data.data.author} />
                  </div>
                  <div className="mb-3 flex items-center">
                    <input type="text" className="form_control" name="book_year_modal" id="book_year_modal" placeholder="Tahun Terbit" defaultValue={data.data.year} />
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
