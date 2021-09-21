import React, { Fragment } from "react";
import { Panel, Group, Div, Title, Text, Avatar } from "@vkontakte/vkui";

import { Icon36CancelOutline } from "@vkontakte/icons";

const Cookies = ({ id }) => {
	return (
		<Panel id={id} centered={true}>
			<Fragment>
				<Group>
					<Div className="WelcomeBlock">
						<Avatar size={64}>
							<Icon36CancelOutline />
						</Avatar>
						<Title
							level="1"
							weight="bold"
							style={{ marginBottom: 10, marginTop: 10 }}
						>
							Ах-ох! Что произошло?
						</Title>
						<Text weight="regular">
							Скорее всего, вы зашли с инкогнито. <br /> В этом
							режиме приложение не может работать.
						</Text>
					</Div>
				</Group>
			</Fragment>
		</Panel>
	);
};

export default Cookies;
