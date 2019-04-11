import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import {
  getProjects,
  getProjectAnnotations,
  changeProject,
  joinProject,
  leaveProject,
  getProjectForUpdate,
  gotProjectForUpdate,
  requestAccessToProject,
  updateProject
} from "../../redux-actions/project";
import { getTypes } from "../../redux-actions/types";
import { getLabels, addLabels } from "../../redux-actions/labels";
import ProjectsComponent from "../../components/ProjectsComponent.jsx";

class ProjectsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    this.props.getTypes();
    this.props.getProjects();
    this.props.getLabels();
  }
  render() {
    const {
      loggedIn,
      username,
      allowed,
      joined,
      other,
      owned,
      refused,
      requested,
      labels,
      projectForUpdate
    } = this.props;
    return (
      <ProjectsComponent
        loggedIn={loggedIn}
        allowed={allowed}
        joined={joined}
        other={other}
        owned={owned}
        refused={refused}
        requested={requested}
        username={username}
        labels={labels}
        addLabels={this.props.addLabels}
        getLabels={this.props.getLabels}
        joinProject={this.props.joinProject}
        leaveProject={this.props.leaveProject}
        changeProject={this.props.changeProject}
        getProjectForUpdate={this.props.getProjectForUpdate}
        gotProjectForUpdate={this.props.gotProjectForUpdate}
        requestAccessToProject={this.props.requestAccessToProject}
        getProjectAnnotations={this.props.getProjectAnnotations}
        projectTypes={this.props.projectTypes}
        history={this.props.history}
        updateProject={this.props.updateProject}
        projectForUpdate={projectForUpdate}
        username={this.props.username}
      />
    );
  }
}
const mapStateToProps = state => {
  const { projectForUpdate } = state.project;
  const {
    allowed,
    other,
    owned,
    refused,
    requested,
    joined
  } = state.project.projects;
  const { projectTypes } = state.types;
  const { labels } = state;
  return {
    labels: labels.labels,
    loggedIn: state.auth.loggedIn,
    signedUp: state.auth.signedUp,
    session: state.auth.session,
    email: state.auth.email,
    score: state.auth.score,
    allowed,
    other,
    owned,
    refused,
    requested,
    joined,
    projectForUpdate,
    username: state.auth.username,
    projectTypes
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getProjects,
      joinProject,
      leaveProject,
      getLabels,
      getProjectForUpdate,
      gotProjectForUpdate,
      getProjectAnnotations,
      changeProject,
      requestAccessToProject,
      updateProject,
      getTypes,
      addLabels
    },
    dispatch
  );
ProjectsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsContainer);
export default ProjectsContainer;
