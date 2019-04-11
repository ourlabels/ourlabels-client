import { agent, HOSTNAME } from "../constants";
export const GOT_TYPES = "GOT_TYPES";

export const getTypes = () => dispatch => {
  return agent.get(`${HOSTNAME}/v1/get/types`).end((err, res) => {
    if (err) {
      dispatch(gotTypes(null));
    } else if (res.body.success) {
      dispatch(gotTypes(res.body));
    } else {
      dispatch(gotTypes(null));
    }
  });
};

const gotTypes = payload => {
  return { type: GOT_TYPES, types: payload };
};
