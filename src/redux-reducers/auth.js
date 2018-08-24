import { LOGGED_IN, SIGNED_UP } from "../redux-actions/auth";

const initialState = {
  logged_in: false,
  signed_up: false,
  session: null,
  username: null,
  email: null,
  just_logged_in: false,
  current_project: null,
  owned_projects: [],
  score: 0
};

export function auth(state = initialState, action) {
  if (action.payload) {
    switch (action.type) {
      case LOGGED_IN:
        return Object.assign({}, state, {
          session: action.payload.session,
          username: action.payload.username,
          email: action.payload.email,
          score: parseInt(action.payload.score, 10),
          just_logged_in: true,
          last_idx: action.payload.last_idx,
          current_project: action.payload.current_project,
          role: action.payload.role,
          logged_in: true,
          signed_up: false
        });
      case SIGNED_UP:
        if (action.payload) {
          return Object.assign({}, state, {
            logged_in: false,
            signed_up: true,
            session: null
          });
        }
        return state;
      default:
        return state;
    }
    return state;
  }
  return state;
}
