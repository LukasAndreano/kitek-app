import axios from "axios";

export default function authorizedAPIFiles(method, data) {
  return new Promise((resolve) => {
    axios
      .post("https://testing-only.lukass.ru/v1/" + method, data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          Refresh: localStorage.getItem("refresh_token"),
        },
      })
      .then((response) => {
        return resolve(response.data);
      });
  });
}
