// noinspection JSCheckFunctionSignatures

import React, { useState } from "react";
import { Group, FormItem, Placeholder, File} from "@vkontakte/vkui";
import { useDispatch } from "react-redux";
import { setSnackbar, updateAvatar } from "../reducers/mainReducer";

import {motion} from "framer-motion";
import {
	Icon24CameraOutline,
	Icon56CameraOutline,
} from "@vkontakte/icons";
import authorizedAPIFiles from "../service/authorizedAPIFiles";
import refreshTokenWithFileUpload from "../service/refreshTokenWithFileUpload";

export default function ChangeAvatar(props) {
	const dispatch = useDispatch();

	const [disabled, setDisabled] = useState(false);

	return (
		<Group>
			<Placeholder
				icon={
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							delay: 0.1,
							type: "spring",
							stiffness: 260,
							damping: 20,
						}}
					>
						<Icon56CameraOutline />
					</motion.div>
				}
				header="Аватар пароля"
				style={{ marginBottom: -30, marginTop: -30 }}
			>
				Придайте уникальности Вашему профилю - добавьте аватар.
			</Placeholder>
			<FormItem>
				<File
					disabled={disabled}
					style={{
						width: "100%",
						marginRight: 8,
					}}
					before={
						!disabled && <Icon24CameraOutline />
					}
					accept="image/png, image/jpeg"
					controlSize="l"
					onChange={(e) => {
						e.preventDefault()
							if (e.target.files.length !== 0 && e.target.files[0].size < 10000000) {
								setDisabled(true);
								let form = new FormData();
								form.append("image", e.target.files[0]);
								authorizedAPIFiles(
									"updateProfilePicture",
									form
								).then((data) => {
									if (data.response) {
										dispatch(updateAvatar(data.url));
										dispatch(setSnackbar({text: "Аватар успешно обновлён!", success: true}))
										props.closeModal()
									} else {
										if (
											data.errorCode !==
											undefined &&
											(data.errorCode === 3 ||
												data.errorCode === 4)
										)
											refreshTokenWithFileUpload(
												"updateProfilePicture",
												form
											).then((data) => {
												if (data.response) {
													dispatch(updateAvatar(data.url));
													dispatch(setSnackbar({text: "Аватар успешно обновлён!", success: true}))
													props.closeModal()
												}
											}).catch(() => {
												setDisabled(false)
												dispatch(setSnackbar({text: "Доступные форматы для загрузки: png, jpeg", success: false}))
											})
									}
								}).catch(() => {
									setDisabled(false)
									dispatch(setSnackbar({text: "Доступные форматы для загрузки: png, jpeg", success: false}))
								})

						}
					}}
					mode={disabled ? "primary" : "secondary"}
				>
					{disabled
						? "Обработка..."
						: "Выберите фотографию"}
				</File>
			</FormItem>
		</Group>
	);
}
