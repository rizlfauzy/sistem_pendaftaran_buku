// env
const { REACT_APP_URL_BACKEND: URL_BACKEND } = process.env;

export default function fetch_file({ url, method = "GET", data, host = URL_BACKEND }) {
  return fetch(`${host}${url}`, {
    method,
    mode: "cors",
    body: data,
  }).then(async (res) => {
    const response_json = await res.json();
    if (res.ok) return response_json;
    return response_json;
  });
}
