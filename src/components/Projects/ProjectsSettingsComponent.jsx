import React from "react";
import Dropzone from "react-dropzone";
import {
  Header,
  Segment,
  Form,
  Button,
  Dropdown,
  Icon,
  Input,
  Grid,
  Container
} from "semantic-ui-react";
import NumericInput from "react-numeric-input";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReactTooltip from "react-tooltip";
import science from "../../assets/types/science.svg";
import civic from "../../assets/types/civic.svg";
import "./ProjectsSettingsComponent.scss";

const getFilesSize = files => {
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
      maxSize
    } = this.props.project;
    const { projectTypes } = this.props;
    let sequences = sequencenames.map((seq, index) => {
      return {
        index,
        name: seq.name,
        video: seq.video,
        hSplit: seq.hSplit,
        vSplit: seq.vSplit,
        numFiles: seq.files
      };
    });
    const newSequence = {
      name: "",
      file: null,
      video: projectTypes[type].video,
      hSplit: 1,
      vSplit: 1,
      start: 0,
      length: 100,
      everyNFrames: 1,
      dropZoneActive: false
    };
    this.state = {
      project: {
        allowed,
        refused,
        requested,
        owner: this.props.username,
        type: `${type}`,
        description,
        fullDescription,
        sequences,
        newSequences: [],
        deletedSequences: [],
        modifiedSequences: [], // not used yet
        publicType: `${publicType}`,
        dropZoneActive: true
      },
      newSequence,
      maxSize,
      scrollDown: <Icon name="angle double down" size="big" />,
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
    this.onChangeProjectType = this.onChangeProjectType.bind(this);
    this.changeProjectInfo = this.changeProjectInfo.bind(this);
    this.addNewSequence = this.addNewSequence.bind(this);
    this.resetNewSequence = this.resetNewSequence.bind(this);
    this.deleteSequence = this.deleteSequence.bind(this);
    this.deleteNewSequence = this.deleteNewSequence.bind(this);
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
    newSequence.file = newFile[0];
    return this.setState({ newSequence });
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
    let { newSequence, project } = this.state;
    console.log(newSequence);
    if (!newSequence.file || !newSequence.name) {
      return;
    }
    let sequencesNames = project.sequences.map(seq => {
      return seq.name;
    });
    if (sequencesNames.includes(newSequence.name)) {
      return;
    }
    project.newSequences.push(newSequence);
    console.log(project.newSequences);
    this.setState({ project });
    this.resetNewSequence();
  }

  resetNewSequence() {
    let resetSequence = {
      name: "",
      file: null,
      video: this.props.projectTypes[this.state.project.type].video,
      hSplit: 1,
      vSplit: 1,
      start: 0,
      length: 100,
      everyNFrames: 1,
      dropZoneActive: false
    };

    this.setState({ newSequence: resetSequence });
  }

  onChangeNewSequence(type, value) {
    let { newSequence } = this.state;
    newSequence[type] = value;
    this.setState({ newSequence });
  }

  deleteSequence(index) {
    const { project } = this.state;
    const deleted = project.sequences.splice(index, 1);
    project.deletedSequences.push(deleted[0]);
    this.setState({ project });
  }

  deleteNewSequence(index) {
    const { project } = this.state;
    project.newSequences.splice(index, 1);
    this.setState({ project });
  }

  undeleteSequence(index) {
    const { project } = this.state;
    const deleted = project.deletedSequences.splice(index, 1);
    project.sequences.push(deleted[0]); // does not put it where it was (.idx) because others may have been removed since then
    this.setState({ project });
  }

  changeProjectInfo() {
    const { project } = this.state;
    if (project.owner != null && !project.allowed.includes(project.owner)) {
      alert("Owner must be in allowed list.");
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
      project.sequences,
      project.deletedSequences,
      project.newSequences
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
  }

  moveItem(id, idxS, idxD) {
    if (idxS == idxD) {
      return;
    }
    const { project } = this.state;
    let source = project[id];
    const item = source.splice(idxS, 1);
    source.splice(idxD, 0, item);
    project[id] = source;
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
    project[id] = source;
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
    project.video = this.props.projectTypes[val.value].video;
    this.setState({ project });
    this.resetNewSequence();
  }

  addScrollListener(node) {
    if (node) {
      node.addEventListener("scroll", this.handleScroll);
    }
  }

  handleScroll(evt) {
    // signifiers for the scroll affordance
    let scrollUp = null;
    let scrollDown = null;
    if (evt.target.scrollTop > 0) {
      scrollUp = (
        <div className="scroll-up">
          <Icon name="angle double up" size="big" />
        </div>
      );
    }
    if (
      evt.target.scrollTop + evt.target.clientHeight <
      evt.target.scrollHeight
    ) {
      scrollDown = (
        <div className="scroll-down">
          <Icon name="angle double down" size="big" />
        </div>
      );
    }
    this.setState({ scrollDown, scrollUp });
  }

  render() {
    const {
      description,
      fullDescription,
      requested,
      allowed,
      refused,
      publicType,
      type,
      sequences,
      newSequences,
      deletedSequences,
      owner
    } = this.state.project;
    const { newSequence, maxSize } = this.state;
    const { projectTypes } = this.props;
    const projectOptions = Object.keys(projectTypes).map((key, index) => {
      return {
        key: key,
        image: { avatar: true, src: this.getImageForType(parseInt(key)) },
        text: projectTypes[key].name,
        value: key
      };
    });
    const publicTypeOptions = [
      { key: "true", text: "public", value: "true", icon: { name: "unlock" } },
      { key: "false", text: "private", value: "false", icon: { name: "lock" } }
    ];
    return (
      <Container>
        <Header as="h2">Project Settings</Header>
        <div className="project-settings-container">
          <Segment className="project-settings-segment">
            <div
              className="project-settings-holder"
              ref={this.addScrollListener}
            >
              <Form>
                <Button
                  style={{ float: "right" }}
                  type="submit"
                  primary={true}
                  onClick={this.changeProjectInfo}
                >
                  Save Changes
                </Button>
                <Button
                  style={{ float: "right" }}
                  type="cancel"
                  primary={false}
                  onClick={() => {
                    this.props.gotProjectForUpdate(null);
                  }}
                >
                  Cancel
                </Button>
                <Header as="h4">Project Description</Header>
                <Form.Group>
                  <Form.Input
                    defaultValue={description}
                    placeholder="Project description"
                    onChange={(e, v) => {
                      this.onChange("description", v.value);
                    }}
                    data-for={"description"}
                    data-tip="This is the short description of the project. It will be seen on the projects page."
                    data-iscapture="true"
                  />
                </Form.Group>
                <Header as="h4">Full Description</Header>
                <Form.Group>
                  <Form.TextArea
                    defaultValue={fullDescription}
                    placeholder="Project's detailed description"
                    onChange={(e, v) => {
                      this.onChange("fullDescription", v.value);
                    }}
                    data-for={"fullDescription"}
                    data-tip="The long/complete description of the project. This will be displayed on the details modal about a project."
                    data-iscapture="true"
                  />
                </Form.Group>
                <Header as="h4">Owner</Header>
                <Form.Group>
                  <Form.Input
                    defaultValue={owner}
                    onChange={(e, v) => {
                      this.onChange("owner", v.value);
                    }}
                  />
                </Form.Group>
                <Header as="h4">Select project type</Header>
                <Form.Group>
                  <Dropdown
                    fluid
                    selection
                    options={projectOptions}
                    value={type}
                    onChange={(e, v) => {
                      this.onChange("type", v.value);
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Dropdown
                    fluid
                    selection
                    options={publicTypeOptions}
                    value={publicType}
                    onChange={(e, v) => {
                      this.onChange("publicType", v.value);
                    }}
                  />
                </Form.Group>

                <Form.Group className="drag-drop-context">
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="requested-items-drag-drop">
                      <Header as="h4">Requested list</Header>
                      <Droppable droppableId="requested">
                        {(provided, snapshot) => (
                          <Segment
                            style={{
                              backgroundColor: snapshot.isDraggingOver
                                ? "blue"
                                : "white"
                            }}
                          >
                            <div ref={provided.innerRef}>
                              {requested.map((requestedItem, index) => {
                                return (
                                  <Draggable
                                    key={requestedItem}
                                    draggableId={requestedItem}
                                    index={index}
                                  >
                                    {(p, s) => (
                                      <div
                                        className="requested-item"
                                        ref={p.innerRef}
                                        {...p.draggableProps}
                                        {...p.dragHandleProps}
                                      >
                                        {requestedItem}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              <br />
                              {provided.placeholder}
                            </div>
                          </Segment>
                        )}
                      </Droppable>
                    </div>
                    <div className="allowed-items-drag-drop">
                      <Header as="h4">Allowed list</Header>
                      <Droppable droppableId="allowed">
                        {(provided, snapshot) => (
                          <Segment
                            style={{
                              backgroundColor: snapshot.isDraggingOver
                                ? "blue"
                                : "white"
                            }}
                          >
                            <div ref={provided.innerRef}>
                              {allowed.map((allowedItem, index) => {
                                return (
                                  <Draggable
                                    key={allowedItem}
                                    draggableId={allowedItem}
                                    index={index}
                                  >
                                    {(p, s) => (
                                      <div
                                        className="allowed-item"
                                        ref={p.innerRef}
                                        {...p.draggableProps}
                                        {...p.dragHandleProps}
                                      >
                                        {allowedItem}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              <br />
                              {provided.placeholder}
                            </div>
                          </Segment>
                        )}
                      </Droppable>
                    </div>
                    <div className="refused-items-drag-drop">
                      <Header as="h4">Refused list</Header>
                      <Droppable droppableId="refused">
                        {(provided, snapshot) => (
                          <Segment
                            style={{
                              backgroundColor: snapshot.isDraggingOver
                                ? "blue"
                                : "white"
                            }}
                          >
                            <div ref={provided.innerRef}>
                              {refused.map((refusedItem, index) => {
                                return (
                                  <Draggable
                                    key={refusedItem}
                                    draggableId={refusedItem}
                                    index={index}
                                  >
                                    {(p, s) => (
                                      <div
                                        className="refused-item"
                                        ref={p.innerRef}
                                        {...p.draggableProps}
                                        {...p.dragHandleProps}
                                      >
                                        {refusedItem}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              <br />
                              {provided.placeholder}
                            </div>
                          </Segment>
                        )}
                      </Droppable>
                    </div>
                  </DragDropContext>
                </Form.Group>
                <Header as="h4">New Sequence</Header>
                <Segment className="newseq">
                  <Icon
                    name={newSequence.video ? "video" : "camera"}
                    size="big"
                  />
                  <Dropzone
                    className="dropzone"
                    activeClassName="dropzone-enabled"
                    disabledClassName="dropzone-disabled"
                    accept={[
                      "application/x-tar",
                      "application/gzip",
                      "application/x-bzip2"
                    ]}
                    multiple={false}
                    maxSize={maxSize * Math.pow(2, 20)}
                    onDragEnter={this.onDragNewEnter}
                    onDragLeave={this.onDragNewLeave}
                    onDrop={this.onDropNew}
                    data-for={"dropzoneNewSequence"}
                    data-tip={
                      newSequence.video
                        ? "<p>Drop <b>a</b> video file here of MP2, MP4, TS types that has been gzipped/bzipped</p>"
                        : "<p>Drop image files here or a gzipped or bzipped set of images</p>"
                    }
                    data-html={true}
                    data-iscapture="true"
                  >
                    {newSequence.dropZoneActive && (
                      <div className="dropzone-text">Leave file here</div>
                    )}
                    {!newSequence.dropZoneActive && (
                      <div className="dropzone-text">Drag file here</div>
                    )}
                  </Dropzone>
                  {newSequence.file != null && (
                    <div>file: {newSequence.file.name}</div>
                  )}
                  <Input
                    type="text"
                    placeholder="sequence name"
                    value={newSequence.name}
                    onChange={(e, v) => {
                      this.onChangeNewSequence("name", v.value);
                    }}
                  />
                  <NumericInput
                    min={1}
                    max={10}
                    step={1}
                    precision={0}
                    value={newSequence.vSplit}
                    onChange={(v, s, i) => {
                      this.onChangeNewSequence("vSplit", v);
                    }}
                  />

                  <NumericInput
                    min={1}
                    max={10}
                    step={1}
                    value={newSequence.hSplit}
                    onChange={(v, s, i) => {
                      this.onChangeNewSequence("hSplit", v);
                    }}
                  />
                  {newSequence.newVideo && (
                    <Form.Input
                      size="small"
                      type="number"
                      label="Start seconds"
                      min={0}
                      max={360}
                      step={10}
                      defaultValue={newSequence.start}
                      onChange={(e, v) => {
                        this.onChangeNewSequence("start", parseInt(v.value));
                      }}
                    />
                  )}
                  {newSequence.newVideo && (
                    <Form.Input
                      size="small"
                      type="number"
                      label="Length to capture"
                      min={100}
                      max={900}
                      step={5}
                      defaultValue={newSequence.length}
                      onChange={(e, v) => {
                        this.onChangeNewSequence("length", parseInt(v.value));
                      }}
                    />
                  )}
                  {newSequence.newVideo && (
                    <Form.Input
                      size="small"
                      type="number"
                      label="Every n frames"
                      min="0"
                      max="10"
                      defaultValue={newSequence.everyNFrames}
                      onChange={(e, v) => {
                        this.onChangeNewSequence(
                          "everyNFrames",
                          parseInt(v.value)
                        );
                      }}
                    />
                  )}
                  <Button primary onClick={this.addNewSequence}>
                    Add
                  </Button>
                  <Button secondary onClick={this.resetNewSequence}>
                    Reset
                  </Button>
                </Segment>
                <Header as="h4">New Sequences</Header>
                {newSequences.map((seq, idx) => {
                  const vSplitArray = Array(seq.vSplit).fill(1);
                  const hSplitArray = Array(seq.hSplit).fill(1);
                  return (
                    <Segment key={`${seq.name}-new`} className="seq-segment">
                      <Icon name={seq.video ? "video" : "camera"} size="big" />
                      <div className="seq-name">{`"${seq.name}"`}</div>
                      <div className="splits">
                        <div>Sections:</div>
                        <Grid columns={seq.hSplit}>
                          {vSplitArray.map((a, i) => {
                            return (
                              <Grid.Row
                                className="splits-v"
                                key={`row-${seq.name}-${i}`}
                              >
                                {hSplitArray.map((a, j) => {
                                  return (
                                    <Grid.Column
                                      className="splits-h"
                                      key={`col-${seq.name}-${j}`}
                                    >
                                      x
                                    </Grid.Column>
                                  );
                                })}
                              </Grid.Row>
                            );
                          })}
                        </Grid>
                      </div>
                      <div className="seq-icon">
                        <Icon
                          color="red"
                          onClick={() => {
                            this.deleteNewSequence(idx);
                          }}
                          name="x"
                          data-for={"remove"}
                          data-tip="Remove this item"
                          data-iscapture="true"
                          size="large"
                        />
                      </div>
                    </Segment>
                  );
                })}
                <Header as="h4">Existing Sequences</Header>
                {sequences.map((seq, idx) => {
                  const vSplitArray = Array(seq.vSplit).fill(1);
                  const hSplitArray = Array(seq.hSplit).fill(1);
                  return (
                    <Segment
                      key={`${seq.name}-existing`}
                      className="seq-segment"
                    >
                      <Icon name={seq.video ? "video" : "camera"} size="big" />
                      <div className="seq-name">{`"${seq.name}"`}</div>
                      <div className="files">
                        {seq.numFiles ? seq.numFiles : 0} files
                      </div>
                      <div className="splits">
                        <div>Sections:</div>
                        <Grid columns={seq.hSplit}>
                          {vSplitArray.map((a, i) => {
                            return (
                              <Grid.Row
                                className="splits-v"
                                key={`row-${seq.name}-${i}`}
                              >
                                {hSplitArray.map((a, j) => {
                                  return (
                                    <Grid.Column
                                      className="splits-h"
                                      key={`col-${seq.name}-${j}`}
                                    >
                                      x
                                    </Grid.Column>
                                  );
                                })}
                              </Grid.Row>
                            );
                          })}
                        </Grid>
                      </div>
                      <div className="seq-icon">
                        <Icon
                          color="red"
                          onClick={() => {
                            this.deleteSequence(idx);
                          }}
                          name="x"
                          data-for={"remove"}
                          data-tip="Remove this item"
                          data-iscapture="true"
                          size="large"
                        />
                      </div>
                    </Segment>
                  );
                })}
                <Header as="h4">Deleting Sequences</Header>
                {deletedSequences.map((seq, idx) => {
                  const vSplitArray = Array(seq.vSplit).fill(1);
                  const hSplitArray = Array(seq.hSplit).fill(1);
                  return (
                    <Segment
                      key={`${seq.name}-existing`}
                      className="seq-segment"
                    >
                      <Icon name={seq.video ? "video" : "camera"} size="big" />
                      <div className="seq-name">{`"${seq.name}"`}</div>
                      <div className="files">
                        {seq.numFiles ? seq.numFiles : 0} files
                      </div>
                      <div className="splits">
                        <div>Sections:</div>
                        <Grid columns={seq.hSplit}>
                          {vSplitArray.map((a, i) => {
                            return (
                              <Grid.Row
                                className="splits-v"
                                key={`row-${seq.name}-${i}`}
                              >
                                {hSplitArray.map((a, j) => {
                                  return (
                                    <Grid.Column
                                      className="splits-h"
                                      key={`col-${seq.name}-${j}`}
                                    >
                                      x
                                    </Grid.Column>
                                  );
                                })}
                              </Grid.Row>
                            );
                          })}
                        </Grid>
                      </div>
                      <div className="seq-icon">
                        <Icon
                          color="red"
                          onClick={() => {
                            this.undeleteSequence(idx);
                          }}
                          name="undo"
                          data-for={"undo"}
                          data-tip="undo remove this item"
                          data-iscapture="true"
                          size="large"
                        />
                      </div>
                    </Segment>
                  );
                })}
                <ReactTooltip id="description" place="bottom" type="dark" />
                <ReactTooltip id="fullDescription" place="bottom" type="dark" />
                <ReactTooltip
                  id="dropzoneSequence"
                  html={true}
                  place="bottom"
                  type="dark"
                />
                <ReactTooltip
                  id="dropzoneNewSequence"
                  html={true}
                  place="bottom"
                  type="dark"
                />
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
