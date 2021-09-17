import React, { Fragment, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Group,
  PanelHeaderButton,
  PanelHeader,
  Gradient,
  Div,
  Spinner,
  Title,
  Text,
  Header,
  SimpleCell,
} from "@vkontakte/vkui";
import {
  Icon28DoorArrowRightOutline,
  Icon28MailOutline,
  Icon28UserStarBadgeOutline,
  Icon28SettingsOutline,
  Icon28EditOutline,
  Icon28InfoOutline,
  Icon28Notifications,
} from "@vkontakte/icons";

import Login from "../forms/Login";
import Register from "../forms/Register";

import { setActiveModal, setUser, setSnackbar } from "../reducers/mainReducer";

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
                    margin: 10,
                    borderRadius: 10,
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
                      : storage.user.group
                      ? "Студент, группа " + storage.user.group
                      : "Нет никаких данных :("}
                  </Text>
                </Gradient>
                <Group mode="plain">
                  <Div style={{ marginTop: -10, marginLeft: -5 }}>
                    <Header>Общая информация</Header>
                    <SimpleCell
                      before={<Icon28MailOutline />}
                      onClick={() => {
                        navigator.clipboard
                          .writeText(storage.user.email)
                          .then(() => {
                            dispatch(
                              setSnackbar({
                                text: "Адрес электронной почты скопирован в буфер обмена.",
                                success: true,
                              })
                            );
                          })
                          .catch(() => {
                            dispatch(
                              setSnackbar({
                                text: "Произошла ошибка при копировании почты в буфер обмена.",
                                success: false,
                              })
                            );
                          });
                      }}
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
                    <Header>Настройки</Header>
                    {storage.user.status !== 2 && (
                      <SimpleCell
                        before={<Icon28SettingsOutline />}
                        onClick={() => {
                          dispatch(setActiveModal("editAccountInfo"));
                        }}
                        description="Если нужно, например, изменить группу"
                        multiline
                      >
                        Отредактировать профиль
                      </SimpleCell>
                    )}
                    <SimpleCell
                      onClick={() => {
                        dispatch(setActiveModal("changePassword"));
                      }}
                      before={<Icon28EditOutline />}
                      description="Безопасность - это главное"
                      multiline
                    >
                      Изменить пароль
                    </SimpleCell>
                    <SimpleCell
                      onClick={() => {
                        dispatch(setActiveModal("soon"));
                      }}
                      before={<Icon28Notifications />}
                      description="Получайте уведомления при изменении расписания"
                      multiline
                    >
                      Уведомления (скоро)
                    </SimpleCell>
                    <Header>Другое</Header>
                    <SimpleCell
                      onClick={() => {
                        dispatch(setActiveModal("aboutAPP"));
                      }}
                      before={<Icon28InfoOutline />}
                      description="Подробная информация о приложении"
                      multiline
                    >
                      О приложении
                    </SimpleCell>
                  </Div>
                </Group>
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
