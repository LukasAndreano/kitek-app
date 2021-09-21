import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Group,
	Placeholder,
	PanelHeader,
	FormItem,
	File,
} from "@vkontakte/vkui";
import {
	Icon56ArticleOutline,
	Icon24DoneOutline,
	Icon24DocumentOutline,
} from "@vkontakte/icons";

import { useHistory } from "react-router-dom";
import { saveURL, setSnackbar } from "../../reducers/mainReducer";

import authorizedAPIFiles from "../../service/authorizedAPIFiles";
import refreshTokenWithFileUpload from "../../service/refreshTokenWithFileUpload";

export default function Admin() {
	const storage = useSelector((state) => state.main);
	const dispatch = useDispatch();

	const history = useHistory();

	const [disabled, setDisabled] = useState(false);
	const [updated, setUpdated] = useState(false);

	useEffect(() => {
		if (storage.user.status !== 1) {
			history.replace({ pathname: "/" });
			dispatch(saveURL(""));
		}
	}, [storage.user.status, dispatch, history]);

	return (
		<React.Fragment>
			<PanelHeader separator={storage.isDesktop ? true : false}>
				{storage.isDesktop ? "Панель администратора" : "Админка"}
			</PanelHeader>
			<Group>
				<Placeholder
					header="Панель администратора"
					icon={<Icon56ArticleOutline />}
					style={{ marginTop: -30, marginBottom: -30 }}
				>
					Добро пожаловать в панель администратора.
				</Placeholder>
				<FormItem top="Загрузка расписания">
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
									form.append("shedule", e.target.files[0]);
									authorizedAPIFiles(
										"updateShedule",
										form
									).then((data) => {
										if (
											data.errorCode !== undefined &&
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
							mode={updated ? "commerce" : "primary"}
						>
							{updated ? "Запущена обработка!" : "Обновить файл"}
						</File>
					</div>
				</FormItem>
			</Group>
		</React.Fragment>
	);
}
