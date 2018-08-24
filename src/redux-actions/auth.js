import request from "superagent";
let HOST_AUTH = "https://ourlabels.org";
if (process.env.NODE_ENV === "development") {
  HOST_AUTH = "http://localhost:59003";
}

export const LOGGED_IN = "LOGGED_IN";
export const SIGNED_UP = "SIGNED_UP";

// because thunks allow functions which resolve
export const logIn = (username, password) => dispatch => {
  return request
    .agent()
    .post(HOST_AUTH + "/v1/auth/login")
    .withCredentials()
    .set("Content-Type", "application/x-www-form-urlencoded")
    .send({ username, password })
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(loggedIn(null));
        return;
      } else if (res.body.success) {
        // emit the action
        dispatch(loggedIn(res.body));
        return;
      }
    });
};

export const signUp = (username, password, email) => dispatch => {
  return request
    .agent()
    .post(HOST_AUTH + "/v1/auth/signup")
    .set("Content-Type", "application/json")
    .send({ username, password, email })
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(signedUp(false));
        return;
      } else if (res.body.success) {
        // emit the action
        dispatch(signedUp(true));
        return;
      }
    });
};

const loggedIn = payload => {
  return { type: LOGGED_IN, payload };
};

export const signedUp = payload => {
  return { type: SIGNED_UP, payload };
};
