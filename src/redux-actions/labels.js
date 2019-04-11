import { agent, HOSTNAME } from "../constants";
export const GOT_LABELS = "GOT_LABELS";

export const getLabels = callback => dispatch => {
  return agent
    .withCredentials()
    .get(`${HOSTNAME}/v1/get/labels`)
    .end((err, res) => {
      if (err || res.body == null) {
        console.log("Error", err);
        return;
      } else if (res.body.success) {
        console.log("res body labels: ", res.body);
        dispatch(gotLabels(res.body));
      }
    });
};
export const addLabels = (labels, callback) => dispatch => {
  return agent
    .withCredentials()
    .post(HOSTNAME + "/v1/add/labels")
    .send({ labels })
    .end((err, res) => {
      dispatch(getLabels());
    });
};
const gotLabels = payload => {
  return { type: GOT_LABELS, labels: payload };
};
