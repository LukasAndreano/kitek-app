import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	PanelHeader,
	CardScroll,
	Card,
	SimpleCell,
	Div,
	Avatar,
	Title,
	Text,

} from "@vkontakte/vkui";

import {
	Icon16Down,
	Icon16Users,
	Icon16Recent,
	Icon16Pin,
	Icon16Flash,
	Icon16Poll,
	Icon16Sync
} from "@vkontakte/icons"

import {
	setActiveModal,
	setSnackbar
} from "../reducers/mainReducer";
import {useHistory} from "react-router-dom";

export default function Time() {
	const storage = useSelector((state) => state.main);
	const dispatch = useDispatch();

	const history = useHistory();

	return (
		<Fragment>
			<PanelHeader separator={storage.isDesktop}>
				Сервисы
			</PanelHeader>
			<Div>
				<CardScroll size="m">
					<Card className={"tap"} style={{marginLeft: storage.isDesktop ? 12 : 5}} onClick={() => dispatch(setSnackbar({text: "Добро пожаловать на вкладку «Сервисы»!", success: true}))}>
						<Div>
							<Avatar style={{ background: 'var(--button_commerce_background)' }} size={28} shadow={false}><Icon16Pin fill="var(--white)" /></Avatar>
							<Title level={4} weight={"medium"} style={{marginTop: 10, marginBottom: 5}}>Вкладка «Сервисы»</Title>
							<Text weight={"regular"}>Здесь расположены дополнительные функции и разделы приложения.</Text>
						</Div>
					</Card>
					<Card className={"tap"} onClick={() => dispatch(
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
					<Card className={"tap"} onClick={() => dispatch(setActiveModal('download'))}>
						<Div>
							<Avatar style={{ background: 'var(--button_commerce_background)' }} size={28} shadow={false}><Icon16Down fill="var(--white)" /></Avatar>
							<Title level={4} weight={"medium"} style={{marginTop: 10, marginBottom: 5}}>Приложение</Title>
							<Text weight={"regular"}>Установите приложение КИТЭК себе на Android или на ПК с Windows.</Text>
						</Div>
					</Card>
				</CardScroll>
				<div style={{paddingLeft: 5, paddingRight: 5, marginTop: 10}}>
					<Card>
						<SimpleCell
							onClick={() => dispatch(setActiveModal('time'))}
							before={<Avatar style={{ background: 'var(--accent)' }} size={28} shadow={false}><Icon16Recent fill="var(--white)" /></Avatar>}
							description="Звонки учебных занятий."
						>
							Расписание звонков
						</SimpleCell>
					</Card>
					<Card style={{margin: '10px 0'}}>
						<SimpleCell
							onClick={() => dispatch(setActiveModal('social'))}
							before={<Avatar style={{ background: 'var(--accent)' }} size={28} shadow={false}><Icon16Users fill="var(--white)" /></Avatar>}
							description="Соц. сети колледжа"
						>
							Социальные сети
						</SimpleCell>
						<SimpleCell
							onClick={() => dispatch(setActiveModal('download'))}
							before={<Avatar style={{ background: 'var(--accent)' }} size={28} shadow={false}><Icon16Down fill="var(--white)" /></Avatar>}
							description="Поддерживаем Android и Windows."
						>
							Загрузка приложения
						</SimpleCell>
					</Card>
					{storage.user.status === 1 &&
					!storage.isDesktop && (
						<Card style={{margin: '10px 0'}}>
							<SimpleCell
								before={<Avatar style={{ background: 'var(--destructive)' }} size={28} shadow={false}><Icon16Poll fill="var(--white)" /></Avatar>}
								onClick={() => {
									history.push(
										"/admin"
									);
								}}
								description="Посещаемость приложения"
							>
								Статистика
							</SimpleCell>
							<SimpleCell
								before={<Avatar style={{ background: 'var(--destructive)' }} size={28} shadow={false}><Icon16Sync fill="var(--white)" /></Avatar>}
								onClick={() => {
									history.push(
										"/admin/settings"
									);
								}}
								description="Управление приложением"
							>
								Настройки
							</SimpleCell>
						</Card>
					)}
				</div>
			</Div>
		</Fragment>
	);
}
