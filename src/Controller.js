import React from "react";

import { Switch, Route } from "react-router-dom";

// Импортируем все панели
import Social from "./panels/Social";
import News from "./panels/News";
import Shedule from "./panels/Shedule";
import Download from "./panels/Download";
import Services from "./panels/Services";

// С доступами
import Profile from "./panels/Profile";
import Admin from "./panels/admin/Admin";
import Settings from "./panels/admin/Settings";
import Albums from "./panels/admin/Albums";

const routes = [
	{
		path: "/",
		exact: true,
		panel: () => <Shedule />,
	},
	{
		path: "/social",
		exact: true,
		panel: () => <Social />,
	},
	{
		path: "/news",
		exact: true,
		panel: () => <News />,
	},
	{
		path: "/download",
		exact: true,
		panel: () => <Download />,
	},
	{
		path: "/services",
		exact: true,
		panel: () => <Services />,
	},
	{
		path: "/profile",
		exact: true,
		panel: () => <Profile />,
	},
	{
		path: "/admin",
		exact: true,
		panel: () => <Admin />,
	},
	{
		path: "/admin/settings",
		exact: true,
		panel: () => <Settings />,
	},
	{
		path: "/admin/albums",
		exact: true,
		panel: () => <Albums />,
	},
	{
		path: "/",
		panel: () => <Shedule />,
	},
];

export default function Controller() {
	return (
		<Switch>
			{routes.map((route, index) => (
				<Route
					key={index}
					path={route.path}
					exact={route.exact}
					children={<route.panel />}
				/>
			))}
		</Switch>
	);
}
