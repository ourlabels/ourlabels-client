import { getAnnotations } from "./annotations";
import { agent, HOSTNAME } from "../constants";

export const CHANGED_IMAGE = "CHANGED_IMAGE";
export const NEW_INDEX = "NEW_INDEX";

export const getImage = callback => dispatch => {
  return agent
    .withCredentials()
    .get(HOSTNAME + "/v1/get/image")
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(gotImage(null, callback));
        return;
      } else if (res.body.success) {
        // emit the action with payload
        dispatch(gotImage(res.body));
        dispatch(getAnnotations(0, callback));
        return;
      }
    });
};

export const updateIndex = (offset, toNumber, callback) => dispatch => {
  return agent
    .withCredentials()
    .post(HOSTNAME + "/v1/update/index")
    .send({ offset, toNumber })
    .end((err, res) => {
      dispatch(getImage(callback));
    });
};

export const sendClassifications = (boxes, classifications) => dispatch => {
  return agent
    .withCredentials()
    .post(HOSTNAME + "/v1/add/annotation")
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send({ boxes: boxes, classifications: classifications })
    .end((err, res) => {
      if (err) {
        return;
      } else if (res.body.success) {
        // emit the action with payload
        dispatch(incrementIndex());
      } else {
        // emit the action, but with null
        return;
      }
    });
};

const gotImage = (payload, callback) => {
  return { type: CHANGED_IMAGE, image: payload, callback };
};
const gotNewIndex = payload => {
  return { type: NEW_INDEX, index: payload };
};
