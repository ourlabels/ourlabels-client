import React, { Component } from 'react';
import { Card, Image, Icon, Header, Button } from 'semantic-ui-react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import ZoomComponent from './ZoomComponent.jsx';
import TypeComponent from './TypeComponent.jsx';
import SequenceComponent from './SequenceComponent.jsx';
import IndexComponent from './IndexComponent.jsx';
import './ClassificationComponent.scss';

class ClassificationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topContent: null,
      bottomContent: null,
      initialTime: true,
      scrollRef: null
    };
    this.onScroll = this.onScroll.bind(this);
    this.update = this.update.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
  }
  onScroll(evt, x) {
    const { scrollHeight, clientHeight, scrollTop } = evt.target;
    let bottomContent = null;
    let topContent = null;
    //evt.target.scrollHeight is entire height
    //evt.target.clientHeight is visible height
    //evt.target.scrollTop is the offset from the top... so scrolled to the bottom
    if (scrollTop + clientHeight < scrollHeight && window.innerWidth > 400) {
      bottomContent = (
        <Icon
          name="angle double down"
          size="big"
          onClick={() => {
            if (this.state.scrollRef) {
              this.state.scrollRef.scrollTop = scrollHeight;
            }
          }}
        />
      );
    }
    if (scrollTop > 0 && window.innerWidth > 400) {
      topContent = (
        <Icon
          name="angle double up"
          size="big"
          onClick={() => {
            if (this.state.scrollRef) {
              this.state.scrollRef.scrollTop = 0;
            }
          }}
        />
      );
    }

    this.setState({ bottomContent, topContent });
  }
  componentWillReceiveProps(newProps) {}
  update(ref) {
    if (ref && this.state.initialTime) {
      let bottomContent = null;
      let topContent = null;

      const { scrollHeight, clientHeight, scrollTop } = ref;
      if (scrollTop + clientHeight < scrollHeight && window.innerWidth > 400) {
        bottomContent = <Icon name="angle double down" size="big" />;
      }
      if (scrollTop > 0 && window.innerWidth > 400) {
        topContent = (
          <Icon
            name="angle double up"
            size="big"
            onClick={() => {
              ref.scrollTop = 0;
            }}
          />
        );
      }

      this.setState({
        bottomContent,
        topContent,
        initialTime: false,
        scrollRef: ref
      });
    }
  }
  submitChanges() {}
  render() {
    return (
      <div
        className={
          this.props.portrait
            ? 'classifications-holder-portrait'
            : 'classifications-holder-landscape'
        }
      >
        <div className="top-classification">{this.state.topContent}</div>
        <div
          className={
            this.props.portrait
              ? 'classifications-scroller-portrait'
              : 'classifications-scroller-landscape'
          }
          onBlur={this.onScroll}
          onScroll={this.onScroll}
          ref={ref => {
            setTimeout(() => {
              this.update(ref);
            }, 500);
          }}
        >
          {this.props.annotations &&
            this.props.annotations.map((annotation, index) => {
              let r = this.props.labels[annotation.type].r;
              let g = this.props.labels[annotation.type].g;
              let b = this.props.labels[annotation.type].b;
              let a = this.props.labels[annotation.type].a;

              return (
                <div
                  key={annotation.name}
                  onClick={() => {
                    this.props.selectAnnotation(annotation.name);
                  }}
                  className={
                    index === this.props.selected ? 'selected' : 'annotation'
                  }
                  style={{
                    backgroundColor:
                      index === this.props.selected
                        ? 'black'
                        : `rgba(${r},${g},${b},${a})`
                  }}
                >
                  {this.props.labels[annotation.type].description}
                </div>
              );
            })}
          {!this.props.annotations ||
            (this.props.annotations.length === 0 && (
              <div className="selected" style={{ backgroundColor: 'black' }}>
                {'No annotations yet'}
              </div>
            ))}
        </div>
        <div className="bottom-classification">{this.state.bottomContent}</div>
        <div
          className={
            this.props.portrait
              ? 'controls-holder-portrait'
              : 'controls-holder-landscape'
          }
        >
          <ZoomComponent
            key={`zoom-component-${this.props.imageid}`}
            changeZoom={this.props.changeZoom}
            zoom={this.props.zoom}
            portrait={this.props.portrait}
          />
          {this.props.annotations.length > 0 && (
            <TypeComponent
              key={`type-component-${this.props.selected}`}
              changeType={this.props.changeType}
              portrait={this.props.portrait}
              type={this.props.annotations[this.props.selected]['type']}
              occluded={this.props.annotations[this.props.selected]['occluded']}
              difficult={this.props.annotations[this.props.selected]['difficult']}
              truncated={this.props.annotations[this.props.selected]['truncated']}
              labels={this.props.labels}
            />
          )}
          {this.props.sequences && (
            <SequenceComponent
              key={`seqs-${this.props.imageid}`}
              sequences={this.props.sequences}
              sequence={this.props.sequence}
              changeSequence={this.props.changeSequence}
            />
          )}
          {this.props.total && (
            <IndexComponent
              key={`idx-${this.props.imageid}`}
              total={this.props.total}
              index={this.props.index}
              updateIndex={this.props.updateIndex}
            />
          )}
          <div
            className={this.props.portrait ? 'save-portrait' : 'save-landscape'}
          >
            <Button
              className={
                this.props.portrait
                  ? 'save-button-portrait'
                  : 'save-button-landscape'
              }
              onClick={this.props.save}
              primary
            >
              Save
            </Button>
            <Button
              className={
                this.props.portrait
                  ? 'copy-button-portrait'
                  : 'copy-button-landscape'
              }
              onClick={this.props.copy}
              secondary
            >
              Copy
            </Button>
          </div>
          <div
            className={
              this.props.portrait ? 'direction-portrait' : 'direction-landscape'
            }
          >
            <Button
              className={
                this.props.portrait
                  ? 'back-button-portrait'
                  : 'back-button-landscape'
              }
              onClick={this.props.back}
            >
              <Icon name="arrow left" />
            </Button>

            <Button
              className={
                this.props.portrait
                  ? 'next-button-portrait'
                  : 'next-button-landscape'
              }
              onClick={this.props.next}
            >
              <Icon name="arrow right" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ClassificationComponent;
