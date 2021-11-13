// noinspection JSCheckFunctionSignatures

import React, { useState, useCallback } from "react";
import { FormLayout, Button, Group, FormItem, Input } from "@vkontakte/vkui";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../reducers/mainReducer";

import { setAlbumsLoaded } from "../reducers/adminReducer";

import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";

export default function AddAlbum(props) {
	const dispatch = useDispatch();

	const [album_id, setAlbumId] = useState("");
	const [group_id, setGroupId] = useState("");

	const [disabled, setDisabled] = useState(false);

	const request = useCallback(() => {
		return new Promise((resolve) => {
			authorizedAPI("admin/albums/add", {
				album_id,
				group_id,
			}).then((data) => {
				if (
					data.errorCode !== undefined &&
					(data.errorCode === 3 || data.errorCode === 4)
				)
					refreshToken("admin/albums/add", {
						album_id,
						group_id,
					}).then((data) => {
						return resolve(data);
					});
				else {
					return resolve(data);
				}
			});
		});
	}, [group_id, album_id]);

	return (
		<Group>
			<FormLayout
				style={{ marginTop: -20 }}
				onSubmit={(e) => {
					e.preventDefault();
					setDisabled(true);
					if (group_id !== "" || album_id !== "") {
						request().then((data) => {
							if (data.response) {
								dispatch(setAlbumsLoaded(false));
								props.closeModal();
								dispatch(
									setSnackbar({
										text: "Альбом добавлен!",
										success: true,
									})
								);
							} else {
								setDisabled(false);
								if (data.errorCode === 1)
									setSnackbar({
										text: "Такой альбом уже создан",
										success: true,
									});
								else
									setSnackbar({
										text: "Что-то пошло не так...",
										success: true,
									});
							}
						});
					}
				}}
			>
				<FormItem className="mb10" top="ID сообщества">
					<Input
						placeholder="206215182"
						maxLength="20"
						value={group_id}
						required
						onChange={(e) => {
							setGroupId(e.target.value.trim());
						}}
					/>
				</FormItem>
				<FormItem className="mb10" top="ID альбома">
					<Input
						placeholder="280906195"
						maxLength="20"
						value={album_id}
						required
						onChange={(e) => {
							setAlbumId(e.target.value.trim());
						}}
					/>
				</FormItem>
				<FormItem>
					<Button
						size="l"
						stretched
						type="submit"
						loading={disabled}
						disabled={album_id === "" || group_id === ""}
					>
						Добавить
					</Button>
				</FormItem>
			</FormLayout>
		</Group>
	);
}
