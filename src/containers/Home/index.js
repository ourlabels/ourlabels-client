import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import HomeComponent from "../../components/HomeComponent";

const getLocalDate = date => {
  let realDate = new Date(0);
  realDate.setUTCSeconds(date);
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return `${realDate.toLocaleDateString("en-US", options)}`;
};

class Home extends Component {
  render() {
    return <HomeComponent dateConversion={getLocalDate} />;
  }
}

const mapStateToProps = state => {
  return {
    logged_in: state.auth.logged_in,
    signed_up: state.auth.signed_up,
    session: state.auth.session,
    email: state.auth.email,
    score: state.auth.score,
    current_project: state.auth.current_project,
    owned_projects: state.auth.owned_projects,
    all_projects: state.auth.all_projects,
    username: state.auth.username
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};
Home = connect(mapStateToProps, mapDispatchToProps)(Home);
export default withRouter(Home);
