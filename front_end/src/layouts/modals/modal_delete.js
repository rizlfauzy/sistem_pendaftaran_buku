import React,{useRef,useEffect,useCallback} from 'react'

import useSession from '../../helpers/hooks/useSession';
import useAsync from '../../helpers/hooks/useAsync';

import post_data from "../../helpers/fetch/post_data_with_token";

export default function ModalDelete({ set_modal_delete, book_id,set_alert,set_is_delete }) {
  const ref_btn_delete = useRef(null);

  const { session } = useSession();
  const { run } = useAsync();

  const on_click_delete = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (!book_id) throw new Error("Id buku tidak ditemukan");
      const {error:error_delete,message:message_delete} = await run(post_data({ url: "/book", method: "DELETE", token: session, data: { id: book_id } }))
      if (error_delete) throw new Error(message_delete);
      set_alert({
        type: "success",
        message: message_delete,
      })
      set_is_delete(true);
      set_modal_delete({ show: false, book_id: null });
    } catch (e) {
      if (e.message.toLowerCase().includes("failed to fetch")) e.message = "koneksi gagal, sepertinya Anda sedang offline !!!";
      set_alert({
        type: "error",
        message: e.message,
      })
    }
   },[set_alert,book_id,run,session,set_modal_delete,set_is_delete])

  useEffect(() => {
    const btn_delete = ref_btn_delete.current;

    btn_delete.addEventListener("click", on_click_delete);

    return () => {
      btn_delete.removeEventListener("click", on_click_delete);
    }
  }, [on_click_delete])


  return (
    <div className="modal_box" id="modal_delete" onClick={(e) => {
      e.target.id === 'modal_delete' && set_modal_delete({ show: false, book_id: null });
    }}>
      <span className="modal_close" title="Close Modal" onClick={set_modal_delete.bind(this, { show: false, book_id: null })}>
        x
      </span>
      <div className="modal_content">
        <div className="modal_container">
          <div className="modal_header mb-3">Hapus Item</div>
          <hr className="border-b-2 border-light-green mb-3" />
          <div className="modal_body">
            <div className="mb-6 mt-6">
              <p className='dark:text-white text-slate-700 lg:text-md text-sm '>Apa kamu yakin ingin menghapus item ini ?</p>
            </div>
            <div className="flex justify-center">
              <button type="button" className="btn btn_cancel w-1/2 mx-2" onClick={set_modal_delete.bind(this,{show:false,book_id:null})}>
                Batal
              </button>
              <button type="button" className="btn btn_reset w-1/2 mx-2" ref={ref_btn_delete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
