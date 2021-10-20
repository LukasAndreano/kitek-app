// noinspection JSCheckFunctionSignatures

import React, { useState, useCallback } from "react";
import {
	FormLayout,
	Button,
	Group,
	FormItem,
	Input,
	Textarea, File
} from "@vkontakte/vkui";
import {Icon24DoneOutline, Icon24CameraOutline} from "@vkontakte/icons";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../reducers/mainReducer";

import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";
import authorizedAPIFiles from "../service/authorizedAPIFiles";
import refreshTokenWithFileUpload from "../service/refreshTokenWithFileUpload";
import {saveData} from "../reducers/newsReducer";

export default function AddNews(props) {
	const dispatch = useDispatch();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("")

	const [disabled, setDisabled] = useState(false);

	const [uploaded, setUploaded] = useState(false)
	const [files, setFiles] = useState(null)
	const [images, setImages] = useState("")

	const request = useCallback(() => {
		return new Promise((resolve) => {
			authorizedAPI("admin/news/add", {
				title,
				description,
				images
			}).then((data) => {
				if (
					data.errorCode !== undefined &&
					(data.errorCode === 3 || data.errorCode === 4)
				)
					refreshToken("admin/news/add", {
						title,
						description,
						images
					}).then((data) => {
						return resolve(data);
					});
				else {
					return resolve(data);
				}
			});
		});
	}, [title, description, images]);

	return (
		<Group>
			<FormLayout
				onSubmit={(e) => {
					e.preventDefault();
					setDisabled(true);
					if (
						title !== "" ||
						title.length >= 5 ||
						description !== "" ||
						description.length >= 5
					) {
						setTitle(title.trim());
						request().then((data) => {
							if (data.response) {
								props.closeModal();
								dispatch(saveData([]));
								dispatch(
									setSnackbar({
										text: "Пост опубликован!",
										success: true,
									})
								);
							} else {
								setDisabled(false);
								setSnackbar({
									text: "Что-то пошло не так...",
									success: true,
								});
							}
						});
					}
				}}
			>
				<FormItem className="mb10" top="Заголовок записи">
					<Input
						placeholder="Пар сегодня не будет!"
						maxLength="60"
						value={title}
						required
						onChange={(e) => {
							setTitle(
								e.target.value
							);
						}}
					/>
				</FormItem>
				<FormItem className="mb10" top="Текст записи">
					<Textarea maxLength={4000} rows={9} value={description} onChange={e => setDescription(e.target.value)} placeholder="Несите учебник русского языка..." />
				</FormItem>
				<FormItem className="mb10" top="Вложения">
					<File
						multiple
						disabled={disabled}
						style={{
							width: "100%",
							marginRight: 8,
						}}
						before={
							uploaded ? (
								<Icon24DoneOutline />
							) : (
								<Icon24CameraOutline />
							)
						}
						accept="image/png, image/jpeg"
						controlSize="l"
						onChange={(e) => {
							e.preventDefault();
							setUploaded(true);
							if (e.target.files.length > 10) {
								setUploaded(false)
								dispatch(setSnackbar({text: "Можно загрузить не более 10 фотографий", success: false}))
							} else {
								setFiles(e.target.files.length)
								setDisabled(true)
								let urls = []
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
											"image",
											e.target.files[i]
										);
										authorizedAPIFiles(
											"admin/albums/addPhoto",
											form
										).then((data) => {
											if (data.response) {
												urls.push(data.url)
												if (i+1 === e.target.files.length) {
													setDisabled(false)
													setImages(urls.join(","))
													console.log(urls.join(","))
												}
											} else {
												if (
													data.errorCode !==
													undefined &&
													(data.errorCode === 3 ||
														data.errorCode ===
														4)
												)
													refreshTokenWithFileUpload(
														"admin/albums/addPhoto",
														form
													).then(data => {
														if (data.response) {
															urls.push(data.url)
															if (i+1 === e.target.files.length) {
																setDisabled(false)
																setImages(urls.join(","))
															}
														}
													})
											}
										});
									}
								}
							}
						}}
						mode={uploaded ? "primary" : "secondary"}
					>
						{uploaded
							? "Выбрано " + files + " фото"
							: "Добавить фотографии (до 10 шт.)"}
					</File>
				</FormItem>
				<FormItem>
					<Button
						size="l"
						stretched
						type="submit"
						loading={disabled}
						disabled={
							title === "" ||
							title.length < 5 ||
							description === "" ||
							description.length < 5
						}
					>
						Опубликовать
					</Button>
				</FormItem>
			</FormLayout>
		</Group>
	);
}
