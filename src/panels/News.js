import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Div,
	ContentCard,
	Link,
	Spinner,
	PanelHeader,
	PullToRefresh,
} from "@vkontakte/vkui";
import api from "../service/api";

import { saveData } from "../reducers/newsReducer";

export default function News() {
	const [wall, setWall] = useState([]);
	const [loader, setLoader] = useState(false);
	const [fetching, setFetching] = useState(false);

	const storage = useSelector((state) => state.main);
	const newsStorage = useSelector((state) => state.news);
	const dispatch = useDispatch();

	useEffect(() => {
		if (newsStorage.data.length !== 0) {
			renderWall(newsStorage.data);
		} else {
			setLoader(true);
			api("getNews").then((data) => {
				if (data.response !== undefined && data.response !== null) {
					renderWall(data.response.items);
					dispatch(saveData(data.response.items));
				}
			});
		}
	}, [newsStorage.data, dispatch, setLoader]);

	function renderWall(data) {
		let arr = [];
		data.forEach((el) => {
			let image = el.attachments !== undefined &&
				el.attachments[0].type === "photo" ? el.attachments[0].photo.sizes[
			el.attachments[0].photo.sizes.length - 1
				].url : null
			if (el.text !== "")
				arr.push(
					<Link
						key={el.id}
						href={
							"https://vk.com/omsktec?w=wall" +
							el.owner_id +
							"_" +
							el.id
						}
						target="_blank"
						refferer="no-referrer"
						className="noHover"
					>
						<ContentCard
							className="defaultText tw"
							disabled
							mode="tint"
							style={{ marginBottom: 10 }}
							text={el.text}
							image={image}
							caption={new Date(el.date * 1000).toLocaleString(
								"ru-RU",
								{
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								}
							)}
						/>
					</Link>
				);
		});
		setWall(arr);
		setFetching(false);
	}

	return (
		<Fragment>
			<PanelHeader separator={storage.isDesktop}>
				Новости
			</PanelHeader>
			<PullToRefresh
				onRefresh={() => {
					setFetching(true);
					api("getNews")
						.then((data) => {
							if (
								data.response !== undefined &&
								data.response !== null
							) {
								renderWall(data.response.items);
								dispatch(saveData(data.response.items));
							}
						})
						.catch(() => {
							setFetching(false);
						});
				}}
				isFetching={fetching}
			>
				{wall.length === 0 && loader === true ? (
					<Spinner size="medium" style={{ margin: "20px 0" }} />
				) : storage.isDesktop ? (
					wall
				) : (
					<Div>{wall}</Div>
				)}
			</PullToRefresh>
		</Fragment>
	);
}
