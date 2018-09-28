import { GOT_ANNOTATIONS } from '../redux-actions/annotations';

const annotationState = {
  annotations: [],
};

export default function annotations(state = annotationState, action) {
  if (action.annotations) {
    switch (action.type) {
    case GOT_ANNOTATIONS:
      if (typeof action.callback === 'function') {
        action.callback();
      }
      return Object.assign({}, state, {
        annotations: action.annotations.boxes,
        index: action.annotations.idx,
        callback: action.callback,
      });
    default:
      return state;
    }
  }
  return state;
}
