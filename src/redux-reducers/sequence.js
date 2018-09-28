import { GOT_SEQUENCES } from '../redux-actions/sequence';

const sequenceState = {
  sequences: null,
  current_sequence: null,
};

export default function sequence(state = sequenceState, action) {
  switch (action.type) {
  case GOT_SEQUENCES:
    return Object.assign({}, state, {
      sequences: action.sequences.sequences,
    });
  default:
    return state;
  }
}

