import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { auth } from "./redux-reducers/auth";
import { annotations } from "./redux-reducers/annotations";
import { image } from "./redux-reducers/image";
import { project } from "./redux-reducers/project";
import { sequence } from "./redux-reducers/sequence";
import { types } from "./redux-reducers/types";
import { labels } from "./redux-reducers/labels";
import thunk from "redux-thunk";
import logger from "redux-logger";
let store = createStore(
  combineReducers({
    annotations,
    auth,
    image,
    project,
    sequence,
    types,
    labels
  }),
  applyMiddleware(thunk),
  applyMiddleware(logger)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
