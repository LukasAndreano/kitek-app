import authorizedAPI from "./authorizedAPI";
import authorizedAPIFiles from "./authorizedAPIFiles";

export default async function refreshTokenWithFileUpload(method, file) {
	return new Promise((resolve) => {
		authorizedAPI("refreshTokens").then((data) => {
			if (data.errorCode !== undefined && data.errorCode === 4) {
				// Убираем авторизацию
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				window.location.reload();
			} else {
				localStorage.setItem("access_token", data.access_token);
				localStorage.setItem("refresh_token", data.refresh_token);
				authorizedAPIFiles(method, file).then((data) => {
					return resolve(data);
				});
			}
		});
	});
}
