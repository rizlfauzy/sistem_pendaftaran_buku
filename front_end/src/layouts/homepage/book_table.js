import React, { useEffect, useCallback, useLayoutEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

import useAsync from "../../helpers/hooks/useAsync";
import useAlert from "../../helpers/hooks/useAlert";
import useSession from "../../helpers/hooks/useSession";

import get_data from "../../helpers/fetch/get_data";
import post_data from "../../helpers/fetch/post_data_with_token";
import { isEmpty } from "../../helpers/formatting/validation";

import ProgressLoadingBar from "../loading/progress_loading_bar";
import Alert from "../alert";
import TableComponent from "./table/table_component";
import ModalEditBook from "../modals/modal_edit_book";
import ModalDelete from "../modals/modal_delete";

const { REACT_APP_PREFIX } = process.env;

export default function BookTable({ data_user, isLoading_user,set_is_add, is_add, set_is_edit, is_edit, set_is_delete, is_delete }) {
  const [modal_edit, set_modal_edit] = useState({
    show: false,
    book_id: null,
  });
  const [modal_delete, set_modal_delete] = useState({
    show: false,
    book_id: null,
  });

  const { data, run, isLoading } = useAsync();
  const { session, clear_session_data } = useSession();

  const location = useLocation();
  const { alert, set_alert } = useAlert();

  const on_click_is_read = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const btn_not_read = e.target;
        const { book_id, is_completed } = isEmpty(btn_not_read.dataset) ? btn_not_read.parentElement.dataset : btn_not_read.dataset;
        if (!book_id) throw new Error("Buku tidak ditemukan");
        if (!is_completed) throw new Error("Buku belum ditandai");
        const is_completed_real = is_completed === "1" ? true : false;
        const { error: error_update_read, message: message_update_read } = await run(
          post_data({
            url: "/book",
            method: "PUT",
            token: session,
            data: {
              id: book_id,
              is_completed: !is_completed_real,
            },
          })
        );
        if (error_update_read) throw new Error(message_update_read);
        if (!isLoading_user) {
          run(get_data({ url: `/book/?id=${data_user?.data?.id}`, token: session }));
        }
        set_alert({
          type: "success",
          message: message_update_read,
        });
      } catch (error) {
        set_alert({
          type: "error",
          message: error.message,
        });
      }
    },
    [isLoading_user]
  );

  useLayoutEffect(() => {
    if (alert.is_show) {
      setTimeout(() => {
        set_alert({
          type: "hide",
        });
      }, 5000);
    }
  }, [alert, set_alert]);

  useEffect(() => {
    if (!isLoading_user) {
      run(get_data({ url: `/book/?id=${data_user?.data?.id}`, token: session }));
    }
    set_is_edit(false);
    set_is_delete(false);
    set_is_add({
      is_changed: false,
      title:"",
    });
  }, [isLoading_user, is_add.is_changed, run, session, data_user, is_edit, is_delete]);

  return (
    <>
      {alert.is_show && (
        <Alert color={alert.color} strong_text={alert.strong_text}>
          {alert.message}
        </Alert>
      )}
      {modal_edit.show && <ModalEditBook set_modal_edit={set_modal_edit} book_id={modal_edit.book_id} set_alert={set_alert} set_is_edit={set_is_delete} />}
      {modal_delete.show && <ModalDelete set_modal_delete={set_modal_delete} book_id={modal_delete.book_id} set_alert={set_alert} set_is_delete={set_is_delete} />}
      <div className="full_card card card_login flex flex-wrap bg-white dark:bg-slate-700 mt-10">
        <div className="lg:w-1/2 w-full px-5">
          <div className="card_header">
            <div className="flex">
              <div className="card_greeting dark:text-white">Buku belum dibaca</div>
            </div>
            <div className="card_introduction text-dark">Daftar buku yang belum dibaca</div>
          </div>
          <div className="card_body">
            <div className="table_not_read overflow-x-auto table_container">
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
                    (data?.data?.length && data?.data.filter((item) => item.is_completed === 0).length) > 0 ? (
                      <ProgressLoadingBar element={<TableComponent arr_element={data} is_completed={0} on_click_is_read={on_click_is_read} set_modal_edit={set_modal_edit} set_modal_delete={set_modal_delete} />} />
                    ) : (
                      <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                        <td colSpan="5" className="td_tbody !text-center">
                          Daftar buku masih kosong
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
          </div>
        </div>
        <div className="lg:w-1/2 w-full px-5 lg:mt-0 mt-10">
          <div className="card_header">
            <div className="flex">
              <div className="card_greeting dark:text-white">Buku sudah dibaca</div>
            </div>
            <div className="card_introduction text-dark">Daftar buku yang sudah dibaca</div>
          </div>
          <div className="card_body">
            <div className="table_read overflow-x-auto table_container">
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
                    (data?.data?.length && data?.data.filter((item) => item.is_completed === 1).length) > 0 ? (
                      <ProgressLoadingBar element={<TableComponent arr_element={data} is_completed={1} on_click_is_read={on_click_is_read} set_modal_edit={set_modal_edit} set_modal_delete={set_modal_delete} />} />
                    ) : (
                      <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                        <td colSpan="5" className="td_tbody !text-center">
                          Daftar buku masih kosong
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
          </div>
        </div>
      </div>
    </>
  );
}
