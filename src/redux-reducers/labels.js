import { GOT_LABELS } from "../redux-actions/labels";

const labelsState = {
  labels: {}
};

export default function labels(state = labelsState, action) {
  if (action.labels) {
    switch (action.type) {
    case GOT_LABELS: {
      const labelsObject = {};
      const labelsArray = action.labels.labels.labels;
      labelsArray.forEach(label => {
        labelsObject[label.type] = {
          type: label.type,
          description: label.description,
          r: label.r,
          g: label.g,
          b: label.b,
          a: label.a
        };
      });
      const newState = Object.assign({}, state, {
        labels: labelsObject
      });
      return newState;
    }
    default:
      return state;
    }
  }
  return state;
}
