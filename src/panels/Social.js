import React from "react";
import { useSelector } from "react-redux";
import {
	Group,
	Placeholder,
	Button,
	PanelHeader,
	Avatar,
	RichCell,
} from "@vkontakte/vkui";
import { Icon56Users3Outline } from "@vkontakte/icons";

import youtube from "../img/youtube.png";
import vk from "../img/vk.png";
import tiktok from "../img/tiktok.png";
import instagram from "../img/instagram.png";

export default function Social() {
	const storage = useSelector((state) => state.main);

	return (
		<React.Fragment>
			<PanelHeader separator={storage.isDesktop}>
				{storage.isDesktop ? "Социальные сети" : "Соц. сети"}
			</PanelHeader>
			<Group>
				<Placeholder
					header="Социальные сети"
					icon={<Icon56Users3Outline />}
					style={{ marginTop: -30, marginBottom: -30 }}
				>
					На этой странице расположены все социальные сети колледжа с
					описанием контента, который в них публикуется.
				</Placeholder>
				<RichCell
					caption="Официальное сообщество колледжа. Новости, мероприятия, любые вопросы — всё здесь."
					multiline
					disabled
					before={<Avatar size={48} src={vk} mode="app" />}
					actions={
						<Button
							className="fixButton2"
							href="https://vk.com/public63457955"
							target="_blank"
						>
							Перейти
						</Button>
					}
				>
					<span className="defaultText">ВКонтакте</span>
				</RichCell>
				<RichCell
					caption="Официальная страница колледжа в Instagram. Новости, мероприятия, жизнь колледжа и множество сториз."
					multiline
					disabled
					before={<Avatar size={48} src={instagram} mode="app" />}
					actions={
						<Button
							className="fixButton2"
							href="https://instagram.com/omskkitec"
							target="_blank"
						>
							Перейти
						</Button>
					}
				>
					<span className="defaultText">Instagram</span>
				</RichCell>
				<RichCell
					caption="Официальная страница колледжа в TikTok. Развлекательный контент и видео с мероприятий."
					multiline
					disabled
					before={<Avatar size={48} src={tiktok} mode="app" />}
					actions={
						<Button
							className="fixButton2"
							href="https://tiktok.com/@omskkitec"
							target="_blank"
						>
							Перейти
						</Button>
					}
				>
					<span className="defaultText">TikTok</span>
				</RichCell>
				<RichCell
					caption="Официальная страница колледжа в YouTube. Видео с мероприятий здесь."
					multiline
					disabled
					before={<Avatar size={48} src={youtube} mode="app" />}
					actions={
						<Button
							className="fixButton2"
							href="https://youtube.com/c/OmsktecRu"
							target="_blank"
						>
							Перейти
						</Button>
					}
				>
					<span className="defaultText">YouTube</span>
				</RichCell>
			</Group>
		</React.Fragment>
	);
}
