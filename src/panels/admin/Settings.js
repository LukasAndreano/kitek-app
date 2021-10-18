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
	Button,
	File,
} from "@vkontakte/vkui";

import { ChipsSelect } from "@vkontakte/vkui/unstable";

import {
	Icon56SettingsOutline,
	Icon24DoneOutline,
	Icon28NotificationAddOutline,
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
				</Placeholder>
				{loaded ? (
					<Fragment>
						<FormItem top="Загрузка расписания" className="mb10">
							<div style={{ display: "flex" }}>
								<File
									multiple
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
										setUpdated(true);
										for (
											let i = 0;
											i < e.target.files.length;
											i++
										) {
											if (
												e.target.files[i].size <
												10000000
											) {
												let form = new FormData();
												form.append(
													"shedule",
													e.target.files[i]
												);
												authorizedAPIFiles(
													"updateShedule",
													form
												).then((data) => {
													if (
														data.errorCode !==
															undefined &&
														(data.errorCode === 3 ||
															data.errorCode ===
																4)
													)
														refreshTokenWithFileUpload(
															"updateShedule",
															form
														);
												});
											}
										}
									}}
									mode={updated ? "primary" : "secondary"}
								>
									{updated
										? "Загружено"
										: "Обновить расписание"}
								</File>
							</div>
						</FormItem>
						<FormItem
							top="Выберите дни недели, на которое мы отобразим расписание"
							className="mb10"
						>
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
								renderChip={({ value, label, ...rest }) => (
									<Chip value={value} {...rest}>
										{label}
									</Chip>
								)}
								renderOption={({ ...otherProps }) => {
									return (
										<CustomSelectOption {...otherProps} />
									);
								}}
							/>
						</FormItem>
						<FormItem top={"Рассылка уведомлений"}>
							<Button
								before={<Icon28NotificationAddOutline />}
								onClick={() => {
									request("startMailing").then((data) => {
										if (!data.response) {
											dispatch(
												setSnackbar({
													text: "Произошла ошибка при запуске рассылки...",
													success: false,
												})
											);
										} else {
											dispatch(
												setSnackbar({
													text: "Рассылка запущена!",
													success: true,
												})
											);
										}
									});
								}}
								stretched
								size={"l"}
							>
								Запустить рассылку
							</Button>
						</FormItem>
					</Fragment>
				) : (
					<Spinner size="medium" style={{ margin: "20px 0" }} />
				)}
			</Group>
		</React.Fragment>
	);
}
