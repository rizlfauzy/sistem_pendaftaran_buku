import React from 'react';

export default function TableComponent({ arr_element, is_completed, on_click_is_read,set_modal_show, set_modal_edit, set_modal_delete }) {

  return (
    <>
      {arr_element?.data
        .filter((item) => item.is_completed === is_completed)
        .map((item, index) => {
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
                  {is_completed === 0 ? <i className="bi bi-book-fill text-white"></i> : <i className="bi bi-book text-white"></i>}
                </button>
                <button type="button" className="btn btn_warning w-full mb-3" onClick={(e) => {
                  e.stopPropagation();
                  set_modal_edit({ show: true, book_id: item.id });
                }}>
                  <i className="bi bi-pencil-fill text-white"></i>
                </button>
                <button type="button" className="btn btn_reset w-full" onClick={(e) => {
                  e.stopPropagation();
                  set_modal_delete({ show: true, book_id: item.id });
                }}>
                  <i className="bi bi-trash-fill text-white"></i>
                </button>
              </td>
            </tr>
          );
        })}
    </>
  );
}
