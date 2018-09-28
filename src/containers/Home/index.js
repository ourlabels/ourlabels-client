import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeComponent from '../../components/HomeComponent.jsx';

const getLocalDate = date => {
  let realDate = new Date(0);
  realDate.setUTCSeconds(date);
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return `${realDate.toLocaleDateString('en-US', options)}`;
};

class Home extends Component {
  render() {
    return <HomeComponent dateConversion={getLocalDate} />;
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn,
    signedUp: state.auth.signedUp,
    session: state.auth.session,
    email: state.auth.email,
    score: state.auth.score,
    username: state.auth.username
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};
Home = connect(mapStateToProps, mapDispatchToProps)(Home);
export default Home;