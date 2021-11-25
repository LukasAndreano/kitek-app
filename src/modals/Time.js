import React from "react";
import { Group, Placeholder } from "@vkontakte/vkui";
import { Icon56RecentOutline } from "@vkontakte/icons";

import { motion } from "framer-motion";

export default function Time() {
	return (
		<Group>
			<Placeholder
				header="Звонки переехали!"
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
				style={{ marginTop: -40 }}
			>
				Расписание звонков переехало прямо в расписание! Теперь смотреть
				длительность пары ещё проще!
			</Placeholder>
		</Group>
	);
}
