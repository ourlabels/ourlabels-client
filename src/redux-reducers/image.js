import { CHANGED_IMAGE, NEW_INDEX } from "../redux-actions/image";

const imageState = {
  image: null,
  imageid: null
};
const indexState = {
  index: 0
};

export const image = (state = imageState, action) => {
  if (action.image) {
    switch (action.type) {
      case CHANGED_IMAGE:
        if (typeof action.callback === "function") {
          action.callback();
        }
        return Object.assign({}, state, {
          image: action.image.image,
          imageid: action.image.imageid,
          index: action.image.index,
          sequence: action.image.sequence,
          count: action.image.count
        });
      default:
        return state;
    }
  }
  return state;
};

export const index = (state = indexState, action) => {
  switch (action.type) {
    case NEW_INDEX:
      return Object.assign({}, state, { index: action.index.index });
  }
  return state;
};

export const classifications = (state = classificationState, action) => {
  switch (action.type) {
    case ADDED_CLASSIFICATIONS:
      return Object.assign({}, state, { classifications: [] });
  }
};
