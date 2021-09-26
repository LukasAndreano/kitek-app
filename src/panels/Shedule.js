import React, { useState, useEffect, Fragment, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Cell,
	Group,
	Search,
	Spinner,
	Placeholder,
	HorizontalScroll,
	Banner,
	Div,
	Footer,
	Button,
	Card,
	PanelHeader,
	Title,
	ContentCard,
	PanelHeaderButton,
	PullToRefresh,
} from "@vkontakte/vkui";
import {
	Icon56InfoOutline,
	Icon28SwitchOutlineAlt,
	Icon56FireOutline,
} from "@vkontakte/icons";
import api from "../service/api";
import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";

import { setActiveModal } from "../reducers/mainReducer";
import {
	setSheduleStore,
	saveSheduleDay,
	setAlreadyLoaded,
} from "../reducers/sheduleReducer";

import { saveGroups } from "../reducers/mainReducer";

const currentDate = new Date();

const month = "0" + (currentDate.getMonth() + 1);
const day = currentDate.getDate();
const year = currentDate.getFullYear();

const fullDate = day + "." + month + "." + year;

export default function Shedule() {
	const [group, setGroup] = useState(null);
	const [sheduleButtons, setSheduleButtons] = useState(null);
	const [loader, setLoader] = useState(false);
	const [list, setList] = useState([]);
	const [search, setSearch] = useState("");
	const [loaded, setLoaded] = useState(false);
	const [renderButtons, setRenderButtons] = useState(false);
	const [fetching, setFetching] = useState(false);

	const [shedule, setShedule] = useState([]);

	const storage = useSelector((state) => state.main);
	const sheduleStorage = useSelector((state) => state.shedule);
	const dispatch = useDispatch();

	// Функция рендера самих пар, использующая локальное хранилище
	const renderLessons = useCallback(
		(data = null, teacherMode = false) => {
			let arr = [];
			if (data !== undefined && data.length !== 0) {
				let renderData =
					data[localStorage.getItem("sheduleDay")].timetable;
				renderData.forEach((el) => {
					let group = teacherMode ? el.group.split("-") : null;
					let currentNumber =
						arr[el.number] !== undefined
							? el.number + 1
							: el.number;

					arr[currentNumber] = (
						<Card
							className="tw"
							key={currentNumber}
							style={{ marginBottom: 10 }}
						>
							<Div>
								<Title level="3" weight="medium">
									{el.name}
								</Title>
								<h4 style={{ marginTop: 5, marginBottom: 0 }}>
									<span className="hide">
										Пара №{el.number}
									</span>
									<span className="type">{el.type}</span>
									<span className="teacher">
										{teacherMode
											? group[1] + "-" + group[0]
											: el.teacher}
									</span>
								</h4>
							</Div>
						</Card>
					);
				});
				setShedule(arr);
			}
		},
		[setShedule]
	);

	// Функция, которая рендерит кнопки и потом запускает рендер текста (самого расписания)
	const renderShedule = useCallback(
		(
			data,
			fromStorage = false,
			teacherMode = false,
			renderSheduleWithCurrentDay = false
		) => {
			let arr = [];
			let i = 0;
			data.forEach((el) => {
				let date = el.date.split(".");
				arr.push(
					<Button
						size="l"
						className="fixButtonsInShedule"
						style={{
							marginRight: 8,
							marginLeft: 2,
							marginTop: 5,
							marginBottom: 5,
						}}
						mode={
							Number(localStorage.getItem("sheduleDay")) === el.id
								? "primary"
								: "secondary"
						}
						key={el.id}
						onClick={() => {
							dispatch(saveSheduleDay(el.id));
							localStorage.setItem("sheduleDay", el.id);
							setRenderButtons(true);
						}}
					>
						{new Date(date[2], date[1] - 1, date[0])
							.toLocaleString("ru-RU", { weekday: "long" })[0]
							.toUpperCase() +
							new Date(date[2], date[1] - 1, date[0])
								.toLocaleString("ru-RU", { weekday: "long" })
								.slice(1)}{" "}
						({el.date.substring(0, 5)})
					</Button>
				);
			});
			setSheduleButtons(arr);
			renderLessons(data, teacherMode);
			dispatch(setSheduleStore(data));
			if (renderSheduleWithCurrentDay)
				data.forEach((el) => {
					if (el.date === fullDate) {
						dispatch(saveSheduleDay(i));
						localStorage.setItem("sheduleDay", i);
						setRenderButtons(true);
						setTimeout(() => setRenderButtons(false), 1);
					} else i++;
				});
			if (!fromStorage) {
				setTimeout(() => setLoaded(true), 400);
			} else {
				setLoaded(true);
			}
			setFetching(false);
		},
		[dispatch, setSheduleButtons, setLoaded, renderLessons]
	);

	useEffect(() => {
		// Вызываем рендер кнопок, чтобы отобразить их новый цвет
		if (renderButtons && localStorage.getItem("group")) {
			setRenderButtons(false);
			renderShedule(
				sheduleStorage.shedule,
				false,
				JSON.parse(localStorage.getItem("group")).id === 0
					? true
					: false
			);
		}
	}, [renderButtons, renderShedule, sheduleStorage.shedule]);

	// Общая функция перед запуском рендера кнопок и расписания. Проверяет, есть ли в кеше сохраненные данные.
	const loadShedule = useCallback(
		(group, connectToApi = false) => {
			if (sheduleStorage.shedule.length !== 0 && !connectToApi) {
				renderShedule(
					sheduleStorage.shedule,
					true,
					JSON.parse(localStorage.getItem("group")).id === 0
						? true
						: false
				);
			} else if (!sheduleStorage.loaded) {
				setLoader(true);
				if (Number(group) === 0) {
					authorizedAPI("getSheduleForTeacher", {})
						.then((data) => {
							if (
								data.errorCode !== undefined &&
								(data.errorCode === 3 || data.errorCode === 4)
							)
								refreshToken("getSheduleForTeacher", {}).then(
									(data) => {
										if (data.response) {
											dispatch(setAlreadyLoaded(true));
											let i = 0;
											data.timetable.forEach((el) => {
												el["id"] = i;
												i++;
											});
											dispatch(
												setSheduleStore(data.timetable)
											);
											if (data.timetable.length !== 0) {
												renderShedule(
													data.timetable,
													false,
													true,
													true
												);
											} else {
												setLoaded(true);
											}
										}
									}
								);
							else {
								if (data.response) {
									dispatch(setAlreadyLoaded(true));
									let i = 0;
									data.timetable.forEach((el) => {
										el["id"] = i;
										i++;
									});
									dispatch(setSheduleStore(data.timetable));
									renderShedule(
										data.timetable,
										false,
										true,
										true
									);
								}
							}
						})
						.catch(() => setFetching(false));
				} else {
					api("getShedule", {
						group: encodeURI(group),
					})
						.then((data) => {
							if (data.response) {
								dispatch(setAlreadyLoaded(true));
								let i = 0;
								data.timetable.forEach((el) => {
									el["id"] = i;
									i++;
								});
								dispatch(setSheduleStore(data.timetable));
								renderShedule(
									data.timetable,
									false,
									false,
									true
								);
							}
						})
						.catch(() => setFetching(false));
				}
			} else {
				setLoaded(true);
			}
		},
		[renderShedule, sheduleStorage.shedule, dispatch, sheduleStorage.loaded]
	);

	// Устанавливает группу из поиска. После установки очищает локальное хранилище и перезапускает страницу.
	const setGroupFunction = useCallback(
		(id, name) => {
			dispatch(setSheduleStore([]));
			dispatch(saveSheduleDay(0));
			dispatch(setAlreadyLoaded(false));
			setLoader(true);
			localStorage.setItem("sheduleDay", 0);
			localStorage.setItem(
				"group",
				JSON.stringify({ id: id, name: name })
			);
			setGroup({ id: id, name: name });
			setLoaded(false);
		},
		[setGroup, setLoaded, dispatch]
	);

	// Функция рендера объектов в поиске. Прокидываем нужный массив с данными и всё рендерится!
	const renderSearch = useCallback(
		(dataForRender) => {
			let arr = [];
			dataForRender.forEach((el) => {
				arr.push(
					<Cell
						onClick={() => setGroupFunction(el.groupID, el.name)}
						key={el.groupID}
					>
						{el.name}
					</Cell>
				);
			});
			setList(arr);
			setLoaded(true);
		},
		[setGroupFunction, setList]
	);

	// Функция поиска. Переводит название группы в lower case, а затем выполняет сравнивание по полученному значению.
	function searchEngine(value) {
		setSearch(value);
		let search = value.toLowerCase();
		let arr = storage.groups.filter(
			({ name }) => name.toLowerCase().indexOf(search) > -1
		);
		renderSearch(arr);
	}

	useEffect(() => {
		// Вытаскиваем группу юзера из локального хранилища
		let group = JSON.parse(localStorage.getItem("group"));

		// Проверяем, сохранена ли группа (null - группы в локальном хранилище нет)
		if (group !== null) {
			// Кидаем в стейт все необходимые для последующих процессов данные
			setGroup({ id: group.id, name: group.name });

			// Начинаем рендерить расписание
			loadShedule(group.id);
		} else {
			if (storage.groups.length === 0) {
				api("getGroups").then((response) => {
					if (response.response) {
						setLoaded(false);
						setLoader(true);
						dispatch(setAlreadyLoaded(false));
						dispatch(saveGroups(response.groups));
						renderSearch(response.groups);
					}
				});
			} else renderSearch(storage.groups);
		}
	}, [setLoaded, loadShedule, renderSearch, dispatch, storage.groups]);

	return (
		<Fragment>
			<PanelHeader
				left={
					localStorage.getItem("group") !== null ? (
						<PanelHeaderButton
							onClick={() => {
								dispatch(setActiveModal("changeGroup"));
							}}
						>
							<Icon28SwitchOutlineAlt />
						</PanelHeaderButton>
					) : (
						""
					)
				}
				separator={storage.isDesktop ? true : false}
			>
				Расписание
			</PanelHeader>
			<Group>
				{loaded ? (
					<Fragment>
						{group === null ? (
							<Fragment>
								{storage.user.status !== 0 && (
									<Banner
										mode="image"
										header="Показать Ваше расписание?"
										subheader="Активируйте режим преподавателя, чтобы увидеть свои пары."
										background={
											<div
												style={{
													backgroundColor: "#65c063",
													backgroundImage:
														"url(https://sun9-59.userapi.com/7J6qHkTa_P8VKRTO5gkh6MizcCEefz04Y0gDmA/y6dSjdtPU4U.jpg)",
													backgroundPosition:
														"right bottom",
													backgroundSize: 320,
													backgroundRepeat:
														"no-repeat",
												}}
											/>
										}
										actions={
											<Button
												mode="overlay_primary"
												onClick={() =>
													setGroupFunction(0, 0)
												}
											>
												Активировать
											</Button>
										}
									/>
								)}
								<Placeholder
									style={{
										marginBottom: -30,
										marginTop: -30,
									}}
									icon={<Icon56InfoOutline />}
									header="Выберите группу"
								>
									Для того, чтобы мы смогли отобразить
									расписание, необходимо выбрать группу.
								</Placeholder>
								<Search
									value={search}
									maxLength="10"
									onChange={(e) => {
										searchEngine(
											e.target.value
												.replace(
													/[A-Za-z^!@#$%^&*()_|/№:?;"'.,<>=-~]/gi,
													""
												)
												.trim()
										);
									}}
								/>
								<Div style={{ marginTop: -10 }}>{list}</Div>
								{search === "" ? (
									<Footer>
										Найдено групп: {list.length}
									</Footer>
								) : (
									list.length === 0 && (
										<Placeholder style={{ marginTop: -20 }}>
											Ничего не найдено
										</Placeholder>
									)
								)}
							</Fragment>
						) : (
							<Fragment>
								<PullToRefresh
									onRefresh={() => {
										dispatch(setAlreadyLoaded(false));
										setFetching(true);
										loadShedule(group.id, true);
									}}
									isFetching={fetching}
								>
									<Div>
										{sheduleStorage.shedule.length !== 0 &&
										sheduleStorage.shedule !== undefined ? (
											<Fragment>
												<ContentCard
													style={{ marginBottom: 10 }}
													onClick={() =>
														dispatch(
															setActiveModal(
																"connectNotifications"
															)
														)
													}
													header="Подключите уведомления!"
													caption="И получайте сообщения об изменении расписания прямо во ВКонтакте."
												/>
												<HorizontalScroll
													showArrows
													getScrollToLeft={(i) =>
														i - 120
													}
													getScrollToRight={(i) =>
														i + 120
													}
													style={{ marginBottom: 10 }}
												>
													<div
														style={{
															display: "flex",
														}}
													>
														{sheduleButtons}
													</div>
												</HorizontalScroll>

												{shedule.length === 0 ? (
													<Placeholder
														icon={
															<Icon56FireOutline />
														}
														header="Ура, отдыхаем!"
													>
														На этот день нет пар.
													</Placeholder>
												) : (
													shedule
												)}
											</Fragment>
										) : (
											<div
												style={{
													height: "80vh",
													display: "flex",
													justifyContent: "center",
													textAlign: "center",
												}}
											>
												<Placeholder
													icon={<Icon56FireOutline />}
													header="Ура, отдыхаем!"
												>
													Нет пар на эту неделю.
												</Placeholder>
											</div>
										)}
									</Div>
								</PullToRefresh>
							</Fragment>
						)}
					</Fragment>
				) : (
					loader && (
						<Spinner size="medium" style={{ margin: "20px 0" }} />
					)
				)}
			</Group>
		</Fragment>
	);
}
