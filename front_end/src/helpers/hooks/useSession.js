import { useState,useCallback } from "react";

function useSession() {
  const [session, set_session] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const set_session_data = useCallback(
    (data) => {
    localStorage.setItem("token", data);
    set_session(data);
  },[set_session]
  )

  const clear_session_data = useCallback(() => {
    localStorage.removeItem("token");
    set_session(null);
  },[set_session]);

  return { session, set_session_data, clear_session_data };
}

export default useSession