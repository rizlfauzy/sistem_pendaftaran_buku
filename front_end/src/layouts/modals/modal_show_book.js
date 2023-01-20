import React, { useLayoutEffect, useRef, useCallback,useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

import useAsync from "../../helpers/hooks/useAsync";
import useSession from "../../helpers/hooks/useSession";

import get_data from "../../helpers/fetch/get_data";
import { format_rupiah } from "../../helpers/formatting/format_rupiah";
import { addClass, removeClass } from "../../helpers/formatting/class_name_modifier";

import PopUpCurrency from "../pop_up/pop_up_currency";

const { REACT_APP_PREFIX } = process.env;

function InputCurrency({ on_currency }) {
  return (
    <>
      <div className="input_group !items-center">
        <input type="text" className="form_control !py-1 !px-2 !w-[60%] !flex-none" name="to_rate" id="to_rate" placeholder=" " onClick={on_currency.bind(this)} onInput={on_currency.bind(this)} />
        <label htmlFor="to_rate" className="place_label label_modal">
          Pilih mata uang
        </label>
        <span className="currency_result ml-3"></span>
      </div>
    </>
  );
}

export default function ModalShowBook({ set_modal_show, book_id,set_alert }) {
  const { data, run, isLoading } = useAsync();
  const { run: run_currency } = useAsync();
  const {run:run_exchange} = useAsync()
  const { session, clear_session_data } = useSession();

  const ref_pop_up = useRef(null);

  const [list_currency, set_currency] = useState(null);

  const location = useLocation();

  const on_currency = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const { value } = e.currentTarget;
        const price_book = document.querySelector(".price_book").innerHTML;
        const [, currency_from] = price_book.split(" ");
        const pop_up = ref_pop_up.current;
        addClass(pop_up, "on_pop");
        removeClass(pop_up, "on_hidden");
        const { error: error_currency, message: message_currency, data: list_currencies } = await run_currency(get_data({ url: `/price/currency/?currency=${value}&exclude=${currency_from}`, token: session }));
        if (error_currency) throw new Error(message_currency);
        if (value.toLowerCase() === currency_from.toLowerCase()) {
          set_alert({
            type: "error",
            message: "Konversi mata uang sudah ada",
          });
        }
        set_currency(list_currencies);
      } catch (e) {
        if (e.message.toLowerCase().includes("failed to fetch")) e.message = "koneksi gagal, sepertinya Anda sedang offline !!!";
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [run_currency, session, set_alert]
  );

  const on_click_row = useCallback(async(e) => {
    e.preventDefault();
    try {
      const pop_up = ref_pop_up.current;
      addClass(pop_up, "on_hidden");
      removeClass(pop_up, "on_pop");

      const row_body = e.currentTarget;
      const apply_currency_pop_up = row_body.querySelector("input[name='apply_currency_pop_up']");
      const input_currency = document.querySelector("#to_rate");
      const price_book = document.querySelector(".price_book").innerHTML;
      const span_currency = document.querySelector(".currency_result");

      input_currency.value = apply_currency_pop_up.value

      const [price, currency_from] = price_book.split(" ");
      const amount = currency_from === "IDR" ? price.replace(/\./g, "") : price;
      const currency_to = input_currency.value;

      const { error: error_exchange,message: message_exchange, data: data_currency } = await run_exchange(get_data({ url: `/price/exchange/?to=${currency_to}&from=${currency_from}&amount=${amount}`,token:session }));

      if (error_exchange) throw new Error(message_exchange);
      const { result, query } = data_currency;
      const currency = currency_to === "IDR" ? format_rupiah(Math.round(result).toString()) : parseFloat(result).toFixed(2).replace(/\./g, ",");
      span_currency.innerHTML = `${currency} ${query.to}`;
    } catch (e) {
      if (e.message.toLowerCase().includes("failed to fetch")) e.message = "koneksi gagal, sepertinya Anda sedang offline !!!";
      set_alert({
        type: "error",
        message: e.message,
      });
    }
  },[set_alert,run_exchange,session])

  useLayoutEffect(() => {
    run(get_data({ url: `/book/id/?id=${book_id}`, token: session }));
  }, [book_id, run, session]);

  return (
    <div
      className="modal_box"
      id="modal_show_book"
      onClick={(e) => {
        e.target.id === "modal_show_book" && set_modal_show({ show: false, book_id: null });
      }}
    >
      <span
        className="modal_close"
        title="Close Modal"
        onClick={set_modal_show.bind(this, {
          show: false,
          book_id: null,
        })}
      >
        x
      </span>
      <div className="modal_content overflow-hidden">
        <div className="modal_container !p-0">
          <div className="modal_body">
            {isLoading ? (
              "Loading ..."
            ) : data?.data ? (
              <div className="pop_up_wrapper">
                <PopUpCurrency ref_pop_up={ref_pop_up} on_click_row={on_click_row} list_currency={list_currency} new_class="pop_up_modal" />
                <div className="modal_image">
                  <img src={data?.data?.thumbnail} alt={data?.data?.title} />
                </div>
                <div className="dark:bg-slate-800 bg-gray-200 rounded-[8px] p-3 m-3 sm:max-h-[30vh] overflow-y-auto max-h-[40vh]">
                  <table className="table w-full !text-left">
                    <thead>
                      <tr className="tr_show">
                        <td width="20%" className="flex items-start">
                          Judul
                        </td>
                        <td width="80%">: {data?.data?.title}</td>
                      </tr>
                      <tr className="tr_show">
                        <td width="20%" className="flex items-start">
                          Penulis
                        </td>
                        <td width="80%">: {data?.data?.author}</td>
                      </tr>
                      <tr className="tr_show">
                        <td width="20%">Tahun</td>
                        <td width="80%">: {data?.data?.year}</td>
                      </tr>
                      <tr className="tr_show">
                        <td width="20%" className="flex items-start">
                          Harga
                        </td>
                        <td width="80%">
                          :{" "}
                          {data?.data?.list_price === "-" ? (
                            data?.data?.list_price + " " + data?.data?.currency
                          ) : data?.data?.list_price === data?.data?.retail_price ? (
                            <>
                              <span className="price_book">
                                {data?.data?.currency === "IDR" ? format_rupiah(data?.data?.retail_price) + " " + data?.data?.currency : parseFloat(data?.data?.retail_price).toFixed(2) + " " + data?.data?.currency}
                              </span>
                              <InputCurrency on_currency={on_currency} />
                            </>
                          ) : (
                            <>
                              <span className="line-through">
                                {data?.data?.currency === "IDR" ? format_rupiah(data?.data?.list_price) + " " + data?.data?.currency : parseFloat(data?.data?.list_price).toFixed(2) + " " + data?.data?.currency}
                              </span>
                              {" - "}
                              <span className="price_book">
                                {data?.data?.currency === "IDR" ? format_rupiah(data?.data?.retail_price) + " " + data?.data?.currency : parseFloat(data?.data?.retail_price).toFixed(2) + " " + data?.data?.currency}
                              </span>
                              <InputCurrency on_currency={on_currency} />
                            </>
                          )}
                        </td>
                      </tr>
                      <tr className="tr_show">
                        <td width="20%" className="flex items-start">
                          Deskripsi
                        </td>
                        <td width="80%">: {data?.data?.description}</td>
                      </tr>
                      <tr className="tr_show">
                        <td width="20%">Link</td>
                        <td width="80%">
                          {data?.data?.link_read === "Link tidak diketahui" ? (
                            <button type="button" className="btn btn_primary w-full">
                              {data?.data?.link_read}
                            </button>
                          ) : (
                            <a href={data?.data?.link_read} rel="noreferrer" target="_blank" className="link link_primary w-[50%]">
                              Link Baca
                            </a>
                          )}
                        </td>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            ) : session ? (
              clear_session_data()
            ) : (
              <Navigate to={`${REACT_APP_PREFIX}login`} replace state={{ from: location }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
