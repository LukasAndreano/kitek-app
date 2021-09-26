import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Group, Placeholder, PanelHeader, Text } from "@vkontakte/vkui";
import { Icon56PlaylistOutline } from "@vkontakte/icons";

import { useHistory } from "react-router-dom";
import { saveURL } from "../../reducers/mainReducer";

export default function Admin() {
	const storage = useSelector((state) => state.main);
	const dispatch = useDispatch();

	const history = useHistory();

	useEffect(() => {
		if (storage.user.status !== 1) {
			history.replace({ pathname: "/" });
			dispatch(saveURL(""));
		}
	}, [storage.user.status, dispatch, history]);

	return (
		<React.Fragment>
			<PanelHeader separator={storage.isDesktop ? true : false}>
				{storage.isDesktop ? "Панель администратора" : "Админка"}
			</PanelHeader>
			<Group>
				<Placeholder
					header="Пока тут пусто..."
					icon={<Icon56PlaylistOutline />}
					style={{ marginTop: -30, marginBottom: -30 }}
				>
					Ничего нет. Ну ладно... пусть будет текст песни:
					<br />
					Клава Кока - ЛА ЛА ЛА
				</Placeholder>
				<Text style={{ marginLeft: 10 }}>
					Жму пропустить
					<br />
					Не можешь забыть
					<br />
					Тогда отпусти
					<br />
					От этой любви
					<br />
					Уже передоз
					<br />
					У меня один вопрос
					<br />
					Чё те нужно?
					<br />
					Чё ты такой душный?
					<br />
					Я равнодушно
					<br />
					Затыкаю ушки
					<br />
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					<br />
					Ты меня понял не так
					<br />
					Я не ищу отношений
					<br />
					Да, ты красивый, но знай
					<br />
					Мне не нужны украшения
					<br />
					Ты меня понял не так
					<br />
					Я же с тобой не торгуюсь
					<br />
					Купи хоть все в мире туфли
					<br />
					Но я не переобуюсь
					<br />
					<br />
					Абрау Лайт льётся вместо слез
					<br />
					И вся эта любовь как пузырьки
					<br />
					Я не хочу всерьёз
					<br />
					Так что без обид
					<br />
					Чё те нужно?
					<br />
					Чё ты такой душный?
					<br />
					Я равнодушно
					<br />
					Затыкаю ушки
					<br />
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					<br />
					Девушки ищут мажоров
					<br />
					Я люблю треки в миноре
					<br />
					Может и нравлюсь тебе
					<br />
					Лишь потому что игнорю
					<br />
					Хочешь украсть этот вечер
					<br />
					Ты так себе криминал
					<br />
					У тебя в голове я, только я<br />
					<br />
					Больше не в секрете
					<br />
					I’m a single lady
					<br />
					Свободная, как ветер
					<br />
					Одиночки в тренде
					<br />
					Больше не в секрете
					<br />
					I’m a single lady
					<br />
					Свободная, как ветер
					<br />
					Одиночки в тренде
					<br />
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
					<br />
					Ла-ла-ла-ла-ла-ла
				</Text>
			</Group>
		</React.Fragment>
	);
}
