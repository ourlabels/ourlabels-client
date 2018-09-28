import request from 'superagent';
let HOSTNAME = 'https://ourlabels.org';
if (process.env.NODE_ENV === 'development') {
  HOSTNAME = 'http://localhost:59003';
}

export const GOT_TYPES = 'GOT_TYPES';

export const getTypes = () => dispatch => {
  return request
    .agent()
    .get(`${HOSTNAME}/v1/get/types`)
    .end((err, res) => {
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
