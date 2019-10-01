import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import AppStore from "./state";
import { Provider } from "react-redux";

const appWithProvider = (
  <Provider store={AppStore}>
    <App />
  </Provider>
);

ReactDOM.render(appWithProvider, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
