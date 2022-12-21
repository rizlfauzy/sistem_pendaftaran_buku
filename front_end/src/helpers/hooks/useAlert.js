import { useRef,useReducer } from "react";

export default function useAlert() {
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
  return { alert, set_alert };
}