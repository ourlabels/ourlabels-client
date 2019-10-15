import React, { Component } from "react";
import { Card, Image, Icon, Modal, Header } from "semantic-ui-react";
import { Stage, Layer, Rect } from "react-konva";
import "./ImageComponent.scss";
import LabelBox from "./LabelBox";
import Img from "./Img.jsx";

class ImageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: false,
      annotations: []
    };
    this.stageRef = null;
    this.gotImageSize = this.gotImageSize.bind(this);
    this.updateDims = this.updateDims.bind(this);
    this.selfSelect = this.selfSelect.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }
  handleDoubleClick(evt) {
    if (this.stageRef) {
      const pos = this.stageRef.getStage().getPointerPosition();
      this.props.addAnnotation(
        pos.x / this.imageWidth,
        pos.y / this.imageHeight,
        100 / this.imageWidth,
        100 / this.imageHeight,
        false,
        false,
        false
      );
    }
  }
  gotImageSize(dims) {
    if (
      dims.height &&
      dims.width &&
      (this.imageHeight !== dims.height || this.imageWidth !== dims.width)
    ) {
      this.imageHeight = dims.height;
      this.imageWidth = dims.width;
      this.setState({ updated: true });
    }
  }
  updateDims(x, y, w, h) {
    let xP = x / this.imageWidth;
    let yP = y / this.imageHeight;
    let wP = w / this.imageWidth;
    let hP = h / this.imageHeight;
    this.props.updateDims(xP, yP, wP, hP);
  }
  componentDidMount(props) {}
  componentWillMount(props) {}
  componentWillReceiveProps(newProps, props) {
    this.imageWidth = newProps.imageWidth;
    this.imageHeight = newProps.imageHeight;
    this.setState({ image_index: newProps.image_index });
    if (this.stageRef) {
      this.stageRef.getStage().scale({ x: 1, y: 1 });
    }
  }
  selfSelect(name) {
    this.props.selectAnnotation(name);
  }
  render() {
    let selected = this.props.annotations[this.props.selected];
    if (this.props.image) {
      return (
        <Stage
          key={`stage-${this.state.image_index}`}
          width={this.imageWidth}
          height={this.imageHeight}
          ref={ref => {
            this.stageRef = ref;
          }}
        >
          <Layer
            key={`layer=${this.state.image_index}`}
            onDblClick={this.handleDoubleClick}
          >
            <Img
              key={`img-${this.state.image_index}`}
              ref={ref => {
                this.imageRef = ref;
              }}
              src={this.props.image}
              height={this.imageHeight}
              width={this.imageWidth}
              onLoad={this.gotImageSize}
              space="fit"
            />
            {this.props.annotations.map((annotation, index) => {
              if (index !== this.props.selected) {
                return (
                  <LabelBox
                    key={`${this.state.image_index}-${annotation.name}`}
                    name={annotation.name}
                    x={annotation.x * this.imageWidth}
                    y={annotation.y * this.imageHeight}
                    w={annotation.w * this.imageWidth}
                    h={annotation.h * this.imageHeight}
                    stageW={this.imageWidth}
                    stageH={this.imageHeight}
                    type={this.props.labels[annotation.type]}
                    updateDims={this.updateDims}
                    selfSelect={this.selfSelect}
                    zoom={this.props.zoom}
                  />
                );
              }
            })}
            {selected && (
              <LabelBox
                key={`${this.state.image_index}-${selected.name}`}
                name={selected.name}
                x={selected.x * this.imageWidth}
                y={selected.y * this.imageHeight}
                w={selected.w * this.imageWidth}
                h={selected.h * this.imageHeight}
                stageW={this.imageWidth}
                stageH={this.imageHeight}
                type={this.props.labels[selected.type]}
                updateDims={this.updateDims}
                selected={true}
                selfSelect={this.selfSelect}
                zoom={this.props.zoom}
              />
            )}
          </Layer>
        </Stage>
      );
    } else {
      return <div />;
    }
  }
}

export default ImageComponent;
