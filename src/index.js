import React from "react";
import ReactDOM from "react-dom";

// etc...
import { Provider } from "react-redux";
import { store } from "./storage/store";
import { AdaptivityProvider } from "@vkontakte/vkui";

// Router
import Router from "@reyzitwo/react-router-vkminiapps";
import structure from "./structure";

// Modules
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// Styles
import "@vkontakte/vkui/dist/vkui.css";
import "./assets/css/global.scss";

// Import main panel
import App from "./App";

const app = async () => {
  ReactDOM.render(
    <Provider store={store}>
      <AdaptivityProvider>
        <Router structure={structure}>
          <App />
        </Router>
      </AdaptivityProvider>
    </Provider>,
    document.getElementById("root")
  );
};

app();

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
