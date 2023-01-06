// env
const { REACT_APP_URL_BACKEND: URL_BACKEND } = process.env;

export default function fetch_file_with_token({ url, method = "GET", data,token, host = URL_BACKEND }) {
  return fetch(`${host}${url}`, {
    method,
    mode: "cors",
    headers: {
      "authorization": `Bearer ${token}`
    },
    body: data,
  }).then(async (res) => {
    const response_json = await res.json();
    if (res.status === 403) return window.location.reload();
    if (res.ok) return response_json;
    return response_json;
  });
}
