import React, { useRef, useLayoutEffect, useCallback } from "react";
import Title from "../layouts/title";
import { Link, useLocation, Navigate } from "react-router-dom";
import { isEmail } from "validator";

import Alert from "../layouts/alert";

import useAsync from "../helpers/hooks/useAsync";
import useAlert from "../helpers/hooks/useAlert";
import useSession from "../helpers/hooks/useSession";

import { addClass, removeClass } from "../helpers/formatting/class_name_modifier";
import fetch_data from "../helpers/fetch/fetch_data";

const { REACT_APP_PREFIX } = process.env;

export default function Login() {
  const ref_password = useRef(null);
  const ref_card_btn_pass = useRef(null);
  const ref_form_login = useRef(null);

  const { run } = useAsync();
  const { session, set_session_data } = useSession();
  const { alert, set_alert } = useAlert();

  const location = useLocation();

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

  const on_submit_login = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const form_login = ref_form_login.current;
        const data = new FormData(form_login);
        const { email, password } = Object.fromEntries(data.entries());
        if (!email) throw new Error("Email tidak boleh kosong");
        if (!isEmail(email)) throw new Error("Email tidak valid");
        if (!password) throw new Error("Password tidak boleh kosong");
        if (password.length < 8) throw new Error("Password minimal 8 karakter");
        const { error: error_login, message: message_login, token: token_login } = await run(fetch_data({ url: "/auth/login", method: "POST", data: { email, password } }));
        if (error_login) throw new Error(message_login);
        set_session_data(token_login);
      } catch (e) {
        set_alert({
          type: "error",
          message: e.message,
        });
      }
    },
    [set_alert, ref_form_login, run, set_session_data]
  );

  useLayoutEffect(() => {
    const card_btn_pass = ref_card_btn_pass.current;
    const form_login = ref_form_login.current;

    card_btn_pass.addEventListener("click", on_click_password);
    form_login.addEventListener("submit", on_submit_login);

    if (alert.is_show) {
      setTimeout(() => {
        set_alert({
          type: "hide",
        });
      }, 5000);
    }
    return () => {
      card_btn_pass.removeEventListener("click", on_click_password);
      form_login.removeEventListener("submit", on_submit_login);
    };
  }, [on_click_password, on_submit_login, set_alert, alert]);

  return (
    <>
      <Title>Login | Bookshelf</Title>
      {session && <Navigate to={REACT_APP_PREFIX} replace state={{ from: location }} />}
      <section id="login_page" className="pt-36 dark:bg-dark pb-36">
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
                  <div className="card_greeting dark:text-white">Selamat Datang</div>
                  <div className="card_introduction dark:text-slate-300">Masuk atau daftar untuk menikmati fitur aplikasi bookshelf</div>
                  <div className="card_logo mx-auto">
                    <img className="img_logo" src="./assets/img/bookshelf_icon_mini.png" alt="" />
                  </div>
                </div>
                <div className="card_body">
                  <form action="#" method="post" ref={ref_form_login}>
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
                        Masuk
                      </button>
                    </div>
                  </form>
                  <div className="strip_text">
                    <span>Belum punya akun ?</span>
                  </div>
                  <div className="mb-3 text-center mt-6">
                    <Link to={`${REACT_APP_PREFIX}register`} className="btn btn_secondary link_btn">
                      Buat akun baru
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
