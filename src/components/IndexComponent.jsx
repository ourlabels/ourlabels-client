import React, { Component } from "react";
import {
  Segment,
  Image,
  Input,
  Dropdown,
  Button,
  Header
} from "semantic-ui-react";
import "./IndexComponent.scss";

class IndexComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { total, index } = this.props;
    let indexOptions = [];
    for (let ea_index = 0; ea_index < total; ea_index += 1) {
      indexOptions.push({
        text: ea_index,
        value: ea_index
      });
    }
    return (
      <div
        className={
          this.props.portrait ? "index-holder-portrait" : "index-holder-landscape"
        }
      >
        <Header as="h5" className="index-title">Choose Index</Header>
        <Dropdown
          options={indexOptions}
          fluid
          selection
          defaultValue={index}
          placeholder="Select index"
          onChange={(tag, val) => {
            this.props.updateIndex(0, val.value);
          }}
        />
      </div>
    );
  }
}
export default IndexComponent;
