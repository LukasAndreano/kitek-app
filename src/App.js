// noinspection JSCheckFunctionSignatures

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	SplitLayout,
	SplitCol,
	Cell,
	PanelHeader,
	Panel,
	Tabbar,
	TabbarItem,
	Alert,
	ScreenSpinner,
	Epic,
	Group,
	withAdaptivity,
	Snackbar,
	Avatar,
	View,
	usePlatform,
	Footer,
	VKCOM,
} from "@vkontakte/vkui";

import {
	Icon16Done,
	Icon16Cancel,
	Icon28CompassOutline,
	Icon28Newsfeed,
	Icon28PollSquareOutline,
	Icon28ListOutline,
	Icon28CalendarOutline,
	Icon28SettingsOutline,
	Icon28UserCircleOutline,
} from "@vkontakte/icons";

import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";

import {
	savePlatform,
	saveURL,
	setActiveModal,
	setSnackbar,
	setPopout,
	setNavigation,
	setUser,
	setWaitForProfileGet,
} from "./reducers/mainReducer";
import authorizedAPI from "./service/authorizedAPI";
import refreshToken from "./service/refreshToken";

import Controller from "./Controller";
import Modals from "./modals/main";

const App = withAdaptivity(
	({ viewWidth }) => {
		const platform = usePlatform();
		const isDesktop = viewWidth >= 3;
		const hasHeader = platform !== VKCOM;

		const [themeManager, setThemeManager] = useState(false);
		const [snackbar, setSnackbarFunc] = useState(null);
		const [popout, setPopoutFunc] = useState(false);

		const storage = useSelector((state) => state.main);
		const dispatch = useDispatch();

		// Инициализируем модальные окна
		const modal = Modals();

		// Получаем историю из роутера, необходимо для пуша в неё (URLChanger function)
		const history = useHistory();

		// Ловим 1ю часть URL и сейвим в storage
		const locationListener = useCallback(() => {
			const url = window.location.pathname.split("/");

			if (url[2] !== undefined && url[1] !== "admin") {
				dispatch(setNavigation(false));
			} else {
				dispatch(setNavigation(true));
			}

			dispatch(
				saveURL(
					url[2] !== undefined
						? window.location.pathname.slice(1)
						: url[1]
				)
			);
		}, [dispatch]);

		// При клике на ссылку в эпике пушим в историю эту страницу
		function URLChanger(e) {
			history.push("/" + e.currentTarget.dataset.story);
			locationListener();
		}

		useEffect(() => {
			if (localStorage.getItem("showUpdateCard")) {
				setTimeout(() => {
					dispatch(
						setActiveModal('updated')
					);
				}, 1000)

				localStorage.removeItem("showUpdateCard");
			}
		});

		useEffect(() => {
			if ((storage.popout.title && storage.popout.text) === null) {
				return;
			}
			history.push(window.location.pathname + "#popout");
			setPopoutFunc(
				<Alert
					onClose={() => {
						history.goBack();
					}}
					actions={[
						{
							title: "Понятно",
							autoclose: true,
							mode: "cancel",
						},
					]}
					header={storage.popout.title}
					text={storage.popout.text}
				/>
			);
		}, [storage.popout, dispatch, history]);

		// Ловим ивенты с кнопки назад-вперед
		window.onpopstate = () => {
			if ((storage.popout.title && storage.popout.text) !== null) {
				dispatch(
					setPopout({
						title: null,
						text: null,
					})
				);
				setPopoutFunc(null);
			} else if (storage.activeModal !== null) {
				dispatch(setActiveModal(null));
			}
			locationListener();
		};

		const request = useCallback(() => {
			return new Promise((resolve) => {
				authorizedAPI("getProfile", {}).then((data) => {
					if (
						data.errorCode !== undefined &&
						(data.errorCode === 3 || data.errorCode === 4)
					)
						refreshToken("getProfile", {}).then((data) => {
							dispatch(setUser(data.user));
							return resolve(data);
						});
					else {
						return resolve(data);
					}
				});
			});
		}, [dispatch]);

		useEffect(() => {
			if (
				window.location.pathname.split("/")[1] !== "profile" &&
				localStorage.getItem("access_token") !== null &&
				localStorage.getItem("refresh_token") !== null
			) {
				dispatch(setWaitForProfileGet(true));
				request().then((data) => {
					if (data.response) {
						setTimeout(
							() => dispatch(setWaitForProfileGet(false)),
							200
						);
						dispatch(setUser(data.user));
					}
				});
			}
		}, [dispatch, request]);

		useEffect(() => {
			// Определяем платформу пользователя (desktop или нет)
			console.log("[Log] Platform detected! isDesktop: " + isDesktop);
			dispatch(savePlatform(isDesktop));

			window.addEventListener("offline", () => {
				setPopoutFunc(null);
				dispatch(setActiveModal(null));
				dispatch(
					setSnackbar({
						success: false,
						text: "Вы потеряли подключение к сети. Загрузка контента, обновление ленты, а также отправка некоторых данных может быть недоступна.",
					})
				);
			});

			window.addEventListener("online", () => {
				dispatch(
					setSnackbar({
						text: "Подключение к сети восстановлено.",
						success: true,
					})
				);
				history.push("/online");
				history.goBack();
			});

			// Проверяем URL через 100мс, чтобы правильно отобразить таббар
			setTimeout(() => {
				setThemeManager(true);
				locationListener();
			}, 100);
		}, [dispatch, isDesktop, locationListener, setThemeManager, history]);

		useEffect(() => {
			if (storage.snackbar.text !== null)
				setSnackbarFunc(
					<Snackbar
						layout="vertical"
						duration={4000}
						className={
							storage.isDesktop
								? "snackBar-fix"
								: "snackbar-mobile-fix"
						}
						onClose={() => {
							dispatch(setSnackbar({ text: null }));
							setSnackbarFunc(null);
						}}
						before={
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									delay: 0.4,
									type: "spring",
									stiffness: 260,
									damping: 20,
								}}
							>
								<Avatar
									size={24}
									style={{ background: "var(--accent)" }}
								>
									{storage.snackbar.success ? (
										<Icon16Done
											fill="#fff"
											width={14}
											height={14}
										/>
									) : (
										<Icon16Cancel
											fill="#fff"
											width={14}
											height={14}
										/>
									)}
								</Avatar>
							</motion.div>
						}
					>
						{storage.snackbar.text}
					</Snackbar>
				);
		}, [
			setSnackbarFunc,
			dispatch,
			storage.isDesktop,
			storage.snackbar.success,
			storage.snackbar.text,
		]);

		return (
			<Fragment>
				{themeManager && (
					<SplitLayout
						className={
							storage.snackbar.text !== null && "snackbarActive"
						}
						header={hasHeader && <PanelHeader separator={false} />}
						style={{ justifyContent: "center" }}
					>
						{isDesktop && (
							<SplitCol fixed width="280px" maxWidth="280px">
								<Panel nav="navigationDesktop">
									{hasHeader && (
										<PanelHeader>КИТЭК</PanelHeader>
									)}
									<Group>
										<Cell
											onClick={URLChanger}
											disabled={storage.url === "profile"}
											style={
												storage.url === "profile"
													? {
															backgroundColor:
																"var(--button_secondary_background)",
															borderRadius: 8,
													  }
													: {}
											}
											data-story="profile"
											before={<Icon28UserCircleOutline />}
										>
											Профиль
										</Cell>
										<Cell
											onClick={URLChanger}
											disabled={
												storage.url === "news" ||
												!storage.navigation
											}
											className={
												!storage.navigation &&
												"disabledNav"
											}
											style={
												storage.url === "news"
													? {
															backgroundColor:
																"var(--button_secondary_background)",
															borderRadius: 8,
													  }
													: {}
											}
											data-story="news"
											before={<Icon28Newsfeed />}
										>
											Новости
										</Cell>
										<Cell
											onClick={URLChanger}
											disabled={
												storage.url === "services" ||
												!storage.navigation
											}
											className={
												!storage.navigation &&
												"disabledNav"
											}
											style={
												storage.url === "services"
													? {
															backgroundColor:
																"var(--button_secondary_background)",
															borderRadius: 8,
													  }
													: {}
											}
											data-story="services"
											before={<Icon28CompassOutline />}
										>
											Сервисы
										</Cell>
										<Cell
											onClick={URLChanger}
											disabled={
												storage.url === "" ||
												!storage.navigation
											}
											className={
												!storage.navigation &&
												"disabledNav"
											}
											style={
												storage.url === ""
													? {
															backgroundColor:
																"var(--button_secondary_background)",
															borderRadius: 8,
													  }
													: {}
											}
											data-story=""
											before={<Icon28CalendarOutline />}
										>
											Расписание
										</Cell>
									</Group>
									{storage.user.status === 1 && (
										<Group>
											<Cell
												onClick={URLChanger}
												disabled={
													storage.url === "admin" ||
													!storage.navigation
												}
												className={
													!storage.navigation &&
													"disabledNav"
												}
												style={
													storage.url === "admin"
														? {
																backgroundColor:
																	"var(--button_secondary_background)",
																borderRadius: 8,
														  }
														: {}
												}
												data-story="admin"
												before={
													<Icon28PollSquareOutline />
												}
											>
												Статистика
											</Cell>
											<Cell
												onClick={URLChanger}
												disabled={
													storage.url ===
														"admin/albums" ||
													!storage.navigation
												}
												className={
													!storage.navigation &&
													"disabledNav"
												}
												style={
													storage.url ===
													"admin/albums"
														? {
																backgroundColor:
																	"var(--button_secondary_background)",
																borderRadius: 8,
														  }
														: {}
												}
												data-story="admin/albums"
												before={<Icon28ListOutline />}
											>
												Альбомы
											</Cell>
											<Cell
												onClick={URLChanger}
												disabled={
													storage.url ===
														"admin/settings" ||
													!storage.navigation
												}
												className={
													!storage.navigation &&
													"disabledNav"
												}
												style={
													storage.url ===
													"admin/settings"
														? {
																backgroundColor:
																	"var(--button_secondary_background)",
																borderRadius: 8,
														  }
														: {}
												}
												data-story="admin/settings"
												before={
													<Icon28SettingsOutline />
												}
											>
												Настройки
											</Cell>
										</Group>
									)}
									<Footer style={{ marginTop: -10 }}>
										Версия приложения: 1.1.9 <br />
										Разработчик:{" "}
										<a
											href="https://vk.com/id172118960"
											target="_blank"
											rel="noopener noreferrer"
										>
											Никита Балин
										</a>
										<br />
										<a
											href="https://github.com/LukasAndreano/kitek-app"
											target="_blank"
											rel="noopener noreferrer"
										>
											Репозиторий на GitHub
										</a>
									</Footer>
								</Panel>
							</SplitCol>
						)}

						<SplitCol
							animate={!isDesktop}
							spaced={isDesktop}
							width={isDesktop ? "560px" : "100%"}
							maxWidth={isDesktop ? "560px" : "100%"}
						>
							<Epic
								activeStory={"default"}
								tabbar={
									!isDesktop && (
										<Tabbar>
											<TabbarItem
												onClick={URLChanger}
												disabled={
													!storage.navigation ||
													storage.url === "news"
												}
												selected={
													storage.url === "news"
												}
												text={"Новости"}
												data-story="news"
											>
												<Icon28Newsfeed />
											</TabbarItem>

											<TabbarItem
												onClick={URLChanger}
												selected={
													storage.url === "services"
												}
												data-story="services"
												disabled={
													!storage.navigation ||
													storage.url === "services"
												}
												text={"Сервисы"}
											>
												<Icon28CompassOutline />
											</TabbarItem>

											<TabbarItem
												onClick={URLChanger}
												selected={storage.url === ""}
												data-story=""
												disabled={
													!storage.navigation ||
													storage.url === "news" ||
													storage.url === ""
												}
												text={"Расписание"}
											>
												<Icon28CalendarOutline />
											</TabbarItem>

											<TabbarItem
												onClick={URLChanger}
												disabled={
													!storage.navigation ||
													storage.url === "profile"
												}
												selected={
													storage.url === "profile"
												}
												data-story="profile"
												text={"Профиль"}
											>
												<Icon28UserCircleOutline />
											</TabbarItem>
										</Tabbar>
									)
								}
							>
								<View
									id="default"
									activePanel="default"
									modal={modal}
									popout={
										storage.waitForProfileGet ? (
											<ScreenSpinner />
										) : (
											popout
										)
									}
								>
									{!storage.waitForProfileGet && (
										<Panel id="default">
											<Controller />
										</Panel>
									)}
								</View>
							</Epic>
							{snackbar}
						</SplitCol>
					</SplitLayout>
				)}
			</Fragment>
		);
	},
	{
		viewWidth: true,
	}
);

export default App;
