import React, { useLayoutEffect, useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
import { isEmail } from "validator";

import Alert from "./alert";
import LoadingProfil from "./loading/loading_profil";

import useAlert from "../helpers/hooks/useAlert";
import useAsync from "../helpers/hooks/useAsync";
import useSession from "../helpers/hooks/useSession";

import fetch_file_with_token from "../helpers/fetch/fetch_file_with_token";
import post_data_with_token from "../helpers/fetch/post_data_with_token";
import { ext_exclude } from "../helpers/formatting/ext_formatting";
import { addClass, removeClass } from "../helpers/formatting/class_name_modifier";
import { including_char, exc_char, replace_char } from "../helpers/formatting/formatting_char";

const { REACT_APP_URL_BACKEND: URL_BACKEND } = process.env;

export default function ProfilPage({ data_user, isLoading_user, set_is_update_photo, set_is_update_profil, is_update_profil }) {
  const [user, set_user] = useState(() => (isLoading_user ? null : data_user));
  const [is_pop, set_is_pop] = useState(false);
  const [is_input_name, set_input_name] = useState(false);
  const [is_input_username, set_input_username] = useState(false);
  const [is_input_email, set_input_email] = useState(false);
  const [is_input_pass, set_input_pass] = useState(false);

  const { alert, set_alert } = useAlert();
  const { run: run_photo } = useAsync();
  const { run: run_profil } = useAsync();
  const { run: run_pass } = useAsync();
  const { session } = useSession();

  const ref_input_photo = useRef(null);
  const ref_img_preview = useRef(null);
  const ref_form_photo = useRef(null);
  const ref_form_profil = useRef(null);
  const ref_form_pass = useRef(null);

  const text_introduction = useRef("Ini adalah halaman profil Anda. Anda dapat melihat detail profil Anda dan mengubah profil Anda");

  const on_change_photo = useCallback(
    (e) => {
      e.preventDefault();
      try {
        const input_photo = ref_input_photo.current;
        const img_preview = ref_img_preview.current;
        const file = input_photo.files[0];
        if (!file) throw new Error("File tidak ditemukan");
        if (!ext_exclude(file.name, "jpg", "jpeg", "png")) throw new Error("Ekstensi file tidak didukung");
        if (file.size > 4000000) throw new Error("Ukuran file tidak boleh lebih dari 4 MB !!!");
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = reader.result;
          img_preview.src = result;
        };
        reader.readAsDataURL(file);
        set_is_pop(true);
      } catch (e) {
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [set_alert]
  );

  const on_submit_photo = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const form_photo = ref_form_photo.current;

        const form_data = new FormData(form_photo);
        const form_data_json = Object.fromEntries(form_data);
        const { photo } = form_data_json;
        if (!photo.name) throw new Error("Foto belum diisi");
        const { error: error_photo, message: message_photo } = await run_photo(
          fetch_file_with_token({
            url: "/user/photo",
            method: "PUT",
            data: form_data,
            token: session,
          })
        );
        if (error_photo) throw new Error(message_photo);
        set_alert({
          type: "success",
          message: message_photo,
        });
        set_is_pop(false);
        set_is_update_photo(true);
      } catch (e) {
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [run_photo, set_alert, session, set_is_update_photo]
  );

  const on_click_btn_edit = useCallback((e) => {
    e.preventDefault();
    if (e.currentTarget.id === "btn_edit_name") set_input_name(true);
    else if (e.currentTarget.id === "btn_edit_username") set_input_username(true);
    else if (e.currentTarget.id === "btn_edit_email") set_input_email(true);
    else if (e.currentTarget.id === "btn_edit_password") set_input_pass(true);
  }, []);

  const on_click_back_btn = useCallback((e) => {
    e.preventDefault();
    if (e.currentTarget.id === "btn_cancel_name") set_input_name(false);
    else if (e.currentTarget.id === "btn_cancel_username") set_input_username(false);
    else if (e.currentTarget.id === "btn_cancel_email") set_input_email(false);
  }, []);

  const on_click_password = useCallback((e) => {
    const btn_pass = e.currentTarget;
    const pass = btn_pass.previousElementSibling.previousElementSibling;
    if (pass.type === "password") {
      pass.type = "text";
      addClass(btn_pass, "active");
    } else {
      pass.type = "password";
      removeClass(btn_pass, "active");
    }
  }, []);

  const on_reset_pass = useCallback(() => {
    const form_pass = ref_form_pass.current;
    form_pass.reset();
    set_input_pass(false);
  }, []);

  const on_submit_pass = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const form_pass = ref_form_pass.current;
        const form_data = new FormData(form_pass);
        const form_data_json = Object.fromEntries(form_data);
        const { pass_now, pass_new } = form_data_json;
        if (!pass_now) throw new Error("Password Sekarang belum diisi");
        if (pass_now.length < 8) throw new Error("Password Sekarang minimal 8 karakter");
        if (!pass_new) throw new Error("Password Baru belum diisi");
        if (pass_new.length < 8) throw new Error("Password Baru minimal 8 karakter");
        if (pass_new === pass_now) throw new Error("Password Sekarang dan Password Baru sama");
        const { error: error_pass, message: message_pass } = await run_pass(post_data_with_token({ url: "/user/password", method: "PUT", data: form_data_json, token: session }));
        if (error_pass) throw new Error(message_pass);
        set_alert({
          type: "success",
          message: message_pass,
        });
        set_input_pass(false);
      } catch (e) {
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [set_alert, run_pass, session]
  );

  const on_submit_profil = useCallback(
    async (e) => {
      e.preventDefault();
      const form_profil = ref_form_profil.current;
      try {
        const form_data = new FormData(form_profil);
        const form_data_json = Object.fromEntries(form_data);
        const { edit_name, edit_username, edit_email } = form_data_json;
        let error_profil,
          message_profil = "";
        if (e.submitter.id === "btn_submit_name" && edit_name) {
          set_input_name(false);
          form_data_json.submitter = e.submitter.id;
          const response = await run_profil(post_data_with_token({ url: "/user", method: "PUT", token: session, data: form_data_json }));
          error_profil = response.error;
          message_profil = response.message;
        } else if (e.submitter.id === "btn_submit_username" && edit_username) {
          set_input_username(false);
          form_data_json.submitter = e.submitter.id;
          if (including_char(edit_username)) throw new Error(`Nama pengguna tidak boleh mengandung karakter ${exc_char.join(" ")}`);
          const response = await run_profil(post_data_with_token({ url: "/user", method: "PUT", token: session, data: form_data_json }));
          error_profil = response.error;
          message_profil = response.message;
        } else if (e.submitter.id === "btn_submit_email" && edit_email) {
          set_input_email(false);
          form_data_json.submitter = e.submitter.id;
          if (!isEmail(edit_email)) throw new Error("Email tidak valid !!!");
          const response = await run_profil(post_data_with_token({ url: "/user", method: "PUT", token: session, data: form_data_json }));
          error_profil = response.error;
          message_profil = response.message;
        }
        if (error_profil) throw new Error(message_profil);
        set_alert({
          type: "success",
          message: message_profil,
        });
        set_is_update_profil(true);
      } catch (e) {
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [set_alert, run_profil, session, set_is_update_profil]
  );

  useEffect(() => {
    const input_photo = ref_input_photo.current;
    const form_photo = ref_form_photo.current;
    const form_profil = ref_form_profil.current;
    const form_pass = ref_form_pass.current;

    input_photo.addEventListener("change", on_change_photo);
    form_photo.addEventListener("submit", on_submit_photo);
    form_profil.addEventListener("submit", on_submit_profil);
    form_pass.addEventListener("submit", on_submit_pass);
    form_pass.addEventListener("reset", on_reset_pass);

    return () => {
      input_photo.removeEventListener("change", on_change_photo);
      form_photo.removeEventListener("submit", on_submit_photo);
      form_profil.removeEventListener("submit", on_submit_profil);
      form_pass.addEventListener("submit", on_submit_pass);
      form_pass.removeEventListener("reset", on_reset_pass);
    };
  }, [on_change_photo, on_submit_photo, on_submit_profil, on_reset_pass, on_submit_pass]);

  useEffect(() => {
    const gs_animate = gsap.context(() => {
      gsap.registerPlugin(TextPlugin);
      gsap.fromTo(
        ".card_introduction",
        {
          text: "",
        },
        {
          duration: 5,
          text: text_introduction.current,
        }
      );
    });
    return () => gs_animate.revert();
  }, []);

  useLayoutEffect(() => {
    !isLoading_user && set_user(data_user);

    if (alert.is_show) {
      setTimeout(() => {
        set_alert({ type: "hide" });
      }, 5000);
    }
  }, [isLoading_user, alert, set_alert, data_user, is_update_profil]);
  return (
    <>
      {alert.is_show && (
        <Alert color={alert.color} strong_text={alert.strong_text}>
          {alert.message}
        </Alert>
      )}
      <div className="full_card card card_login flex flex-wrap bg-white dark:bg-slate-700 gs_trigger gs_trigger_from_down">
        <div className="w-full px-5">
          <div className="card_header">
            <div className="card_greeting dark:text-white">
              <h1 className="text-xl font-bold">
                Haloo Bos{" "}
                {user ? (
                  user.data.name
                ) : (
                  <span className="py-2">
                    <p className="inline-block w-24 h-6 bg-gray-400 rounded-full"></p>
                  </span>
                )}
              </h1>
            </div>
            <div className="card_introduction text-dark">
              <p className="text-sm">{text_introduction.current}</p>
            </div>
          </div>
          <div className="card_body flex flex-wrap">
            <div className="lg:w-1/2 w-full gs_trigger gs_trigger_from_left">
              <div className="flex flex-wrap items-center">
                <div className="md:w-1/4 w-full">
                  <form action="#" method="post" ref={ref_form_photo}>
                    <div className="input_photo my-3 px-2">
                      <label htmlFor="photo" className="label_photo">
                        {user ? (
                          <img src={user?.data?.photo === `${URL_BACKEND}/img/pp.png` ? `${URL_BACKEND}/img_default/pp.png` : user?.data?.photo} alt="" id="preview" className="img_preview rounded-full" ref={ref_img_preview} />
                        ) : (
                          <div className="img_preview rounded-full bg-gray-400"></div>
                        )}
                        <div className="cam_logo">
                          <i className="bi bi-camera"></i>
                        </div>
                        <input type="file" name="photo" id="photo" className="input_file hidden" ref={ref_input_photo} />
                      </label>
                      {is_pop && (
                        <button type="submit" className="mt-3 btn btn_primary !px-5 !text-sm">
                          Ganti Foto
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                <div className="md:w-3/4 w-full dark:bg-slate-800 bg-gray-200 rounded-[8px] p-5">
                  <form action="#" method="post" ref={ref_form_profil}>
                    <input type="hidden" name="id" value={user ? user.data.id : ""} />
                    <table className="table ml-4">
                      <thead>
                        {user ? (
                          <>
                            <tr className="tr_show">
                              {!is_input_name ? (
                                <>
                                  <td width="20%">Nama</td>
                                  <th width="60%">: {user?.data?.name > 10 ? user.data.name.substring(0, 10) + "..." : user.data.name}</th>
                                  <td width="20%">
                                    <button type="button" className="btn btn_warning w-full !text-sm" id="btn_edit_name" onClick={on_click_btn_edit.bind(this)}>
                                      <i className="bi bi-brush"></i>
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td colSpan="2">
                                    <div className="input_group">
                                      <input type="text" className="form_control" name="edit_name" id="edit_name" placeholder=" " defaultValue={user.data.name} />
                                      <label htmlFor="edit_name" className="place_label">
                                        Nama
                                      </label>
                                      <button type="button" className="card_btn_pass" id="btn_cancel_name" onClick={on_click_back_btn.bind(this)}>
                                        <i className="bi bi-arrow-return-left"></i>
                                      </button>
                                    </div>
                                  </td>
                                  <td width="20%">
                                    <button type="submit" className="btn btn_warning w-[90%] ml-2 !text-sm" id="btn_submit_name">
                                      <i className="bi bi-pencil-fill"></i>
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                            <tr className="tr_show">
                              {!is_input_username ? (
                                <>
                                  <td width="20%">Nama Pengguna</td>
                                  <th width="60%">: {user?.data?.username > 10 ? user.data.username.substring(0, 10) + "..." : user.data.username}</th>
                                  <td width="20%">
                                    <button type="button" className="btn btn_warning w-full !text-sm" id="btn_edit_username" onClick={on_click_btn_edit.bind(this)}>
                                      <i className="bi bi-brush"></i>
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td colSpan="2">
                                    <div className="input_group">
                                      <input
                                        type="text"
                                        className="form_control"
                                        name="edit_username"
                                        id="edit_username"
                                        placeholder=" "
                                        defaultValue={user.data.username}
                                        onInput={(e) => {
                                          e.preventDefault();
                                          const input = e.currentTarget;
                                          input.value = replace_char(input.value);
                                        }}
                                      />
                                      <label htmlFor="edit_username" className="place_label">
                                        Nama Pengguna
                                      </label>
                                      <button type="button" className="card_btn_pass" id="btn_cancel_username" onClick={on_click_back_btn.bind(this)}>
                                        <i className="bi bi-arrow-return-left"></i>
                                      </button>
                                    </div>
                                  </td>
                                  <td width="20%">
                                    <button type="submit" className="btn btn_warning w-[90%] ml-2 !text-sm" id="btn_submit_username">
                                      <i className="bi bi-pencil-fill"></i>
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                            <tr className="tr_show">
                              {!is_input_email ? (
                                <>
                                  <td width="20%">Email</td>
                                  <th width="60%">: {user?.data?.email.length > 15 ? user.data.email.substring(0, 15) + "..." : user.data.email}</th>
                                  <td width="20%">
                                    <button type="button" className="btn btn_warning w-full !text-sm" id="btn_edit_email" onClick={on_click_btn_edit.bind(this)}>
                                      <i className="bi bi-brush"></i>
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td colSpan="2">
                                    <div className="input_group">
                                      <input type="text" className="form_control" name="edit_email" id="edit_email" placeholder=" " defaultValue={user.data.email} />
                                      <label htmlFor="edit_email" className="place_label">
                                        Email
                                      </label>
                                      <button type="button" className="card_btn_pass" id="btn_cancel_email" onClick={on_click_back_btn.bind(this)}>
                                        <i className="bi bi-arrow-return-left"></i>
                                      </button>
                                    </div>
                                  </td>
                                  <td width="20%">
                                    <button type="submit" className="btn btn_warning w-[90%] ml-2 !text-sm" id="btn_submit_email">
                                      <i className="bi bi-pencil-fill"></i>
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                          </>
                        ) : (
                          <LoadingProfil />
                        )}
                      </thead>
                    </table>
                  </form>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full gs_trigger gs_trigger_from_right">
              <div className="dark:bg-slate-800 bg-gray-200 rounded-[8px] p-5 lg:ml-2 ml-0 mt-2 lg:mt-0">
                <form action="#" method="post" ref={ref_form_pass}>
                  <input type="hidden" name="id" value={user ? user.data.id : ""} />
                  <table className="table w-full">
                    <thead>
                      {!is_input_pass ? (
                        <tr className="tr_show">
                          <td width="20%">Kata Sandi</td>
                          <td width="80%">
                            <button type="button" className="btn btn_warning sm:w-[75%] w-[90%] sm:ml-0 ml-2 !text-sm " id="btn_edit_password" onClick={on_click_btn_edit.bind(this)}>
                              Ganti Kata Sandi
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <>
                          <tr className="tr_show">
                            <td colSpan="2">
                              <div className="input_group">
                                <input type="password" className="form_control" name="pass_now" id="pass_now" placeholder=" " />
                                <label htmlFor="pass_now" className="place_label">
                                  Kata Sandi Sekarang
                                </label>
                                <button type="button" className="card_btn_pass" onClick={on_click_password.bind(this)}>
                                  <i className="bi bi-eye"></i>
                                </button>
                              </div>
                            </td>
                            <td width="20%">
                              <button type="reset" className="btn btn_reset lg:w-[70%] w-[90%] ml-2 !text-sm" id="btn_cancel_password">
                                <i className="bi bi-arrow-return-left"></i>
                              </button>
                            </td>
                          </tr>
                          <tr className="tr_show">
                            <td colSpan="2">
                              <div className="input_group">
                                <input type="password" className="form_control" name="pass_new" id="pass_new" placeholder=" " />
                                <label htmlFor="pass_new" className="place_label">
                                  Kata Sandi Baru
                                </label>
                                <button type="button" className="card_btn_pass" onClick={on_click_password.bind(this)}>
                                  <i className="bi bi-eye"></i>
                                </button>
                              </div>
                            </td>
                            <td width="20%">
                              <button type="submit" className="btn btn_warning lg:w-[70%] w-[90%] ml-2 !text-sm" id="btn_submit_password">
                                <i className="bi bi-pass-fill"></i>
                              </button>
                            </td>
                          </tr>
                        </>
                      )}
                    </thead>
                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
