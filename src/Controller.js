import React from "react"

import {
    Switch,
    Route,
} from "react-router-dom";

// Импортируем все панели
import Social from "./panels/Social";
import Time from "./panels/Time";
import News from "./panels/News";
import Shedule from "./panels/Shedule";

const routes = [
    {
        path: "/",
        exact: true,
        panel: () => <Shedule />
    },
    {
        path: "/social",
        exact: true,
        panel: () => <Social />
    },
    {
        path: "/time",
        exact: true,
        panel: () => <Time />
    },
    {
        path: "/news",
        exact: true,
        panel: () => <News />
    }
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
    )
}
