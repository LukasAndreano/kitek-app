export default async function authorizedAPI(method, params) {
  const data = await fetch("https://testing-only.lukass.ru/v1/" + method, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      Refresh: localStorage.getItem("refresh_token"),
    },
    body: JSON.stringify(params),
  });
  return await data.json();
}
