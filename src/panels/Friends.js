import React, {useCallback, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Group,
	Div,
	Button,
	PanelHeader,
	Avatar,
	RichCell, Spinner, Footer, Header, Search,
} from "@vkontakte/vkui";
import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";
import {saveURL, setSnackbar} from "../reducers/mainReducer";
import {useHistory} from "react-router-dom";
import {setLoaded, saveData} from "../reducers/friendsReducer"
import {Icon16Done, Icon24SearchOutline, Icon28SearchOutline} from "@vkontakte/icons";

export default function Friends() {
	const [friendList, setFriendList] = useState([])

	const storage = useSelector((state) => state.main);
	const friends = useSelector((state) => state.friends);

	const dispatch = useDispatch()
	const history = useHistory();

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

	const renderFriendList = useCallback(friendList => {
		let arr = []
		friendList.forEach(el => {
			arr.push(
				<RichCell
					before={<Avatar size={48} src={el.avatar} />}
					caption={el.status === 2
						? "Преподаватель"
						: el.status === 1 ? "Администратор" : el.group
							? "Студент, группа " +
							el.group
							: ""}
				>
					<div style={{display: 'inline-flex'}}>{el.name} {el.verifed && <Icon16Done style={{marginTop: 4, marginLeft: 5}} fill={"#71AAEB"} />} </div>
				</RichCell>
			)
		})
		setFriendList(arr)
		dispatch(setLoaded(true))
	}, [dispatch])

	useEffect(() => {
		if (!storage.waitForRequest)
			if (storage.user.email === null) {
				history.replace({ pathname: "/" });
				dispatch(saveURL(""));
			} else {
				if (!friends.loaded)
					request("friends/get", {}).then((data) => {
						if (data.response) {
							renderFriendList(data.friends)
							dispatch(saveData(data.friends))
						} else {
							history.replace({ pathname: "/" });
							dispatch(saveURL(""));
						}
					});
				else if (friends.data.length !== 0)
					renderFriendList(friends.data)
			}
	}, [
		storage.user.status,
		dispatch,
		friends.data,
		history,
		request,
		storage.waitForRequest,
		friends.loaded,
		storage.user.email,
		renderFriendList
	]);

	return (
		<React.Fragment>
			<PanelHeader separator={storage.isDesktop}>
				Друзья
			</PanelHeader>
			<Group>
				{friends.loaded ? (
					<Div style={{marginTop: -10}}>
						<Search value={""} placeholder={"Найти друзей"} onChange={e => console.log(e)} after={null}/>
						<Header mode={"secondary"}>У Вас в друзьях</Header>
						{friendList}
						<Footer>Всего друзей: {friendList.length}</Footer>
					</Div>
				) : (
					<Spinner size="medium" style={{ margin: "20px 0" }} />
				)}
			</Group>
		</React.Fragment>
	);
}
