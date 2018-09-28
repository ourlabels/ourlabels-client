import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SignupComponent from '../../components/SignupComponent.jsx';
import { signUp } from '../../redux-actions/auth';

class SignupContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: ''
    };
  }
  componentWillReceiveProps(newProps) {
    if (newProps.signed_up) {
      newProps.history.push('/login');
    }
  }
  render() {
    return <SignupComponent formHandler={this.props.signUp} />;
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
      signUp
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer);
