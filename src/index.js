import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";

import "./services";

import { Provider } from "react-redux";
import { ConfigProvider } from "./contexts/ConfigContext";

import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastProvider } from "react-toast-notifications";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
