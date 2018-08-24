import React, { Component } from "react";
import "./ProjectsComponent.scss";
import { withFormik } from "formik";
import {
  Card,
  Modal,
  Button,
  Form,
  Grid,
  GridRow,
  Header,
  Icon,
  Image,
  Input,
  Dropdown,
  Checkbox,
  TextArea,
  Segment
} from "semantic-ui-react";
import ReactTooltip from "react-tooltip";
import science from "../assets/science.svg";
import civic from "../assets/civic.svg";
import Dropzone from "react-dropzone";
import { SketchPicker } from "react-color";
import { Object } from "core-js";

const RequestAccessForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Form onSubmit={handleSubmit}>
    <Grid textAlign="center">
      <GridRow style={{ width: "100%" }}>
        <Icon name="registered" size="huge" />
      </GridRow>
      <GridRow style={{ width: "100%" }}>
        {window.innerWidth < 500 && (
          <Input
            className="signup-input"
            type="text"
            name="requested_project"
            placeholder="requested project"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.requested_project}
          />
        )}
        {window.innerWidth >= 500 && (
          <Input
            label="Requested Project"
            className="signup-input"
            type="text"
            name="requested_project"
            placeholder="requested project"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.requested_project}
          />
        )}
      </GridRow>
      {touched.requested_project &&
        errors.requested_project && (
          <GridRow>
            <div className="error-label">{errors.requested_project}</div>
          </GridRow>
        )}
      <GridRow style={{ width: "100%" }}>
        <Button
          className="group-submit"
          type="submit"
          primary
          disabled={isSubmitting}
        >
          Request Access
        </Button>
      </GridRow>
    </Grid>
  </Form>
);
const FormikRequestAccessForm = withFormik({
  // Transform outer props into form values
  mapPropsToValues: props => ({ requested_project: "" }),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {};
    if (!values.requested_project) {
      errors.requested_project = "Required";
    }
    return errors;
  },
  handleSubmit: (values, props) => {
    props.props.handleSubmit(values.requested_project);
  }
})(RequestAccessForm);

class ProjectsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalContent: null,
      filter: "",
      cardsToDisplay: {
        owned: [],
        allowed: [],
        refused: [],
        requested: [],
        other: []
      },
      public: null,
      type: null,
      statuses: {},
      currentItem: null,
      itemOwner: null,
      itemPublic: null,
      itemDescription: null,
      itemFullDescription: null,
      ownerError: null,
      project_for_update: null,
      sequences: {},
      files: [],
      dropZoneActive: false,
      newSequenceName: "",
      labels: {},
      showLabelSelection: false,
      colorWheel: null
    };
    this.filterUpdate = this.filterUpdate.bind(this);
    this.join = this.join.bind(this);
    this.maximize = this.maximize.bind(this);
    this.settings = this.settings.bind(this);
    this.requestAccess = this.requestAccess.bind(this);
    this.showModal = this.showModal.bind(this);
    this.changeProject = this.changeProject.bind(this);
    this.changeDropdown = this.changeDropdown.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeProjectInfo = this.changeProjectInfo.bind(this);
    this.changeText = this.changeText.bind(this);
    this.changeCheckbox = this.changeCheckbox.bind(this);
    this.changeOwner = this.changeOwner.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.resetFormFromProps = this.resetFormFromProps.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDropNew = this.onDropNew.bind(this);
    this.onDragNewEnter = this.onDragNewEnter.bind(this);
    this.onDragNewLeave = this.onDragNewLeave.bind(this);
    this.changeSequenceName = this.changeSequenceName.bind(this);
    this.changeNewSequenceName = this.changeNewSequenceName.bind(this);
    this.deleteSequence = this.deleteSequence.bind(this);
    this.addNewSequence = this.addNewSequence.bind(this);
    this.resetNewSequence = this.resetNewSequence.bind(this);
    this.showLabels = this.showLabels.bind(this);
    this.hideLabels = this.hideLabels.bind(this);
    this.showColorWheel = this.showColorWheel.bind(this);
    this.hideColorWheel = this.hideColorWheel.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.saveLabels = this.saveLabels.bind(this);
    this.addLabel = this.addLabel.bind(this);
    this.notProcessingLabels = this.notProcessingLabels.bind(this);
  }

  onDrop(newFiles, key, video) {
    let i = 0;
    if (!video) {
      for (let file of newFiles) {
        if (["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
          this.state.sequences[key].files.push(file);
          i += 1;
        }
      }
    }
    this.state.sequences[key].active = false;
    if (i !== 0) {
      this.state.sequences[key].updated = true;
    }
    this.forceUpdate();
  }

  onDropNew(newFiles, video) {
    if (
      video &&
      this.state.files.length < 1 &&
      newFiles.length === 1 &&
      newFiles[0].size / Math.pow(2, 20) < 25.0
    ) {
      this.setState({ files: newFiles, dropZoneActive: false });
    } else if (video) {
      alert(
        "Can only store one video file per sequence and that file has a maximum size of 25MB (2^20 Bytes=1MB). To request more space, email eli.j.selkin@gmail.com"
      );
    } else if (!video) {
      let files = this.state.files;
      files = files.concat(newFiles);
      this.setState({ files, dropZoneActive: false });
    }
  }
  onDragNewEnter(evt) {
    this.setState({ dropZoneActive: true });
  }
  onDragNewLeave(evt) {
    this.setState({ dropZoneActive: false });
  }
  onDragEnter(key) {
    let sequences = this.state.sequences;
    sequences[key].active = true;
    this.setState({ sequences });
  }
  onDragLeave(key) {
    let sequences = this.state.sequences;
    sequences[key].active = false;
    this.setState({ sequences });
  }
  addNewSequence(evt) {
    evt.preventDefault();
    if (this.state.files.length == 0 || this.state.newSequenceName === "") {
      return;
    }
    if (this.state.newSequenceName in this.state.sequences) {
      return;
    }
    this.state.sequences[this.state.newSequenceName] = {
      name: this.state.newSequenceName,
      active: false,
      files: this.state.files.slice(0),
      video: this.props.types[this.state.itemType].video,
      deleted: false,
      files_length: 0,
      new: true
    };
    this.setState({ files: [], newSequenceName: "" });
  }
  resetNewSequence(evt) {
    evt.preventDefault();
    // no memory leaks
    this.state.files.forEach(file => {
      window.URL.revokeObjectURL(file.preview);
    });
    this.setState({ files: [], newSequenceName: "" });
  }
  showModal(evt) {
    Object.keys(this.state.sequences).forEach(key => {
      this.state.sequences[key].files.forEach(file => {
        window.URL.revokeObjectURL(file.preview);
      });
    });

    this.setState({
      modalContent: null,
      allowed: null,
      refused: null,
      requested: null,
      owner: null,
      public: null,
      type: null,
      files: [],
      sequences: {},
      dropZoneActive: false,
      newSequenceName: ""
    });
  }
  statusDropdownOptions = [
    {
      label: { color: "blue", empty: true, circular: true },
      value: "Requested",
      text: "Requested"
    },
    {
      label: { color: "green", empty: true, circular: true },
      value: "Allowed",
      text: "Allowed"
    },
    {
      label: { color: "red", empty: true, circular: true },
      value: "Refused",
      text: "Refused"
    }
  ];

  requestedDict = {};
  allowedDict = {};
  refusedDict = {};
  settings(project_id) {
    this.requestedDict = {};
    this.allowedDict = {};
    this.refusedDict = {};
    Object.keys(this.state.sequences).forEach(key => {
      this.state.sequences[key].files.forEach(file => {
        window.URL.revokeObjectURL(file.preview);
      });
    });
    this.setState({
      project_for_update: project_id,
      currentItem: null,
      statuses: {},
      sequences: {},
      files: [],
      dropZoneActive: false,
      newSequenceName: ""
    });
    this.props.getProjectForUpdate(project_id);
  }
  changeProject(project_id) {
    this.props.changeProject(project_id);
    this.setState({labels: []});
  }
  changeSequenceName(key, value) {
    let sequences = this.state.sequences;
    sequences[key].name = value;
    sequences[key].updated = true;
    this.setState({ sequences });
  }
  changeNewSequenceName(value) {
    this.setState({ newSequenceName: value.value });
  }
  deleteSequence(key) {
    this.state.sequences[key].files.forEach(file => {
      window.URL.revokeObjectURL(file.preview);
    });
    this.state.sequences[key].deleted = true;
    this.forceUpdate();
  }
  changeProjectInfo(form) {
    this.setState({ ownerError: null });
    let allowed = Object.keys(this.allowedDict);
    let refused = Object.keys(this.refusedDict);
    let requested = Object.keys(this.requestedDict);
    const {
      itemPublic,
      itemOwner,
      itemDescription,
      itemFullDescription,
      itemType,
      sequences
    } = this.state;
    if (!allowed.includes(itemOwner)) {
      this.setState({ ownerError: "Owner must be in allowed list" });
      return;
    }
    this.props.updateProject(
      this.state.currentItem.id,
      allowed,
      refused,
      requested,
      itemPublic,
      itemOwner,
      itemDescription,
      itemFullDescription,
      itemType,
      sequences
    );
    this.closeForm();
  }
  closeForm() {
    this.props.getProjectForUpdate(null);
    this.setState({ currentItem: null, just_received_project: null });
    this.showModal();
  }
  resetForm(evt) {
    Object.keys(this.state.sequences).forEach(key => {
      this.state.sequences[key].files.forEach(file => {
        window.URL.revokeObjectURL(file.preview);
      });
    });
    this.setState({
      currentItem: null,
      allowed: null,
      refused: null,
      requested: null,
      owner: null,
      public: null,
      type: null,
      just_received_project: null,
      sequences: {}
    });
    this.resetFormFromProps(this.props);
  }
  changeText(type, val) {
    if (type === "full") {
      this.setState({ itemFullDescription: val.value });
    } else if (type === "short") {
      this.setState({ itemDescription: val.value });
    } else if (type === "owner") {
      this.setState({ itemOwner: val.value });
    }
  }
  downloadJSON(id) {
    this.props.getProjectAnnotations(id, "json");
  }
  downloadXML(id) {
    this.props.getProjectAnnotations(id, "xml");
  }
  componentDidMount() {
    this.props.getLabels();
  }
  addLabel() {
    let { labels } = this.state;
    let i = 0;
    while (Object.keys(labels).includes(`${i}`)) {
      i += 1;
    }
    labels[i] = { type: "", description: "", r: 0, g: 0, b: 0, a: 1 };
    this.setState({ labels });
  }

  notProcessingLabels() {
    this.setState({ isProcessingLabels: false });
  }
  saveLabels() {
    let newDictionary = {};
    Object.keys(this.state.labels).forEach(label => {
      // limit to one per type name
      newDictionary[label.type] = this.state.labels[label];
    });
    let labelsArray = Object.keys(newDictionary).map(label => {
      return newDictionary[label];
    });
    this.props.addLabels(labelsArray, this.notProcessingLabels);
  }
  showColorWheel(key) {
    this.setState({
      colorWheel: (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(150,150,150,0.5)",
            zIndex: 99
          }}
        >
          <div
            style={{
              position: "absolute",
              zIndex: 100,
              backgroundColor: "white"
            }}
          >
            <SketchPicker
              onChangeComplete={color => {
                this.selectColor(key, color);
              }}
            />
            <Button onClick={this.hideColorWheel} secondary>
              {"Close color picker"}
            </Button>
          </div>
        </div>
      )
    });
  }
  hideColorWheel(evt) {
    evt.preventDefault();
    evt.bubbles = false;
    this.state.colorWheel = null;
    this.setState({ colorWheel: null, isProcessingLabels: true });
  }
  selectColor(key, color) {
    let labels = this.state.labels;
    labels[key].r = color.rgb.r;
    labels[key].g = color.rgb.g;
    labels[key].b = color.rgb.b;
    labels[key].a = color.rgb.a;
    this.setState({ labels });
  }
  showLabels(project_id) {
    this.setState({labels: []});
    this.props.changeProject(project_id);
    this.setState({showLabelSelection:true});
  }
  hideLabels() {
    this.setState({ showLabelSelection: false });
    this.props.getLabels();
  }
  changeOwner(val) {
    this.setState({ itemOwner: val.value });
  }
  changeCheckbox(val) {
    this.setState({ itemPublic: val.checked });
  }
  changeType(newType, oldType) {
    this.state.files.forEach(file => {
      window.URL.revokeObjectURL(file.preview);
    });
    this.setState({
      itemType: newType,
      files: [],
      newSequenceName: "",
      dropZoneActive: false
    });
  }
  changeDropdown(newStatus, key, status) {
    // Status is original status, newStatus is new status
    let statuses = this.state.statuses;
    if (key === this.props.username) {
      return; // cannot change status of owner
    }
    statuses[key] = newStatus;

    switch (status) {
      case "Requested":
        switch (newStatus) {
          case "Refused":
            this.refusedDict[key] = true;
            delete this.requestedDict[key];
            break;
          case "Allowed":
            this.allowedDict[key] = true;
            delete this.requestedDict[key];
            break;
        }
        break;
      case "Refused":
        switch (newStatus) {
          case "Requested":
            this.requestedDict[key] = true;
            delete this.refusedDict[key];
            break;
          case "Allowed":
            this.allowedDict[key] = true;
            delete this.refusedDict[key];
            break;
        }
        break;
      case "Allowed":
        switch (newStatus) {
          case "Refused":
            this.refusedDict[key] = true;
            delete this.allowedDict[key];
            break;
          case "Requested":
            this.requestedDict[key] = true;
            delete this.allowedDict[key];
            break;
        }
        break;
    }
    this.setState({ statuses });
  }
  resetFormFromProps(newProps) {
    if (newProps.projectForUpdate && this.state.project_for_update) {
      let idx;
      let i = 0;

      for (let ownedProject of newProps.owned) {
        if (ownedProject.id === this.state.project_for_update) {
          idx = i;
          break;
        }
        i += 1;
      }
      let currentItem = newProps.owned[idx];
      if (newProps.projectForUpdate.public) {
        this.state.itemPublic = true;
      } else {
        this.state.itemPublic = false;
      }
      this.state.itemOwner = newProps.username;
      this.state.itemDescription = currentItem.description;
      this.state.itemFullDescription = currentItem.full_description;
      this.state.itemType = currentItem.type;
      let sequences = {};
      newProps.projectForUpdate.sequencenames.forEach(seq => {
        sequences[seq.name] = {
          name: seq.name,
          active: false,
          files: [],
          video: seq.video,
          files_length: seq.files,
          deleted: false,
          new: false,
          updated: false
        };
      });

      // populate the Objects
      newProps.projectForUpdate.requested.map(person => {
        this.state.statuses[person.username] = "Requested";
        this.requestedDict[person.username] = true;
      });
      newProps.projectForUpdate.allowed.map(person => {
        this.state.statuses[person.username] = "Allowed";
        this.allowedDict[person.username] = true;
      });
      newProps.projectForUpdate.refused.map(person => {
        this.state.statuses[person.username] = "Refused";
        this.refusedDict[person.username] = true;
      });

      //
      this.setState({ currentItem, just_received_project: true, sequences });
    }
  }
  componentWillUnmount() {
    this.state = {
      modalContent: null,
      filter: "",
      cardsToDisplay: {
        owned: [],
        allowed: [],
        refused: [],
        requested: [],
        other: []
      },
      public: null,
      type: null,
      statuses: {},
      currentItem: null,
      itemOwner: null,
      itemPublic: null,
      itemDescription: null,
      itemFullDescription: null,
      ownerError: null,
      project_for_update: null,
      just_received_project: null
    };
  }
  componentWillReceiveProps(newProps) {
    this.filterUpdateHelper("", newProps);
    if (this.state.just_received_project == null) {
      this.resetFormFromProps(newProps);
    }
    console.log("KEYS:", Object.keys(this.state.labels), newProps);
    if (Object.keys(this.state.labels).length === 0) {
      console.log(this.state.labels);
      this.setState({ labels: newProps.labels });
    }
    console.log("NOW KEYS:", Object.keys(this.state.labels));
    
  }

  requestAccess(evt) {
    if (this.props.logged_in) {
      this.setState({
        modalContent: (
          <Modal
            size="small"
            closeIcon
            defaultOpen={true}
            onClose={this.showModal}
          >
            <Modal.Header>Request Access</Modal.Header>
            <Modal.Content scrolling>
              <Modal.Description className="request-access">
                <FormikRequestAccessForm
                  handleSubmit={this.props.requestAccessToProject}
                />
                <Form>
                  <Grid textAlign="center">
                    <GridRow style={{ width: "100%" }}>
                      <Button
                        className="group-submit"
                        type="cancel"
                        secondary
                        onClick={this.showModal}
                      >
                        Cancel
                      </Button>
                    </GridRow>
                  </Grid>
                </Form>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        )
      });
    } else {
      this.props.history.push("/login");
    }
  }

  join(type, project_id) {
    if (this.props.logged_in) {
      this.props.joinProject(project_id);
    }
  }

  leave(type, project_id) {
    if (this.props.logged_in) {
      this.props.leaveProject(project_id);
    }
  }

  maximize(type, project) {
    console.log("MAX:", type, project);
  }

  filterUpdate(evt) {
    this.filterUpdateHelper(evt.currentTarget.value, this.props);
  }
  filterUpdateHelper(filter, props) {
    let types = ["owned", "allowed", "requested", "refused", "other"];

    let cardsToDisplay = {
      owned: [],
      allowed: [],
      requested: [],
      refused: [],
      other: []
    };
    for (let type of types) {
      cardsToDisplay[type] = props[type].map(card => {
        if (
          RegExp(filter, "i").test(card.title) ||
          RegExp(filter, "i").test(card.description) ||
          RegExp(filter, "i").test(card.full_description)
        ) {
          return (
            <Card
              key={`${type}-${card.id}`}
              color={card.current_project ? "blue" : "yellow"}
            >
              <div className="type-holder">
                {this.getImage(card.type, "large")}
                <div className="card-attributes">
                  {card.current_project && (
                    <div className="public_type">
                      <div className="icon-film">
                        <p
                          data-for={`current-${card.id}`}
                          data-tip="current project"
                          data-iscapture="true"
                        >
                          <Icon
                            name="bookmark"
                            size="big"
                            className="icon-film"
                          />
                        </p>
                        <ReactTooltip
                          id={`current-${card.id}`}
                          place="right"
                          type="dark"
                        />
                      </div>
                    </div>
                  )}
                  {card.requested && (
                    <div className="public_type">
                      <div className="icon-film">
                        <br />
                        <p
                          data-for={`requested-${card.id}`}
                          data-tip="requested access"
                          data-iscapture="true"
                        >
                          <Icon
                            name="registered"
                            size="big"
                            className="icon-film"
                          />
                        </p>
                        <ReactTooltip
                          id={`requested-${card.id}`}
                          place="right"
                          type="dark"
                        />
                      </div>
                    </div>
                  )}
                  {card.public && (
                    <div className="public_type">
                      {props.types[card.type] &&
                        props.types[card.type].video && (
                          <div className="icon-film">
                            <p
                              data-for={`video-${card.id}`}
                              data-tip="video"
                              data-iscapture="true"
                            >
                              <Icon
                                name="film"
                                size="big"
                                className="icon-film"
                              />
                            </p>
                            <ReactTooltip
                              id={`video-${card.id}`}
                              place="right"
                              type="dark"
                            />
                          </div>
                        )}
                      <div className="icon-lock">
                        <p
                          data-for={`public-${card.id}`}
                          data-tip="public"
                          data-iscapture="true"
                        >
                          <Icon name="unlock alternate" size="big" />
                        </p>
                        <ReactTooltip
                          id={`public-${card.id}`}
                          place="right"
                          type="dark"
                        />
                      </div>
                    </div>
                  )}
                  {!card.public && (
                    <div className="public_type">
                      {props.types[card.type] &&
                        props.types[card.type].video && (
                          <div className="icon-film">
                            <p
                              data-for={`video-${card.id}`}
                              data-tip="video"
                              data-iscapture="true"
                            >
                              <Icon
                                name="film"
                                size="big"
                                className="icon-film"
                              />
                            </p>
                            <ReactTooltip
                              id={`video-${card.id}`}
                              place="right"
                              type="dark"
                            />
                          </div>
                        )}
                      <div className="icon-lock">
                        <p
                          data-for={`private-${card.id}`}
                          data-tip="private"
                          data-iscapture="true"
                        >
                          <Icon name="lock" size="big" className="icon-lock" />
                        </p>
                        <ReactTooltip
                          id={`private-${card.id}`}
                          place="right"
                          type="dark"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Card.Content className="home-content">
                <Card.Header>{card.title}</Card.Header>
                <Card.Description>{card.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a
                  data-for={`maximize-${card.id}`}
                  data-tip="more"
                  data-iscapture="true"
                  onClick={evt => {
                    this.maximize(type, card.id);
                  }}
                  className="icon-link"
                >
                  <Icon name="window maximize" size="large" fitted />
                  <ReactTooltip
                    id={`maximize-${card.id}`}
                    place="bottom"
                    type="dark"
                  />
                </a>
                {card.id !== props.current_project && (
                  <a
                    data-for={`change-${card.id}`}
                    data-tip="change to this project"
                    data-iscapture="true"
                    onClick={evt => {
                      this.changeProject(card.id);
                    }}
                    className="icon-link"
                  >
                    <Icon name="retweet" size="large" fitted />
                    <ReactTooltip
                      id={`change-${card.id}`}
                      place="bottom"
                      type="dark"
                    />
                  </a>
                )}
                {type === "owned" && (
                  <a
                    data-for={`settings-${card.id}`}
                    data-tip="settings"
                    data-iscapture="true"
                    onClick={evt => {
                      this.settings(card.id);
                    }}
                    className="icon-link"
                  >
                    <Icon name="setting" size="large" fitted />
                    <ReactTooltip
                      id={`settings-${card.id}`}
                      place="bottom"
                      type="dark"
                    />
                  </a>
                )}
                {type === "owned" && card.current_project && (
                  <a
                    data-for={`labels-${card.id}`}
                    data-tip="labels"
                    data-iscapture="true"
                    onClick={evt => {
                      this.showLabels(card.id);
                    }}
                    className="icon-link"
                  >
                    <Icon name="tags" size="large" fitted />
                    <ReactTooltip
                      id={`labels-${card.id}`}
                      place="bottom"
                      type="dark"
                    />
                  </a>
                )}
                {(type === "owned" || card.public) && card.current_project && (
                  <a
                    data-for={`dljson-${card.id}`}
                    data-tip="download JSON"
                    data-iscapture="true"
                    onClick={evt => {
                      this.downloadJSON(card.id);
                    }}
                    className="icon-link"
                  >
                    <Icon name="cloud download" size="big" fitted />
                    <ReactTooltip
                      id={`dljson-${card.id}`}
                      place="bottom"
                      type="dark"
                    />
                  </a>
                )}
                {(type === "owned" || card.public) && card.current_project && (
                  <a
                    data-for={`dlxml-${card.id}`}
                    data-tip="download XML"
                    data-iscapture="true"
                    onClick={evt => {
                      this.downloadXML(card.id);
                    }}
                    className="icon-link"
                  >
                    <Icon name="download" size="large" fitted />
                    <ReactTooltip
                      id={`dlxml-${card.id}`}
                      place="bottom"
                      type="dark"
                    />
                  </a>
                )}

                {card.joined && (
                  <a
                    data-for={`leave-${card.id}`}
                    data-tip="leave this project"
                    data-iscapture="true"
                    onClick={evt => {
                      this.leave(type, card.id);
                    }}
                    className="icon-link"
                  >
                    <Icon name="unlinkify" size="large" fitted />
                    <ReactTooltip
                      id={`leave-${card.id}`}
                      place="bottom"
                      type="dark"
                    />
                  </a>
                )}
                {!card.joined && (
                  <a
                    data-for={`join-${card.id}`}
                    data-tip="join this project"
                    data-iscapture="true"
                    onClick={evt => {
                      this.join(type, card.id);
                    }}
                    className="icon-link"
                  >
                    <Icon name="linkify" size="large" fitted />
                    <ReactTooltip
                      id={`join-${card.id}`}
                      place="bottom"
                      type="dark"
                    />
                  </a>
                )}
              </Card.Content>
            </Card>
          );
        }
      });
    }
    this.setState({ cardsToDisplay, filter });
  }
  getImage(project_type, size) {
    if (this.props.types[project_type]) {
      switch (this.props.types[project_type].name) {
        case "science":
        case "science_videos":
          if (size === "small") {
            return science;
          }
          return (
            <div className="project_type">
              <Image src={science} className="project_type_base" />
            </div>
          );
        case "civic":
        case "civic_videos":
          if (size === "small") {
            return civic;
          }
          return (
            <div className="project_type">
              <Image src={civic} className="project_type_base" />
            </div>
          );
        default:
          if (size === "small") {
            return science;
          }
          return (
            <div className="project_type">
              <Image src={science} className="project_type_base" />
            </div>
          );
      }
    }
  }
  updateLabel(type, key, value) {
    let { labels } = this.state;
    labels[key][type] = value;
    this.setState({ labels });
  }

  render() {
    const { activeIndex } = this.state;
    const itemTypes = Object.keys(this.props.types).map(key => {
      return {
        image: { avatar: true, src: this.getImage(key, "small") },
        value: key,
        text: this.props.types[key].name
      };
    });
    let { labels } = this.state;
    return (
      <div className="projects-holder">
        <div className="projects">
          {this.state.modalContent}
          <Modal
            size="large"
            closeIcon
            open={this.state.showLabelSelection}
            onClose={this.hideLabels}
          >
            <Modal.Header>Update Labels</Modal.Header>
            <Modal.Content>
              {this.state.colorWheel}
              <Button
                className="save-labels"
                onClick={this.saveLabels}
                color={"green"}
                style={{ marginBottom: 20 }}
              >
                Save labels
              </Button>
              <Button icon className="add-label" onClick={this.addLabel}>
                <Icon name="plus" />New label
              </Button>
              <br />
              <Grid doubling stackable columns={16}>
                {Object.keys(this.state.labels).map(key => {
                  let label = this.state.labels[key];
                  return (
                    <Segment className="label-segment" key={key}>
                      <Grid.Row className="label-row">
                        <Grid.Column>
                          <Input
                            style={{ width: "100%" }}
                            value={label.type}
                            onChange={(_, v) => {
                              labels = this.updateLabel("type", key, v.value);
                            }}
                          />
                        </Grid.Column>
                        <Grid.Column>
                          <Input
                            value={label.description}
                            style={{ width: "100%" }}
                            onChange={(_, v) => {
                              labels = this.updateLabel(
                                "description",
                                key,
                                v.value
                              );
                            }}
                          />
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row className="label-row">
                        <Grid.Column>Annotation color:</Grid.Column>
                        <Grid.Column>
                          <div
                            className="label-color-display"
                            style={{
                              backgroundColor: `rgba(${label.r},${label.g},${
                                label.b
                              },${label.a})`,
                              border: "1px solid black",
                              borderRadius: "5px",
                              width: "100%"
                            }}
                            onClick={() => {
                              this.showColorWheel(key);
                            }}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </Segment>
                  );
                })}
              </Grid>
            </Modal.Content>
          </Modal>
          {this.state.currentItem && (
            <Modal
              size="large"
              closeIcon
              defaultOpen={true}
              onClose={this.closeForm}
            >
              <Modal.Header>{this.state.currentItem.title}</Modal.Header>
              <Modal.Content image>
                <Modal.Description className="request-access">
                  <Form onSubmit={this.changeProjectInfo}>
                    <Input
                      label="Owner"
                      placeholder="Owner"
                      className="group-input"
                      value={this.state.itemOwner}
                      onChange={(field, val) => {
                        this.changeText("owner", val);
                      }}
                    />
                    <Dropdown
                      fluid
                      selection
                      button
                      options={itemTypes}
                      defaultValue={JSON.stringify(this.state.itemType)}
                      className="group-dropdown"
                      onChange={(field, val) => {
                        this.changeType(parseInt(val.value));
                      }}
                    />
                    {this.state.ownerError && (
                      <div className="label-error">
                        {this.state.ownerError}{" "}
                      </div>
                    )}
                    <TextArea
                      autoHeight
                      className="modal-textarea"
                      onChange={(field, value) => {
                        this.changeText("short", value);
                      }}
                      defaultValue={this.state.itemDescription}
                    />
                    <br />
                    <TextArea
                      autoHeight
                      className="modal-textarea"
                      onChange={(field, value) => {
                        this.changeText("full", value);
                      }}
                      defaultValue={this.state.itemFullDescription}
                    />
                    <br />
                    <Checkbox
                      toggle
                      fitted
                      label={this.state.itemPublic ? "Public" : "Private"}
                      className="modal-checkbox"
                      checked={this.state.itemPublic}
                      onChange={(field, val) => {
                        this.changeCheckbox(val);
                      }}
                    />
                    <br />
                    <div className="dropdowns">
                      <div className="requested">
                        <div className="dropdown-title">Requested</div>
                        {Object.keys(this.requestedDict).map(key => {
                          return (
                            <div className="dropdown-holder" key={key}>
                              <div className="label-dropdown">{key}</div>
                              <div className="dropdown">
                                <Dropdown
                                  floating
                                  labeled
                                  button
                                  options={this.statusDropdownOptions}
                                  defaultValue={this.state.statuses[key]}
                                  text={this.state.statuses[key]}
                                  onChange={(field, val) => {
                                    this.changeDropdown(
                                      val.value,
                                      key,
                                      "Requested"
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="refused">
                        <div className="dropdown-title">Refused</div>
                        {Object.keys(this.refusedDict).map(key => {
                          return (
                            <div className="dropdown-holder" key={key}>
                              <div className="label-dropdown">{key}</div>
                              <div className="dropdown">
                                <Dropdown
                                  floating
                                  labeled
                                  button
                                  defaultValue={this.state.statuses[key]}
                                  options={this.statusDropdownOptions}
                                  text={this.state.statuses[key]}
                                  onChange={(field, val) => {
                                    this.changeDropdown(
                                      val.value,
                                      key,
                                      "Refused"
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="allowed">
                        <div className="dropdown-title">Allowed</div>
                        {Object.keys(this.allowedDict).map(key => {
                          return (
                            <div className="dropdown-holder" key={key}>
                              <div className="label-dropdown">{key}</div>
                              <div className="dropdown">
                                <Dropdown
                                  floating
                                  labeled
                                  button
                                  defaultValue={this.state.statuses[key]}
                                  text={this.state.statuses[key]}
                                  options={this.statusDropdownOptions}
                                  onChange={(field, val) => {
                                    this.changeDropdown(
                                      val.value,
                                      key,
                                      "Allowed"
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <Header as="h3">Add New sequence</Header>
                    {((this.props.types[this.state.itemType].video &&
                      this.state.files.length < 1) ||
                      !this.props.types[this.state.itemType].video) && (
                      <Segment className="dropzone-new-text">
                        <Dropzone
                          disableClick
                          accept={
                            this.props.types[this.state.itemType].video
                              ? "video/mpeg, video/mp4, video/MP2T, video/mpeg4, application/x-gzip, application/gzip, application/bzip2, application/x-bzip2, application/bz2, application/x-bz2"
                              : "image/jpeg, image/jpg, image/png, application/x-gzip, application/gzip, application/bzip2, application/x-bzip2"
                          }
                          disabled={
                            Object.keys(this.state.sequences).filter(key => {
                              return !this.state.sequences[key].deleted;
                            }).length >= 24
                          }
                          className="dropzone-new-box"
                          onDrop={files => {
                            this.onDropNew(
                              files,
                              this.props.types[this.state.itemType].video
                            );
                          }}
                          onDragEnter={this.onDragNewEnter}
                          onDragLeave={this.onDragNewLeave}
                        >
                          <div className="dropzone-new-message">
                            {!this.state.dropZoneActive &&
                              this.props.types[this.state.itemType].video &&
                              "Drop a single video file here (mpg, ts, mp4)"}
                            {!this.state.dropZoneActive &&
                              !this.props.types[this.state.itemType].video &&
                              "Drop multiple image files here (png, jpg)"}
                            {this.state.dropZoneActive &&
                              "Feel free to leave those files here!"}
                          </div>
                        </Dropzone>
                        <Segment className="dropzone-new-files">{`${
                          this.state.files.length
                        } files`}</Segment>
                      </Segment>
                    )}
                    {this.props.types[this.state.itemType].video &&
                      this.state.files.length >= 1 && (
                        <Segment>File stored</Segment>
                      )}
                    <Input
                      placeholder="New sequence name"
                      value={this.state.newSequenceName}
                      onChange={(field, value) => {
                        this.changeNewSequenceName(value);
                      }}
                    />
                    <Button
                      className="group-submit"
                      onClick={this.addNewSequence}
                      disabled={
                        Object.keys(this.state.sequences).filter(key => {
                          return !this.state.sequences[key].deleted;
                        }).length >= 24 ||
                        (this.props.types[this.state.itemType].video &&
                          this.state.files.length > 1)
                      }
                      color="orange"
                    >
                      add new sequence
                    </Button>
                    <Button
                      className="group-submit"
                      onClick={this.resetNewSequence}
                    >
                      reset new sequence
                    </Button>
                    <Header as="h3">Sequences (max: 24)</Header>
                    <Grid className="files-grid" columns={16}>
                      {Object.keys(this.state.sequences).map(seqKey => {
                        if (!this.state.sequences[seqKey].deleted) {
                          return (
                            <GridRow key={`${seqKey}`} columns={16}>
                              <Grid.Column width={1}>
                                {!this.state.sequences[seqKey].video ? (
                                  <Icon
                                    name="image"
                                    color="blue"
                                    size="large"
                                  />
                                ) : (
                                  <Icon
                                    name="video"
                                    color="blue"
                                    size="large"
                                  />
                                )}
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Segment className="dropzone-text">
                                  <Dropzone
                                    disableClick
                                    accept="image/jpeg, image/jpg, image/png"
                                    disabled={
                                      this.state.sequences[seqKey].video
                                    }
                                    className="dropzone-box"
                                    onDrop={files => {
                                      this.onDrop(
                                        files,
                                        seqKey,
                                        this.state.sequences[seqKey].video
                                      );
                                    }}
                                    onDragEnter={evt =>
                                      this.onDragEnter(seqKey)
                                    }
                                    onDragLeave={evt =>
                                      this.onDragLeave(seqKey)
                                    }
                                  >
                                    <div className="dropzone-message">
                                      {this.state.sequences[seqKey].video &&
                                        "To add files to a video sequence, change the sequence to photo type and then add images. Or you can delete this sequence and then add a new video instead."}
                                      {!this.state.sequences[seqKey].active &&
                                        !this.state.sequences[seqKey].video &&
                                        "Drag and drop image (jpg, png) files here."}
                                      {this.state.sequences[seqKey].active &&
                                        !this.state.sequences[seqKey].video &&
                                        "Leave those images here."}
                                    </div>
                                  </Dropzone>
                                  <Segment className="dropzone-files">{`${this
                                    .state.sequences[seqKey].files_length +
                                    this.state.sequences[seqKey].files
                                      .length} file${
                                    this.state.sequences[seqKey].files_length +
                                      this.state.sequences[seqKey].files
                                        .length >
                                    1
                                      ? "s"
                                      : ""
                                  }`}</Segment>
                                </Segment>
                              </Grid.Column>
                              <Grid.Column width={8}>
                                <Input
                                  type="text"
                                  className="signup-input"
                                  value={this.state.sequences[seqKey].name}
                                  onChange={(field, value) => {
                                    this.changeSequenceName(
                                      seqKey,
                                      value.value
                                    );
                                  }}
                                />
                              </Grid.Column>
                              <Grid.Column width={1}>
                                <a
                                  onClick={() => {
                                    this.deleteSequence(seqKey);
                                  }}
                                >
                                  <Icon name="delete" />
                                </a>
                              </Grid.Column>
                            </GridRow>
                          );
                        }
                      })}
                    </Grid>
                    <br />
                    <Button className="group-submit" type="submit" primary>
                      Submit
                    </Button>
                    <Button
                      className="group-submit"
                      type="reset"
                      onClick={() => {
                        this.resetForm();
                      }}
                      color="teal"
                    >
                      Reset
                    </Button>
                    <Button
                      className="group-submit"
                      type="cancel"
                      secondary
                      onClick={this.closeForm}
                    >
                      Cancel
                    </Button>
                  </Form>
                  <div className="spacer" />
                </Modal.Description>
              </Modal.Content>
            </Modal>
          )}
          <Input
            label="Filter projects:"
            type="text"
            className="filter-input"
            onChange={this.filterUpdate}
          />
          <Card.Group>
            <Card>
              <div className="type-holder">
                <a
                  onClick={this.requestAccess}
                  data-for="requestAccess"
                  data-tip="request access"
                  data-iscapture="true"
                  className="icon-link"
                >
                  <Icon name="add circle" size="huge" />
                </a>
                <ReactTooltip id="requestAccess" place="bottom" type="dark" />
              </div>
              <Card.Content className="home-content">
                <Card.Header>Request access to project</Card.Header>
                <Card.Description>
                  {this.props.logged_in &&
                    "Private projects require you to know the project's name. If you know the name, you'll type it on the form that will appear."}
                  {!this.props.logged_in &&
                    "You'll have to log in for this option."}
                </Card.Description>
              </Card.Content>
            </Card>
          </Card.Group>

          {this.state.cardsToDisplay.owned.length > 0 && (
            <Segment className="segment-width">
              <Header as="h2">
                <Icon name="user" size="large" /> Your projects
              </Header>
              <Card.Group>{this.state.cardsToDisplay.owned}</Card.Group>
            </Segment>
          )}

          {this.state.cardsToDisplay.allowed.length > 0 && (
            <Segment className="segment-width">
              <Header as="h2">
                <Icon name="smile outline" size="large" /> Groups you can join
              </Header>
              <Card.Group>{this.state.cardsToDisplay.allowed}</Card.Group>
            </Segment>
          )}

          {this.state.cardsToDisplay.requested.length > 0 && (
            <Segment className="segment-width">
              <Header as="h2">
                <Icon name="registered" size="large" /> Groups you've requested
                to join
              </Header>
              <Card.Group>{this.state.cardsToDisplay.requested}</Card.Group>
            </Segment>
          )}

          {this.state.cardsToDisplay.refused.length > 0 && (
            <Segment className="segment-width">
              <Header as="h2">
                <Icon name="hand paper" size="large" /> Groups that you cannot
                join
              </Header>
              <Card.Group>{this.state.cardsToDisplay.refused}</Card.Group>
            </Segment>
          )}

          {this.state.cardsToDisplay.other.length > 0 && (
            <Segment className="segment-width">
              <Header as="h2">
                <Icon name="folder open" size="large" /> Other groups
              </Header>
              <Card.Group>{this.state.cardsToDisplay.other}</Card.Group>
            </Segment>
          )}
        </div>
      </div>
    );
  }
}
export default ProjectsComponent;
