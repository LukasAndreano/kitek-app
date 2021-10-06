import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Group,
	PanelHeader,
	CardScroll,
	Card,
	Header,
	SimpleCell,
	Div,
	Avatar,
	Title,
	Text,

} from "@vkontakte/vkui";

import {
	Icon16Down,
	Icon16Recent,
	Icon16Pin,
	Icon16Flash
} from "@vkontakte/icons"

import {
	setActiveModal,
	setSnackbar
} from "../reducers/mainReducer";

export default function Time() {
	const storage = useSelector((state) => state.main);
	const dispatch = useDispatch();

	return (
		<Fragment>
			<PanelHeader separator={storage.isDesktop}>
				Сервисы
			</PanelHeader>
			<Group>
				<CardScroll size="m">
					<Card style={{marginLeft: 10}} onClick={() => dispatch(setSnackbar({text: "Добро пожаловать на вкладку «Сервисы»!", success: true}))}>
						<Div>
							<Avatar style={{ background: 'var(--button_commerce_background)' }} size={28} shadow={false}><Icon16Pin fill="var(--white)" /></Avatar>
							<Title level={4} weight={"medium"} style={{marginTop: 10, marginBottom: 5}}>Вкладка «Сервисы»</Title>
							<Text weight={"regular"}>Здесь расположены дополнительные функции и разделы приложения.</Text>
						</Div>
					</Card>
					<Card onClick={() => dispatch(
						setActiveModal(
							"connectNotifications"
						)
					)}>
						<Div>
							<Avatar style={{ background: 'var(--button_commerce_background)' }} size={28} shadow={false}><Icon16Flash fill="var(--white)" /></Avatar>
							<Title level={4} weight={"medium"} style={{marginTop: 10, marginBottom: 5}}>Уведомления</Title>
							<Text weight={"regular"}>Получайте уведомления при обновлении расписания. Прямо во ВКонтакте.</Text>
						</Div>
					</Card>
					<Card onClick={() => dispatch(setActiveModal('download'))}>
						<Div>
							<Avatar style={{ background: 'var(--button_commerce_background)' }} size={28} shadow={false}><Icon16Down fill="var(--white)" /></Avatar>
							<Title level={4} weight={"medium"} style={{marginTop: 10, marginBottom: 5}}>Приложение</Title>
							<Text weight={"regular"}>Установите приложение КИТЭК себе на Android или на ПК с Windows.</Text>
						</Div>
					</Card>
				</CardScroll>
				<Header mode="secondary">Основные функции</Header>
				<SimpleCell
					onClick={() => dispatch(setActiveModal('download'))}
					before={<Avatar style={{ background: 'var(--accent)' }} size={28} shadow={false}><Icon16Down fill="var(--white)" /></Avatar>}
					description="Поддерживаем Android и Windows."
				>
					Загрузка приложения
				</SimpleCell>
				<SimpleCell
					onClick={() => dispatch(setActiveModal('time'))}
					before={<Avatar style={{ background: 'var(--accent)' }} size={28} shadow={false}><Icon16Recent fill="var(--white)" /></Avatar>}
					description="Звонки учебных занятий."
				>
					Расписание звонков
				</SimpleCell>
			</Group>
		</Fragment>
	);
}
