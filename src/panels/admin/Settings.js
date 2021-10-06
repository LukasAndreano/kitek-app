import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Group,
	Placeholder,
	PanelHeader,
	FormItem,
	CustomSelectOption,
	Chip,
	Spinner,
	PanelHeaderBack,
	File,
} from "@vkontakte/vkui";

import { ChipsSelect } from "@vkontakte/vkui/unstable";

import {
	Icon56SettingsOutline,
	Icon24DoneOutline,
	Icon24DocumentOutline,
} from "@vkontakte/icons";

import { useHistory } from "react-router-dom";
import { saveURL, setSnackbar } from "../../reducers/mainReducer";

import authorizedAPI from "../../service/authorizedAPI";
import refreshToken from "../../service/refreshToken";

import authorizedAPIFiles from "../../service/authorizedAPIFiles";
import refreshTokenWithFileUpload from "../../service/refreshTokenWithFileUpload";

const weekDays = [
	{ value: "1", label: "Понедельник" },
	{ value: "2", label: "Вторник" },
	{ value: "3", label: "Среда" },
	{ value: "4", label: "Четверг" },
	{ value: "5", label: "Пятница" },
	{ value: "6", label: "Суббота" },
];
export default function Settings() {
	const storage = useSelector((state) => state.main);

	const dispatch = useDispatch();

	const history = useHistory();

	const [weekDaysState, setWeekDays] = useState([]);
	const [updated, setUpdated] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const [loaded, setLoaded] = useState(false);

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
		if (storage.user.status !== 1) {
			history.replace({ pathname: "/" });
			dispatch(saveURL(""));
		} else {
			request("getSettings", {}).then((data) => {
				if (data.response) {
					setLoaded(true);
					setWeekDays(data.config.sheduleWeekDays);
				} else {
					history.replace({ pathname: "/admin" });
					dispatch(saveURL(""));
					dispatch(
						setSnackbar({
							text: "Произошла ошибка при получении конфига",
							success: false,
						})
					);
				}
			});
		}
	}, [storage.user.status, dispatch, history, request]);

	return (
		<React.Fragment>
			<PanelHeader
				left={
					!storage.isDesktop ? (
						<PanelHeaderBack
							onClick={() => {
								history.push("/services");
							}}
						/>
					) : (
						""
					)
				}
				separator={storage.isDesktop}
			>
				Настройки
			</PanelHeader>
			<Group>
				<Placeholder
					header="Настройки приложения"
					icon={<Icon56SettingsOutline />}
					style={{ marginTop: -30, marginBottom: -30 }}
				>
					На этой странице можно изменить настройки приложения.
					Конфигурация обновляется в реальном времени, нажимать кнопку
					для сохранения не требуется.
					<br />
					<br />
					Это <span className="hide">бета</span> раздел. Подгрузка
					данных и их обновление может работать некорректно.
				</Placeholder>
				{loaded ? (
					<Fragment>
						<FormItem top="Загрузка расписания" className="mb10">
							<div style={{ display: "flex" }}>
								<File
									disabled={disabled}
									style={{
										width: "100%",
										marginRight: 8,
									}}
									before={
										updated ? (
											<Icon24DoneOutline />
										) : (
											<Icon24DocumentOutline />
										)
									}
									accept="text/html"
									controlSize="l"
									onChange={(e) => {
										e.preventDefault();
										setDisabled(true);
										if (e.target.files[0].size < 10000000) {
											let form = new FormData();
											form.append(
												"shedule",
												e.target.files[0]
											);
											authorizedAPIFiles(
												"updateShedule",
												form
											).then((data) => {
												if (
													data.errorCode !==
														undefined &&
													(data.errorCode === 3 ||
														data.errorCode === 4)
												)
													refreshTokenWithFileUpload(
														"updateShedule",
														form
													).then((data) => {
														if (data.response) {
															dispatch(
																setSnackbar({
																	text: "Файл загружен. По окончанию обработки Вам придет уведомление в VK.",
																	success: true,
																})
															);
															setUpdated(true);
														}
													});
												else {
													if (data.response) {
														dispatch(
															setSnackbar({
																text: "Файл загружен. По окончанию обработки Вам придет уведомление в VK.",
																success: true,
															})
														);
														setUpdated(true);
													}
												}
											});
										}
									}}
									mode={updated ? "primary" : "secondary"}
								>
									{updated
										? "Запущена обработка..."
										: "Обновить расписание"}
								</File>
							</div>
						</FormItem>
						<FormItem top="Выберите дни недели, на которое мы отобразим расписание">
							<ChipsSelect
								value={weekDaysState}
								onChange={(e) => {
									request("updateSettings", {
										param: "sheduleWeekDays",
										value: e,
									}).then((data) => {
										if (!data.response)
											dispatch(
												setSnackbar({
													text: "Произошла ошибка при сохранении настроек...",
													success: false,
												})
											);
									});
									setWeekDays(e);
								}}
								options={weekDays}
								emptyText="Пусто! Ничего не найдено!"
								placeholder="Все дни недели. Изменить?"
								showSelected={false}
								closeAfterSelect={false}
								renderChip={({
									value,
									label,
									...rest
								}) => (
									<Chip value={value} {...rest}>
										{label}
									</Chip>
								)}
								renderOption={({
									...otherProps
								}) => {
									return (
										<CustomSelectOption {...otherProps} />
									);
								}}
							/>
						</FormItem>
					</Fragment>
				) : (
					<Spinner size="medium" style={{ margin: "20px 0" }} />
				)}
			</Group>
		</React.Fragment>
	);
}
