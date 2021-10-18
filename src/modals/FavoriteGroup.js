// noinspection JSCheckFunctionSignatures

import React, { useEffect, useState, useCallback } from "react";
import {
	FormLayout,
	Button,
	Group,
	FormItem,
	Placeholder,
	NativeSelect,
} from "@vkontakte/vkui";
import {Icon56Users3Outline} from "@vkontakte/icons";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar, setUser, saveGroups } from "../reducers/mainReducer";
import { motion } from "framer-motion";

import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";
import api from "../service/api";

export default function FavoriteGroup(props) {
	const storage = useSelector((state) => state.main);
	const dispatch = useDispatch();

	const [disabled, setDisabled] = useState(false);
	const [changed, setChanged] = useState(false);

	const [group, setGroup] = useState(0);
	const [groups, setGroups] = useState([]);
	const [loaded, setLoaded] = useState(false);

	const request = useCallback(() => {
		return new Promise((resolve) => {
			authorizedAPI("teacher/editGroup", {
				group,
			}).then((data) => {
				if (
					data.errorCode !== undefined &&
					(data.errorCode === 3 || data.errorCode === 4)
				)
					refreshToken("teacher/editGroup", {
						group,
					}).then((data) => {
						return resolve(data);
					});
				else {
					return resolve(data);
				}
			});
		});
	}, [group]);

	useEffect(() => {
		setGroup(storage.user.teacherGroup === null ? 0 : storage.user.teacherGroup);
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
	}, [storage.user.teacherGroup, dispatch, storage.groups]);

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
						<Icon56Users3Outline />
					</motion.div>
				}
				header="Курируемая группа"
				style={{ marginBottom: -30, marginTop: -60 }}
			>
				Добавьте курируемую группу и быстро просматривайте её расписание.
			</Placeholder>
			<FormLayout
				onSubmit={(e) => {
					e.preventDefault();
					setDisabled(true);
					if (
						!disabled &&
						group !== 0 &&
						changed
					) {
						request().then((data) => {
							if (data.response) {
								dispatch(setUser(data.user));
								props.closeModal();
								dispatch(
									setSnackbar({
										text: "Курируемая группа успешно изменена.",
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
					<NativeSelect
						disabled={!loaded}
						defaultValue={group}
						onChange={(e) => {
							setChanged(true);
							setGroup(e.target.value);
						}}
					>
						<option value={0}>
							{storage.user.teacherGroup === null
								? "Укажите курируемую группу"
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
