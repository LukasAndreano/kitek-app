export default async function api(method, params) {
  let fetch_params = params || "";
  const data = await fetch(
    "https://api.omsktec.ru/app",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "method=" + method + "&" + fetch_params,
    }
  );
  return await data.json();
}
