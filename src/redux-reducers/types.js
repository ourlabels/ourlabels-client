import { isNull } from "util";
import { GOT_TYPES } from "../redux-actions/types";

const currentTypesState = {
  projectTypes: {}
};

export default function types(state = currentTypesState, action) {
  if (isNull(action.types)) {
    return state;
  }
  switch (action.type) {
  case GOT_TYPES: {
    const { projectTypes } = action.types;
    console.log("PROJECT TYPES:", action);
    const accumulator = {};
    projectTypes.forEach(type => {
      accumulator[type.id] = { name: type.type, video: type.video };
    });
    return Object.assign({}, state, {
      projectTypes: accumulator
    });
  }
  default:
    return state;
  }
}
