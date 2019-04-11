import { combineReducers } from "redux";
import { routerReducer as router } from "react-router-redux";
import auth from "./auth";
import annotations from "./annotations";
import { image } from "./image";
import project from "./project";
import sequence from "./sequence";
import types from "./types";
import labels from "./labels";

const rootReducer = combineReducers({
  annotations,
  auth,
  image,
  project,
  sequence,
  types,
  labels,
  router
});

export default rootReducer;
