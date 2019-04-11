import React, { Component } from "react";
import { Rect, Circle, Group } from "react-konva";

class LabelBox extends Component {
  constructor(...props) {
    super(...props);
    this.nodes = {};
    this.update = this.update.bind(this);
    this.finalizeUpdate = this.finalizeUpdate.bind(this);
    this.handleRectMove = this.handleRectMove.bind(this);
    this.getPointsInOrder = this.getPointsInOrder.bind(this);
  }
  componentDidMount() {}
  finalizeUpdate() {
    if (this.nodes["rect"] && this.props.selected) {
      this.props.updateDims(
        this.nodes["rect"].getX(),
        this.nodes["rect"].getY(),
        this.nodes["rect"].getWidth(),
        this.nodes["rect"].getHeight()
      );
    }
  }

  update(ref, selfRun) {
    let anchor = this.nodes[ref];
    let X = anchor.getX();
    if (X < 0.05) {
      return;
    }
    if (Y < 0.05) {
      return;
    }
    let Y = anchor.getY();
    X =
      X < 0.05
        ? 0.05
        : X > this.props.stageW - 0.05
          ? this.props.stageW - 0.05
          : X;
    Y =
      Y < 0.05
        ? 0.05
        : Y > this.props.stageH - 0.05
          ? this.props.stageH - 0.05
          : Y;
    this.nodes[ref].setX(X);
    this.nodes[ref].setY(Y);
    switch (ref) {
    case "topLeft":
      this.nodes["topRight"].setY(Y);
      this.nodes["bottomLeft"].setX(X);
      break;
    case "topRight":
      this.nodes["topLeft"].setY(Y);
      this.nodes["bottomRight"].setX(X);
      break;
    case "bottomRight":
      this.nodes["bottomLeft"].setY(Y);
      this.nodes["topRight"].setX(X);
      break;
    case "bottomLeft":
      this.nodes["bottomRight"].setY(Y);
      this.nodes["topLeft"].setX(X);
      break;
    }
    this.getPointsInOrder();
    this.nodes["rect"].position(this.nodes["topLeft"].position());
    const width = this.nodes["topRight"].getX() - this.nodes["topLeft"].getX();
    const height =
      this.nodes["bottomLeft"].getY() - this.nodes["topLeft"].getY();

    if (width && height) {
      this.nodes["rect"].setWidth(width);
      this.nodes["rect"].setHeight(height);
    }
  }
  getPointsInOrder() {
    let rectH = this.nodes["rect"].getHeight();
    let rectW = this.nodes["rect"].getWidth();
    if (rectH <= 0) {
      // height is negative, means topLeft is below bottomLeft
      let topY = this.nodes["topLeft"].getY();
      let bottomY = this.nodes["bottomLeft"].getY();
      this.nodes["topLeft"].setY(bottomY);
      this.nodes["bottomLeft"].setY(topY);
      this.nodes["topRight"].setY(bottomY);
      this.nodes["bottomRight"].setY(topY);
    }
    if (rectW <= 0) {
      const leftX = this.nodes["topLeft"].getX();
      const rightX = this.nodes["topRight"].getX();
      this.nodes["topLeft"].setX(rightX);
      this.nodes["topRight"].setX(leftX);
      this.nodes["bottomLeft"].setX(rightX);
      this.nodes["bottomRight"].setX(leftX);
    }
  }
  handleRectMove(evt) {
    this.nodes["topLeft"].setX(this.nodes["rect"].getX());
    this.nodes["topLeft"].setY(this.nodes["rect"].getY());
    this.nodes["topRight"].setY(this.nodes["rect"].getY());
    this.nodes["topRight"].setX(
      this.nodes["rect"].getX() + this.nodes["rect"].getWidth()
    );
    this.nodes["bottomRight"].setX(
      this.nodes["rect"].getX() + this.nodes["rect"].getWidth()
    );
    this.nodes["bottomRight"].setY(
      this.nodes["rect"].getY() + this.nodes["rect"].getHeight()
    );
    this.nodes["bottomLeft"].setX(this.nodes["rect"].getX());
    this.nodes["bottomLeft"].setY(
      this.nodes["rect"].getY() + this.nodes["rect"].getHeight()
    );
  }
  render() {
    const r = this.props.type.r;
    const g = this.props.type.g;
    const b = this.props.type.b;
    const a = this.props.type.a;
    const translucentCircle = "rgba(120,120,120,0.01)";
    return (
      <Group name={this.props.name} ref={node => (this.nodes["group"] = node)}>
        <Rect
          ref={node => (this.nodes["rect"] = node)}
          x={this.props.x}
          y={this.props.y}
          width={this.props.w}
          height={this.props.h}
          shadowEnabled={this.props.selected}
          fillEnabled
          fill={this.props.selected ? "rgba(120,120,120,0.10)" : null}
          shadowOpacity={0.5}
          shadowOffsetX={3}
          shadowOffsetY={3}
          shadowBlur={0.2}
          shadowColor={this.props.selected ? "#ff0" : null}
          stroke={
            this.props.selected
              ? `rgba(${r}, ${g}, ${b}, ${a})`
              : translucentCircle
          }
          strokeWidth={
            this.props.selected ? 2 + this.props.zoom : this.props.zoom
          }
          draggable={this.props.selected}
          onDragMove={this.handleRectMove}
          onDragEnd={this.finalizeUpdate}
          dragBoundFunc={pos => {
            let newY;
            let newX;
            if (
              pos.y + this.nodes["rect"].getHeight() >
              this.props.stageH - 0.01
            ) {
              newY = this.props.stageH - this.nodes["rect"].getHeight() - 0.01;
            } else if (pos.y > 0.01) {
              newY = pos.y;
            } else {
              newY = 0.01;
            }
            if (
              pos.x + this.nodes["rect"].getWidth() >
              this.props.stageW - 0.01
            ) {
              newX = this.props.stageW - this.nodes["rect"].getWidth() - 0.01;
            } else if (pos.x > 0.01) {
              newX = pos.x;
            } else {
              newX = 0.01;
            }
            return {
              x: newX,
              y: newY
            };
          }}
        />
        {/* TL */}
        <Circle
          ref={node => (this.nodes["topLeft"] = node)}
          x={this.props.x + 1}
          y={this.props.y + 1}
          radius={2 * (2 + this.props.zoom)}
          strokeWidth={
            this.props.selected ? 1 + this.props.zoom : this.props.zoom / 2
          }
          stroke="#555"
          fill={this.props.selected ? "#ddd" : translucentCircle}
          name="topLeft"
          style={{ zIndex: this.props.selected ? 101 : 0 }}
          draggable={this.props.selected}
          onDragMove={() => {
            this.update("topLeft", false);
          }}
          onTouchStart={() => {
            this.nodes.rect.setDraggable(false);
            this.nodes.group.setDraggable(false);
          }}
          onTouchEnd={() => {
            this.nodes.rect.setDraggable(true);
            this.nodes.group.setDraggable(true);
            this.finalizeUpdate();
          }}
          onDragEnd={() => {
            this.finalizeUpdate();
          }}
          onMouseUp={() => {
            this.finalizeUpdate();
          }}
        />
        {/* TR */}
        <Circle
          draggable={this.props.selected}
          ref={node => (this.nodes["topRight"] = node)}
          style={{ zIndex: this.props.selected ? 101 : 0 }}
          x={this.props.x + this.props.w - 1}
          y={this.props.y + 1}
          radius={2 * (2 + this.props.zoom)}
          strokeWidth={
            this.props.selected ? 1 + this.props.zoom : this.props.zoom / 2
          }
          stroke="#555"
          fill={this.props.selected ? "#ddd" : translucentCircle}
          name="topRight"
          onDragMove={() => {
            this.update("topRight", false);
          }}
          onTouchStart={() => {
            this.nodes.group.setDraggable(false);
            this.nodes.rect.setDraggable(false);
          }}
          onTouchEnd={() => {
            this.nodes.group.setDraggable(true);
            this.nodes.rect.setDraggable(true);
            this.finalizeUpdate();
          }}
          onDragEnd={() => {
            this.finalizeUpdate();
          }}
          onMouseUp={() => {
            this.finalizeUpdate();
          }}
        />
        {/* BL */}
        <Circle
          draggable={this.props.selected}
          style={{ zIndex: this.props.selected ? 101 : 0 }}
          ref={node => (this.nodes["bottomLeft"] = node)}
          x={this.props.x + 1}
          y={this.props.y + this.props.h - 1}
          radius={2 * (2 + this.props.zoom)}
          strokeWidth={
            this.props.selected ? 1 + this.props.zoom : this.props.zoom / 2
          }
          stroke="#555"
          fill={this.props.selected ? "#ddd" : translucentCircle}
          name="bottomLeft"
          onDragMove={() => {
            this.update("bottomLeft", false);
          }}
          onTouchStart={() => {
            this.nodes.group.setDraggable(false);
            this.nodes.rect.setDraggable(false);
          }}
          onTouchEnd={() => {
            this.nodes.group.setDraggable(true);
            this.nodes.rect.setDraggable(true);
            this.finalizeUpdate();
          }}
          onDragEnd={() => {
            this.finalizeUpdate();
          }}
          onMouseUp={() => {
            this.finalizeUpdate();
          }}
        />
        {/* BR */}
        <Circle
          draggable={this.props.selected}
          style={{ zIndex: this.props.selected ? 101 : 0 }}
          ref={node => (this.nodes["bottomRight"] = node)}
          x={this.props.x + this.props.w - 1}
          y={this.props.y + this.props.h - 1}
          radius={2 * (2 + this.props.zoom)}
          strokeWidth={
            this.props.selected ? 1 + this.props.zoom : this.props.zoom / 2
          }
          stroke="#555"
          fill={this.props.selected ? "#ddd" : translucentCircle}
          name="bottomRight"
          onDragMove={() => {
            this.update("bottomRight", false);
          }}
          onTouchStart={() => {
            this.nodes.group.setDraggable(false);
            this.nodes.rect.setDraggable(false);
          }}
          onTouchEnd={() => {
            this.nodes.group.setDraggable(true);
            this.nodes.rect.setDraggable(true);
            this.finalizeUpdate();
          }}
          onDragEnd={() => {
            this.finalizeUpdate();
          }}
          onMouseUp={() => {
            this.finalizeUpdate();
          }}
        />
      </Group>
    );
  }
}

export default LabelBox;
