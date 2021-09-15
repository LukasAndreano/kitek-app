import React, { Fragment, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Group,
  PanelHeaderButton,
  Button,
  PanelHeader,
  Gradient,
  Div,
  Spinner,
  Title,
  Text,
  Header,
  Footer,
  SimpleCell,
} from "@vkontakte/vkui";
import {
  Icon28DoorArrowRightOutline,
  Icon28MailOutline,
  Icon28UserStarBadgeOutline,
} from "@vkontakte/icons";

import Login from "../forms/Login";
import Register from "../forms/Register";

import { setActiveModal, setUser } from "../reducers/mainReducer";

import authorizedAPI from "../service/authorizedAPI";
import refreshToken from "../service/refreshToken";

export default function Profile() {
  const storage = useSelector((state) => state.main);
  const dispatch = useDispatch();

  const request = useCallback(() => {
    return new Promise((resolve) => {
      authorizedAPI("getProfile", {}).then((data) => {
        if (
          data.errorCode !== undefined &&
          (data.errorCode === 3 || data.errorCode === 4)
        )
          refreshToken("getProfile", {}).then((data) => {
            return resolve(data);
          });
        else {
          return resolve(data);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("access_token") !== null &&
      localStorage.getItem("refresh_token") !== null &&
      storage.user.email === null
    ) {
      request().then((data) => {
        if (data.response) {
          dispatch(setUser(data.user));
        }
      });
    }
  }, [dispatch, request, storage.user.email]);

  return (
    <React.Fragment>
      <PanelHeader
        separator={storage.isDesktop ? true : false}
        left={
          localStorage.getItem("access_token") !== null &&
          localStorage.getItem("refresh_token") !== null ? (
            <PanelHeaderButton
              onClick={() => {
                dispatch(setActiveModal("logout"));
              }}
            >
              <Icon28DoorArrowRightOutline />
            </PanelHeaderButton>
          ) : (
            ""
          )
        }
      >
        Профиль
      </PanelHeader>
      <Group>
        {localStorage.getItem("access_token") === null &&
        localStorage.getItem("refresh_token") === null ? (
          <Fragment>
            {storage.currentForm === 1 ? <Login /> : <Register />}
          </Fragment>
        ) : (
          <Fragment>
            {storage.user.email !== null ? (
              <Fragment>
                <Gradient
                  style={{
                    margin: "-7px -7px 0 -7px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 32,
                  }}
                >
                  <Title
                    style={{ marginBottom: 2, marginTop: 10 }}
                    level="2"
                    weight="medium"
                  >
                    {storage.user.name
                      ? storage.user.name
                      : "Неизвестный пользователь"}
                  </Title>
                  <Text
                    style={{ marginBottom: 10, color: "var(--text_secondary)" }}
                  >
                    {storage.user.status === 2
                      ? "Преподаватель"
                      : storage.user.group && storage.user.course !== 0
                      ? "Студент " +
                        storage.user.course +
                        "-го курса, группа " +
                        storage.user.group
                      : "Нет никаких данных :("}
                  </Text>
                  {storage.user.status !== 2 && (
                    <Button
                      size="m"
                      mode="secondary"
                      onClick={() => {
                        dispatch(setActiveModal("editAccountInfo"));
                      }}
                    >
                      Редактировать
                    </Button>
                  )}
                </Gradient>
                <Group mode="plain">
                  <Div style={{ marginTop: -10, marginLeft: -5 }}>
                    <Header>Общая информация</Header>
                    <SimpleCell
                      before={<Icon28MailOutline />}
                      disabled
                      description="Адрес электронной почты"
                    >
                      {storage.user.email}
                    </SimpleCell>
                    <SimpleCell
                      before={<Icon28UserStarBadgeOutline />}
                      disabled
                      description="Ваш ранг в приложении"
                    >
                      {storage.user.status === 0
                        ? "Обычный пользователь"
                        : storage.user.status === 1
                        ? "Администратор"
                        : "Преподаватель"}
                    </SimpleCell>
                  </Div>
                </Group>
                {!storage.isDesktop && <Footer>
                    Версия приложения: 1.1.0 <br />
                    Разработчик:{" "}
                    <a
                      href="https://vk.com/id172118960"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Никита Балин
                    </a>
                  </Footer>}
              </Fragment>
            ) : (
              <Spinner size="medium" style={{ margin: "20px 0" }} />
            )}
          </Fragment>
        )}
      </Group>
    </React.Fragment>
  );
}
