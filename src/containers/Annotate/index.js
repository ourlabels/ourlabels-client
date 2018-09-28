import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import ReactLoading from 'react-loading';
import ImageComponent from '../../components/ImageComponent.jsx';
import ClassificationComponent from '../../components/ClassificationComponent.jsx';
import { getImage, updateIndex } from '../../redux-actions/image';
import { getLabels } from '../../redux-actions/labels';
import {
  getAnnotations,
  postAnnotations
} from '../../redux-actions/annotations';
import { getSequences, changeSequence } from '../../redux-actions/sequence';
import { bindActionCreators } from 'redux';
import './Annotate.scss';

class AnnotateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageHeight: 0,
      imageWidth: 0,
      annotations: [],
      zoom: 1.0,
      image: null,
      imageid: null,
      imageComponent: null,
      reset: true
    };
    this.reset = true;
    this.resetAnnotations = true;
    this.resetImage = true;
    this.unchanged = true;
    this.annotations = [];
    this.imageid = null;
    this.oldimageid = null;
    this.image = null;
    this.selected = 0;
    this.counter = 0;

    this.addAnnotation = this.addAnnotation.bind(this);
    this.updateDims = this.updateDims.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeZoom = this.changeZoom.bind(this);
    this.changeSequence = this.changeSequence.bind(this);
    this.selectAnnotation = this.selectAnnotation.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.windowResize = this.windowResize.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.back = this.back.bind(this);
    this.next = this.next.bind(this);
    this.copy = this.copy.bind(this);
    this.save = this.save.bind(this);
  }
  addAnnotation(x, y, w, h, o, t, d, type) {
    // name is LabelBox id
    let annotations = this.annotations.slice(0);
    annotations.push({
      name: annotations.length > 0 ? `${parseInt(annotations[annotations.length - 1].name) + 1}` : '0',
      x,
      y,
      w,
      h,
      occluded: o,
      truncated: t,
      difficult: d,
      type: Object.keys(this.props.labels)[0]
    });
    this.unchanged = false;
    this.selected = annotations.length - 1;
    this.annotations = annotations;
    this.forceUpdate();
  }
  changeType(newType, type = 'type') {
    // just type of a box
    let annotations = this.annotations.slice(0);
    annotations[this.selected][type] = newType;
    this.annotations = annotations;
    this.unchanged = false;
    this.forceUpdate();
  }
  updateDims(x, y, w, h) {
    // just dimensions of a box
    let annotations = this.annotations.slice(0);
    annotations[this.selected] = {
      name: annotations[this.selected].name,
      x,
      y,
      w,
      h,
      occluded: annotations[this.selected].occluded,
      truncated: annotations[this.selected].truncated,
      difficult: annotations[this.selected].difficult,
      type: annotations[this.selected].type
    };
    this.annotations = annotations;
    this.unchanged = false;
    this.forceUpdate();
  }
  // way to select!
  positionOf(name) {
    let i = 0;
    let annotations = this.annotations;
    for (; i < annotations.length; i += 1) {
      if (annotations[i].name === name) {
        break;
      }
    }
    if (i === annotations.length) {
      return -1;
    }
    return i;
  }
  selectAnnotation(name) {
    let index = this.positionOf(name);
    if (index !== -1 && this.selected !== index) {
      this.unchanged = false;
      this.selected = index;
      this.forceUpdate();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.annotations && this.unchanged) {
      let i = 0;
      let newAnnotations = [];
      for (let box of newProps.annotations) {
        newAnnotations.push({
          name: `${i}`,
          x: box.x,
          y: box.y,
          w: box.width,
          h: box.height,
          type: box.type_key,
          occluded: box.occluded != undefined ? box.occluded : false,
          truncated: box.truncated != undefined ? box.truncated : false,
          difficult: box.difficult != undefined ? box.difficult : false
        });
        i += 1;
      }
      this.resetAnnotations = false;
      this.annotations = newAnnotations;
      this.selected = 0;
      this.image = newProps.image;
      this.oldimageid = this.imageid;
      this.imageid = newProps.imageid;
      this.forceUpdate();
    }
    if (this.reset || this.imageid !== this.oldimageid) {
      this.reset = false;
      this.loadImage();
    }
  }
  componentDidMount() {
    let i = 0;
    let newAnnotations = [];
    for (let box of this.props.annotations) {
      newAnnotations.push({
        name: `${i}`,
        x: box.x,
        y: box.y,
        w: box.width,
        h: box.height,
        type: box.type_key,
        occluded: box.occluded != undefined ? box.occluded : false,
        truncated: box.truncated != undefined ? box.truncated : false,
        difficult: box.difficult != undefined ? box.difficult : false
      });
      i += 1;
    }
    this.annotations = newAnnotations;
    this.loadImage();
    this.windowResize();
  }
  changeZoom(zoom) {
    if (zoom && !isNaN(zoom) && zoom !== 0) {
      let imageWidth = window.innerWidth * zoom;
      let imageHeight = window.innerHeight * zoom;
      this.setState({ imageWidth, imageHeight, zoom });
    }
  }
  changeSequence(newSequence) {
    this.props.changeSequence(newSequence);
    this.unchanged = true;
    this.loadImage();
  }
  componentWillMount() {
    this.props.getSequences();
    this.props.getLabels();
    this.loadImage();
    this.windowResize();
    window.addEventListener('resize', this.windowResize);
    window.addEventListener('keydown', this.keyDown);
  }
  keyDown(keydownevent) {
    if (keydownevent.key === 'X' || keydownevent.key === 'x') {
      this.annotations.splice(this.selected, 1);
      this.selected = 0;
      this.unchanged = false;
      this.forceUpdate();
    }
  }
  componentDidMount() {
    this.windowResize();
  }
  loadImage() {
    this.setState({ showLoading: true });
    const offset = 0;
    this.props.getImage(this.updatePage);
  }
  updatePage() {
    this.setState({ showLoading: false });
  }
  getPreviousAnnotations() {
    this.setState({ showLoading: true });
    const offset = -1; // previous
    this.props.getAnnotations(offset, this.updatePage);
  }
  windowResize(evt) {
    // here we decide on the size... if it's a wide screen, palce controls on the side
    let imageWidth = window.innerWidth * this.state.zoom;
    let imageHeight = window.innerHeight * this.state.zoom;
    this.setState({ imageWidth, imageHeight });
  }
  save() {
    this.setState({ showLoading: true });
    this.reset = false;
    this.selected = 0;
    this.props.postAnnotations(this.annotations, this.next);
  }
  copy() {
    this.resetAnnotations = true;
    this.unchanged = true;
    this.getPreviousAnnotations();
  }
  back() {
    this.reset = true;
    this.resetImage = true;
    this.resetAnnotations = true;
    this.unchanged = true;
    this.props.updateIndex(-1, null, this.updatePage);
    this.windowResize();
  }
  next() {
    this.setState({ showLoading: false });
    this.reset = true;
    this.resetImage = true;
    this.resetAnnotations = true;
    this.unchanged = true;
    this.props.updateIndex(1, null, this.updatePage);
    this.windowResize();
  }
  render() {
    return (
      <div
        className={
          window.innerWidth > window.innerHeight
            ? 'image-classifications-holder-landscape'
            : 'image-classifications-holder-portrait'
        }
      >
        <div
          className={
            window.innerWidth > window.innerHeight
              ? 'image-holder-landscape'
              : 'image-holder-portrait'
          }
        >
          <Modal
            open={this.state.showLoading}
            size="mini"
            className="modal-loading"
            center="true"
          >
            <Modal.Header>Loading image</Modal.Header>
            <Modal.Content>
              <ReactLoading type="spin" color="#0000ff" />
            </Modal.Content>
          </Modal>
          {this.image && (
            <ImageComponent
              key={`image-${this.imageid}`}
              image={this.image}
              annotations={this.annotations}
              imageid={this.imageid}
              image_index={this.props.image_index}
              annotation_index={this.props.annotation_index}
              imageWidth={this.state.imageWidth}
              imageHeight={this.state.imageHeight}
              updateDims={this.updateDims}
              addAnnotation={this.addAnnotation}
              selectAnnotation={this.selectAnnotation}
              selected={this.selected}
              labels={this.props.labels}
              zoom={this.state.zoom}
            />)
          }
          {this.image == null && (
            <div>
                No more images
            </div>
          )
          }
        </div>
        <div
          className={
            window.innerWidth > window.innerHeight
              ? 'classifications-holder-landscape'
              : 'classifications-holder-portrait'
          }
        >
          <ClassificationComponent
            key={`classificaiton-${this.imageid}`}
            annotations={this.annotations}
            changeType={this.changeType}
            changeZoom={this.changeZoom}
            selected={this.selected}
            zoom={this.state.zoom}
            selectAnnotation={this.selectAnnotation}
            labels={this.props.labels}
            portrait={window.innerHeight > window.innerWidth}
            index={this.props.image_index}
            sequence={this.props.sequence}
            sequences={this.props.sequences}
            changeSequence={this.changeSequence}
            updateIndex={this.props.updateIndex}
            total={this.props.count}
            save={this.save}
            next={this.next}
            back={this.back}
            copy={this.copy}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { auth, annotations, labels, image, sequence } = state;
  if (typeof annotations.callback === 'function') {
    annotations.callback(annotations.annotations);
  }
  return {
    annotations: annotations.annotations,
    loggedIn: auth.loggedIn,
    sequences: sequence.sequences,
    labels: labels.labels,
    image: image.image,
    image_idx: image.index,
    annotation_index: annotations.index,
    imageid: image.imageid,
    image_index: image.index,
    sequence: image.sequence,
    count: image.count,
    project: auth.current_project
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getAnnotations,
      postAnnotations,
      getImage,
      getLabels,
      updateIndex,
      changeSequence,
      getSequences
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnotateContainer);
