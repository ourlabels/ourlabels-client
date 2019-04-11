import React from "react";
import { Container, Header, Modal } from "semantic-ui-react";
import { css } from "react-emotion";
import { RingLoader } from "react-spinners";
import ProjectsCardsComponent from "./ProjectsCardsComponent.jsx";
import ProjectsFilterComponent from "./ProjectsFilterComponent.jsx";
import ProjectsLabelsComponent from "./ProjectsLabelsComponent.jsx";
import ProjectsSettingsComponent from "./ProjectsSettingsComponent.jsx";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  background-color: white;
  z-index: 100;
`;

class ProjectsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      project_for_update: null,
      cardsToDisplay: {
        owned: [],
        allowed: [],
        refused: [],
        requested: [],
        other: []
      },
      showLoading: false,
      showProjects: true,
      showLabels: false,
      showColorPicker: false,
      showSettings: false
    };
    this.filter = this.filter.bind(this);
    this.showLabels = this.showLabels.bind(this);
    this.hideLabels = this.hideLabels.bind(this);
    this.getProjectForUpdate = this.getProjectForUpdate.bind(this);
    this.addLabels = this.addLabels.bind(this);
  }

  // responsive filtering of projects
  filter(filterValue) {
    this.setState({ filter: filterValue });
  }

  // labels toggle
  showLabels() {
    this.setState({ showLabels: true, showProjects: false });
  }
  hideLabels() {
    this.setState({ showLabels: false, showProjects: true });
  }
  addLabels(labels) {
    this.props.addLabels(labels);
    this.setState({ showLabels: false, showProjects: true });
  }

  getProjectForUpdate() {
    this.setState({ showLoading: true });
    this.props.getProjectForUpdate();
  }

  // handle what happens when we receive a project to edit
  componentWillReceiveProps(nextProps) {
    console.log(this.state, nextProps, "State and props ProjectsComponent");
    if (nextProps.projectForUpdate != null && !this.state.showSettings) {
      this.setState({
        projectForUpdate: nextProps.projectForUpdate,
        showSettings: true,
        showProjects: false,
        showLoading: false
      });
    } else if (nextProps.projectForUpdate == null && this.state.showSettings) {
      this.setState({
        projectForUpdate: null,
        showSettings: false,
        showProjects: true,
        showLoading: false
      });
    }
  }

  // saveProjectLabels
  saveProjectLabels(newLabels) {
    const projectForUpdate = this.state;
  }

  render() {
    const {
      owned,
      requested,
      allowed,
      refused,
      other,
      labels,
      projectForUpdate
    } = this.props;
    console.log(this.props, this.state, "PROJECT COMPONENT PROPS");
    return (
      <Container>
        <Modal open={this.state.showLoading} size="tiny">
          <Modal.Header>Loading...</Modal.Header>
          <Modal.Content>
            <RingLoader
              className={override}
              sizeUnit={"px"}
              color={"#123abc"}
              loading={this.state.showLoading}
            />
          </Modal.Content>
        </Modal>
        {this.state.showProjects && (
          <Container>
            <Header as="h1">Projects</Header>
            {["owned", "requested", "allowed", "refused", "other"].map(
              projectType => {
                return (
                  <ProjectsCardsComponent
                    key={projectType}
                    loggedIn={this.props.loggedIn}
                    type={projectType}
                    items={this.props[projectType]}
                    filter={this.state.filter}
                    projectTypes={this.props.projectTypes}
                    joinProject={this.props.joinProject}
                    changeProject={this.props.changeProject}
                    getProjectForUpdate={this.getProjectForUpdate}
                    getProjectAnnotations={this.props.getProjectAnnotations}
                    leaveProject={this.props.leaveProject}
                    showLabels={this.showLabels}
                  />
                );
              }
            )}
          </Container>
        )}
        {this.state.showSettings && (
          <Container>
            <ProjectsSettingsComponent
              project={projectForUpdate}
              projectTypes={this.props.projectTypes}
              gotProjectForUpdate={this.props.gotProjectForUpdate}
              username={this.props.username}
              updateProject={this.props.updateProject}
            />
          </Container>
        )}
        {this.state.showLabels && (
          <Container>
            <ProjectsLabelsComponent
              labels={labels}
              projectTypes={this.props.projectTypes}
              addLabels={this.addLabels}
            />
          </Container>
        )}
      </Container>
    );
  }
}

export default ProjectsComponent;
