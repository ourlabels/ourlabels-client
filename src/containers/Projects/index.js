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
  requestAccessToProject,
  updateProject
} from "../../redux-actions/project";
import { getTypes } from "../../redux-actions/types";
import { getLabels, addLabels } from "../../redux-actions/labels";
import ProjectsComponent from "../../components/ProjectsComponent";

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
    const { logged_in, email, score, username } = this.props;
    return (
      <ProjectsComponent
        key={`project-${this.props.current_project}`}
        logged_in={logged_in}
        allowed={this.props.projects_allowed}
        joined={this.props.projects_joined}
        other={this.props.projects_other}
        owned={this.props.projects_owned}
        username={username}
        labels={this.props.labels}
        getProjectAnnotations={this.props.getProjectAnnotations}
        addLabels={this.props.addLabels}
        getLabels={this.props.getLabels}
        refused={this.props.projects_refused}
        requested={this.props.projects_requested}
        current_project={this.props.current_project}
        joinProject={this.props.joinProject}
        leaveProject={this.props.leaveProject}
        changeProject={this.props.changeProject}
        getProjectForUpdate={this.props.getProjectForUpdate}
        requestAccessToProject={this.props.requestAccessToProject}
        types={this.props.types}
        history={this.props.history}
        projectForUpdate={this.props.project_for_update}
        updateProject={this.props.updateProject}
      />
    );
  }
}
const mapStateToProps = state => {
  let current_project = state.auth.current_project;
  if (state.project.current_project) {
    current_project = state.project.current_project;
  }
  const { project_for_update } = state.project;
  const {
    allowed,
    other,
    owned,
    refused,
    requested,
    joined
  } = state.project.projects;
  const { types } = state.types;
  const { labels } = state;
  return {
    labels: labels.labels,
    logged_in: state.auth.logged_in,
    signed_up: state.auth.signed_up,
    session: state.auth.session,
    email: state.auth.email,
    score: state.auth.score,
    current_project: current_project,
    projects_allowed: allowed,
    projects_other: other,
    projects_owned: owned,
    projects_refused: refused,
    projects_requested: requested,
    projects_joined: joined,
    project_for_update,
    username: state.auth.username,
    types
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getProjects,
      joinProject,
      leaveProject,
      getLabels,
      getProjectForUpdate,
      getProjectAnnotations,
      changeProject,
      requestAccessToProject,
      updateProject,
      addLabels,
      getTypes
    },
    dispatch
  );
};
ProjectsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsContainer);
export default withRouter(ProjectsContainer);
