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

  const storage = useSelector(state => state.main);
  const timeStorage = useSelector(state => state.time);
  const dispatch = useDispatch();

  return (
    <Fragment>
      <PanelHeader separator={storage.isDesktop ? true : false}>
        {storage.isDesktop ? "Расписание звонков" : "Звонки"}
      </PanelHeader>
      <Group>
        <Placeholder
          header="Расписание звонков"
          icon={<Icon56RecentOutline />}
          style={{ marginTop: -30, marginBottom: -30 }}
        >
          На этой странице отображаются звонки на будний или выходной день.
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
          caption={timeStorage.tab === 1 ? "8:45 — 10:15" : "8:45 — 9:55"}
          multiline
          disabled
          before={
            <Avatar size={40} src={""} mode="app" style={{ marginTop: 12 }}>
              <span className="TopText" style={{ marginTop: -4 }}>
                1
              </span>
            </Avatar>
          }
        >
          <span className="defaultText">Пара №1</span>
        </RichCell>
        <RichCell
          caption={timeStorage.tab === 1 ? "10:25 — 11:10" : "10:00 — 10:40"}
          multiline
          disabled
          before={
            <Avatar size={40} src={""} mode="app" style={{ marginTop: 12 }}>
              <span className="TopText" style={{ marginTop: -4 }}>
                2
              </span>
            </Avatar>
          }
        >
          <span className="defaultText">Первая часть пары №2</span>
        </RichCell>
        <RichCell
          caption={timeStorage.tab === 1 ? "11:10 — 11:40" : "10:40 — 11:00"}
          multiline
          disabled
          before={
            <Avatar size={40} src={""} mode="app" style={{ marginTop: 12 }} />
          }
        >
          <span className="defaultText">Перерыв</span>
        </RichCell>
        <RichCell
          caption={timeStorage.tab === 1 ? "11:40 — 12:25" : "11:00 — 11:30"}
          multiline
          disabled
          before={
            <Avatar size={40} src={""} mode="app" style={{ marginTop: 12 }}>
              <span className="TopText" style={{ marginTop: -4 }}>
                2
              </span>
            </Avatar>
          }
        >
          <span className="defaultText">Вторая часть пары №2</span>
        </RichCell>
        <RichCell
          caption={timeStorage.tab === 1 ? "12:35 — 14:05" : "11:35 — 12:45"}
          multiline
          disabled
          before={
            <Avatar size={40} src={""} mode="app" style={{ marginTop: 12 }}>
              <span className="TopText" style={{ marginTop: -4 }}>
                3
              </span>
            </Avatar>
          }
        >
          <span className="defaultText">Пара №3</span>
        </RichCell>
        <RichCell
          caption={timeStorage.tab === 1 ? "14:15 — 15:45" : "12:50 — 14:00"}
          multiline
          disabled
          before={
            <Avatar size={40} src={""} mode="app" style={{ marginTop: 12 }}>
              <span className="TopText" style={{ marginTop: -4 }}>
                4
              </span>
            </Avatar>
          }
        >
          <span className="defaultText">Пара №4</span>
        </RichCell>
        <RichCell
          caption={timeStorage.tab === 1 ? "15:55 — 17:25" : "14:05 — 15:15"}
          multiline
          disabled
          before={
            <Avatar size={40} src={""} mode="app" style={{ marginTop: 12 }}>
              <span className="TopText" style={{ marginTop: -4 }}>
                5
              </span>
            </Avatar>
          }
        >
          <span className="defaultText">Пара №5</span>
        </RichCell>
        <RichCell
          caption={timeStorage.tab === 1 ? "17:35 — 19:05" : "15:20 — 16:30"}
          multiline
          disabled
          before={
            <Avatar size={40} src={""} mode="app" style={{ marginTop: 12 }}>
              <span className="TopText" style={{ marginTop: -4 }}>
                6
              </span>
            </Avatar>
          }
        >
          <span className="defaultText">Пара №6</span>
        </RichCell>
      </Group>
    </Fragment>
  );
}
