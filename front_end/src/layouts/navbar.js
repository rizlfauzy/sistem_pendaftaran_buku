import React, { useState, useRef, useEffect,useLayoutEffect, useCallback } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import gsap from "gsap"

import Alert from "./alert";

import useSession from "../helpers/hooks/useSession";
import useAsync from "../helpers/hooks/useAsync";
import useAlert from "../helpers/hooks/useAlert";

import get_data from "../helpers/fetch/get_data";

import LoadingNavProfil from "./loading/loading_nav_profil";

const { REACT_APP_URL_BACKEND: URL_BACKEND, REACT_APP_PREFIX } = process.env;

export default function Navbar({ data, isLoading }) {
  const ref_humbeger_btn = useRef(null);
  const ref_nav_list = useRef(null);
  const ref_dark_toggle = useRef(null);
  const ref_logout_btn = useRef(null);
  const ref_header = useRef(null);

  const { run } = useAsync();
  const { session, clear_session_data } = useSession();
  const { alert, set_alert } = useAlert();

  const location = useLocation();
  const { pathname } = location;

  const [theme, setTheme] = useState(() => {
    const theme = localStorage.getItem("theme");
    return theme === "dark" ? true : false;
  });

  const on_click_link_to_top = useCallback(()=>window.scrollTo(0,0),[])

  const on_click_hamburger_btn = useCallback((e) => {
    const humberger_btn = ref_humbeger_btn.current;
    const nav_menu = humberger_btn.nextElementSibling;
    humberger_btn.classList.toggle("hamburger-active");
    nav_menu.classList.toggle("hidden");
  }, []);

  const on_change_dark_toggle = useCallback((e) => setTheme(!theme), [theme]);

  const on_click_logout_btn = useCallback(
    (e) => {
      e.preventDefault();
      run(get_data({ url: "/auth/logout", token: session }));
      clear_session_data();
    },
    [clear_session_data, run, session]
  );

  const on_scroll_window = useCallback(() => {
    const header = ref_header.current;
    const fixed_nav = header.offsetTop;
    window.pageYOffset > fixed_nav ? header.classList.add("navbar-fixed") : header.classList.remove("navbar-fixed");
  }, []);

  useEffect(() => {
    const header = ref_header.current;

    gsap.fromTo(
      header,
      {
        opacity: 0,
        y: -100,
      },
      {
        duration: 2,
        opacity: 1,
        ease: "bounce",
        y: 0,
      }
    );
  },[]);

  useLayoutEffect(() => {
    const humberger_btn = ref_humbeger_btn.current;
    const dark_toggle = ref_dark_toggle.current;
    const logout_btn = ref_logout_btn.current;

    humberger_btn.addEventListener("click", on_click_hamburger_btn);
    dark_toggle.addEventListener("change", on_change_dark_toggle);
    logout_btn.addEventListener("click", on_click_logout_btn);
    window.addEventListener("scroll", on_scroll_window);

    if (theme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    if (localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme(true);
    } else {
      setTheme(false);
    }

    if (alert.is_show) {
      setTimeout(() => {
        set_alert({
          type: "hide",
        });
      }, 5000);
    }

    return () => {
      humberger_btn.removeEventListener("click", on_click_hamburger_btn);
      dark_toggle.removeEventListener("change", on_change_dark_toggle);
      logout_btn.removeEventListener("click", on_click_logout_btn);
      window.removeEventListener("scroll", on_scroll_window);
    };
  }, [theme, session, on_change_dark_toggle, on_click_hamburger_btn, on_click_logout_btn, on_scroll_window, alert, set_alert]);
  return (
    <>
      {!session && <Navigate to={`${REACT_APP_PREFIX}login`} replace state={{ from: location }} />}
      <header className="bg-transparent absolute top-0 left-0 w-full flex items-center z-10" ref={ref_header}>
        <div className="container">
          <div className="flex items-center justify-between relative">
            <div className="px-4">
              <Link to={REACT_APP_PREFIX} className="font-bold text-lg text-slate-700 dark:text-primary block py-6 ">
                <i className="bi bi-journal-text mr-2"></i>
                Rak Buku
              </Link>
            </div>
            <div className="flex items-center px-4">
              <button ref={ref_humbeger_btn} id="hamburger" name="hamburger" className="block absolute right-4 lg:hidden">
                <span className="hamburger-line origin-top-left"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line origin-bottom-left"></span>
              </button>
              <nav
                id="nav-menu"
                className="hidden absolute py-5 bg-white shadow-lg rounded-lg max-w-[250px] w-full right-4 top-full lg:block lg:static lg:bg-transparent lg:max-w-full lg:shadow-none lg:rounded-none dark:bg-dark dark:shadow-slate-500 lg:dark:bg-transparent"
              >
                <ul ref={ref_nav_list} className="block lg:flex nav-list">
                  <li className="group">
                    <Link
                      to={REACT_APP_PREFIX}
                      className={"text-base text-dark mx-8 flex py-2 group-hover:text-slate-800 dark:group-hover:text-primary dark:text-white nav-link " + (pathname === REACT_APP_PREFIX ? "active" : "")}
                      onClick={on_click_link_to_top.bind(this)}
                    >
                      Beranda
                    </Link>
                  </li>
                  <li className="group">
                    <div className="text-base text-dark mx-8 flex group-hover:text-slate-800 dark:group-hover:text-primary dark:text-white nav-link">
                      <div>
                        <div className="dropdown relative">
                          <button
                            className="dropdown-toggle flex items-center whitespace-nowrap"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {isLoading ? (
                              <LoadingNavProfil />
                            ) : data?.data ? (
                              <>
                                <span className="text-base text-dark mr-4 flex py-2 group-hover:text-slate-800 dark:group-hover:text-primary dark:text-white nav-link ">{data?.data?.username}</span>
                                <img src={data?.data?.photo === `${URL_BACKEND}/img/pp.png` ? `${URL_BACKEND}/img_default/pp.png` : data?.data?.photo} alt="" className="img_profil" />
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" className="w-2 ml-2 dark:text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                  <path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
                                </svg>
                              </>
                            ) : session ? (
                              clear_session_data()
                            ) : (
                              <Navigate to={`${REACT_APP_PREFIX}login`} replace state={{ from: location }} />
                            )}
                          </button>
                          <ul
                            className=" dropdown-menu min-w-max absolute hidden bg-white dark:bg-dark text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none "
                            aria-labelledby="dropdownMenuButton1"
                          >
                            <li>
                              <Link
                                to={`${REACT_APP_PREFIX}profil`}
                                className={
                                  "dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 " +
                                  (pathname === `${REACT_APP_PREFIX}profil` ? "active" : "")
                                }
                                onClick={on_click_link_to_top.bind(this)}
                              >
                                Profil
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                ref={ref_logout_btn}
                              >
                                Keluar
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center px-8 mt-3 lg:mt-0">
                    <div className="flex">
                      <span className="mr-2 text-sm text-slate-500">Terang</span>
                      <input ref={ref_dark_toggle} type="checkbox" className="hidden" id="dark-toggle" defaultChecked={theme} />
                      <label htmlFor="dark-toggle">
                        <div className="flex h-5 w-9 cursor-pointer items-center rounded-full bg-slate-500 p-1">
                          <div className="toggle-circle h-4 w-4 rounded-full bg-white transition duration-300 ease-in-out"></div>
                        </div>
                      </label>
                      <span className="ml-2 text-sm text-slate-500">Gelap</span>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
      {alert.is_show && (
        <Alert color={alert.color} strong_text={alert.strong_text}>
          {alert.message}
        </Alert>
      )}
    </>
  );
}
