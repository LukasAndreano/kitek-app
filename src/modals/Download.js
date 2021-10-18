import React from "react";
import { Group, Placeholder, RichCell } from "@vkontakte/vkui";
import {
	Icon56DownloadSquareOutline,
	Icon28DownloadCloudOutline,
} from "@vkontakte/icons";

import { motion } from "framer-motion";

export default function Download() {
	return (
		<Group>
			<Placeholder
				header="Загрузка приложения"
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
						<Icon56DownloadSquareOutline />
					</motion.div>
				}
				style={{ marginTop: -40, marginBottom: -30 }}
			>
				Загрузите приложение КИТЭК'а и просматривайте расписание и
				новости еще быстрее!
			</Placeholder>
			<RichCell
				multiline
				caption="Windows 10 и выше (Microsoft Store)"
				href="https://www.microsoft.com/ru-ru/p/%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BA%D0%B8%D1%82%D1%8D%D0%BA/9pnf3jwf9lcj?activetab=pivot:overviewtab"
				target="_blank"
				after={<Icon28DownloadCloudOutline />}
			>
				<span className="defaultText">Приложение для Windows</span>
			</RichCell>
			<RichCell
				multiline
				caption="Windows 10 и выше (Установщик)"
				href="https://github.com/LukasAndreano/kitek-app/releases/tag/v1.1.1"
				target="_blank"
				after={<Icon28DownloadCloudOutline />}
			>
				<span className="defaultText">Приложение для Windows</span>
			</RichCell>
			<RichCell
				multiline
				caption="Установщик (.apk)"
				href="https://github.com/LukasAndreano/kitek-app/releases/tag/v1.1.1"
				target="_blank"
				after={<Icon28DownloadCloudOutline />}
			>
				<span className="defaultText">Приложение для Android</span>
			</RichCell>
		</Group>
	);
}
