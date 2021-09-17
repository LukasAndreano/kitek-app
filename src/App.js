import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SplitLayout,
  SplitCol,
  Cell,
  PanelHeader,
  Panel,
  Tabbar,
  TabbarItem,
  Alert,
  Epic,
  Group,
  withAdaptivity,
  Snackbar,
  Avatar,
  View,
  usePlatform,
  Footer,
  VKCOM,
} from "@vkontakte/vkui";

import {
  Icon16Done,
  Icon16Cancel,
  Icon28Newsfeed,
  Icon28CalendarOutline,
  Icon28DownloadCloudOutline,
  Icon28RecentOutline,
  Icon28Users3Outline,
  Icon28UserCircleOutline,
  Icon28LockOutline,
} from "@vkontakte/icons";

import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";

import {
  savePlatform,
  saveURL,
  setActiveModal,
  setSnackbar,
  setPopout,
  setUser,
} from "./reducers/mainReducer";
import authorizedAPI from "./service/authorizedAPI";
import refreshToken from "./service/refreshToken";

import Controller from "./Controller";
import Modals from "./modals/main";

const App = withAdaptivity(
  ({ viewWidth }) => {
    const platform = usePlatform();
    const isDesktop = viewWidth >= 3;
    const hasHeader = platform !== VKCOM;

    const [themeManager, setThemeManager] = useState(false);
    const [snackbar, setSnackbarFunc] = useState(null);
    const [popout, setPopoutFunc] = useState(false);

    const storage = useSelector((state) => state.main);
    const dispatch = useDispatch();

    // Инициализируем модальные окна
    const modal = Modals();

    // Получаем историю из роутера, необходимо для пуша в неё (URLChanger function)
    const history = useHistory();

    // Ловим 1ю часть URL и сейвим в storage
    const locationListener = useCallback(() => {
      dispatch(saveURL(window.location.pathname.split("/")[1]));
    }, [dispatch]);

    // При клике на ссылку в эпике пушим в историю эту страницу
    function URLChanger(e) {
      history.push("/" + e.currentTarget.dataset.story);
      locationListener();
    }

    useEffect(() => {
      if ((storage.popout.title && storage.popout.text) !== null) {
        history.push(window.location.pathname + "#popout");
        setPopoutFunc(
          <Alert
            onClose={() => {
              history.goBack();
            }}
            actions={[
              {
                title: "Понятно",
                autoclose: true,
                mode: "cancel",
              },
            ]}
            header={storage.popout.title}
            text={storage.popout.text}
          />
        );
      }
    }, [storage.popout, dispatch, history]);

    // Ловим ивенты с кнопки назад-вперед
    window.onpopstate = () => {
      if ((storage.popout.title && storage.popout.text) !== null) {
        dispatch(
          setPopout({
            title: null,
            text: null,
          })
        );
        setPopoutFunc(null);
      } else if (storage.activeModal !== null) {
        dispatch(setActiveModal(null));
      }
      locationListener();
    };

    const request = useCallback(() => {
      return new Promise((resolve) => {
        authorizedAPI("getProfile", {}).then((data) => {
          if (
            data.errorCode !== undefined &&
            (data.errorCode === 3 || data.errorCode === 4)
          )
            refreshToken("getProfile", {}).then((data) => {
              dispatch(setUser(data.user));
              return resolve(data);
            });
          else {
            return resolve(data);
          }
        });
      });
    }, [dispatch]);

    useEffect(() => {
      if (
        window.location.pathname.split("/")[1] !== "profile" &&
        localStorage.getItem("access_token") !== null &&
        localStorage.getItem("refresh_token") !== null
      )
        request().then((data) => {
          if (data.response) {
            dispatch(setUser(data.user));
          }
        });
    }, [dispatch, request]);

    useEffect(() => {
      // Определяем платформу пользователя (desktop или нет)
      console.log("[Log] Platform detected! isDesktop: " + isDesktop);
      dispatch(savePlatform(isDesktop));

      // Проверяем URL через 1мс, чтобы правильно отобразить таббар
      setTimeout(() => {
        setThemeManager(true);
        locationListener();
      }, 100);
    }, [dispatch, isDesktop, locationListener, setThemeManager]);

    useEffect(() => {
      if (storage.snackbar.text !== null)
        setSnackbarFunc(
          <Snackbar
            layout="vertical"
            duration={4000}
            className={storage.isDesktop ? "snackBar-fix" : ""}
            onClose={() => {
              dispatch(setSnackbar({ text: null }));
              setSnackbarFunc(null);
            }}
            before={
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <Avatar size={24} style={{ background: "var(--accent)" }}>
                  {storage.snackbar.success ? (
                    <Icon16Done fill="#fff" width={14} height={14} />
                  ) : (
                    <Icon16Cancel fill="#fff" width={14} height={14} />
                  )}
                </Avatar>
              </motion.div>
            }
          >
            {storage.snackbar.text}
          </Snackbar>
        );
    }, [
      setSnackbarFunc,
      dispatch,
      storage.isDesktop,
      storage.snackbar.success,
      storage.snackbar.text,
    ]);

    return (
      <Fragment>
        {themeManager && (
          <SplitLayout
            header={hasHeader && <PanelHeader separator={false} />}
            style={{ justifyContent: "center" }}
          >
            {isDesktop && (
              <SplitCol fixed width="280px" maxWidth="280px">
                <Panel nav="navigationDesktop">
                  {hasHeader && <PanelHeader />}
                  <Group>
                    <Cell
                      onClick={URLChanger}
                      disabled={storage.url === "profile"}
                      style={
                        storage.url === "profile"
                          ? {
                              backgroundColor:
                                "var(--button_secondary_background)",
                              borderRadius: 8,
                            }
                          : {}
                      }
                      data-story="profile"
                      before={<Icon28UserCircleOutline />}
                    >
                      {storage.url !== "admin"
                        ? "Профиль"
                        : "Обратно в профиль"}
                    </Cell>
                    {storage.url !== "admin" && (
                      <Cell
                        onClick={URLChanger}
                        disabled={storage.url === "news"}
                        style={
                          storage.url === "news"
                            ? {
                                backgroundColor:
                                  "var(--button_secondary_background)",
                                borderRadius: 8,
                              }
                            : {}
                        }
                        data-story="news"
                        before={<Icon28Newsfeed />}
                      >
                        Новости
                      </Cell>
                    )}
                    {storage.url !== "admin" && (
                      <Cell
                        onClick={URLChanger}
                        disabled={storage.url === ""}
                        style={
                          storage.url === ""
                            ? {
                                backgroundColor:
                                  "var(--button_secondary_background)",
                                borderRadius: 8,
                              }
                            : {}
                        }
                        data-story=""
                        before={<Icon28CalendarOutline />}
                      >
                        Расписание
                      </Cell>
                    )}
                    {storage.url !== "admin" && (
                      <Cell
                        onClick={URLChanger}
                        disabled={storage.url === "time"}
                        style={
                          storage.url === "time"
                            ? {
                                backgroundColor:
                                  "var(--button_secondary_background)",
                                borderRadius: 8,
                              }
                            : {}
                        }
                        data-story="time"
                        before={<Icon28RecentOutline />}
                      >
                        Звонки
                      </Cell>
                    )}
                    {storage.url !== "admin" && (
                      <Cell
                        onClick={URLChanger}
                        disabled={storage.url === "social"}
                        style={
                          storage.url === "social"
                            ? {
                                backgroundColor:
                                  "var(--button_secondary_background)",
                                borderRadius: 8,
                              }
                            : {}
                        }
                        data-story="social"
                        before={<Icon28Users3Outline />}
                      >
                        Социальные сети
                      </Cell>
                    )}
                  </Group>
                  {storage.url !== "admin" && (
                    <Group>
                      <Cell
                        onClick={URLChanger}
                        disabled={storage.url === "download"}
                        style={
                          storage.url === "download"
                            ? {
                                backgroundColor:
                                  "var(--button_secondary_background)",
                                borderRadius: 8,
                              }
                            : {}
                        }
                        data-story="download"
                        before={<Icon28DownloadCloudOutline />}
                      >
                        Загрузить приложение
                      </Cell>
                    </Group>
                  )}
                  {storage.user.status === 1 && (
                    <Group>
                      <Cell
                        onClick={URLChanger}
                        disabled={storage.url === "admin"}
                        style={
                          storage.url === "admin"
                            ? {
                                backgroundColor:
                                  "var(--button_secondary_background)",
                                borderRadius: 8,
                              }
                            : {}
                        }
                        data-story="admin"
                        before={<Icon28LockOutline />}
                      >
                        {storage.url === "admin"
                          ? "Вы в админке! Воу!"
                          : "Перейти в админку"}
                      </Cell>
                    </Group>
                  )}
                  <Footer style={{ marginTop: -10 }}>
                    Версия приложения: 1.1.1 <br />
                    Разработчик:{" "}
                    <a
                      href="https://vk.com/id172118960"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Никита Балин
                    </a>
                    <br />
                    <a
                      href="https://github.com/LukasAndreano/kitek-app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                    Репозиторий на GitHub
                    </a>
                  </Footer>
                </Panel>
              </SplitCol>
            )}

            <SplitCol
              animate={!isDesktop}
              spaced={isDesktop}
              width={isDesktop ? "560px" : "100%"}
              maxWidth={isDesktop ? "560px" : "100%"}
            >
              <Epic
                activeStory={"default"}
                tabbar={
                  !isDesktop && (
                    <Tabbar>
                      <TabbarItem
                        onClick={URLChanger}
                        selected={storage.url === "news"}
                        data-story="news"
                        text="Новости"
                      >
                        <Icon28Newsfeed />
                      </TabbarItem>

                      <TabbarItem
                        onClick={URLChanger}
                        selected={storage.url === ""}
                        data-story=""
                        text="Расписание"
                      >
                        <Icon28CalendarOutline />
                      </TabbarItem>

                      <TabbarItem
                        onClick={URLChanger}
                        selected={storage.url === "time"}
                        data-story="time"
                        text="Звонки"
                      >
                        <Icon28RecentOutline />
                      </TabbarItem>

                      <TabbarItem
                        onClick={URLChanger}
                        selected={storage.url === "social"}
                        data-story="social"
                        text="Соц. сети"
                      >
                        <Icon28Users3Outline />
                      </TabbarItem>

                      <TabbarItem
                        onClick={URLChanger}
                        selected={storage.url === "profile"}
                        data-story="profile"
                        text="Профиль"
                      >
                        <Icon28UserCircleOutline />
                      </TabbarItem>
                    </Tabbar>
                  )
                }
              >
                <View
                  id="default"
                  activePanel="default"
                  modal={modal}
                  popout={popout}
                >
                  <Panel id="default">
                    <Controller />
                    {snackbar}
                  </Panel>
                </View>
              </Epic>
            </SplitCol>
          </SplitLayout>
        )}
      </Fragment>
    );
  },
  {
    viewWidth: true,
  }
);

export default App;
