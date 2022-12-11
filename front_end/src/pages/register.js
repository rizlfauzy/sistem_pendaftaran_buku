import React, { useRef, useLayoutEffect, useCallback, useReducer,useState } from "react";
import { Link } from "react-router-dom";

import { addClass, removeClass } from "../helpers/formatting/class_name_modifier";
import { ext_exclude } from "../helpers/formatting/ext_formatting";
import Alert from "../layouts/alert";

import useAsync from "../helpers/hooks/useAsync";
import fetch_file from "../helpers/fetch/fetch_file";

export default function Register() {
  const {run} = useAsync();

  const ref_password = useRef(null);
  const ref_card_btn_pass = useRef(null);
  const ref_input_photo = useRef(null);
  const ref_img_preview = useRef(null);
  const ref_form_register = useRef(null);

  const initial_alert = useRef({ is_show: false, color: "", message: "", strong_text: "" });
  const [alert, set_alert] = useReducer((state, action) => {
    if (action.type === "success") {
      return {
        is_show: true,
        color: "green",
        message: action.message,
        strong_text: "Sukses !!!",
      };
    } else if (action.type === "error") {
      return {
        is_show: true,
        color: "red",
        message: action.message,
        strong_text: "Error !!!",
      };
    } else {
      return initial_alert.current;
    }
  }, initial_alert.current);

  const [is_popup, set_is_popup] = useState(false);

  const on_click_btn_default_img = useCallback(
    (e) => {
      e.preventDefault();
      const input_photo = ref_input_photo.current;
      const img_preview = ref_img_preview.current;
      img_preview.src = "/assets/pp.png";
      img_preview.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img_preview, 0, 0);
        const data_url = canvas.toDataURL("image/png");
        const my_file = new File([data_url], "pp.png", {
          type: "image/png",
          lastModified: new Date(),
        });
        const data_transfer = new DataTransfer();
        data_transfer.items.add(my_file);
        input_photo.files = data_transfer.files;
      }
      set_is_popup(false);
    },[]
  )

  const on_click_password = useCallback(
    (e) => {
      e.preventDefault();
      const password = ref_password.current;
      const card_btn_pass = ref_card_btn_pass.current;
      if (password.type === "password") {
        password.type = "text";
        addClass(card_btn_pass, "active");
      } else {
        password.type = "password";
        removeClass(card_btn_pass, "active");
      }
    },
    [ref_password, ref_card_btn_pass]
  );

  const on_change_input_photo = useCallback(
    (e) => {
      try {
        const input_photo = ref_input_photo.current;
        const img_preview = ref_img_preview.current;
        const file = input_photo.files[0];
        if (file) {
          if (!ext_exclude(file.name, "jpg", "jpeg", "png")) throw new Error("Format File Salah !!!");
          if (file.size > 4000000) throw new Error("Ukuran file tidak boleh lebih dari 4 MB !!!");
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            img_preview.src = result;
          };
          reader.readAsDataURL(file);
          set_is_popup(true);
        }
      } catch (err) {
        set_alert({
          type: "error",
          message: err.message,
        });
      }
    },
    [ref_input_photo, ref_img_preview]
  );

  const on_submit_register = useCallback(async (e) => {
    e.preventDefault();
    try {
      const form_register = ref_form_register.current;
      const data = new FormData(form_register);
      const data_json = Object.fromEntries(data);
      const { photo, email, username, password } = data_json;
      if (!photo.name) throw new Error("Foto belum diisi !!!");
      if (!email) throw new Error("Email belum diisi !!!");
      if (!username) throw new Error("Username belum diisi !!!");
      if (!password) throw new Error("Password belum diisi !!!");
      if (password.length < 8) throw new Error("Password minimal 8 karakter !!!");
      const { error: error_register, message: message_register } = await run(fetch_file({ url: "/auth/register", method: "POST", data }));
      if (error_register) throw new Error(message_register);
      set_alert({
        type: "success",
        message: message_register,
      });
    } catch (e) {
      set_alert({
        type: "error",
        message: e.message,
      });
    }
  }, [run]);

  useLayoutEffect(() => {
    const card_btn_pass = ref_card_btn_pass.current;
    const input_photo = ref_input_photo.current;
    const form_register = ref_form_register.current;

    card_btn_pass.addEventListener("click", on_click_password);
    input_photo.addEventListener("change", on_change_input_photo);
    form_register.addEventListener("submit", on_submit_register);
    if (alert.is_show) {
      setTimeout(() => {
        set_alert({ type: "hide" });
      }, 5000);
    }
    return () => {
      card_btn_pass.removeEventListener("click", on_click_password);
      input_photo.removeEventListener("change", on_change_input_photo);
      form_register.removeEventListener("submit", on_submit_register);
    };
  }, [on_click_password, on_change_input_photo,on_submit_register, alert]);

  return (
    <section id="register_page" className="pt-36 dark:bg-dark pb-36">
      {alert.is_show && (
        <Alert color={alert.color} strong_text={alert.strong_text}>
          {alert.message}
        </Alert>
      )}
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap">
          <div className="card card_login flex flex-wrap bg-white dark:bg-slate-700">
            <div className="flex-[1_0_0%] w-full max-w-full px-5">
              <div className="card_header">
                <div className="flex">
                  <Link to="/login" className="link_back">
                    <i className="bi bi-arrow-left"></i>
                  </Link>
                  <div className="card_greeting dark:text-white">Daftar</div>
                </div>
                <div className="card_introduction dark:text-slate-300">Daftar untuk menikmati fitur aplikasi bookshelf</div>
              </div>
              <div className="card_body">
                <form action="#" method="post" encType="multipart/form-data" ref={ref_form_register}>
                  <div className="input_photo mt-3 mb-3">
                    <label htmlFor="photo" className="label_photo">
                      <img src="/assets/pp.png" alt="" id="preview" className="img_preview rounded-full" ref={ref_img_preview} />
                      <div className="cam_logo">
                        <i className="bi bi-camera"></i>
                      </div>
                      <input type="file" name="photo" id="photo" className="input_file hidden" ref={ref_input_photo} />
                    </label>
                    {is_popup && (
                      <button type="button" className="mt-3 btn btn_back_to_default_img" onClick={(e) => on_click_btn_default_img(e)
                      }>
                        Kembali ke Foto Bawaan
                      </button>
                    )}
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form_control" name="username" id="name" placeholder="username" />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form_control" name="email" id="email" placeholder="user@email.com" />
                  </div>
                  <div className="mb-3">
                    <div className="input_group">
                      <input type="password" className="form_control" name="password" id="password" placeholder="********" ref={ref_password} />
                      <button type="button" className="card_btn_pass" ref={ref_card_btn_pass}>
                        <i className="bi bi-eye"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button type="submit" className="btn btn_primary w-full">
                      Daftar
                    </button>
                  </div>
                  <div className="strip_text">
                    <span>atau</span>
                  </div>
                  <div className="mb-3 text-center mt-6">
                    <div className="is_account">
                      Sudah punya akun?{" "}
                      <Link to="/login" className="link_to_login">
                        Masuk
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
