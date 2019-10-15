import { getLabels } from "./labels";
import { agent, HOSTNAME } from "../constants";

export const LOGGED_IN = "LOGGED_IN";
export const SIGNED_UP = "SIGNED_UP";

const loggedIn = payload => ({ type: LOGGED_IN, payload });

export const signedUp = payload => ({ type: SIGNED_UP, payload });

// because thunks allow functions which resolve
export const logIn = (username, password) => dispatch =>
  agent
    .post(`${HOSTNAME}/v1/auth/login`)
    .withCredentials()
    .set("Content-Type", "application/json")
    .send({ username, password })
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(loggedIn(null));
      } else if (res.body.success) {
        // emit the action
        dispatch(loggedIn(res.body));
        dispatch(getLabels());
      }
    });

export const signUp = (username, password, email) => dispatch =>
  agent
    .post(`${HOSTNAME}/v1/auth/signup`)
    .set("Content-Type", "application/json")
    .send({ username, password, email })
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(signedUp(false));
      } else if (res.body.success) {
        // emit the action
        dispatch(signedUp(true));
      }
    });
