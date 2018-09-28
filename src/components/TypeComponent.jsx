import React, { Component } from 'react';
import { Dropdown, Checkbox, Header } from 'semantic-ui-react';
import ReactTooltip from 'react-tooltip';
import './TypeComponent.scss';

class TypeComponent extends Component {
  constructor(props) {
    super(props);
    this.changeType = this.changeType.bind(this);
    this.changeDifficult = this.changeDifficult.bind(this);
    this.changeOccluded = this.changeOccluded.bind(this);
    this.changeTruncated = this.changeTruncated.bind(this);
  }
  changeType(value) {
    this.props.changeType(value, 'type');
  }
  changeDifficult(value) {
    this.props.changeType(value, 'difficult');
  }
  changeOccluded(value) {
    this.props.changeType(value, 'occluded');
  }
  changeTruncated(value) {
    this.props.changeType(value, 'truncated');
  }

  render() {
    const { type, occluded, truncated, difficult } = this.props;
    let typeOptions = [];
    for (let label of Object.keys(this.props.labels)) {
      typeOptions.push({
        text: this.props.labels[label].description,
        value: label
      });
    }
    return (
      <div
        className={
          this.props.portrait ? 'type-holder-portrait' : 'type-holder-landscape'
        }
      >
        <Header as="h5" className="type-title">
          Choose Type
        </Header>
        <Dropdown
          options={typeOptions}
          fluid
          selection
          defaultValue={type}
          placeholder="Select type"
          onChange={(tag, val) => {
            this.changeType(val.value);
          }}
        />
        {'O'}
        <Checkbox
          data-for={'occluded'}
          data-tip="is occluded, covered but entirely in image"
          data-iscapture="true"
          defaultChecked={occluded}
          onChange={(tag, val) => {
            this.changeOccluded(val.checked);
          }}
        />
        <ReactTooltip id="occluded" place="bottom" type="dark" />
        {'T'}
        <Checkbox
          data-for={'truncated'}
          data-tip="is truncated, off the edge of the image"
          data-iscapture="true"
          defaultChecked={truncated}
          onChange={(tag, val) => {
            this.changeTruncated(val.checked);
          }}
        />
        <ReactTooltip id="truncated" place="bottom" type="dark" />
        {'D'}
        <Checkbox
          data-for={'difficult'}
          data-tip="is difficult to determine"
          data-iscapture="true"
          defaultChecked={difficult}
          onChange={(tag, val) => {
            this.changeDifficult(val.checked);
          }}
        />
        <ReactTooltip id="difficult" place="bottom" type="dark" />
      </div>
    );
  }
}
export default TypeComponent;
