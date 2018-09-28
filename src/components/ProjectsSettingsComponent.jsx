import React from 'react';
import Dropzone from 'react-dropzone';
import { Header, Segment, Form, Button, Dropdown, Icon, Container } from 'semantic-ui-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ReactTooltip from 'react-tooltip';
import science from '../assets/types/science.svg';
import civic from '../assets/types/civic.svg';
import './ProjectsSettingsComponent.scss';

const getFilesSize = (files) => {
  let size = 0;
  for (let file of files) {
    size += file.size;
  }
  return size;
};

class ProjectsSettingsComponent extends React.Component {
  constructor(props) {
    super(props);
    const {
      allowed,
      refused,
      requested,
      type,
      description,
      fullDescription,
      publicType,
      sequencenames,
      maxSize } = this.props.project;
    const { projectTypes } = this.props;
    let sequences = sequencenames.map(seq => {
      return ({
        originalName: seq.name,
        originalVideo: seq.video,
        originalHSplit: seq.hSplit,
        originalVSplit: seq.vSplit,
        numFiles: seq.files,
        newName: seq.name,
        newHSplit: seq.hSplit,
        newVSplit: seq.vSplit,
        deleted: false,
        new: false,
        updated: false,
      });
    });
    const newSequence = {
      newName: '',
      newFile: null,
      newVideo: projectTypes[type].video,
      newHSplit: 1,
      newVSplit: 1,
      dropZoneActive: false,
      deleted: false,
      new: true
    };
    this.state = {
      project: {
        allowed,
        refused,
        requested,
        owner: this.props.username,
        type,
        description,
        fullDescription,
        sequences,
        publicType,
        dropZoneActive: true
      },
      newSequence,
      maxSize,
      scrollDown: (<Icon name="angle double down" size="big"/>),
      scrollUp: null
    };
    this.scrollRef = null;
    this.moveItem = this.moveItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragNewEnter = this.onDragNewEnter.bind(this);
    this.onDragNewLeave = this.onDragNewLeave.bind(this);
    this.onDropNew = this.onDropNew.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getImageForType = this.getImageForType.bind(this);
    this.onChangeNewSequence = this.onChangeNewSequence.bind(this);
    this.onChangeSequence = this.onChangeSequence.bind(this);
    this.onChangeProjectType = this.onChangeProjectType.bind(this);
    this.changeProjectInfo = this.changeProjectInfo.bind(this);
    this.addNewSequence = this.addNewSequence.bind(this);
    this.resetNewSequence = this.resetNewSequence.bind(this);
    this.addScrollListener = this.addScrollListener.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }
  getImageForType(type) {
    if (type === 2 || type == 3) {
      return science;
    } else {
      return civic;
    }
  }

  onDropNew(newFile) {
    let { newSequence, maxSize } = this.state;
    if (
      newSequence.newFile == null
    ) {
      newSequence.newFile = newFile;
      return this.setState({ newSequence });
    }
  }

  onDragNewEnter(evt) {
    let { newSequence } = this.state;
    newSequence.dropZoneActive = true;
    this.setState({ newSequence });
  }

  onDragNewLeave(evt) {
    let { newSequence } = this.state;
    newSequence.dropZoneActive = false;
    this.setState({ newSequence });
  }

  addNewSequence(evt) {
    evt.preventDefault();
    let { newSequence } = this.state;
    const { project } = this.state;
    if (newSequence.newFile == null || newSequence.newName === '') {
      return;
    }
    let sequencesNames = project.sequences
      .filter((seq) => { return !seq.deleted; })
      .map((seq) => {
        return seq.newName;
      });
    if (sequencesNames.includes(newSequence.newName)) {
      return;
    }
    if (sequencesNames.length >= 24) {
      return;
    }
    project.sequences.push(newSequence);
    this.setState({ project });
    this.resetNewSequence();
  }
  resetNewSequence() {
    let resetSequence = {
      newName: '',
      files: 0,
      newFile: null,
      newVideo: this.props.projectTypes[this.state.project.type].video,
      newHSplit: 1,
      newVSplit: 1,
      dropZoneActive: false,
      deleted: false,
      new: true
    };
    // no memory leaks
    this.state.newSequence.newFiles.forEach(file => {
      window.URL.revokeObjectURL(file.preview);
    });
    this.setState({ newSequence: resetSequence });
  }

