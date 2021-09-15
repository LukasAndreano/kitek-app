import React from "react";
import ReactDOM from "react-dom";

// Подключаем необходимые зависимости
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";
import { Provider } from "react-redux";
import { store } from "./store";
import themeManager from "./service/themeManager";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import { BrowserRouter as Router } from "react-router-dom";

// Подключаем все нужные стили для работы сервиса
import "@vkontakte/vkui/dist/vkui.css";
import "./css/style.css";

// Импортируем главный файл
import App from "./App";
import Cookies from "./panels/Cookies";

try {
  // Подключаем менеджер тем. Автоматически определяет тему спустя 100 мс (задержка для загрузки VKUI).
  themeManager();

  // Чистим локальное хранилище от мусора
  localStorage.setItem("sheduleDay", 0);

  // Начинаем рендер, где подключаем Storage и ConfigProviver (необходим для определения платформы и нормальной работой с VKMA)
  ReactDOM.render(
    <Provider store={store}>
      <ConfigProvider isWebView={true}>
        <AdaptivityProvider>
          <AppRoot>
            <Router>
              <App />
            </Router>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </Provider>,
    document.getElementById("root")
  );
} catch {
  ReactDOM.render(<Cookies />, document.getElementById("root"));
}

// Подключаем Service Worker, который необходим для PWA-приложений
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
});
