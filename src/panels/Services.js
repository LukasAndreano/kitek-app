import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import {
	Group,
	PanelHeader,
} from "@vkontakte/vkui";

export default function Time() {
	const storage = useSelector((state) => state.main);

	return (
		<Fragment>
			<PanelHeader separator={storage.isDesktop}>
				Сервисы
			</PanelHeader>
			<Group>123</Group>
		</Fragment>
	);
}
