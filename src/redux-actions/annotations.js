import { agent, HOSTNAME } from "../constants";

export const GOT_ANNOTATIONS = "GOT_ANNOTATIONS";

export const postAnnotations = (boxes, callback) => dispatch => {
  return agent
    .withCredentials()
    .post(HOSTNAME + "/v1/add/annotation")
    .send({ boxes: boxes })
    .end((err, res) => {
      if (err || res.body == null) {
        return;
      } else if (res.body.success) {
        // emit the action with payload
        if (typeof callback === "function") {
          callback();
        }
        return;
      }
    });
};

export const getAnnotations = (offset, callback) => dispatch => {
  return agent
    .withCredentials()
    .get(HOSTNAME + "/v1/get/annotations")
    .query({ offset })
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(gotAnnotations(null));
        return;
      }
      if (res.body.success) {
        // emit the action with payload
        dispatch(gotAnnotations(res.body, callback));
      }
    });
};
export const resetAnnotations = () => {
  return {
    type: GOT_ANNOTATIONS,
    annotations: { annotations: [] }
  };
};

export function gotAnnotations(annotations, callback) {
  return { type: GOT_ANNOTATIONS, annotations, callback };
}
