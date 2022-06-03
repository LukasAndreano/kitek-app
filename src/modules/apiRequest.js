export default async function api(endpoint, method, params) {
  const data = await fetch(`https://kitek.nbalin.dev/v1/${endpoint}`, {
    method: method,
    body: JSON.stringify(params),
  });
  return await data.json();
}
