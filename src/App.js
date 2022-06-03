import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  AppearanceProvider,
  AppRoot,
  ConfigProvider,
  Epic,
  PanelHeader,
  PanelHeaderButton,
  SplitCol,
  SplitLayout,
  usePlatform,
  View,
  VKCOM,
  withAdaptivity,
} from "@vkontakte/vkui";
import { withRouter } from "@reyzitwo/react-router-vkminiapps";

// Panels
import Home from "./components/home/base";
import Page from "./components/__global/Page";
import { useDispatch } from "react-redux";
import {
  setIsDesktop,
  setPlatform,
  setSelected,
} from "./storage/reducers/main";
import { Icon28SettingsOutline } from "@vkontakte/icons";

// Modals
const Modals = lazy(() => import("./components/__modals/base"));

const App = withAdaptivity(
  ({ viewWidth, router }) => {
    // Main states (theme, mode, user)
    const [theme, setTheme] = useState("light");

    // Main params (like device, platform, header for nav and etc...)
    const platform = usePlatform();
    const dispatch = useDispatch();

    const isDesktop = viewWidth >= 3;
    const hasHeader = platform !== VKCOM;

    // Catch offline mode and get user info on app start
    useEffect(() => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
          setTheme(
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
          );
        });
    }, []);

    useEffect(() => {
      const localData = localStorage.getItem("userSelect");

      if (localData) {
        const userData = JSON.parse(localData);

        dispatch(setSelected(userData));
      }
    }, [dispatch]);

    useEffect(() => {
      dispatch(setIsDesktop(isDesktop));
      dispatch(setPlatform(platform));

      const currentTheme = window.matchMedia("(prefers-color-scheme: dark)");

      setTheme(currentTheme.matches ? "dark" : "light");
    }, [isDesktop, dispatch, platform]);

    const toBack = () => router.toBack();
    const toModal = (modal) => router.toModal(modal);

    return (
      <ConfigProvider isWebView>
        <AppearanceProvider appearance={theme}>
          <AppRoot className={isDesktop ? "desktop" : ""}>
            <SplitLayout
              header={hasHeader && <PanelHeader separator={false} />}
              style={{ justifyContent: "center" }}
              modal={
                <Suspense fallback={""}>
                  <Modals router={router} toBack={toBack} />
                </Suspense>
              }
              popout={router.popout}
            >
              <SplitCol
                animate={!isDesktop}
                spaced={isDesktop}
                width={isDesktop ? "660px" : "100%"}
                maxWidth={isDesktop ? "660px" : "100%"}
              >
                <Epic activeStory={router.activeView} tabbar={""}>
                  <View id="schedule" activePanel={router.activePanel}>
                    <Page
                      id={"schedule"}
                      name={"Расписание"}
                      left={
                        <PanelHeaderButton
                          aria-label={"Настройки"}
                          onClick={() => toModal("selectDisplayParam")}
                        >
                          <Icon28SettingsOutline
                            fill={"var(--accent)"}
                            width={24}
                            height={24}
                          />
                        </PanelHeaderButton>
                      }
                    >
                      <Home toModal={toModal} />
                    </Page>
                  </View>
                </Epic>
              </SplitCol>
            </SplitLayout>
          </AppRoot>
        </AppearanceProvider>
      </ConfigProvider>
    );
  },
  {
    viewWidth: true,
  }
);

export default withRouter(App);
