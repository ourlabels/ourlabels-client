import { agent, HOSTNAME } from "../constants";
import { getImage } from "./image";
import { getAnnotations } from "./annotations";

export const GOT_SEQUENCES = "GOT_SEQUENCES";
export const NEW_SEQUENCE = "NEW_SEQUENCE";

// because thunks allow functions which resolve
export const getSequences = () => dispatch => {
  return agent
    .withCredentials()
    .get(`${HOSTNAME}/v1/get/sequences`) // knows current_project
    .end((err, res) => {
      if (err || res.body == null || !res.body.success) {
        dispatch(gotSequences(null));
      } else {
        // emit the action with payload
        dispatch(gotSequences(res.body));
      }
    });
};

export const changeSequence = new_sequence => dispatch => {
  return agent
    .withCredentials()
    .post(`${HOSTNAME}/v1/update/sequence`)
    .send({ sequence: new_sequence }) // if null sent, gives current sequence
    .end((err, res) => {
      if (err || res.body == null || !res.body.success) {
        gotNewSequence(null);
        return;
      } else {
        // emit the action with payload
        dispatch(getImage());
        dispatch(getAnnotations(0));
        return;
      }
    });
};

const gotSequences = payload => {
  return { type: GOT_SEQUENCES, sequences: payload };
};

const gotNewSequence = payload => {
  return { type: NEW_SEQUENCE, current_sequence: payload };
};
