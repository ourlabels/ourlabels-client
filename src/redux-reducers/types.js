import { GOT_TYPES } from "../redux-actions/types.js";
import { isNull } from "util";

const currentTypesState = {
  types: {}
};

export const types = (state = currentTypesState, action) => {
  if (isNull(action.types)) {
    return state;
  }
  switch (action.type) {
    case GOT_TYPES:
      const { types } = action.types;
      let accumulator = {};
      for (let type of types) {
        accumulator[type.id] = { name: type.type, video: type.video };
      }
      return Object.assign({}, state, {
        types: accumulator
      });
    default:
      return state;
  }
};
