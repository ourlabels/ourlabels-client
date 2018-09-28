import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginComponent from '../../components/LoginComponent.jsx';
import { logIn } from '../../redux-actions/auth';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }
  componentWillMount() {
  }
  componentWillReceiveProps(newProps) {
    if (newProps.loggedIn) {
      newProps.history.push('/');
    }
  }
  render() {
    return <LoginComponent formHandler={this.props.logIn} />;
  }
}
const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn,
    signedUp: state.auth.signedUp,
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
  return bindActionCreators(
    {
      logIn
    },
    dispatch
  );
};
LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
export default LoginContainer;
