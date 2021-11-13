import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Div,
	ContentCard,
	Spinner,
	PanelHeader,
	PullToRefresh,
	Button,
	CardScroll,
	Card, Placeholder,
} from "@vkontakte/vkui";
import api from "../service/api";
import { Icon20WriteSquareOutline } from "@vkontakte/icons";

import { saveData } from "../reducers/newsReducer";
import { setActiveModal } from "../reducers/mainReducer";

export default function News() {
	const [wall, setWall] = useState([]);
	const [loader, setLoader] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [loaded, setLoaded] = useState(false)

	const storage = useSelector((state) => state.main);
	const newsStorage = useSelector((state) => state.news);
	const dispatch = useDispatch();

	useEffect(() => {
		if (newsStorage.data !== undefined && newsStorage.data !== null && newsStorage.data.length !== 0) {
			renderWall(newsStorage.data, storage.isDesktop);
		} else {
			if (newsStorage.data !== null) {
				setLoader(true);
				api("/getLatestNews").then((data) => {
					if (data.response !== undefined && data.response !== null && data.news.length !== 0) {
						renderWall(data.news, storage.isDesktop);
						dispatch(saveData(data.news));
					} else {
						setLoader(false);
						dispatch(saveData(null));
					}
				});
			}
		}
	}, [newsStorage.data, dispatch, setLoader, storage.isDesktop]);

	function renderWall(data, desktop) {
		let arr = [];

		if (data.length !== 0)
			data.forEach((el) => {
				arr.push(
					<Card key={el._id}>
						{el.images[0] !== "" && (
							<CardScroll size="l">
								{el.images.map((el) => {
									return (
										<Card key={el}>
											<img
												src={el}
												alt="img"
												style={{
													width: "100%",
													marginLeft: desktop
													? 15
													: 0,
													height: "100%",
													borderTopLeftRadius: 8,
													borderTopRightRadius: 8
												}}
											/>
										</Card>
									);
								})}
							</CardScroll>
						)}
						<ContentCard
							className="defaultText tw"
							disabled
							mode="tint"
							style={{ marginBottom: 10 }}
							text={el.description}
							header={el.title}
							caption={new Date(el.date * 1000).toLocaleString(
								"ru-RU",
								{
									weekday: "long",
									month: "long",
									day: "numeric",
								}
							)}
						/>
					</Card>
				);
			});
		setWall(arr);
		setFetching(false);
		setLoaded(true)
	}

	return (
		<Fragment>
			<PanelHeader separator={storage.isDesktop}>Новости</PanelHeader>
			<PullToRefresh
				onRefresh={() => {
					setFetching(true);
					api("getLatestNews")
						.then((data) => {
							if (
								data.response !== false &&
								data.news.length !== 0
							) {
								renderWall(data.news, storage.isDesktop);
								dispatch(saveData(data.news));
							} else {
								setFetching(false)
							}
						})
						.catch(() => {
							setFetching(false);
						});
				}}
				isFetching={fetching}
			>
				{storage.user.status === 1 &&
					<Fragment>
						{storage.isDesktop ? (
							<Button
								stretched
								before={<Icon20WriteSquareOutline />}
								onClick={() => dispatch(setActiveModal("addNews"))}
								mode="secondary"
								size="l"
								style={{ marginBottom: 10 }}
							>
								Новая запись
							</Button>
						) : (
							<Div style={{ marginBottom: -10, marginTop: -5 }}>
								<Button
									stretched
									before={<Icon20WriteSquareOutline />}
									onClick={() => dispatch(setActiveModal("addNews"))}
									mode="secondary"
									size="l"
								>
									Новая запись
								</Button>
							</Div>
						)}
					</Fragment>
				}
				{(loader === true && !loaded) ? (
					<Spinner size="medium" style={{ margin: "20px 0" }} />
				) : (
					<Fragment>
						{storage.isDesktop ? (
							wall
						) : (
							<Div>{wall}</Div>
						)}
						{wall.length === 0 && <Placeholder style={{marginTop: -40}}>Новостей пока нет. <br />Ждём!</Placeholder>}
					</Fragment>
				)}
			</PullToRefresh>
		</Fragment>
	);
}
