import React, { Component } from 'react';
import {
  Segment,
  Image,
  Input,
  Dropdown,
  Button,
  Header
} from 'semantic-ui-react';
import './SequenceComponent.scss';

class SequenceComponent extends Component {
  constructor(props) {
    super(props);
    this.changeSequence = this.changeSequence.bind(this);
  }
  changeSequence(value) {
    this.props.changeSequence(value);
  }
  render() {
    const { sequences, sequence } = this.props;
    let sequenceOptions = [];
    for (let ea_sequence of sequences) {
      sequenceOptions.push({
        text: ea_sequence.sequence,
        value: ea_sequence.sequence
      });
    }
    return (
      <div
        className={
          this.props.portrait ? 'sequence-holder-portrait' : 'sequence-holder-landscape'
        }
      >
        <Header as="h5" className="sequence-title">Choose Sequence</Header>
        <Dropdown
          options={sequenceOptions}
          fluid
          selection
          defaultValue={sequence}
          placeholder="Select sequence"
          onChange={(tag, val) => {
            this.changeSequence(val.value);
          }}
        />
      </div>
    );
  }
}
export default SequenceComponent;
