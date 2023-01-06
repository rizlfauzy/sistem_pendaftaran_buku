import React, { useLayoutEffect, useCallback, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

import useAsync from "../../../helpers/hooks/useAsync";
import useSession from "../../../helpers/hooks/useSession";

import get_data from "../../../helpers/fetch/get_data";
import post_data from "../../../helpers/fetch/post_data_with_token";
import { isEmpty } from "../../../helpers/formatting/validation";

import ProgressLoadingBar from "../../loading/progress_loading_bar";
import ModalEditBook from "../../modals/modal_edit_book";
import ModalDelete from "../../modals/modal_delete";
import ModalShowBook from "../../modals/modal_show_book";

const { REACT_APP_PREFIX } = process.env;

export default function TableSearch({ search, set_alert,set_is_add,is_add, set_is_edit, is_edit, set_is_delete, is_delete }) {
  const location = useLocation();

  const { data, run, isLoading } = useAsync();
  const { run: run_update } = useAsync();
  const { session, clear_session_data } = useSession();

  const [is_read, set_is_read] = useState(false);
  const [modal_edit, set_modal_edit] = useState({
    show: false,
    book_id: null,
  });
  const [modal_delete, set_modal_delete] = useState({
    show: false,
    book_id: null,
  });
  const [modal_show, set_modal_show] = useState({
    show: false,
    book_id: null,
  });

  const on_click_is_read = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const btn_read = e.target;
        const { book_id, is_completed } = isEmpty(btn_read.dataset) ? btn_read.parentElement.dataset : btn_read.dataset;
        if (!book_id) throw new Error("Buku tidak ditemukan");
        if (!is_completed) throw new Error("Buku belum ditandai");
        const is_completed_real = is_completed === "1" ? true : false;
        const { error: error_update_read, message: message_update_read } = await run_update(post_data({ url: "/book", method: "PUT", token: session, data: { id: book_id, is_completed: !is_completed_real } }));
        if (error_update_read) throw new Error(message_update_read);
        set_is_read(true);
        set_is_edit(true);
        set_is_delete(true);
        set_alert({
          type: "success",
          message: message_update_read,
        });
      } catch (error) {
        if (e.message.toLowerCase().includes("failed to fetch")) e.message = "koneksi gagal, sepertinya Anda sedang offline !!!";
        set_alert({
          type: "error",
          message: error.message,
        });
      }
    },
    [set_alert, run_update, session, set_is_read, set_is_edit, set_is_delete]
  );

  useLayoutEffect(() => {
    run(get_data({ url: "/book/search/?search=" + search, token: session }));
    set_is_read(false);
    set_is_edit(false);
    set_is_delete(false);
  }, [search, run, session, run_update, is_read, is_add.is_changed, is_edit, is_delete]);

    return (
      <>
        {modal_show.show && <ModalShowBook set_modal_show={set_modal_show} book_id={modal_show.book_id} set_alert={set_alert} />}
        {modal_edit.show && <ModalEditBook set_modal_edit={set_modal_edit} book_id={modal_edit.book_id} set_alert={set_alert} set_is_edit={set_is_edit} />}
        {modal_delete.show && <ModalDelete set_modal_delete={set_modal_delete} book_id={modal_delete.book_id} set_alert={set_alert} set_is_delete={set_is_delete} />}
        <div className="table_search overflow-x-auto table_container !max-h-[35vh]">
          <table className="table w-full">
            <thead className="bg-light-green border-b dark:border-slate-700 border-white">
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
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                  <td colSpan="5" className="td_tbody !text-center">
                    Loading ...
                  </td>
                </tr>
              ) : data?.data ? (
                data?.data?.length > 0 ? (
                  <ProgressLoadingBar
                    element={data?.data.map((item, index) => {
                      return (
                        <tr
                          key={item.id}
                          className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={set_modal_show.bind(this, { show: true, book_id: item.id })}
                        >
                          <td className="td_tbody">{index + 1}</td>
                          <td className="td_tbody">{item.title}</td>
                          <td className="td_tbody">{item.author}</td>
                          <td className="td_tbody">{item.year}</td>
                          <td className="td_tbody">
                            <button type="button" className="btn btn_primary w-full mb-3" data-book_id={item.id} data-is_completed={item.is_completed} onClick={on_click_is_read.bind(this)}>
                              {item.is_completed === 0 ? <i className="bi bi-book-fill text-white"></i> : <i className="bi bi-book text-white"></i>}
                            </button>
                            <button
                              type="button"
                              className="btn btn_warning w-full mb-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                set_modal_edit({
                                  show: true,
                                  book_id: item.id,
                                });
                              }}
                            >
                              <i className="bi bi-pencil-fill text-white"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn_reset w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                set_modal_delete({
                                  show: true,
                                  book_id: item.id,
                                });
                              }}
                            >
                              <i className="bi bi-trash-fill text-white"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  />
                ) : (
                  <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                    <td colSpan="5" className="td_tbody !text-center">
                      Buku tidak bisa ditemukan
                    </td>
                  </tr>
                )
              ) : session ? (
                clear_session_data()
              ) : (
                <Navigate to={`${REACT_APP_PREFIX}login`} replace state={{ from: location }} />
              )}
            </tbody>
          </table>
        </div>
      </>
    );
}
