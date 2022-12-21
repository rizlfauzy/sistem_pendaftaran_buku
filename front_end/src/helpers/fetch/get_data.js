const { REACT_APP_URL_BACKEND: URL_BACKEND } = process.env;

export default function get_data({ url, host = URL_BACKEND,token }) {
  return fetch(`${host}${url}`, {
    method: "GET", mode: "cors",
    headers: {
      "authorization": `Bearer ${token}`,
    }
  }).then(async (res) => {
    const response_json = await res.json();
     if (res.status === 403) return window.location.reload();
    if (res.ok) return response_json;
    return response_json;
  })
}