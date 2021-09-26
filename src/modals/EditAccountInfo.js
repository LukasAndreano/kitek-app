import React, { useEffect, useState, useCallback } from "react";
import {
	FormLayout,
	Button,
	Group,
	FormItem,
	Input,
	Placeholder,
	NativeSelect,
} from "@vkontakte/vkui";
import { Icon56NotePenOutline } from "@vkontakte/icons";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar, setUser, saveGroups } from "../reducers/mainReducer";
import { motion } from "framer-motion";

import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";
import api from "../service/api";

export default function EditAccountInfo(props) {
	const storage = useSelector((state) => state.main);
	const dispatch = useDispatch();

	const [name, setName] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [changed, setChanged] = useState(false);

	const [group, setGroup] = useState(0);
	const [groups, setGroups] = useState([]);
	const [loaded, setLoaded] = useState(false);

	const request = useCallback(() => {
		return new Promise((resolve) => {
			authorizedAPI("editProfile", {
				name,
				group,
			}).then((data) => {
				if (
					data.errorCode !== undefined &&
					(data.errorCode === 3 || data.errorCode === 4)
				)
					refreshToken("editProfile", {
						name,
						group,
					}).then((data) => {
						return resolve(data);
					});
				else {
					return resolve(data);
				}
			});
		});
	}, [group, name]);

	useEffect(() => {
		setGroup(storage.user.group === null ? 0 : storage.user.group);
		setName(storage.user.name === null ? "" : storage.user.name);
		if (storage.groups.length === 0)
			api("getGroups").then((data) => {
				if (data.response !== undefined && data.response !== null) {
					setGroups(data.groups);
					dispatch(saveGroups(data.groups));
					setLoaded(true);
				}
			});
		else {
			setGroups(storage.groups);
			setLoaded(true);
		}
	}, [storage.user.name, storage.user.group, dispatch, storage.groups]);

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
						<Icon56NotePenOutline />
					</motion.div>
				}
				header="Редактирование профиля"
				style={{ marginBottom: -30, marginTop: -30 }}
			>
				Если Вы хотите изменить свои данные, то это можно сделать здесь.
				Обратите внимание, что для работы некоторых функций необходимы
				реальные данные (имя, почта, группа и тд.).
			</Placeholder>
			<FormLayout
				onSubmit={(e) => {
					e.preventDefault();
					setDisabled(true);
					if (
						!disabled &&
						name.length >= 5 &&
						name.length < 60 &&
						group !== 0 &&
						changed
					) {
						setName(name.trim());
						request().then((data) => {
							if (data.response) {
								dispatch(setUser(data.user));
								props.closeModal();
								dispatch(
									setSnackbar({
										text: "Данные Вашего аккаунта успешно изменены.",
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
				<FormItem className="mb10">
					<Input
						placeholder="Имя и фамилия"
						maxLength="60"
						value={name}
						required
						onChange={(e) => {
							setChanged(true);
							setName(
								e.target.value.replace(
									/[0-9A-Za-z^!@#$%^&*()_|/№:?;"'.,<>=-~]/gi,
									""
								)
							);
						}}
					/>
				</FormItem>
				<FormItem className="mb10">
					<NativeSelect
						disabled={!loaded}
						defaultValue={group}
						onChange={(e) => {
							setChanged(true);
							setGroup(e.target.value);
						}}
					>
						<option value={0}>
							{storage.user.group === null
								? "Укажите свою группу"
								: "Изменилась группа?"}
						</option>
						{groups.map((el) => {
							return (
								<option key={el.groupID} value={el.groupID}>
									{el.name}
								</option>
							);
						})}
					</NativeSelect>
				</FormItem>
				<FormItem>
					<Button
						size="l"
						stretched
						type="submit"
						loading={disabled || !loaded}
						disabled={
							name === "" ||
							name.length < 5 ||
							group === 0 ||
							!changed
						}
					>
						Сохранить
					</Button>
				</FormItem>
			</FormLayout>
		</Group>
	);
}
