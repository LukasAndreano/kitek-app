import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Group,
	PanelHeaderBack,
	Placeholder,
	PanelHeader,
	Card,
	CardGrid,
	Title,
	Div,
	Text,
	Spinner,
} from "@vkontakte/vkui";
import { Icon56InfoOutline } from "@vkontakte/icons";

import { useHistory } from "react-router-dom";
import { saveURL, setSnackbar } from "../../reducers/mainReducer";
import {
	saveStatistics,
	setStatisticsLoaded,
} from "../../reducers/adminReducer";

import authorizedAPI from "../../service/authorizedAPI";
import refreshToken from "../../service/refreshToken";

export default function Admin() {
	const storage = useSelector((state) => state.main);
	const adminStorage = useSelector((state) => state.admin);
	const dispatch = useDispatch();

	const history = useHistory();

	const request = useCallback((endpoint, params) => {
		return new Promise((resolve) => {
			authorizedAPI(endpoint, params).then((data) => {
				if (
					data.errorCode !== undefined &&
					(data.errorCode === 3 || data.errorCode === 4)
				)
					refreshToken(endpoint, params).then((data) => {
						return resolve(data);
					});
				else {
					return resolve(data);
				}
			});
		});
	}, []);

	useEffect(() => {
		if (!storage.waitForRequest)
			if (storage.user.status !== 1) {
				history.replace({ pathname: "/" });
				dispatch(saveURL(""));
			} else {
				if (!adminStorage.statisticsLoaded)
					request("getStatistics", {}).then((data) => {
						if (data.response) {
							dispatch(setStatisticsLoaded(true));
							dispatch(
								saveStatistics({
									today: data.today,
									month: data.month,
									lastMonth: data.lastMonth,
								})
							);
						} else {
							history.replace({ pathname: "/admin" });
							dispatch(saveURL(""));
							dispatch(
								setSnackbar({
									text: "Произошла ошибка при получении статистики",
									success: false,
								})
							);
						}
					});
			}
	}, [
		storage.user.status,
		dispatch,
		history,
		request,
		storage.waitForRequest,
		adminStorage.statisticsLoaded,
	]);

	return (
		<React.Fragment>
			<PanelHeader
				left={
					!storage.isDesktop ? (
						<PanelHeaderBack
							onClick={() => {
								history.push("/profile");
							}}
						/>
					) : (
						""
					)
				}
				separator={storage.isDesktop}
			>
				Статистика
			</PanelHeader>
			<Group>
				<Placeholder
					header="Статистика"
					icon={<Icon56InfoOutline />}
					style={{ marginTop: -30, marginBottom: -30 }}
				>
					На этой странице отображатся посещаемость приложения. Каждый
					запрос к приложению (перезагрузка страницы) считается за
					заход.
					<br />
					<br />
					Это <span className="hide">бета</span> раздел. Подгрузка
					данных и их обновление может работать некорректно.
				</Placeholder>
				{adminStorage.statisticsLoaded ? (
					<CardGrid size={storage.isDesktop ? "s" : "m"}>
						<Card>
							<Div>
								<Title weight="heavy" level="1">
									{adminStorage.statistics.today} ч.
								</Title>
								<Text style={{ marginTop: 5 }} weight={"regular"}>
									Пользователей за сегодня.
								</Text>
							</Div>
						</Card>
						<Card>
							<Div>
								<Title weight="heavy" level="1">
									{adminStorage.statistics.month} ч.
								</Title>
								<Text style={{ marginTop: 5 }} weight={"regular"}>
									Пользователей за этот месяц.
								</Text>
							</Div>
						</Card>
						<Card>
							<Div>
								<Title weight="heavy" level="1">
									{adminStorage.statistics.lastMonth} ч.
								</Title>
								<Text style={{ marginTop: 5 }} weight={"regular"}>
									Пользователей за прошлый месяц.
								</Text>
							</Div>
						</Card>
					</CardGrid>
				) : (
					<Spinner size="medium" style={{ margin: "20px 0" }} />
				)}
			</Group>
		</React.Fragment>
	);
}
