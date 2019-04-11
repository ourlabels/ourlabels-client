import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import NavContainer from "./containers/Nav";
import LoginContainer from "./containers/Login";
import SignupContainer from "./containers/Signup";
import AnnotateContainer from "./containers/Annotate";
import Home from "./containers/Home";
import ProjectsContainer from "./containers/Projects";
import "./App.scss";

const Routes = () => {
  return (
    <div className="scrolling-window">
      <NavContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/signup" component={SignupContainer} />
        <Route exact path="/annotate" component={AnnotateContainer} />
        <Route exact path="/projects" component={ProjectsContainer} />
      </Switch>
    </div>
  );
};

export default Routes;
