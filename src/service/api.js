export default async function api(method, params) {
	const data = await fetch("https://kitek-api.nbalin.dev/v1/" + method, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
	});
	return await data.json();
}
