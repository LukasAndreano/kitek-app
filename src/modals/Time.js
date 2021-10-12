import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Group,
	Placeholder,
	SliderSwitch,
	Div,
	Avatar,
	RichCell,
} from "@vkontakte/vkui";
import { Icon56RecentOutline } from "@vkontakte/icons";

import { setTab } from "../reducers/timeReducer";

import { motion } from "framer-motion";

export default function Time() {
	const timeStorage = useSelector((state) => state.time);
	const dispatch = useDispatch();

	return (
		<Group>
			<Placeholder
				header="Расписание звонков"
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
						<Icon56RecentOutline />
					</motion.div>
				}
				style={{ marginTop: -40, marginBottom: -30 }}
			>
				На этой странице отображаются звонки учебных занятий.
			</Placeholder>
			<Div>
				<SliderSwitch
					onSwitch={(value) => dispatch(setTab(value))}
					activeValue={timeStorage.tab}
					options={[
						{
							name: "Будние дни",
							value: 1,
						},
						{
							name: "Суббота",
							value: 2,
						},
					]}
				/>
			</Div>
			<RichCell
				caption={
					timeStorage.tab === 1 ? "с 8:45 до 10:15" : "с 8:45 до 9:55"
				}
				multiline
				disabled
				before={
					<Avatar
						size={40}
						src={""}
						mode="app"
						style={{ marginTop: 12 }}
					>
						<span className="TopText" style={{ marginTop: -4 }}>
							1
						</span>
					</Avatar>
				}
			>
				<span className="defaultText">Пара</span>
			</RichCell>
			<RichCell
				caption={
					timeStorage.tab === 1
						? "с 10:25 до 11:10"
						: "с 10:00 до 10:40"
				}
				multiline
				disabled
				before={
					<Avatar
						size={40}
						src={""}
						mode="app"
						style={{ marginTop: 12 }}
					>
						<span className="TopText" style={{ marginTop: -4 }}>
							2
						</span>
					</Avatar>
				}
			>
				<span className="defaultText">Первая часть пары</span>
			</RichCell>
			<RichCell
				caption={
					timeStorage.tab === 1
						? "с 11:10 до 11:40"
						: "с 10:40 до 11:00"
				}
				multiline
				disabled
				before={
					<Avatar
						size={40}
						src={""}
						mode="app"
						style={{ marginTop: 12 }}
					/>
				}
			>
				<span className="defaultText">Перерыв</span>
			</RichCell>
			<RichCell
				caption={
					timeStorage.tab === 1
						? "с 11:40 до 12:25"
						: "с 11:00 до 11:30"
				}
				multiline
				disabled
				before={
					<Avatar
						size={40}
						src={""}
						mode="app"
						style={{ marginTop: 12 }}
					>
						<span className="TopText" style={{ marginTop: -4 }}>
							2
						</span>
					</Avatar>
				}
			>
				<span className="defaultText">Вторая часть пары</span>
			</RichCell>
			<RichCell
				caption={
					timeStorage.tab === 1
						? "с 12:35 до 14:05"
						: "с 11:35 до 12:45"
				}
				multiline
				disabled
				before={
					<Avatar
						size={40}
						src={""}
						mode="app"
						style={{ marginTop: 12 }}
					>
						<span className="TopText" style={{ marginTop: -4 }}>
							3
						</span>
					</Avatar>
				}
			>
				<span className="defaultText">Пара</span>
			</RichCell>
			<RichCell
				caption={
					timeStorage.tab === 1
						? "с 14:15 до 15:45"
						: "с 12:50 до 14:00"
				}
				multiline
				disabled
				before={
					<Avatar
						size={40}
						src={""}
						mode="app"
						style={{ marginTop: 12 }}
					>
						<span className="TopText" style={{ marginTop: -4 }}>
							4
						</span>
					</Avatar>
				}
			>
				<span className="defaultText">Пара</span>
			</RichCell>
			<RichCell
				caption={
					timeStorage.tab === 1
						? "с 15:55 до 17:25"
						: "с 14:05 до 15:15"
				}
				multiline
				disabled
				before={
					<Avatar
						size={40}
						src={""}
						mode="app"
						style={{ marginTop: 12 }}
					>
						<span className="TopText" style={{ marginTop: -4 }}>
							5
						</span>
					</Avatar>
				}
			>
				<span className="defaultText">Пара</span>
			</RichCell>
			<RichCell
				caption={
					timeStorage.tab === 1
						? "с 17:35 до 19:05"
						: "с 15:20 до 16:30"
				}
				multiline
				disabled
				before={
					<Avatar
						size={40}
						src={""}
						mode="app"
						style={{ marginTop: 14 }}
					>
						<span className="TopText" style={{ marginTop: -4 }}>
							6
						</span>
					</Avatar>
				}
			>
				<span className="defaultText">Пара</span>
			</RichCell>
		</Group>
	);
}
