import React, { useEffect, useCallback, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Group,
	PanelHeaderBack,
	Placeholder,
	Div,
	PanelHeader,
	Spinner,
	Button,
	Cell,
	Footer,
} from "@vkontakte/vkui";
import { Icon56GalleryOutline, Icon20Add } from "@vkontakte/icons";

import { useHistory } from "react-router-dom";
import {
	saveURL,
	setActiveModal,
	setSnackbar,
} from "../../reducers/mainReducer";
import { setAlbumsLoaded, saveAlbumsData } from "../../reducers/adminReducer";

import authorizedAPI from "../../service/authorizedAPI";
import refreshToken from "../../service/refreshToken";

export default function Albums() {
	const storage = useSelector((state) => state.main);
	const adminStorage = useSelector((state) => state.admin);
	const dispatch = useDispatch();

	const history = useHistory();

	const [albums, setBlocks] = useState(false);

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

	const render = useCallback(
		(data) => {
			let blocks = [];
			data.map((item, index) =>
				blocks.push(
					<Cell
						description={"Группа: " + item.group_id}
						key={item._id}
						mode={"removable"}
						onRemove={() => {
							request("admin/albums/delete", {
								id: data[index]._id,
							}).then((res) => {
								if (res.response || res.errorCode === 1) {
									let newData = [
										...data.slice(0, index),
										...data.slice(index + 1),
									];
									dispatch(saveAlbumsData(newData));
									render(newData);
								} else {
									dispatch(
										setSnackbar({
											text: "Произошла ошибка при удалении альбома",
											success: false,
										})
									);
								}
							});
						}}
					>
						{item.album_id} ({item.total}/10000)
					</Cell>
				)
			);

			setBlocks(blocks);
		},
		[request, dispatch]
	);

	useEffect(() => {
		if (!storage.waitForRequest)
			if (storage.user.status !== 1) {
				history.replace({ pathname: "/" });
				dispatch(saveURL(""));
			} else {
				if (!adminStorage.albumsLoaded)
					request("admin/albums/get", {}).then((data) => {
						if (data.response) {
							dispatch(setAlbumsLoaded(true));
							dispatch(saveAlbumsData(data.albums));
							render(data.albums);
						} else {
							history.replace({ pathname: "/admin" });
							dispatch(saveURL(""));
							dispatch(
								setSnackbar({
									text: "Произошла ошибка при получении альбомов",
									success: false,
								})
							);
						}
					});
				else if (adminStorage.albums.length !== 0)
					render(adminStorage.albums);
			}
	}, [
		storage.user.status,
		dispatch,
		adminStorage.albums,
		history,
		request,
		render,
		storage.waitForRequest,
		adminStorage.albumsLoaded,
	]);

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
				Альбомы
			</PanelHeader>
			<Group>
				<Placeholder
					header="Альбомы"
					icon={<Icon56GalleryOutline />}
					style={{ marginTop: -30, marginBottom: -30 }}
				>
					На этой странице отображатся альбомы ВКонтакте,
					использующиеся в качестве хранилища фотографий для новостей
					и других функций приложения.
				</Placeholder>
				{storage.isDesktop ? (
					<Button
						before={<Icon20Add />}
						onClick={() => dispatch(setActiveModal("addAlbum"))}
						stretched
						size="l"
						mode="secondary"
					>
						Добавить альбом
					</Button>
				) : (
					<Div>
						<Button
							style={{ marginTop: -10, marginBottom: -10 }}
							before={<Icon20Add />}
							onClick={() => dispatch(setActiveModal("addAlbum"))}
							stretched
							size="l"
							mode="secondary"
						>
							Добавить альбом
						</Button>
					</Div>
				)}
				{adminStorage.albumsLoaded ? (
					<Fragment>
						{albums !== false && albums.length !== 0 ? (
							<div style={{ marginTop: 10 }}>
								{albums}
								<Footer>Всего альбомов: {albums.length}</Footer>
							</div>
						) : (
							<Placeholder>Альбомов пока нет</Placeholder>
						)}
					</Fragment>
				) : (
					<Spinner size="medium" style={{ margin: "20px 0" }} />
				)}
			</Group>
		</React.Fragment>
	);
}
