import React, { useState, useCallback } from "react";
import {
	FormLayout,
	Button,
	Group,
	FormItem,
	Input,
	Placeholder,
} from "@vkontakte/vkui";
import { Icon56LockOutline } from "@vkontakte/icons";
import { useDispatch } from "react-redux";
import { setSnackbar, setPopout, setUser } from "../reducers/mainReducer";
import { motion } from "framer-motion";

import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";

export default function ChangePassword(props) {
	const dispatch = useDispatch();

	const [disabled, setDisabled] = useState(false);

	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPassword2, setNewPassword2] = useState("");

	const [showPasswordError, setShowPasswordError] = useState(false);
	const [showPasswordError2, setShowPasswordError2] = useState(false);
	const [showPasswordError3, setShowPasswordError3] = useState(false);

	const request = useCallback(() => {
		return new Promise((resolve) => {
			authorizedAPI("changePassword", {
				password: password,
				newPassword: newPassword,
			}).then((data) => {
				if (
					data.errorCode !== undefined &&
					(data.errorCode === 3 || data.errorCode === 4)
				)
					refreshToken("changePassword", {
						password: password,
						newPassword: newPassword,
					}).then((data) => {
						return resolve(data);
					});
				else {
					return resolve(data);
				}
			});
		});
	}, [newPassword, password]);

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
						<Icon56LockOutline />
					</motion.div>
				}
				header="Смена пароля"
				style={{ marginBottom: -30, marginTop: -30 }}
			>
				Если кто-то узнал Ваш текущий пароль или у Вас появилось желание
				его обновить, то эта страница для Вас. После смены пароля
				выполнится выход из аккаунта на всех устройствах, которые были
				авторизованы.
			</Placeholder>
			<FormLayout
				onSubmit={(e) => {
					e.preventDefault();
					setDisabled(true);
					if (
						!disabled &&
						!showPasswordError &&
						!showPasswordError2 &&
						!showPasswordError3 &&
						newPassword === newPassword2 &&
						password !== newPassword
					) {
						request().then((data) => {
							setDisabled(false);
							if (data.response) {
								props.closeModal();
								localStorage.removeItem("access_token");
								localStorage.removeItem("refresh_token");
								dispatch(
									setUser({
										name: null,
										email: null,
										course: 0,
										group: null,
										status: 0,
										avatar: null
									})
								);
								dispatch(
									setSnackbar({
										text: "Пароль изменен. Выполнен выход из аккаунта на всех устройствах.",
										success: true,
									})
								);
							} else if (data.errorCode === 1) {
								dispatch(
									setPopout({
										title: "Уведомление",
										text: "Вы ввели неверный текущий пароль",
									})
								);
							}
						});
					}
				}}
			>
				<FormItem
					top="Введите текущий пароль"
					bottom={
						showPasswordError &&
						"Пароль должен состоять минимум из 5 символов"
					}
					status={showPasswordError && "error"}
					className="mb10"
				>
					<Input
						type="password"
						required
						placeholder="Ваш текущий пароль"
						autoComplete="on"
						value={password}
						maxLength={128}
						onChange={(e) => {
							setPassword(e.target.value);

							if (
								e.target.value.length !== 0 &&
								e.target.value.length < 5
							)
								setShowPasswordError(true);
							else setShowPasswordError(false);
						}}
					/>
				</FormItem>
				<FormItem
					top="Введите новый пароль"
					bottom={
						showPasswordError2 &&
						"Пароль должен состоять минимум из 5 символов"
					}
					status={showPasswordError2 && "error"}
					className="mb10"
				>
					<Input
						type="password"
						autoComplete="on"
						required
						placeholder="Новый пароль"
						value={newPassword}
						maxLength={128}
						onChange={(e) => {
							setNewPassword(e.target.value);

							if (
								e.target.value.length !== 0 &&
								e.target.value.length < 5
							)
								setShowPasswordError2(true);
							else setShowPasswordError2(false);
						}}
					/>
				</FormItem>
				<FormItem
					top="Введите новый пароль еще раз"
					bottom={
						showPasswordError3 &&
						"Пароль должен состоять минимум из 5 символов"
					}
					status={showPasswordError3 && "error"}
					className="mb10"
				>
					<Input
						type="password"
						autoComplete="on"
						required
						placeholder="Повторите новый пароль"
						value={newPassword2}
						maxLength={128}
						onChange={(e) => {
							setNewPassword2(e.target.value);

							if (
								e.target.value.length !== 0 &&
								e.target.value.length < 5
							)
								setShowPasswordError3(true);
							else setShowPasswordError3(false);
						}}
					/>
				</FormItem>
				<FormItem>
					<Button
						size="l"
						stretched
						type="submit"
						loading={disabled}
						disabled={
							showPasswordError ||
							showPasswordError2 ||
							showPasswordError3 ||
							newPassword !== newPassword2 ||
							password === newPassword
						}
					>
						Сохранить
					</Button>
				</FormItem>
			</FormLayout>
		</Group>
	);
}
