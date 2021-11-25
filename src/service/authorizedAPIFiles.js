import axios from "axios";

export default function authorizedAPIFiles(method, data) {
	return new Promise((resolve) => {
		axios
			.post("https://api.omsktec.ru/v1/" + method, data, {
				headers: {
					Authorization:
						"Bearer " + localStorage.getItem("access_token"),
					Refresh: localStorage.getItem("refresh_token"),
				},
			})
			.then((response) => {
				return resolve(response.data);
			})
			.catch((response) => {
				return resolve(response.data);
			});
	});
}