  onChangeSequence(index, type, value) {
    const { project } = this.state;
    project.sequences[index][type] = value;
    project.sequences[index].updated = true;
    this.setState({ project });
  }

  onChangeNewSequence(type, value) {
    let { newSequence } = this.state;
    newSequence[type] = value;
    this.setState({ newSequence });
  }

  deleteSequence(index) {
    const { project } = this.state;
    project.sequences[index].newFiles.forEach(file => {
      window.URL.revokeObjectURL(file.preview);
    });
    project.sequences[index].deleted = true;
    this.setState({ project });
  }

  changeProjectInfo() {
    const { project } = this.state;
    if (project.owner != null && !project.allowed.includes(project.owner)) {
      alert('Owner must be in allowed list.');
      return;
    }
    this.props.updateProject(
      project.allowed,
      project.refused,
      project.requested,
      project.publicType,
      project.owner,
      project.description,
      project.fullDescription,
      project.type,
      project.sequences
    );
  }

  onDragEnd(result) {
    // the only one that is required
    const { source, destination } = result;
    if (destination != null && destination.droppableId === source.droppableId) {
      this.moveItem(source.droppableId, source.index, destination.index);
    } else if (destination != null) {
      const item = this.removeItem(source.droppableId, source.index);
      this.addItem(destination.droppableId, destination.index, item);
    }
  };

  moveItem(id, idxS, idxD) {
    if (idxS == idxD) {
      return;
    }
    const { project } = this.state;
    let source = project[id];
    let item = source[idxS];
    source.splice(idxS, 1);
    source.splice(idxD, 0, item);
    this.setState({ project });
  }

  removeItem(id, idxR) {
    const { project } = this.state;
    let item = project[id][idxR];
    project[id].splice(idxR, 1);
    this.setState({ project });
    return item;
  }

  addItem(id, idxD, item) {
    const { project } = this.state;
    let source = project[id];
    source.splice(idxD, 0, item);
    this.setState({ project });
  }

  onChange(type, value) {
    const { project } = this.state;
    project[type] = value;
    this.setState({ project });
  }

