import React, { Component } from "react";
import { Segment, Image, Input, Header } from "semantic-ui-react";
import "./ZoomComponent.scss";

class ZoomComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { zoom } = this.props;
    return (
      <div
        className={
          this.props.portrait ? "zoom-holder-portrait" : "zoom-holder-landscape"
        }
      >
        <Header as="h5" className="zoom-title">
          Zoom level
        </Header>
        <Input
          className={
            this.props.portrait ? "zoom-input-portrait" : "zoom-input-landscape"
          }
          type="number"
          step="0.1"
          min="0.4"
          max="10.0"
          placeholder="zoom"
          defaultValue={zoom}
          onChange={(tag, val) => {
            this.props.changeZoom(parseFloat(val.value));
          }}
        />
      </div>
    );
  }
}
export default ZoomComponent;
