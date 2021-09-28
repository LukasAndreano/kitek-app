import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Group,
	Placeholder,
	SliderSwitch,
	Div,
	PanelHeader,
	Avatar,
	RichCell,
} from "@vkontakte/vkui";
import { Icon56RecentOutline } from "@vkontakte/icons";

import { setTab } from "../reducers/timeReducer";

export default function Time() {
	const storage = useSelector((state) => state.main);
	const timeStorage = useSelector((state) => state.time);
	const dispatch = useDispatch();

	return (
		<Fragment>
			<PanelHeader separator={storage.isDesktop ? true : false}>
				Сервисы
			</PanelHeader>
			<Group>123</Group>
		</Fragment>
	);
}
