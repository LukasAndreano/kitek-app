// noinspection JSCheckFunctionSignatures

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
	PanelHeader,
	PanelHeaderButton, Avatar
} from "@vkontakte/vkui";
import {
	Icon56InfoOutline,
	Icon28SwitchOutlineAlt,
	Icon56FireOutline,
} from "@vkontakte/icons";
import api from "../service/api";
import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";

import renderSheduleBlocks from "./handlers/renderSheduleBlocks";
import { setActiveModal } from "../reducers/mainReducer";
import {
	setSheduleStore,
	saveSheduleDay,
	setAlreadyLoaded,
} from "../reducers/sheduleReducer";

import { saveGroups } from "../reducers/mainReducer";
import { motion } from "framer-motion";

const currentDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

const month = ("0" + String(currentDate.getMonth() + 1)).slice(-2);
const day = ("0" + String(currentDate.getDate())).slice(-2);

const fullDate = day + "." + month + "." + currentDate.getFullYear();

export default function Shedule() {
	const [group, setGroup] = useState(null);
	const [sheduleButtons, setSheduleButtons] = useState(null);
	const [loader, setLoader] = useState(false);
	const [list, setList] = useState([]);
	const [search, setSearch] = useState("");
	const [loaded, setLoaded] = useState(false);
	const [renderButtons, setRenderButtons] = useState(false);
	const [lazyLoading, setLazyLoading] = useState(false);

	const [shedule, setShedule] = useState([]);

	const storage = useSelector((state) => state.main);
	const sheduleStorage = useSelector((state) => state.shedule);
	const dispatch = useDispatch();

	// Функция рендера самих пар, использующая локальное хранилище
	const renderLessons = useCallback(
		(data = null, teacherMode = false) => {
			if (data !== undefined && data.length !== 0) {
				setShedule(
					renderSheduleBlocks(
						data[localStorage.getItem("sheduleDay")]["timetable"],
						teacherMode
					)
				);
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
			let delay = 0;
			data.forEach((el) => {
				let date = el.date.split(".");
				delay += 0.1;
				arr.push(
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							delay,
							type: "spring",
							stiffness: 260,
							damping: 40,
						}}
					>
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
								Number(localStorage.getItem("sheduleDay")) ===
								el.id
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
									.toLocaleString("ru-RU", {
										weekday: "long",
									})
									.slice(1)}{" "}
							({el.date.substring(0, 5)})
						</Button>
					</motion.div>
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
						setLazyLoading(true);
						setRenderButtons(false);
						setTimeout(() => {
							setLazyLoading(false);
						}, 1);
					} else i++;
				});
			if (!fromStorage) {
				setTimeout(() => setLoaded(true), 300);
			} else {
				setLoaded(true);
			}
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
				);
			} else if (!sheduleStorage.loaded) {
				setLoader(true);
				if (Number(group) === 0) {
					authorizedAPI("teacher/getSheduleForTeacher", {}).then(
						(data) => {
							if (
								data.errorCode !== undefined &&
								(data.errorCode === 3 || data.errorCode === 4)
							)
								refreshToken(
									"teacher/getSheduleForTeacher",
									{}
								).then((data) => {
									if (data.response) {
										dispatch(setAlreadyLoaded(true));
										let i = 0;
										data["timetable"].forEach((el) => {
											el["id"] = i;
											i++;
										});
										dispatch(
											setSheduleStore(data["timetable"])
										);
										if (data["timetable"].length !== 0) {
											renderShedule(
												data["timetable"],
												false,
												true,
												true
											);
										} else {
											setLoaded(true);
										}
									}
								});
							else {
								if (data.response) {
									dispatch(setAlreadyLoaded(true));
									let i = 0;
									data["timetable"].forEach((el) => {
										el["id"] = i;
										i++;
									});
									dispatch(
										setSheduleStore(data["timetable"])
									);
									renderShedule(
										data["timetable"],
										false,
										true,
										true
									);
								}
							}
						}
					);
				} else {
					api("getShedule2", {
						group: encodeURI(group),
					}).then((data) => {
						if (data.response) {
							dispatch(setAlreadyLoaded(true));
							let i = 0;
							data["timetable"].forEach((el) => {
								el["id"] = i;
								i++;
							});
							dispatch(setSheduleStore(data["timetable"]));
							renderShedule(
								data["timetable"],
								false,
								false,
								true
							);
						}
					});
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
						onClick={() => setGroupFunction(el["groupID"], el.name)}
						key={el["groupID"]}
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
				setLoader(true);
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
				separator={storage.isDesktop}
			>
				Расписание
			</PanelHeader>
			<Group>
				<Banner
					before={
						<Avatar size={28} style={{ backgroundImage: "linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)" }}>
							<span style={{ color: "#fff" }}>!</span>
						</Avatar>
					}
					header="Приложение скоро прекратит свою работу!"
					subheader={
						<React.Fragment>
							И да, это не шутка — приложение перестанет работать уже в этот понедельник. <br/><br/>Подпишитесь на сообщество ВКонтакте, где как и раньше будут публиковать актуальное для всех групп расписание.
						</React.Fragment>
					}
					actions={
						<Button mode="secondary"  href={"https://vk.com/couples_schedul"} target={"_blank"}>
							Подписаться
						</Button>
					}
				/>

				{loaded && !lazyLoading ? (
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
								{storage.user.group &&
									storage.user.status === 0 && (
										<Banner
											mode="image"
											header={`Вы из группы ${storage.user.group}?`}
											subheader="Мы можем отобразить расписание для Вас, если это необходимо."
											background={
												<div
													style={{
														backgroundColor:
															"#6385c0",
														backgroundSize: 320,
													}}
												/>
											}
											actions={
												<Button
													mode="overlay_primary"
													onClick={() =>
														setGroupFunction(
															storage.user.group,
															storage.user.group
														)
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
									placeholder="Название группы"
									value={search}
									maxLength="10"
									onChange={(e) => {
										searchEngine(
											e.target.value
												.replace(
													/[A-Za-z^!@#$%&*()_|/№:?;"'.,<>=-~]/gi,
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
								{(storage.user.status === 2 ||
									storage.user.status === 1) &&
									storage.user.teacherGroup !== null &&
									group.name !==
										storage.user.teacherGroup && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{
												opacity: 1,
											}}
											transition={{
												delay: 0.3,
												damping: 40,
											}}
										>
											<Banner
												style={{ marginBottom: -5 }}
												onClick={() => {
													setGroupFunction(
														storage.user
															.teacherGroup,
														storage.user
															.teacherGroup
													);
												}}
												header={
													"Показать пары для " +
													storage.user.teacherGroup +
													"?"
												}
												subheader="Нажмите здесь, чтобы посмотреть пары своей группы."
												asideMode="expand"
											/>
										</motion.div>
									)}
								{(storage.user.status === 2 ||
									storage.user.status === 1) &&
									storage.user.teacherGroup !== null &&
									group.name ===
										storage.user.teacherGroup && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{
												opacity: 1,
											}}
											transition={{
												delay: 0.3,
												damping: 40,
											}}
										>
											<Banner
												style={{ marginBottom: -5 }}
												onClick={() => {
													setGroupFunction(0, 0);
												}}
												header={
													"Показать пары для Вас?"
												}
												subheader="Нажмите здесь, чтобы посмотреть свои пары."
												asideMode="expand"
											/>
										</motion.div>
									)}
								<Div>
									{sheduleStorage.shedule.length !== 0 &&
									sheduleStorage.shedule ? (
										<Fragment>
											<HorizontalScroll
												showArrows
												getScrollToLeft={(i) => i - 120}
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
													icon={<Icon56FireOutline />}
													header="Ура, отдыхаем!"
												>
													На этот день нет пар.
												</Placeholder>
											) : (
												<motion.div
													initial={{ opacity: 0 }}
													animate={{
														opacity: 1,
													}}
													transition={{
														delay: 0.3,
														damping: 40,
													}}
												>
													{shedule}
												</motion.div>
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
							</Fragment>
						)}
					</Fragment>
				) : (
					loader &&
					!lazyLoading && (
						<Spinner size="medium" style={{ margin: "20px 0" }} />
					)
				)}
			</Group>
		</Fragment>
	);
}
