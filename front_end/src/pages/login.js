import React, { useRef, useLayoutEffect, useCallback } from "react";
import { Link } from 'react-router-dom';

import { addClass, removeClass } from "../helpers/formatting/class_name_modifier";

export default function Login() {
  const ref_password = useRef(null);
  const ref_card_btn_pass = useRef(null);

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

  useLayoutEffect(() => {
    const card_btn_pass = ref_card_btn_pass.current;
    card_btn_pass.addEventListener("click", on_click_password);
    return () => {
      card_btn_pass.removeEventListener("click", on_click_password);
    };
  }, [on_click_password]);

  return (
    <section id="login_page" className="pt-36 dark:bg-dark pb-36">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap">
          <div className="card card_login flex flex-wrap bg-white dark:bg-slate-700">
            <div className="flex-[1_0_0%] w-full max-w-full px-5">
              <div className="card_header">
                <div className="card_greeting dark:text-white">Selamat Datang</div>
                <div className="card_introduction dark:text-slate-300">Masuk atau daftar untuk menikmati fitur aplikasi bookshelf</div>
                <div className="card_logo mx-auto">
                  <img className="img_logo" src="/assets/img/bookshelf_icon_mini.png" alt="" />
                </div>
              </div>
              <div className="card_body">
                <form action="#" method="post">
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
                  <Link to="/register" className="btn btn_secondary link_btn">
                    Buat akun baru
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