  onChangeProjectType(evt, val) {
    const { project } = this.state;
    project.type = val.value;
    project.newVideo = this.props.projectTypes[val.value].video;
    this.setState({ project });
    this.resetNewSequence();
  }
  addScrollListener(node) {
    if (node) {
      node.addEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll(evt) {
    // signifiers for the scroll affordance
    let scrollUp = null;
    let scrollDown = null;
    if (evt.target.scrollTop > 0) {
      scrollUp = (<div className="scroll-up"><Icon name="angle double up" size="big"/></div>);
    }
    if (evt.target.scrollTop + evt.target.clientHeight < evt.target.scrollHeight) {
      scrollDown = (<div className="scroll-down"><Icon name="angle double down" size="big"/></div>);
    }
    this.setState({scrollDown, scrollUp});
  }

  render() {
    const { description, fullDescription, requested, allowed, refused, publicType, type, sequences, owner } = this.state.project;
    const { newSequence, maxSize } = this.state;
    const { projectTypes } = this.props;
    const projectOptions = Object.keys(projectTypes).map((key, index) => {
      return (
        {
          image: { avatar: true, src: this.getImageForType(parseInt(key)) },
          text: projectTypes[key].name,
          value: parseInt(key)
        }
      );
    });
    const publicTypeOptions = [{ text: 'public', value: true, icon: { name: 'unlock' } }, { text: 'private', value: false, icon: { name: 'lock' } }];
    return (
      <Container >
        <Header as="h2">Project Settings</Header>
        <div className="project-settings-container">
          <Segment className="project-settings-segment">
            <div className="project-settings-holder" ref={this.addScrollListener}>
              <Form>
                <Button style={{ float: 'right' }} type="submit" primary={true} onClick={this.changeProjectInfo}>Save Changes</Button>
                <Button style={{ float: 'right' }} type="cancel" primary={false} onClick={() => { this.props.gotProjectForUpdate(null); }}>Cancel</Button>
                <Header as="h4">Project Description</Header>
                <Form.Group>
                  <Form.Input
                    defaultValue={description}
                    placeholder="Project description"
                    onChange={(e, v) => { this.onChange('description', v.value); }}
                    data-for={'description'}
                    data-tip="This is the short description of the project. It will be seen on the projects page."
                    data-iscapture="true"

                  />
                </Form.Group>
                <Header as="h4">Full Description</Header>
                <Form.Group>
                  <Form.TextArea
                    defaultValue={fullDescription}
                    placeholder="Project's detailed description"
                    onChange={(e, v) => { this.onChange('fullDescription', v.value); }}
                    data-for={'fullDescription'}
                    data-tip="The long/complete description of the project. This will be displayed on the details modal about a project."
                    data-iscapture="true"
                  />
                </Form.Group>
                <Header as="h4">Owner</Header>
                <Form.Group>
                  <Form.Input defaultValue={owner} onChange={(e, v) => { this.onChange('owner', v.value); }} />
                </Form.Group>
                <Header as="h4">Select project type</Header>
                <Form.Group>
                  <Dropdown fluid selection options={projectOptions} defaultValue={type} onChange={this.onChangeProjectType} />
                </Form.Group>
                <Form.Group>
                  <Dropdown fluid selection options={publicTypeOptions} defaultValue={publicType} onChange={(e, v) => { this.onChange('publicType', v.value); }} />
                </Form.Group>

                <Form.Group className="drag-drop-context">
                  <DragDropContext
                    onDragEnd={this.onDragEnd}
                  >
                    <div className="requested-items-drag-drop">
                      <Header as="h4">Requested list</Header>
                      <Droppable droppableId="requested">
                        {(provided, snapshot) => (
                          <Segment style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'white' }}>
                            <div ref={provided.innerRef}>
                              {requested.map((requestedItem, index) => {
                                return (
                                  <Draggable key={requestedItem} draggableId={requestedItem} index={index}>
                                    {(p, s) => (
                                      <div className="requested-item" ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>{requestedItem}</div>
                                    )
                                    }
                                  </Draggable>
                                );
                              })}
                              <br />
                              {provided.placeholder}
                            </div>
                          </Segment>
                        )
                        }
                      </Droppable>
                    </div>
                    <div className="allowed-items-drag-drop">
                      <Header as="h4">Allowed list</Header>
                      <Droppable droppableId="allowed">
                        {(provided, snapshot) => (
                          <Segment style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'white' }}>
                            <div ref={provided.innerRef}>
                              {allowed.map((allowedItem, index) => {
                                return (
                                  <Draggable key={allowedItem} draggableId={allowedItem} index={index}>
                                    {(p, s) => (
                                      <div className="allowed-item" ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>{allowedItem}</div>
                                    )
                                    }
                                  </Draggable>
                                );
                              })}
                              <br />
                              {provided.placeholder}
                            </div>
                          </Segment>
                        )
                        }
                      </Droppable>
                    </div>
                    <div className="refused-items-drag-drop">
                      <Header as="h4">Refused list</Header>
                      <Droppable droppableId="refused">
                        {(provided, snapshot) => (
                          <Segment style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'white' }}>
                            <div ref={provided.innerRef}>
                              {refused.map((refusedItem, index) => {
                                return (
                                  <Draggable key={refusedItem} draggableId={refusedItem} index={index}>
                                    {(p, s) => (
                                      <div className="refused-item" ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>{refusedItem}</div>
                                    )
                                    }
                                  </Draggable>
                                );
                              })}
                              <br />
                              {provided.placeholder}
                            </div>
                          </Segment>
                        )
                        }
                      </Droppable>
                    </div>
                  </DragDropContext>
                </Form.Group>
                <Header as="h4">New Sequence</Header>
                <Segment style={{ backgroundColor: 'gray' }}>
                  <Form.Group>
                    <Icon
                      name={newSequence.newVideo ? 'video' : 'camera'}
                      size="big"
                    />
                    <Dropzone
                      className="dropzone"
                      activeClassName="dropzone-enabled"
                      disabledClassName="dropzone-disabled"
                      disabled={newSequence.newFile != null}
                      accept={['application/x-tar', 'application/gzip', 'application/x-bzip2']}
                      multiple={false}
                      maxSize={maxSize * Math.pow(2, 20)}
                      onDragEnter={this.onDragNewEnter}
                      onDragLeave={this.onDragNewLeave}
                      onDrop={this.onDropNew}
                      data-for={'dropzoneNewSequence'}
                      data-tip={newSequence.newVideo ? '<p>Drop <b>a</b> video file here of MP2, MP4, TS types (or gzipped/bzipped)</p>' : '<p>Drop image files here or a gzipped or bzipped set of images</p>'}
                      data-html={true}
                      data-iscapture="true"
                    >
                      {newSequence.dropZoneActive && <div className="dropzone-text">Leave files here</div>}
                      {!newSequence.dropZoneActive && <div className="dropzone-text">Drop files here</div>}
                    </Dropzone>
                    <Form.TextArea label="sequence name" value={newSequence.newName} onChange={(e, v) => { this.onChangeNewSequence('newName', v.value); }} />
                    <Form.Input size="small" type="number" min="1" max="5" label="Vertical split" defaultValue={newSequence.newVSplit} onChange={(e, v) => { this.onChangeNewSequence('newVSplit', parseInt(v.value)); }} />
                    <Form.Input size="small" type="number" min="1" max="5" label="Horizontal split" defaultValue={newSequence.newHSplit} onChange={(e, v) => { this.onChangeNewSequence('newHSplit', parseInt(v.value)); }} />
                    <Button primary onClick={this.addNewSequence}>Add</Button>
                    <Button secondary onClick={this.resetNewSequence}>Reset</Button>
                  </Form.Group>
                </Segment>
                <Header as="h4">Created Sequences</Header>
                {sequences.map((seq, idx) => {
                  return (
                    <Segment key={`${seq.newName}-${seq.deleted}`} style={{ display: seq.deleted ? 'none' : 'block' }}>
                      <Form.Group>
                        <Icon
                          name={seq.newVideo ? 'video' : 'camera'}
                          size="big"
                        />
                        <div className="dropzone-files">{(seq.numFiles ? seq.numFiles : 0)} files</div>
                        <Form.TextArea label="sequence name" value={seq.newName} onChange={(e, v) => { this.onChangeSequence(idx, 'newName', v.value); }} />
                        <Form.Input
                          size="small"
                          type="number"
                          min="1"
                          max="5"
                          label="Vertical split"
                          value={seq.newVSplit}
                          onChange={(e, v) => { this.onChangeSequence(idx, 'newVSplit', parseInt(v.value)); }} />
                        <Form.Input
                          size="small"
                          type="number"
                          min="1" max="5"
                          label="Horizontal split"
                          value={seq.newHSplit}
                          onChange={(e, v) => { this.onChangeSequence(idx, 'newHSplit', parseInt(v.value)); }} />
                        <Icon
                          color="red"
                          onClick={() => { this.deleteSequence(idx); }}
                          name="x"
                          data-for={'remove'}
                          data-tip="Remove this item"
                          data-iscapture="true"
                          size="large"
                          style={{ float: 'right' }} />
                      </Form.Group>
                    </Segment>
                  );
                })}
                <ReactTooltip id="description" place="bottom" type="dark" />
                <ReactTooltip id="fullDescription" place="bottom" type="dark" />
                <ReactTooltip id="dropzoneSequence" html={true} place="bottom" type="dark" />
                <ReactTooltip id="dropzoneNewSequence" html={true} place="bottom" type="dark" />
                <ReactTooltip id="remove" place="bottom" type="dark" />
              </Form>
            </div>
          </Segment>
          <div className="scroll-indicators">
            <div className="scroll-up">{this.state.scrollUp}</div>
            <div className="scroll-down">{this.state.scrollDown}</div>
          </div>
        </div>
      </Container>
    );
  }

}

export default ProjectsSettingsComponent;
