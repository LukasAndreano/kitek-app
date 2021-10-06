import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Group,
	PanelHeaderButton,
	PanelHeader,
	Gradient,
	Div,
	Spinner,
	Title,
	Text,
	Header,
	PullToRefresh,
	SimpleCell,
} from "@vkontakte/vkui";
import {
	Icon28DoorArrowRightOutline,
	Icon28MailOutline,
	Icon28UserStarBadgeOutline,
	Icon28SettingsOutline,
	Icon28EditOutline,
	Icon28PollSquareOutline,
	Icon28InfoOutline,
	Icon28Notifications,
	Icon28BugOutline,
} from "@vkontakte/icons";

import Login from "../forms/Login";
import Register from "../forms/Register";

import { setActiveModal, setUser, setSnackbar } from "../reducers/mainReducer";
import { useHistory } from "react-router-dom";

import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";

export default function Profile() {
	const storage = useSelector((state) => state.main);
	const dispatch = useDispatch();

	const [fetching, setFetching] = useState(false);

	const history = useHistory();

	const request = useCallback(() => {
		return new Promise((resolve) => {
			authorizedAPI("getProfile", {})
				.then((data) => {
					if (
						data.errorCode !== undefined &&
						(data.errorCode === 3 || data.errorCode === 4)
					)
						refreshToken("getProfile", {}).then((data) => {
							return resolve(data);
						});
					else {
						return resolve(data);
					}
				})
				.catch(() => {
					setFetching(false);
				});
		});
	}, []);

	useEffect(() => {
		if (
			localStorage.getItem("access_token") !== null &&
			localStorage.getItem("refresh_token") !== null &&
			storage.user.email === null
		) {
			request().then((data) => {
				if (data.response) {
					dispatch(setUser(data.user));
				}
			});
		}
	}, [dispatch, request, storage.user.email]);

	return (
		<React.Fragment>
			<PanelHeader
				separator={storage.isDesktop}
				left={
					localStorage.getItem("access_token") !== null &&
					localStorage.getItem("refresh_token") !== null ? (
						<PanelHeaderButton
							onClick={() => {
								dispatch(setActiveModal("logout"));
							}}
						>
							<Icon28DoorArrowRightOutline />
						</PanelHeaderButton>
					) : (
						""
					)
				}
			>
				Профиль
			</PanelHeader>
			<Group>
				{localStorage.getItem("access_token") === null &&
				localStorage.getItem("refresh_token") === null ? (
					<Fragment>
						{storage.currentForm === 0 ? <Register /> : <Login />}
					</Fragment>
				) : (
					<Fragment>
						<PullToRefresh
							onRefresh={() => {
								setFetching(true);
								request()
									.then((data) => {
										if (data.response) {
											dispatch(setUser(data.user));
											setFetching(false);
										}
									})
									.catch(() => setFetching(false));
							}}
							isFetching={fetching}
						>
							{storage.user.email !== null ? (
								<Fragment>
									<Gradient
										style={{
											margin: 10,
											borderRadius: 10,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											textAlign: "center",
											padding: 32,
										}}
									>
										<Title
											style={{
												marginBottom: 2,
												marginTop: 10,
											}}
											level="2"
											weight="medium"
										>
											{storage.user.name
												? storage.user.name
												: "Неизвестный пользователь"}
										</Title>
										<Text
											weight={'regular'}
											style={{
												marginBottom: 10,
												color: "var(--text_secondary)",
											}}
										>
											{storage.user.status === 2
												? "Преподаватель"
												: storage.user.group
												? "Студент, группа " +
												  storage.user.group
												: "Нет никаких данных :("}
										</Text>
									</Gradient>
									<Group mode="plain">
										<Div
											style={{
												marginTop: -10,
												marginLeft: -5,
											}}
										>
											<Header>Общая информация</Header>
											<SimpleCell
												before={<Icon28MailOutline />}
												onClick={() => {
													navigator.clipboard
														.writeText(
															storage.user.email
														)
														.then(() => {
															dispatch(
																setSnackbar({
																	text: "Адрес электронной почты скопирован в буфер обмена.",
																	success: true,
																})
															);
														})
														.catch(() => {
															dispatch(
																setSnackbar({
																	text: "Произошла ошибка при копировании почты в буфер обмена.",
																	success: false,
																})
															);
														});
												}}
												description="Адрес электронной почты"
											>
												{storage.user.email}
											</SimpleCell>
											<SimpleCell
												before={
													<Icon28UserStarBadgeOutline />
												}
												disabled
												description="Ваш ранг в приложении"
											>
												{storage.user.status === 0
													? "Обычный пользователь"
													: storage.user.status === 1
													? "Администратор"
													: "Преподаватель"}
											</SimpleCell>
											{storage.user.status === 1 &&
												!storage.isDesktop && (
													<SimpleCell
														before={
															<Icon28PollSquareOutline />
														}
														onClick={() => {
															history.push(
																"/admin"
															);
														}}
														description="Посещаемость приложения"
													>
														Статистика
													</SimpleCell>
												)}
											{storage.user.status === 1 &&
												!storage.isDesktop && (
													<SimpleCell
														before={
															<Icon28SettingsOutline />
														}
														onClick={() => {
															history.push(
																"/admin/settings"
															);
														}}
														description="Управление приложением"
													>
														Настройки
													</SimpleCell>
												)}
											<Header>Настройки</Header>
											{storage.user.status !== 2 && (
												<SimpleCell
													before={
														<Icon28SettingsOutline />
													}
													onClick={() => {
														dispatch(
															setActiveModal(
																"editAccountInfo"
															)
														);
													}}
													description="Если нужно, например, изменить группу"
													multiline
												>
													Отредактировать профиль
												</SimpleCell>
											)}
											<SimpleCell
												onClick={() => {
													dispatch(
														setActiveModal(
															"changePassword"
														)
													);
												}}
												before={<Icon28EditOutline />}
												description="Безопасность - это главное"
												multiline
											>
												Изменить пароль
											</SimpleCell>
											<SimpleCell
												onClick={() => {
													dispatch(
														setActiveModal(
															"connectNotifications"
														)
													);
												}}
												before={<Icon28Notifications />}
												description="Получайте уведомления при изменении расписания"
												multiline
											>
												Уведомления
											</SimpleCell>
											<Header>Другое</Header>
											<SimpleCell
												onClick={() => {
													dispatch(
														setActiveModal(
															"aboutAPP"
														)
													);
												}}
												before={<Icon28InfoOutline />}
												description="Подробная информация о приложении"
												multiline
											>
												О приложении
											</SimpleCell>
											<SimpleCell
												href="https://github.com/LukasAndreano/kitek-app"
												target="_blank"
												before={<Icon28BugOutline />}
												description="Заведите issue в репозитории на GitHub, если Вы нашли ошибку!"
												multiline
											>
												<span className="defaultText">
													Сообщить о баге
												</span>
											</SimpleCell>
										</Div>
									</Group>
								</Fragment>
							) : (
								<Spinner
									size="medium"
									style={{ margin: "20px 0" }}
								/>
							)}
						</PullToRefresh>
					</Fragment>
				)}
			</Group>
		</React.Fragment>
	);
}
