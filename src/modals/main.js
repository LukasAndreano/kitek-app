import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	ModalCard,
	ModalRoot,
	Button,
	ModalPage,
	ModalPageHeader,
	PanelHeaderButton, RichCell, Card, Text, Title, Group, Div,
} from "@vkontakte/vkui";

import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";

import developer from "../img/avatar.png"

import {
	Icon56InfoOutline,
	Icon24Dismiss,
	Icon56NotificationOutline,
	Icon28FaceRecognitionOutline,
	Icon28Newsfeed,
	Icon28SmartphoneOutline,
	Icon28Users3Outline, Icon28SpeedometerMaxOutline,
} from "@vkontakte/icons";

import { setActiveModal, setUser } from "../reducers/mainReducer";
import { saveSheduleDay, setSheduleStore } from "../reducers/sheduleReducer";

import EditAccountInfo from "./EditAccountInfo";
import ChangePassword from "./ChangePassword";
import Time from "./Time";
import Download from "./Download";
import Social from "./Social";
import FavoriteGroup from "./FavoriteGroup";
import AddNews from "./AddNews";
import AddAlbum from "./AddAlbum";
import ChangeAvatar from "./ChangeAvatar";

export default function Modals() {
	const [blockBackButton, setBlockBackButton] = useState(false);

	const storage = useSelector((state) => state.main);
	const dispatch = useDispatch();

	const history = useHistory();

	const pushToHistory = useCallback(
		(activeModal) => {
			history.push(window.location.pathname + "#" + activeModal);
		},
		[history]
	);

	const closeModal = useCallback(() => {
		if (!blockBackButton) {
			setBlockBackButton(true);
			history.goBack();
			dispatch(setActiveModal(null));
			setTimeout(() => setBlockBackButton(false), 50);
		}
	}, [history, dispatch, blockBackButton]);

	useEffect(() => {
		if (storage.activeModal !== null) pushToHistory(storage.activeModal);
	}, [pushToHistory, storage.activeModal]);

	return (
		<ModalRoot activeModal={storage.activeModal}>
			<ModalCard
				id="changeGroup"
				onClose={() => {
					closeModal();
				}}
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
						<Icon56InfoOutline />
					</motion.div>
				}
				header="Вы уверены, что хотите сменить группу?"
				subheader={
					"При смене группы из кеша удалится расписание, а также привязка к группе."
				}
				actions={
					<Button
						size="l"
						mode="primary"
						style={{ marginTop: -20 }}
						onClick={() => {
							closeModal();
							localStorage.removeItem("group");
							dispatch(saveSheduleDay(0));
							dispatch(setSheduleStore([]));
							history.push(
								window.location.pathname + "leaveGroup"
							);
							history.goBack();
						}}
					>
						Да, сменить
					</Button>
				}
			/>

			<ModalCard
				id="logout"
				onClose={() => {
					closeModal();
				}}
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
						<Icon56InfoOutline />
					</motion.div>
				}
				header="Выйти из аккаунта?"
				subheader={
					"После выхода из аккаунта для доступа к некоторым функциям понадобится авторизация."
				}
				actions={
					<Button
						size="l"
						mode="primary"
						style={{ marginTop: -20 }}
						onClick={() => {
							closeModal();
							localStorage.removeItem("access_token");
							localStorage.removeItem("refresh_token");
							dispatch(
								setUser({
									name: null,
									email: null,
									course: 0,
									group: null,
									status: 0,
								})
							);
						}}
					>
						Да, выйти
					</Button>
				}
			/>

			<ModalPage
				id="favoriteGroup"
				onClose={() => {
					closeModal();
				}}
				dynamicContentHeight
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					/>
				}
			>
				<FavoriteGroup closeModal={closeModal} />
			</ModalPage>

			<ModalPage
				id="updated"
				onClose={() => {
					closeModal();
				}}
				dynamicContentHeight
				header={
					<ModalPageHeader
						style={{marginBottom: -15}}
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					/>
				}
			>
				<Group style={{ textAlign: "center" }}>
					<img src={developer} alt="avatar"  style={{width: 128}}/>
					<Title level="2" weight="normal" style={{ marginBottom: 5 }}>
						Приложение обновилось!
					</Title>
					<Text weight="regular">
						Встречайте обновление 1.1.9!<br/>Давайте посмотрим, что мы изменили:
					</Text>
					<Div style={{ textAlign: "left" }}>
						<Card>
							<RichCell
								before={
									<Icon28FaceRecognitionOutline
										style={{ marginTop: 18, marginRight: 10 }}
									/>
								}
								caption="Добавьте немного уникальности в свой профиль - добавьте аватар."
								className="tw"
								disabled
							>
								Аватарки профиля
							</RichCell>
						</Card>
						<Card style={{ marginTop: 10 }}>
							<RichCell
								before={
									<Icon28Newsfeed
										style={{ marginTop: 18, marginRight: 10 }}
									/>
								}
								caption="Мы полностью переработали вкладку с новостями, чтобы в будущем публиковать здесь только уникальный контент."
								className="tw"
								disabled
							>
								Новости приложения (beta)
							</RichCell>
						</Card>
						<Card style={{ marginTop: 10 }}>
							<RichCell
								before={
									<Icon28SmartphoneOutline
										style={{ marginTop: 18, marginRight: 10 }}
									/>
								}
								caption="Теперь приложение будет работать даже на iPhone 5s. Наконец-то!"
								className="tw"
								disabled
							>
								Поддержка старых iPhone
							</RichCell>
						</Card>
						<Card style={{ marginTop: 10 }}>
							<RichCell
								before={
									<Icon28Users3Outline
										style={{ marginTop: 18, marginRight: 10 }}
									/>
								}
								caption="Отныне преподаватели, которые курируют какую-либо группу, могут отслеживать её расписание в один клик."
								className="tw"
								disabled
							>
								Курируемые группы
							</RichCell>
						</Card>
						<Card style={{ marginTop: 10 }}>
							<RichCell
								before={
									<Icon28SpeedometerMaxOutline
										style={{ marginTop: 18, marginRight: 10 }}
									/>
								}
								caption="В этом обновлении мы причесали код и переработали логику запросов. Всё для старых iOS & Android устройств!"
								className="tw"
								disabled
							>
								Теперь ещё быстрее
							</RichCell>
						</Card>
					</Div>
				</Group>
			</ModalPage>

			<ModalPage
				id="editAccountInfo"
				onClose={() => {
					closeModal();
				}}
				dynamicContentHeight
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					>
						Редактирование
					</ModalPageHeader>
				}
			>
				<EditAccountInfo closeModal={closeModal} />
			</ModalPage>

			<ModalCard
				id="aboutAPP"
				className="tw"
				onClose={() => {
					closeModal();
				}}
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
						<Icon56InfoOutline />
					</motion.div>
				}
				header={"О приложении"}
				subheader={
					"Это приложение для студентов КИТЭК'а, позволяющее просматривать текущее расписание, следить за новостями, а также быстро подписываться на социальные сети колледжа.\n\nТекущая версия: 1.2.0\nРазработчик: Никита Балин"
				}
				actions={
					<Button
						size="l"
						mode="primary"
						href="https://vk.com/id172118960"
						target="_blank"
						className="fixButton2"
						style={{ marginTop: -20 }}
					>
						Страница разработчика
					</Button>
				}
			/>

			<ModalCard
				id="connectNotifications"
				className="tw"
				onClose={() => {
					closeModal();
				}}
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
						<Icon56NotificationOutline />
					</motion.div>
				}
				header={"Уведомления"}
				subheader={
					"Для подключения уведомлений Вам потребуется страница ВКонтакте.\n\nПерейдите в мини-приложение «Уведомления» и подключите сервис «КИТЭК». Способ получения уведомлений можно настроить отдельно в мини-приложении."
				}
				actions={
					<Button
						size="l"
						mode="primary"
						className="fixButton2"
						onClick={() => closeModal()}
						href="https://vk.com/app7915893"
						target="_blank"
						style={{ marginTop: -20 }}
					>
						Открыть
					</Button>
				}
			/>

			<ModalPage
				id="changePassword"
				onClose={() => {
					closeModal();
				}}
				dynamicContentHeight
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					>
						Смена пароля
					</ModalPageHeader>
				}
			>
				<ChangePassword closeModal={closeModal} />
			</ModalPage>

			<ModalPage
				id="changeAvatar"
				onClose={() => {
					closeModal();
				}}
				dynamicContentHeight
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					>
						Аватар
					</ModalPageHeader>
				}
			>
				<ChangeAvatar closeModal={closeModal} />
			</ModalPage>

			<ModalPage
				id="addNews"
				onClose={() => {
					closeModal();
				}}
				dynamicContentHeight
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					>
						Новая запись
					</ModalPageHeader>
				}
			>
				<AddNews closeModal={closeModal} />
			</ModalPage>

			<ModalPage
				id="addAlbum"
				onClose={() => {
					closeModal();
				}}
				dynamicContentHeight
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					>
						Новый альбом
					</ModalPageHeader>
				}
			>
				<AddAlbum closeModal={closeModal} />
			</ModalPage>

			<ModalPage
				id="time"
				onClose={() => {
					closeModal();
				}}
				settlingHeight={100}
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					/>
				}
			>
				<Time />
			</ModalPage>

			<ModalPage
				id="download"
				onClose={() => {
					closeModal();
				}}
				dynamicContentHeight
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					/>
				}
			>
				<Download />
			</ModalPage>
			<ModalPage
				id="social"
				onClose={() => {
					closeModal();
				}}
				settlingHeight={100}
				header={
					<ModalPageHeader
						right={
							storage.isDesktop ? (
								""
							) : (
								<PanelHeaderButton onClick={() => closeModal()}>
									<Icon24Dismiss />
								</PanelHeaderButton>
							)
						}
						separator={false}
					/>
				}
			>
				<Social />
			</ModalPage>
		</ModalRoot>
	);
}
