import React from 'react'
import { addClass,removeClass } from '../../helpers/formatting/class_name_modifier';

export default function PopUpCurrency({ref_pop_up,on_click_row,list_currency,new_class = ""}) {
  return (
    <div className={[new_class, "pop_up on_hidden"].join(" ")} ref={ref_pop_up}>
      <div className="pop_up_header">
        <div className="pop_up_title !text-xs">Mata Uang</div>
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
                <th scope="col" className="th_thead !px-4 !py-2 !text-xs !text-center">
                  Nama
                </th>
                <th scope="col" className="th_thead !px-4 !py-2 !text-xs !text-center">
                  Mata Uang
                </th>
              </tr>
            </thead>
            <tbody className="pop_up_tbody">
              {!list_currency ? (
                <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                  <td colSpan="6" className="td_tbody !px-4 !py-2 !text-xs !text-center">
                    Loading ...
                  </td>
                </tr>
              ) : list_currency.length < 1 ? (
                <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
                  <td colSpan="6" className="td_tbody !px-4 !py-2 !text-xs !text-center">
                    Mata uang tidak bisa ditemukan
                  </td>
                </tr>
              ) : (
                list_currency.map((item) => {
                  return (
                    <tr key={item.id} className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer" onClick={on_click_row.bind(this)}>
                      <td className="td_tbody !px-4 !py-2 !text-xs !text-center">{item.name}</td>
                      <td className="td_tbody !px-4 !py-2 !text-xs !text-center">
                        {item.code}
                        <input type="hidden" name="apply_currency_pop_up" value={item.code} />
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
