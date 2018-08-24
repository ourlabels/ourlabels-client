import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { resetAnnotations } from "../../redux-actions/annotations";
import NavComponent from "../../components/NavComponent";

class NavContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.releaseLabels = this.releaseLabels.bind(this);
  }
  releaseLabels(evt) {
    this.props.dispatch(resetAnnotations());
  }
  logged_in_items_nolabels = { home: "/", projects: "/projects" };
  logged_in_items = { home: "/", annotate: "/annotate", projects: "/projects" };
  logged_out_items = {
    home: "/",
    login: "/login",
    signup: "/signup",
    projects: "/projects"
  };
  render() {
    const { logged_in, email, score, username, labels } = this.props;
    return (
      <div className="nav">
        <NavComponent
          email={email}
          score={score}
          username={username}
          items={
            logged_in
              ? Object.keys(labels).length > 0
                ? this.logged_in_items
                : this.logged_in_items_nolabels
              : this.logged_out_items
          }
          closeMenu={this.props.closeMenu}
          releaseLabels={this.releaseLabels}
        />
        <br />
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { auth, labels } = state;
  return {
    labels: labels.labels,
    logged_in: auth.logged_in,
    signed_up: auth.signed_up,
    session: auth.session,
    email: auth.email,
    score: auth.score,
    current_project: auth.current_project,
    owned_projects: auth.owned_projects,
    all_projects: auth.all_projects,
    username: auth.username
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};
NavContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavContainer);
export default withRouter(NavContainer);
