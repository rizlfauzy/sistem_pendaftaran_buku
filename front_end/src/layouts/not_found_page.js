import React, { useLayoutEffect,useEffect, useRef } from "react";
import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";

import useAlert from "../helpers/hooks/useAlert";

import Alert from "./alert";

export default function NotFoundPage() {

  const { alert, set_alert } = useAlert();

  const text_card_body = useRef("Mohon maaf Halaman yang Anda tuju belum kami buat 🙏");

  useEffect(() => {
    gsap.registerPlugin(TextPlugin);
    gsap.fromTo(
      ".card_text",
      {
        delay: 1,
        text: "",
        ease: "back",
      },
      {
        duration: 4,
        text: text_card_body.current,
      }
    );
  },[])

  useLayoutEffect(() => {
    if (alert.is_show) {
      setTimeout(() => {
        set_alert({
          type: "hide",
        });
      }, 5000);
    }
  }, [alert, set_alert]);
  return (
    <>
      {alert.is_show && (
        <Alert color={alert.color} strong_text={alert.strong_text}>
          {alert.message}
        </Alert>
      )}
      <div className="card card_not_found flex flex-wrap bg-white dark:bg-slate-700 gs_trigger !max-w-[500px] gs_trigger_from_down">
        <div className="w-full px-5">
          <div className="card_body">
            <div className="card_logo md:!w-96 md:!h-96 !w-56 !h-56 mx-auto">
              <img className="img_logo" src="/assets/img/bg-404.png" alt="404 Not Found" />
            </div>
            <div className="card_text dark:!text-slate-300 md:!text-xl md:!font-bolder">{text_card_body.current}</div>
          </div>
        </div>
      </div>
    </>
  );
}
