import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
//import Annotate from "./components/Annotate";
import NavContainer from "./containers/Nav";
import LoginContainer from "./containers/Login";
import SignupContainer from "./containers/Signup";
import AnnotateContainer from "./containers/Annotate";
import Home from "./containers/Home";
import ProjectsContainer from "./containers/Projects";
import "./App.scss";
/*
import Signup from "./components/Signup";
import Footer from "./components/Footer";
import User from "./components/User";
*/
class App extends Component {
  constructor(props) {
    super(...props);
    this.state = {};
  }

  render() {
    const labelingprops = {};
    const loginProps = {};
    const signupProps = {};
    return (
      <BrowserRouter>
        <div>
          <NavContainer />
          <div className="scrolling-window">
            <Switch>
              {/* Home related routes */}
              <Route exact path="/" render={props => <Home props={props} />} />
              {/* Login/Signup related routes */}
              <Route
                exact
                path="/login"
                render={props => (
                  <LoginContainer props={props} data={loginProps} />
                )}
              />
              <Route
                exact
                path="/signup"
                render={props => <SignupContainer props={props} />}
              />
              {/* labeling task routes */}
              {this.props.annotate}
              {this.props.user}
              <Route
                exact
                path="/projects"
                render={props => <ProjectsContainer props={props} />}
              />
            </Switch>
          </div>
          {/*<Footer />*/}
        </div>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => {
  let annotate = null;
  let user = null;
  if (state.auth.logged_in) {
    annotate = (
      <Route
        exact
        path="/annotate"
        render={props => <AnnotateContainer props={state} />}
      />
    );
    /*user = (
      <Route exact path="/user" render={props => <User props={state} />} />
    );*/
  }
  return {
    logged_in: state.auth.logged_in,
    signed_up: state.auth.signed_up,
    session: state.auth.session,
    email: state.auth.email,
    score: state.auth.score,
    current_project: state.auth.current_project,
    owned_projects: state.auth.owned_projects,
    all_projects: state.auth.all_projects,
    username: state.auth.username,
    user,
    annotate
  };
};
const mapDispatchToProps = dispatch => {
  return { dispatch };
};

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
