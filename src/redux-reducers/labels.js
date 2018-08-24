import { GOT_LABELS } from "../redux-actions/labels";
let labelsState = {
    labels: {}
};

export const labels = (state = labelsState, action) => {
  if (action.labels) {
    switch (action.type) {
      case GOT_LABELS:
        let labels = {};
        for (let label of action.labels.labels.labels) {
          labels[label.type] = {
              type: label.type,
              description: label.description,
              r: label.r,
              g: label.g,
              b: label.b,
              a: label.a
          };
        }
        let newState = Object.assign({}, state, {
          labels
        });
        return newState;
      default:
        return state;
    }
  } 
  return state;
};
