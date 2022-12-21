import React, { useRef, useState, useLayoutEffect, useCallback, useEffect } from "react";

import useAlert from "../helpers/hooks/useAlert";
import useAsync from "../helpers/hooks/useAsync";
import useSession from "../helpers/hooks/useSession";

import post_data from "../helpers/fetch/post_data_with_token";

import Alert from "./alert";
import InsertSearch from "./homepage/insert_search";
import BookTable from "./homepage/book_table";

export default function HomePage({ data_user, isLoading_user }) {
  const ref_is_read = useRef(null);
  const ref_form_insert_book = useRef(null);

  const [user_id, set_user_id] = useState(() => {
    return isLoading_user ? "" : data_user?.data?.id;
  });
  const [is_add, set_is_add] = useState({
    is_changed: false,
    title: ""
  });
  const [is_edit, set_is_edit] = useState(false);
  const [is_delete, set_is_delete] = useState(false);

  const { alert, set_alert } = useAlert();
  const { run } = useAsync();
  const { session } = useSession();

  const on_submit_form_insert_book = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const form_insert_book = ref_form_insert_book.current;
        const input_is_read = ref_is_read.current;

        const form_data = new FormData(form_insert_book);
        const form = Object.fromEntries(form_data);
        form.is_completed = input_is_read.checked ? "1" : "0";
        const { book_title, book_author, book_year, is_completed } = form;
        if (!book_title) throw new Error("Judul buku tidak boleh kosong");
        if (!book_author) throw new Error("Penulis buku tidak boleh kosong");
        if (!book_year) throw new Error("Tahun buku tidak boleh kosong");
        if (!is_completed) throw new Error("Buku belum ditandai");
        if (parseInt(book_year) > new Date().getFullYear()) throw new Error("Tahun buku tidak boleh lebih besar dari tahun sekarang");
        if (parseInt(book_year) < 1900) throw new Error("Tahun buku tidak boleh kurang dari 1900");
        const { error: error_insert_book, message: message_insert_book } = await run(post_data({ url: "/book", method: "POST", token: session, data: form }));

        if (error_insert_book) throw new Error(message_insert_book);
        set_is_add({
          is_changed: true,
          title: book_title
        });
        form_insert_book.reset();
        set_alert({
          type: "success",
          message: message_insert_book,
        });
      } catch (e) {
        set_alert({
          type: "error",
          message: e.message,
        });
        set_is_add({
          is_changed: false,
          title: ""
        });
      }
    },
    [set_alert, session, run]
  );

  useLayoutEffect(() => {
    if (alert.is_show) {
      setTimeout(() => {
        set_alert({
          type: "hide",
        });
      }, 5000);
    }
  }, [set_alert, alert]);

  useEffect(() => {
    const form_insert_book = ref_form_insert_book.current;

    form_insert_book.addEventListener("submit", on_submit_form_insert_book);

    !isLoading_user && set_user_id(data_user?.data?.id);

    return () => {
      form_insert_book.removeEventListener("submit", on_submit_form_insert_book);
    };
  }, [on_submit_form_insert_book, isLoading_user, data_user]);
  return (
    <>
      {alert.is_show && (
        <Alert color={alert.color} strong_text={alert.strong_text}>
          {alert.message}
        </Alert>
      )}
      <InsertSearch ref_form_insert_book={ref_form_insert_book} ref_is_read={ref_is_read} user_id={user_id} set_alert={set_alert} set_is_add={set_is_add} is_add={is_add} set_is_edit={set_is_edit} is_edit={is_edit} is_delete={is_delete} set_is_delete={set_is_delete} />
      <BookTable data_user={data_user} isLoading_user={isLoading_user} set_is_add={set_is_add} is_add={is_add} set_is_edit={set_is_edit} is_edit={is_edit} set_is_delete={set_is_delete} is_delete={is_delete} />
    </>
  );
}
