import React, {Fragment, useCallback, useEffect, useState} from "react"
import { useSelector, useDispatch } from "react-redux";
import {
  SplitLayout,
  SplitCol,
  Cell,
  PanelHeader,
  Panel,
  Tabbar,
  TabbarItem,
  Epic,
  Group,
  withAdaptivity,
  View,
  usePlatform,
  ViewWidth,
  Footer,
  VKCOM,
} from "@vkontakte/vkui";

import {
  Icon28Newsfeed,
  Icon28CalendarOutline,
  Icon28RecentOutline,
  Icon28Users3Outline,
} from "@vkontakte/icons";

import {
  useHistory,
} from "react-router-dom";

import { savePlatform, saveURL, setActiveModal } from "./reducers/mainReducer";

import Controller from "./Controller"
import Modals from "./modals/main"

const App = withAdaptivity(
  ({ viewWidth }) => {

  const platform = usePlatform();
  const isDesktop = viewWidth >= ViewWidth.TABLET;
  const hasHeader = platform !== VKCOM;

  const [themeManager, setThemeManager] = useState(false)

  const storage = useSelector(state => state.main);
  const dispatch = useDispatch();

  // Инициализируем модальные окна
  const modal = Modals();

  // Получаем историю из роутера, необходимо для пуша в неё (URLChanger function)
  const history = useHistory()

  // Ловим 1ю часть URL и сейвим в storage
  const locationListener = useCallback(() => {
    dispatch(saveURL(window.location.pathname.split("/")[1]))
  }, [dispatch])

  // При клике на ссылку в эпике пушим в историю эту страницу
  function URLChanger(e) {
    history.push("/" + e.currentTarget.dataset.story);
    locationListener()
  }

  // Ловим ивенты с кнопки назад-вперед
  // TODO: Кнопка вперед спавнит две модалки вместо двух.
  window.onpopstate = () => {

    if (storage.activeModal !== null) {
      dispatch(setActiveModal(null));
    } else if (window.location.hash.substr(1) !== (null || "")) {
      dispatch(setActiveModal(window.location.hash.substr(1), true))
    }

    locationListener()
  };


  useEffect(() => {

    // Определяем платформу пользователя (desktop или нет)
    console.log('[Log] Platform detected! isDesktop: ' + isDesktop)
    dispatch(savePlatform(isDesktop))

    // Проверяем URL через 1мс, чтобы правильно отобразить таббар
    setTimeout(() => {
      setThemeManager(true)
      locationListener()
    }, 100)

  }, [dispatch, isDesktop, locationListener, setThemeManager])

  return (
    <Fragment>
      {themeManager &&
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
                        </Group>
                        <Footer style={{ marginTop: -10 }}>
                          Версия приложения: 1.0.4 <br />
                          Разработчик:{" "}
                          <a
                            href="https://vk.com/id172118960"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Никита Балин
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
                          </Tabbar>
                        )
                      }
                    >
                        <View id="default" activePanel="default" modal={modal}>
                          <Panel id="default">
                            <Controller />
                          </Panel>
                        </View>
                    </Epic>
                  </SplitCol>
                </SplitLayout>
                }
    </Fragment>
  );
},
{
  viewWidth: true,
}
);

export default App;
