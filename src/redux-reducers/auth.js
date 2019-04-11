import { LOGGED_IN, SIGNED_UP } from "../redux-actions/auth";

const initialState = {
  loggedIn: false,
  signedUp: false,
  session: null,
  username: null,
  email: null,
  just_logged_in: false,
  currentProject: null,
  score: 0
};

export default function auth(state = initialState, action) {
  if (action.payload) {
    switch (action.type) {
    case LOGGED_IN:
      return Object.assign({}, state, {
        session: action.payload.session,
        username: action.payload.username,
        email: action.payload.email,
        score: parseInt(action.payload.score, 10),
        just_logged_in: true,
        currentProject: action.payload.currentProject,
        role: action.payload.role,
        loggedIn: true,
        signedUp: false
      });
    case SIGNED_UP:
      if (action.payload) {
        return Object.assign({}, state, {
          loggedIn: false,
          signedUp: true,
          session: null
        });
      }
      return state;
    default:
      return state;
    }
  }
  return state;
}
