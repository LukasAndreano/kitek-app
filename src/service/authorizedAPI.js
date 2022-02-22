export default async function authorizedAPI(method, params) {
	const data = await fetch("https://omsktec-api.nbalin.dev/v1/" + method, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("access_token"),
			Refresh: localStorage.getItem("refresh_token"),
		},
		body: JSON.stringify(params),
	});
	const responseData = await data.json();
	if (responseData.errorCode === 2) {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		window.location.reload();
	}
	return responseData;
}
