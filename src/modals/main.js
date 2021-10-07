import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	ModalCard,
	ModalRoot,
	Button,
	ModalPage,
	ModalPageHeader,
	PanelHeaderButton,
} from "@vkontakte/vkui";

import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";

import {
	Icon56InfoOutline,
	Icon24Dismiss,
	Icon56NotificationOutline,
} from "@vkontakte/icons";

import { setActiveModal, setUser } from "../reducers/mainReducer";
import { saveSheduleDay, setSheduleStore } from "../reducers/sheduleReducer";

import EditAccountInfo from "./EditAccountInfo";
import ChangePassword from "./ChangePassword";
import Time from "./Time"
import Download from "./Download"
import Social from "./Social"

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
					"Это приложение для студентов КИТЭК'а, позволяющее просматривать текущее расписание, следить за новостями, а также быстро подписываться на социальные сети колледжа.\n\nТекущая версия: 1.1.7.1\nРазработчик: Никита Балин"
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
